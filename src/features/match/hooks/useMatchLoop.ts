import { useEffect, useMemo, useRef } from "react";
import { getSchoolPathProfile } from "../../../constants/schoolPaths";
import { LeagueLevel } from "../../../types/career";
import type { SchoolPath } from "../../../types/careerProgression";
import type { Player, PlayerAttributes, PlayerGameStats, PlayerArchetype, Position } from "../../../types/player";
import type { Team } from "../../../types/team";
import type { PossessionEventType } from "../../../matchEngine";
import { composeKeyMomentLogText } from "../../../match/keyMoments/logComposer";
import { renderPossessionPlayByPlayLine } from "../../../match/playByPlay/renderer";
import type { MatchEngineStoreState } from "../../../matchEngineStore";
import { useCareerStore } from "../../../store/useCareerStore";
import { useMatchEngineStore } from "../store/useMatchEngineStore";
import { useMatchStore } from "../store/useMatchStore";
import { isBadgeSystemAvailable } from "../../../builder/badges/availability";

const REAL_SECONDS_PER_TICK = 1;
const GAME_SECONDS_PER_TICK = 10;
const POSSESSION_LENGTH = 24;
const REGULATION_TOTAL_SECONDS = 48 * 60;
const POSITIONS: readonly Position[] = ["PG", "SG", "SF", "PF", "C"];

const defaultGameStats: PlayerGameStats = {
  points: 0,
  assists: 0,
  rebounds: 0,
  steals: 0,
  blocks: 0,
  fga: 0,
  fgm: 0,
};

type AttributeDelta = Partial<Record<keyof PlayerAttributes, number>>;

const clampRating = (value: number): PlayerAttributes["shortRange"] =>
  Math.max(0, Math.min(99, Math.round(value))) as PlayerAttributes["shortRange"];

const scaleAttributes = (attrs: PlayerAttributes, multiplier: number): PlayerAttributes => ({
  shortRange: clampRating(attrs.shortRange * multiplier),
  dunking: clampRating(attrs.dunking * multiplier),
  midrange: clampRating(attrs.midrange * multiplier),
  threePoint: clampRating(attrs.threePoint * multiplier),
  handle: clampRating(attrs.handle * multiplier),
  passing: clampRating(attrs.passing * multiplier),
  vision: clampRating(attrs.vision * multiplier),
  perimeterDefense: clampRating(attrs.perimeterDefense * multiplier),
  interiorDefense: clampRating(attrs.interiorDefense * multiplier),
  stealing: clampRating(attrs.stealing * multiplier),
  blocking: clampRating(attrs.blocking * multiplier),
  offRebounding: clampRating(attrs.offRebounding * multiplier),
  defRebounding: clampRating(attrs.defRebounding * multiplier),
  speed: clampRating(attrs.speed * multiplier),
  strength: clampRating(attrs.strength * multiplier),
  stamina: clampRating(attrs.stamina * multiplier),
});

const withDelta = (attrs: PlayerAttributes, delta: AttributeDelta): PlayerAttributes => ({
  shortRange: clampRating(attrs.shortRange + (delta.shortRange ?? 0)),
  dunking: clampRating(attrs.dunking + (delta.dunking ?? 0)),
  midrange: clampRating(attrs.midrange + (delta.midrange ?? 0)),
  threePoint: clampRating(attrs.threePoint + (delta.threePoint ?? 0)),
  handle: clampRating(attrs.handle + (delta.handle ?? 0)),
  passing: clampRating(attrs.passing + (delta.passing ?? 0)),
  vision: clampRating(attrs.vision + (delta.vision ?? 0)),
  perimeterDefense: clampRating(attrs.perimeterDefense + (delta.perimeterDefense ?? 0)),
  interiorDefense: clampRating(attrs.interiorDefense + (delta.interiorDefense ?? 0)),
  stealing: clampRating(attrs.stealing + (delta.stealing ?? 0)),
  blocking: clampRating(attrs.blocking + (delta.blocking ?? 0)),
  offRebounding: clampRating(attrs.offRebounding + (delta.offRebounding ?? 0)),
  defRebounding: clampRating(attrs.defRebounding + (delta.defRebounding ?? 0)),
  speed: clampRating(attrs.speed + (delta.speed ?? 0)),
  strength: clampRating(attrs.strength + (delta.strength ?? 0)),
  stamina: clampRating(attrs.stamina + (delta.stamina ?? 0)),
});

