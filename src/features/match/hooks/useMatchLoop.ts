import { useEffect, useMemo, useRef } from "react";
import { LeagueLevel } from "../../../types/career";
import type { Player, PlayerAttributes, PlayerGameStats, PlayerArchetype, Position } from "../../../types/player";
import type { Team } from "../../../types/team";
import type { PossessionEventType } from "../../../matchEngine";
import { composeKeyMomentLogText } from "../../../match/keyMoments/logComposer";
import { renderPossessionPlayByPlayLine } from "../../../match/playByPlay/renderer";
import type { MatchEngineStoreState } from "../../../matchEngineStore";
import { useCareerStore } from "../../../store/useCareerStore";
import { useMatchEngineStore } from "../store/useMatchEngineStore";
import { useMatchStore } from "../store/useMatchStore";

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

const makePlayer = (
  id: string,
  name: string,
  archetype: PlayerArchetype,
  position: Position,
  attributes: PlayerAttributes,
): Player => ({
  id,
  name,
  age: 18,
  bankBalance: 0,
  morale: 50,
  position,
  secondaryPosition: position,
  archetype,
  identity: null,
  dna: null,
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

const buildRuntimeTeams = (
  userAttributes: PlayerAttributes,
  userDisplayName: string,
  userArchetype: PlayerArchetype,
  userPosition: Position,
): {
  home: Team;
  away: Team;
  homeNames: string[];
  awayNames: string[];
  userPlayerId: string;
} => {
  let userPlayerId = "h1";
  const homeRoster = POSITIONS.map((position, index) => {
    const id = `h${index + 1}`;
    if (position === userPosition) {
      userPlayerId = id;
      return makePlayer(id, userDisplayName, userArchetype, userPosition, userAttributes);
    }

    const profile = teammateProfileByPosition[position];
    return makePlayer(id, getHomeNameForPosition(position), profile.archetype, position, withDelta(userAttributes, profile.delta));
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

  const awayRoster = [
    makePlayer("a1", "Away PG", "Playmaker", "PG", withDelta(awayBase, { passing: 7, handle: 6, perimeterDefense: -3 })),
    makePlayer("a2", "Away SG", "Sharpshooter", "SG", withDelta(awayBase, { threePoint: 9, shortRange: -4 })),
    makePlayer("a3", "Away SF", "Lockdown Defender", "SF", withDelta(awayBase, { perimeterDefense: 10, speed: 4, threePoint: -4 })),
    makePlayer("a4", "Away PF", "Stretch Big", "PF", withDelta(awayBase, { defRebounding: 8, threePoint: 5, handle: -12 })),
    makePlayer("a5", "Away C", "Paint Beast", "C", withDelta(awayBase, { shortRange: 9, defRebounding: 12, interiorDefense: 8, threePoint: -12, handle: -16 })),
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
  const playerName = useCareerStore((state) => state.player.name);
  const playerArchetype = useCareerStore((state) => state.player.archetype);
  const playerPosition = useCareerStore((state) => state.player.position);
  const playerAttributes = useCareerStore((state) => state.player.attributes);

  const runtimeTeams = useMemo(
    () =>
      buildRuntimeTeams(
        playerAttributes,
        playerName.trim().length > 0 ? playerName : "My Player",
        playerArchetype,
        playerPosition,
      ),
    [
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

    recordBoxScoreEvent({
      scoringTeam: shotAttempted ? offenseTeam : undefined,
      shooterIndex: shotAttempted ? trace.result.shooterIndex : undefined,
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
      (trace.result.eventType === "steal" || trace.result.eventType === "block") &&
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
  }, [addLog, endMatch, pauseMatch, recordBoxScoreEvent, setKeyMomentFeedback, startMatch, updateGame]);

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
      leagueLevel: LeagueLevel.PRO,
      simulationMode,
      totalSeconds: REGULATION_TOTAL_SECONDS,
    });
    applyTraceToUi(initialSnapshot);
    projectSnapshotToUi(initialSnapshot);
  }, [
    clearKeyMomentFeedback,
    initializeRuntime,
    initializeBoxScore,
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