const mergeDelta = (base: AttributeDelta, extra: AttributeDelta): AttributeDelta => {
  const merged: AttributeDelta = { ...base };
  for (const [key, value] of Object.entries(extra) as Array<[keyof PlayerAttributes, number]>) {
    merged[key] = (merged[key] ?? 0) + value;
  }
  return merged;
};

const makePlayer = (
  id: string,
  name: string,
  archetype: PlayerArchetype,
  position: Position,
  attributes: PlayerAttributes,
  extras: Partial<Pick<Player, "identity" | "dna" | "secondaryPosition" | "bankBalance" | "morale" | "age">> = {},
): Player => ({
  id,
  name,
  age: extras.age ?? 18,
  bankBalance: extras.bankBalance ?? 0,
  morale: extras.morale ?? 50,
  position,
  secondaryPosition: extras.secondaryPosition ?? position,
  archetype,
  identity: extras.identity ?? null,
  dna: extras.dna ?? null,
  attributes,
  gameStats: { ...defaultGameStats },
});

const getHomeNameForPosition = (position: Position): string => `Home ${position}`;

const teammateProfileByPosition: Record<Position, { archetype: PlayerArchetype; delta: AttributeDelta }> = {
  PG: { archetype: "Playmaker", delta: { passing: 7, handle: 6, perimeterDefense: -3 } },
  SG: { archetype: "Sharpshooter", delta: { threePoint: 8, shortRange: -6, passing: -4, perimeterDefense: -2 } },
  SF: { archetype: "Slasher", delta: { shortRange: 7, speed: 6, threePoint: -5, passing: -2 } },
  PF: { archetype: "Stretch Big", delta: { defRebounding: 8, interiorDefense: 7, threePoint: 4, handle: -12 } },
  C: { archetype: "Paint Beast", delta: { shortRange: 11, defRebounding: 13, interiorDefense: 10, threePoint: -14, handle: -18 } },
};

const teammateBaseAttributesByPosition: Record<Position, PlayerAttributes> = {
  PG: {
    shortRange: 64, dunking: 48, midrange: 64, threePoint: 62, handle: 74, passing: 72, vision: 70,
    perimeterDefense: 66, interiorDefense: 42, stealing: 64, blocking: 36, offRebounding: 38, defRebounding: 46,
    speed: 74, strength: 50, stamina: 72,
  },
  SG: {
    shortRange: 62, dunking: 54, midrange: 70, threePoint: 74, handle: 66, passing: 60, vision: 62,
    perimeterDefense: 64, interiorDefense: 44, stealing: 62, blocking: 38, offRebounding: 40, defRebounding: 48,
    speed: 72, strength: 52, stamina: 72,
  },
  SF: {
    shortRange: 68, dunking: 66, midrange: 66, threePoint: 64, handle: 62, passing: 60, vision: 62,
    perimeterDefense: 70, interiorDefense: 60, stealing: 66, blocking: 58, offRebounding: 54, defRebounding: 62,
    speed: 70, strength: 64, stamina: 72,
  },
  PF: {
    shortRange: 70, dunking: 70, midrange: 60, threePoint: 58, handle: 52, passing: 56, vision: 58,
    perimeterDefense: 62, interiorDefense: 72, stealing: 58, blocking: 70, offRebounding: 72, defRebounding: 76,
    speed: 64, strength: 74, stamina: 72,
  },
  C: {
    shortRange: 76, dunking: 74, midrange: 48, threePoint: 36, handle: 40, passing: 50, vision: 54,
    perimeterDefense: 48, interiorDefense: 78, stealing: 52, blocking: 78, offRebounding: 76, defRebounding: 82,
    speed: 56, strength: 82, stamina: 70,
  },
};

const buildRuntimeTeams = (
  userPlayer: Player,
  userAttributes: PlayerAttributes,
  userDisplayName: string,
  userArchetype: PlayerArchetype,
  userPosition: Position,
  leagueLevel: LeagueLevel,
  schoolPath: SchoolPath,
  performanceMultiplier: number,
  badgesEnabled: boolean,
): {
  home: Team;
  away: Team;
  homeNames: string[];
  awayNames: string[];
  userPlayerId: string;
} => {
  const schoolPathProfile = leagueLevel === LeagueLevel.HIGH_SCHOOL ? getSchoolPathProfile(schoolPath) : null;
  const adjustedUserAttributes = schoolPathProfile ? withDelta(userAttributes, schoolPathProfile.userRuntimeDelta) : userAttributes;
  const userRuntimeAttributes = scaleAttributes(adjustedUserAttributes, performanceMultiplier);
  let userPlayerId = "h1";
  const homeRoster = POSITIONS.map((position, index) => {
    const id = `h${index + 1}`;
    if (position === userPosition) {
      userPlayerId = id;
      return makePlayer(id, userDisplayName, userArchetype, userPosition, userRuntimeAttributes, {
        age: userPlayer.age,
        bankBalance: userPlayer.bankBalance,
        morale: userPlayer.morale,
        secondaryPosition: userPlayer.secondaryPosition,
        identity: userPlayer.identity,
        dna: badgesEnabled || !userPlayer.dna?.builderProfile
          ? userPlayer.dna
          : {
              ...userPlayer.dna,
              builderProfile: {
                ...userPlayer.dna.builderProfile,
                badges: [],
              },
            },
      });
    }

    const profile = teammateProfileByPosition[position];
    return makePlayer(
      id,
      getHomeNameForPosition(position),
      profile.archetype,
      position,
      withDelta(teammateBaseAttributesByPosition[position], schoolPathProfile ? mergeDelta(profile.delta, schoolPathProfile.teammateRuntimeDelta) : profile.delta),
    );
  }) as Team["roster"];

  const awayBase: PlayerAttributes = {
    shortRange: 70,
    dunking: 67,
    midrange: 68,
    threePoint: 69,
    handle: 67,
    passing: 66,
    vision: 68,
    perimeterDefense: 70,
    interiorDefense: 70,
    stealing: 66,
    blocking: 64,
    offRebounding: 67,
    defRebounding: 69,
    speed: 71,
    strength: 70,
    stamina: 72,
  };

  const adjustedAwayBase = schoolPathProfile ? withDelta(awayBase, schoolPathProfile.opponentRuntimeDelta) : awayBase;
  const awayRoster = [
    makePlayer("a1", "Away PG", "Playmaker", "PG", withDelta(adjustedAwayBase, { passing: 7, handle: 6, perimeterDefense: -3 })),
    makePlayer("a2", "Away SG", "Sharpshooter", "SG", withDelta(adjustedAwayBase, { threePoint: 9, shortRange: -4 })),
    makePlayer("a3", "Away SF", "Lockdown Defender", "SF", withDelta(adjustedAwayBase, { perimeterDefense: 10, speed: 4, threePoint: -4 })),
    makePlayer("a4", "Away PF", "Stretch Big", "PF", withDelta(adjustedAwayBase, { defRebounding: 8, threePoint: 5, handle: -12 })),
    makePlayer("a5", "Away C", "Paint Beast", "C", withDelta(adjustedAwayBase, { shortRange: 9, defRebounding: 12, interiorDefense: 8, threePoint: -12, handle: -16 })),
  ] as Team["roster"];

  return {
    home: {
      name: "Home",
      teamOvr: 0,
      roster: homeRoster,
    },
    away: {
      name: "Away",
      teamOvr: 0,
      roster: awayRoster,
    },
    homeNames: homeRoster.map((player) => player.name),
    awayNames: awayRoster.map((player) => player.name),
    userPlayerId,
  };
};

const derivePeriodState = (
  totalSeconds: number,
  secondsRemaining: number,
): { quarter: 1 | 2 | 3 | 4; isOvertime: boolean; overtimePeriod: number; timeRemaining: number } => {
  if (secondsRemaining <= 0) {
    return { quarter: 4, isOvertime: false, overtimePeriod: 0, timeRemaining: 0 };
  }

  const regulationSeconds = Math.max(4, totalSeconds);
  const quarterSeconds = Math.max(1, Math.floor(regulationSeconds / 4));
  if (secondsRemaining > regulationSeconds) {
    const overtimeSeconds = secondsRemaining - regulationSeconds;
    const overtimePeriod = Math.max(1, Math.ceil(overtimeSeconds / quarterSeconds));
    const elapsedInOvertime = overtimeSeconds - (overtimePeriod - 1) * quarterSeconds;
    return {
      quarter: 4,
      isOvertime: true,
      overtimePeriod,
      timeRemaining: Math.max(0, quarterSeconds - elapsedInOvertime),
    };
  }

  const elapsed = Math.max(0, regulationSeconds - secondsRemaining);
  const quarter = Math.min(4, Math.floor(elapsed / quarterSeconds) + 1) as 1 | 2 | 3 | 4;
  const elapsedInQuarter = elapsed - (quarter - 1) * quarterSeconds;
  return {
    quarter,
    isOvertime: false,
    overtimePeriod: 0,
    timeRemaining: Math.max(0, quarterSeconds - elapsedInQuarter),
  };
};

const isShotAttempt = (eventType: PossessionEventType, putbackAttempted: boolean): boolean =>
  eventType === "made_2" ||
  eventType === "made_3" ||
  eventType === "miss" ||
  eventType === "block" ||
  eventType === "putback_make" ||
  (eventType === "def_reb" && putbackAttempted);

export const useMatchLoop = (): void => {
  const possessionProgressRef = useRef(0);
  const lastAppliedTraceIdRef = useRef<number>(0);
  const finalLogAppliedRef = useRef(false);
  const wasPausedForPendingPossessionRef = useRef(false);

  const isPlaying = useMatchStore((state) => state.isPlaying);
  const isPaused = useMatchStore((state) => state.isPaused);
  const gameFinished = useMatchStore((state) => state.gameFinished);
  const simulationMode = useMatchStore((state) => state.simulationMode);
  const simSpeed = useMatchStore((state) => state.simSpeed);
  const startMatch = useMatchStore((state) => state.startMatch);
  const pauseMatch = useMatchStore((state) => state.pauseMatch);
  const endMatch = useMatchStore((state) => state.endMatch);
  const initializeBoxScore = useMatchStore((state) => state.initializeBoxScore);
  const recordBoxScoreEvent = useMatchStore((state) => state.recordBoxScoreEvent);
  const updateGame = useMatchStore((state) => state.updateGame);
  const addLog = useMatchStore((state) => state.addLog);
  const setKeyMomentFeedback = useMatchStore((state) => state.setKeyMomentFeedback);
  const clearKeyMomentFeedback = useMatchStore((state) => state.clearKeyMomentFeedback);
  const engineStarted = useMatchEngineStore((state) => state.snapshot.started);
  const initializeRuntime = useMatchEngineStore((state) => state.initializeRuntime);
  const resetRuntime = useMatchEngineStore((state) => state.resetRuntime);
  const stepPossession = useMatchEngineStore((state) => state.stepPossession);

  const playerId = useCareerStore((state) => state.player.id);
  const careerPlayer = useCareerStore((state) => state.player);
  const playerName = useCareerStore((state) => state.player.name);
  const playerArchetype = useCareerStore((state) => state.player.archetype);
  const playerPosition = useCareerStore((state) => state.player.position);
  const playerAttributes = useCareerStore((state) => state.player.attributes);
  const leagueLevel = useCareerStore((state) => state.leagueLevel);
  const schoolPath = useCareerStore((state) => state.schoolPath);
  const seasonNumber = useCareerStore((state) => state.seasonNumber);
  const injury = useCareerStore((state) => state.injury);
  const addMatchConsequences = useMatchStore((state) => state.addMatchConsequences);

  const runtimeTeams = useMemo(
    () =>
      buildRuntimeTeams(
        careerPlayer,
        playerAttributes,
        playerName.trim().length > 0 ? playerName : "My Player",
        playerArchetype,
        playerPosition,
        leagueLevel,
        schoolPath,
        injury?.performanceMultiplier ?? 1,
        isBadgeSystemAvailable(leagueLevel, seasonNumber),
      ),
    [
      careerPlayer,
      injury?.performanceMultiplier,
      leagueLevel,
      playerArchetype,
      playerAttributes.blocking,
      playerAttributes.defRebounding,
      playerAttributes.dunking,
      playerAttributes.handle,
      playerAttributes.interiorDefense,
      playerAttributes.midrange,
      playerAttributes.offRebounding,
      playerAttributes.passing,
      playerAttributes.perimeterDefense,
      playerAttributes.shortRange,
      playerAttributes.speed,
      playerAttributes.stamina,
      playerAttributes.stealing,
      playerAttributes.strength,
      playerAttributes.threePoint,
      playerAttributes.vision,
      playerName,
      playerPosition,
      schoolPath,
      seasonNumber,
    ],
  );

  const projectSnapshotToUi = (snapshot: MatchEngineStoreState, projectedSecondsRemaining?: number): void => {
    const currentPossession = snapshot.currentPossession;
    if (!currentPossession) {
      return;
    }

    const visibleSecondsRemaining = projectedSecondsRemaining ?? currentPossession.secondsRemaining;
    const periodState = derivePeriodState(snapshot.totalSeconds, visibleSecondsRemaining);
    updateGame({
      homeScore: currentPossession.score.home,
      awayScore: currentPossession.score.away,
      quarter: periodState.quarter,
      isOvertime: periodState.isOvertime,
      overtimePeriod: periodState.overtimePeriod,
      timeRemaining: periodState.timeRemaining,
      possession: currentPossession.offenseKey,
    });

    if (snapshot.pausedForPendingPossession) {
      possessionProgressRef.current = 0;
      pauseMatch();
    } else if (wasPausedForPendingPossessionRef.current && useMatchStore.getState().isPaused && !useMatchStore.getState().gameFinished) {
      startMatch();
    }
    wasPausedForPendingPossessionRef.current = snapshot.pausedForPendingPossession;

    if (currentPossession.secondsRemaining <= 0 && !snapshot.pausedForPendingPossession && !finalLogAppliedRef.current) {
      finalLogAppliedRef.current = true;
      addLog({
        id: `end-${snapshot.lastTrace?.id ?? Date.now()}`,
        quarter: periodState.quarter,
        overtimePeriod: periodState.isOvertime ? periodState.overtimePeriod : undefined,
        isUserAction: false,
        timeRemaining: 0,
        text: "Final buzzer",
        type: "info",
        team: currentPossession.offenseKey,
      });
      endMatch();
    }
  };

  const applyTraceToUi = (snapshot: MatchEngineStoreState): void => {
    const trace = snapshot.lastTrace;
    const context = snapshot.matchContext;
    if (!trace || !trace.result || !trace.beforeState || !context || trace.id === lastAppliedTraceIdRef.current) {
      return;
    }

    lastAppliedTraceIdRef.current = trace.id;

    const offenseTeam = trace.beforeState.offenseKey;
    const defenseTeam = trace.beforeState.defenseKey;
    const shotAttempted = isShotAttempt(trace.result.eventType, trace.result.putbackAttempted);
    const shotMade =
      trace.result.eventType === "made_2" ||
      trace.result.eventType === "made_3" ||
      trace.result.eventType === "putback_make";
    const turnoverTeam =
      trace.result.eventType === "turnover" || trace.result.eventType === "steal" ? offenseTeam : undefined;
    const defenderTeam =
      trace.result.eventType === "steal" || trace.result.eventType === "block" ? defenseTeam : undefined;
    const reboundTeam = trace.result.offensiveRebound
      ? offenseTeam
      : trace.result.eventType === "def_reb"
        ? defenseTeam
        : undefined;
    const freeThrowTeam = trace.result.freeThrows ? offenseTeam : undefined;

    recordBoxScoreEvent({
      scoringTeam: shotAttempted || freeThrowTeam ? offenseTeam : undefined,
      shooterIndex: shotAttempted || freeThrowTeam ? trace.result.shooterIndex : undefined,
      points: trace.result.points ?? 0,
      shotAttempted,
      shotMade,
      assisterIndex: shotMade ? trace.result.assisterIndex : undefined,
      turnoverTeam,
      turnoverPlayerIndex: turnoverTeam ? trace.beforeState.ballHandlerIndex : undefined,
      defenderTeam,
      stealDefenderIndex: trace.result.eventType === "steal" ? trace.result.defensivePlay.defenderIndex : undefined,
      blockDefenderIndex: trace.result.eventType === "block" ? trace.result.defensivePlay.defenderIndex : undefined,
      reboundTeam,
      rebounderIndex: reboundTeam ? trace.result.rebounderIndex : undefined,
      freeThrowMade: trace.result.freeThrows?.made,
      freeThrowAttempted: trace.result.freeThrows?.attempted,
      foulOnTeam: trace.result.freeThrows?.foulOnTeam,
      foulOnPlayerIndex: trace.result.freeThrows?.foulOnPlayerIndex,
    });

    const mappedLog = renderPossessionPlayByPlayLine({
      result: trace.result,
      context,
      offense: offenseTeam,
      defense: defenseTeam,
      ballHandlerIndex: trace.beforeState.ballHandlerIndex,
    });
    const userLocation = snapshot.userPlayerLocation;
    const wasUserBallHandler = Boolean(userLocation && offenseTeam === userLocation.teamKey && trace.beforeState.ballHandlerIndex === userLocation.playerIndex);
    const isUserOffenseAction =
      Boolean(userLocation) &&
      offenseTeam === userLocation?.teamKey &&
      (trace.result.shooterIndex === userLocation?.playerIndex ||
        trace.result.assisterIndex === userLocation?.playerIndex ||
        (trace.result.turnoverLikeFailure && wasUserBallHandler));
    const isUserDefenseAction =
      Boolean(userLocation) &&
      defenseTeam === userLocation?.teamKey &&
      (trace.result.eventType === "steal" || trace.result.eventType === "block" || trace.result.eventType === "free_throws") &&
      trace.result.defensivePlay.defenderIndex === userLocation?.playerIndex;
    const logText = trace.resolvedKeyMoment
      ? composeKeyMomentLogText(trace.resolvedKeyMoment.success, trace.resolvedKeyMoment.promptText, mappedLog.text)
      : mappedLog.text;
    const periodState = derivePeriodState(snapshot.totalSeconds, trace.afterState.secondsRemaining);

    addLog({
      id: `trace-${trace.id}`,
      quarter: periodState.quarter,
      overtimePeriod: periodState.isOvertime ? periodState.overtimePeriod : undefined,
      isUserAction: isUserOffenseAction || isUserDefenseAction,
      timeRemaining: periodState.timeRemaining,
      text: logText,
      type: mappedLog.type,
      team: offenseTeam,
    });

    if (trace.resolvedKeyMoment) {
      addMatchConsequences(trace.resolvedKeyMoment.consequences);
      setKeyMomentFeedback({
        id: trace.resolvedKeyMoment.pendingId,
        success: trace.resolvedKeyMoment.success,
        text: trace.resolvedKeyMoment.resultSummaryText,
      });
    }
  };

  useEffect(() => {
    return () => {
      resetRuntime();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = useMatchEngineStore.subscribe((state) => {
      const snapshot = state.snapshot;
      if (!snapshot.started) {
        return;
      }

      applyTraceToUi(snapshot);
      projectSnapshotToUi(snapshot);
    });

    return () => {
      unsubscribe();
    };
  }, [addLog, addMatchConsequences, endMatch, pauseMatch, recordBoxScoreEvent, setKeyMomentFeedback, startMatch, updateGame]);

  useEffect(() => {
    const matchState = useMatchStore.getState();
    if (matchState.isPlaying || matchState.isPaused || matchState.gameFinished) {
      return;
    }

    resetRuntime();
    possessionProgressRef.current = 0;
    lastAppliedTraceIdRef.current = 0;
    finalLogAppliedRef.current = false;
    wasPausedForPendingPossessionRef.current = false;
    clearKeyMomentFeedback();
    initializeBoxScore(runtimeTeams.homeNames, runtimeTeams.awayNames);
    const initialSnapshot = initializeRuntime({
      home: runtimeTeams.home,
      away: runtimeTeams.away,
      userPlayerId: runtimeTeams.userPlayerId || playerId || "h1",
      seed: Date.now(),
      leagueLevel,
      simulationMode,
      totalSeconds: REGULATION_TOTAL_SECONDS,
    });
    applyTraceToUi(initialSnapshot);
    projectSnapshotToUi(initialSnapshot);
  }, [
    clearKeyMomentFeedback,
    initializeRuntime,
    initializeBoxScore,
    leagueLevel,
    playerId,
    resetRuntime,
    runtimeTeams,
    simulationMode,
  ]);

  useEffect(() => {
    if (!isPlaying || isPaused || gameFinished || !engineStarted) {
      return;
    }

    const intervalId = setInterval(() => {
      const snapshot = useMatchEngineStore.getState().snapshot;
      if (!snapshot.started || snapshot.pausedForPendingPossession || !snapshot.currentPossession) {
        possessionProgressRef.current = 0;
        return;
      }

      if (snapshot.currentPossession.secondsRemaining <= 0) {
        possessionProgressRef.current = 0;
        projectSnapshotToUi(snapshot);
        return;
      }

      possessionProgressRef.current += GAME_SECONDS_PER_TICK;
      if (possessionProgressRef.current < POSSESSION_LENGTH) {
        projectSnapshotToUi(
          snapshot,
          Math.max(0, snapshot.currentPossession.secondsRemaining - possessionProgressRef.current),
        );
        return;
      }

      possessionProgressRef.current = 0;
      stepPossession();
    }, (REAL_SECONDS_PER_TICK * 1000) / simSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [engineStarted, gameFinished, isPaused, isPlaying, simSpeed, stepPossession]);
};
