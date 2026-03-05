import { useEffect, useMemo, useRef } from "react";
import { LeagueLevel } from "../../../types/career";
import type { Player, PlayerAttributes, PlayerGameStats, PlayerArchetype, Position } from "../../../types/player";
import type { Team } from "../../../types/team";
import { createSeededRng, initializePossession, simulatePossession, type MatchContext, type PossessionResult, type PossessionState } from "../../../matchEngine";
import { composeKeyMomentLogText } from "../../../match/keyMoments/logComposer";
import { resolveKeyMoment } from "../../../match/keyMoments/resolveKeyMoment";
import { createKeyMomentScheduler } from "../../../match/keyMoments/scheduler";
import type { KeyMomentContext, KeyMomentPending, PeriodKey } from "../../../match/keyMoments/types";
import { renderPossessionPlayByPlayLine } from "../../../match/playByPlay/renderer";
import { useCareerStore } from "../../../store/useCareerStore";
import { useMatchStore } from "../store/useMatchStore";

/**
 * Real-world seconds per simulation tick before speed multiplier is applied.
 */
const REAL_SECONDS_PER_TICK = 1;
/**
 * In-game seconds advanced on each tick; controls simulation pace independent of wall-clock time.
 */
const GAME_SECONDS_PER_TICK = 10;
/**
 * In-game seconds required before resolving the next possession (shot-clock cadence).
 */
const POSSESSION_LENGTH = 24;
const OVERTIME_SECONDS = 300;
const POSITIONS: readonly Position[] = ["PG", "SG", "SF", "PF", "C"];
const AWAY_ROSTER_NAMES = POSITIONS.map((position) => `Away ${position}`) as string[];

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

const withDelta = (attrs: PlayerAttributes, delta: AttributeDelta): PlayerAttributes => {
  return {
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
  };
};

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

const buildHomeBoxNames = (userDisplayName: string, userPosition: Position): string[] =>
  POSITIONS.map((position) => (position === userPosition ? userDisplayName : getHomeNameForPosition(position)));

const getPeriodKey = (quarter: 1 | 2 | 3 | 4, isOvertime: boolean, overtimePeriod: number): PeriodKey =>
  isOvertime ? `OT${Math.max(1, overtimePeriod)}` : (`Q${quarter}` as PeriodKey);

const teammateProfileByPosition: Record<Position, { archetype: PlayerArchetype; delta: AttributeDelta }> = {
  PG: { archetype: "Playmaker", delta: { passing: 7, handle: 6, perimeterDefense: -3 } },
  SG: { archetype: "Sharpshooter", delta: { threePoint: 8, shortRange: -6, passing: -4, perimeterDefense: -2 } },
  SF: { archetype: "Slasher", delta: { shortRange: 7, speed: 6, threePoint: -5, passing: -2 } },
  PF: { archetype: "Stretch Big", delta: { defRebounding: 8, interiorDefense: 7, threePoint: 4, handle: -12 } },
  C: { archetype: "Paint Beast", delta: { shortRange: 11, defRebounding: 13, interiorDefense: 10, threePoint: -14, handle: -18 } },
};

const buildMatchContext = (
  userAttributes: PlayerAttributes,
  userDisplayName: string,
  userArchetype: PlayerArchetype,
  userPosition: Position,
): MatchContext => {
  const homeRoster = POSITIONS.map((position, index) => {
    if (position === userPosition) {
      return makePlayer(`h${index + 1}`, userDisplayName, userArchetype, userPosition, userAttributes);
    }

    const profile = teammateProfileByPosition[position];
    return makePlayer(`h${index + 1}`, getHomeNameForPosition(position), profile.archetype, position, withDelta(userAttributes, profile.delta));
  }) as Team["roster"];

  const home: Team = {
    name: "Home",
    teamOvr: 0,
    roster: homeRoster,
  };

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

  const away: Team = {
    name: "Away",
    teamOvr: 0,
    roster: [
      makePlayer("a1", "Away PG", "Playmaker", "PG", withDelta(awayBase, { passing: 7, handle: 6, perimeterDefense: -3 })),
      makePlayer("a2", "Away SG", "Sharpshooter", "SG", withDelta(awayBase, { threePoint: 9, shortRange: -4 })),
      makePlayer("a3", "Away SF", "Lockdown Defender", "SF", withDelta(awayBase, { perimeterDefense: 10, speed: 4, threePoint: -4 })),
      makePlayer("a4", "Away PF", "Stretch Big", "PF", withDelta(awayBase, { defRebounding: 8, threePoint: 5, handle: -12 })),
      makePlayer("a5", "Away C", "Paint Beast", "C", withDelta(awayBase, { shortRange: 9, defRebounding: 12, interiorDefense: 8, threePoint: -12, handle: -16 })),
    ],
  };

  return { home, away };
};

export const useMatchLoop = (): void => {
  const possessionProgressRef = useRef<number>(0);
  const contextRef = useRef<MatchContext | null>(null);
  const possessionStateRef = useRef<PossessionState | null>(null);
  const rngRef = useRef<() => number>(createSeededRng(Date.now()));
  const keyMomentSchedulerRef = useRef(createKeyMomentScheduler());

  const isPlaying = useMatchStore((state) => state.isPlaying);
  const isPaused = useMatchStore((state) => state.isPaused);
  const gameFinished = useMatchStore((state) => state.gameFinished);
  const simulationMode = useMatchStore((state) => state.simulationMode);
  const simSpeed = useMatchStore((state) => state.simSpeed);
  const pauseMatch = useMatchStore((state) => state.pauseMatch);
  const startMatch = useMatchStore((state) => state.startMatch);
  const endMatch = useMatchStore((state) => state.endMatch);
  const initializeBoxScore = useMatchStore((state) => state.initializeBoxScore);
  const recordBoxScoreEvent = useMatchStore((state) => state.recordBoxScoreEvent);
  const updateGame = useMatchStore((state) => state.updateGame);
  const addLog = useMatchStore((state) => state.addLog);
  const setKeyMomentPending = useMatchStore((state) => state.setKeyMomentPending);
  const clearKeyMomentResolution = useMatchStore((state) => state.clearKeyMomentResolution);
  const setKeyMomentFeedback = useMatchStore((state) => state.setKeyMomentFeedback);
  const clearKeyMomentFeedback = useMatchStore((state) => state.clearKeyMomentFeedback);

  const playerName = useCareerStore((state) => state.player.name);
  const playerArchetype = useCareerStore((state) => state.player.archetype);
  const playerPosition = useCareerStore((state) => state.player.position);
  const playerAttributes = useCareerStore((state) => state.player.attributes);
  const userPlayerIndex = POSITIONS.indexOf(playerPosition);
  const homeBoxNames = useMemo(
    () => buildHomeBoxNames(playerName.trim().length > 0 ? playerName : "My Player", playerPosition),
    [playerName, playerPosition],
  );

  useEffect(() => {
    if (!isPlaying && !isPaused && !gameFinished) {
      contextRef.current = null;
      possessionStateRef.current = null;
      possessionProgressRef.current = 0;
      rngRef.current = createSeededRng(Date.now());
      keyMomentSchedulerRef.current.reset();
      setKeyMomentPending(undefined);
      clearKeyMomentResolution();
      clearKeyMomentFeedback();

      const { matchBoxScore } = useMatchStore.getState();
      if (matchBoxScore.homePlayers.length === 0 || matchBoxScore.awayPlayers.length === 0) {
        initializeBoxScore(homeBoxNames, [...AWAY_ROSTER_NAMES]);
      }
    }
  }, [clearKeyMomentFeedback, clearKeyMomentResolution, gameFinished, homeBoxNames, initializeBoxScore, isPaused, isPlaying, setKeyMomentPending]);

  useEffect(() => {
    if (!isPlaying || isPaused || gameFinished) {
      return;
    }

    if (!contextRef.current) {
      contextRef.current = buildMatchContext(
        playerAttributes,
        playerName.trim().length > 0 ? playerName : "My Player",
        playerArchetype,
        playerPosition,
      );
    }

    const intervalId = setInterval(() => {
      const {
        timeRemaining,
        quarter,
        isOvertime,
        overtimePeriod,
        possession,
        homeScore,
        awayScore,
        keyMomentPending,
        keyMomentResolutionInput,
      } = useMatchStore.getState();
      const nextTimeRemaining = Math.max(0, timeRemaining - GAME_SECONDS_PER_TICK);

      const applyPossessionResult = (
        result: PossessionResult,
        possessionState: PossessionState,
        forceUserAction = false,
        keyMomentLogMeta?: { success: boolean; promptText: string },
      ): void => {
        possessionStateRef.current = {
          ...result.nextState,
          secondsRemaining: nextTimeRemaining,
        };

        const offenseTeam = possession;
        const defenseTeam = possession === "home" ? "away" : "home";
        const shotAttempted =
          !result.turnoverLikeFailure &&
          (result.eventType === "made_2" ||
            result.eventType === "made_3" ||
            result.eventType === "miss" ||
            result.eventType === "block" ||
            result.eventType === "putback_make" ||
            (result.eventType === "def_reb" && result.putbackAttempted));
        const shotMade = result.eventType === "made_2" || result.eventType === "made_3" || result.eventType === "putback_make";
        const points = result.points ?? 0;
        const turnoverTeam = result.eventType === "turnover" || result.eventType === "steal" ? offenseTeam : undefined;
        const turnoverPlayerIndex = turnoverTeam ? possessionState.ballHandlerIndex : undefined;
        const defenderTeam = result.eventType === "steal" || result.eventType === "block" ? defenseTeam : undefined;
        const stealDefenderIndex = result.eventType === "steal" ? result.defensivePlay.defenderIndex : undefined;
        const blockDefenderIndex = result.eventType === "block" ? result.defensivePlay.defenderIndex : undefined;
        const reboundTeam = result.offensiveRebound ? offenseTeam : result.eventType === "def_reb" ? defenseTeam : undefined;
        const { matchBoxScore } = useMatchStore.getState();
        if (matchBoxScore.homePlayers.length === 0 || matchBoxScore.awayPlayers.length === 0) {
          initializeBoxScore(homeBoxNames, [...AWAY_ROSTER_NAMES]);
        }

        recordBoxScoreEvent({
          scoringTeam: shotAttempted ? offenseTeam : undefined,
          shooterIndex: shotAttempted ? result.shooterIndex : undefined,
          points,
          shotAttempted,
          shotMade,
          assisterIndex: shotMade ? result.assisterIndex : undefined,
          turnoverTeam,
          turnoverPlayerIndex,
          defenderTeam,
          stealDefenderIndex,
          blockDefenderIndex,
          reboundTeam,
          rebounderIndex: reboundTeam ? result.rebounderIndex : undefined,
        });

        updateGame({
          timeRemaining: nextTimeRemaining,
          homeScore: result.nextState.score.home,
          awayScore: result.nextState.score.away,
          possession: result.nextState.offenseKey,
        });

        const mappedLog = renderPossessionPlayByPlayLine({
          result,
          context: contextRef.current!,
          offense: possession,
          defense: possession === "home" ? "away" : "home",
          ballHandlerIndex: possessionState.ballHandlerIndex,
        });
        const wasUserBallHandler = possessionState.ballHandlerIndex === userPlayerIndex;
        const isUserOffenseAction =
          possession === "home" &&
          (result.shooterIndex === userPlayerIndex ||
            result.assisterIndex === userPlayerIndex ||
            (result.turnoverLikeFailure && wasUserBallHandler));
        const isUserDefenseAction =
          possession === "away" &&
          (result.eventType === "steal" || result.eventType === "block") &&
          result.defensivePlay.defenderIndex === userPlayerIndex;
        const isUserAction = forceUserAction || isUserOffenseAction || isUserDefenseAction;
        const text = keyMomentLogMeta
          ? composeKeyMomentLogText(keyMomentLogMeta.success, keyMomentLogMeta.promptText, mappedLog.text)
          : mappedLog.text;

        addLog({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          quarter,
          overtimePeriod: isOvertime ? overtimePeriod : undefined,
          isUserAction,
          timeRemaining: nextTimeRemaining,
          text,
          type: mappedLog.type,
          team: possession,
        });
      };

      if (
        contextRef.current &&
        possessionStateRef.current &&
        keyMomentPending &&
        keyMomentResolutionInput &&
        keyMomentResolutionInput.pendingId === keyMomentPending.id
      ) {
        const resolution = resolveKeyMoment({
          pending: keyMomentPending,
          input: keyMomentResolutionInput,
          context: contextRef.current,
          possessionState: {
            offenseKey: possession,
            defenseKey: possession === "home" ? "away" : "home",
            secondsRemaining: nextTimeRemaining,
            possessionIndex: possessionStateRef.current.possessionIndex,
            score: { home: homeScore, away: awayScore },
            homeStreak: possessionStateRef.current.homeStreak,
            awayStreak: possessionStateRef.current.awayStreak,
          },
        });

        applyPossessionResult(
          resolution.result,
          {
            ...possessionStateRef.current,
            offenseKey: possession,
            defenseKey: possession === "home" ? "away" : "home",
            score: { home: homeScore, away: awayScore },
            secondsRemaining: nextTimeRemaining,
          },
          true,
          {
            success: resolution.success,
            promptText: keyMomentPending.promptText,
          },
        );
        setKeyMomentFeedback({
          id: keyMomentPending.id,
          success: resolution.success,
          text: resolution.resultSummaryText,
        });
        setKeyMomentPending(undefined);
        clearKeyMomentResolution();
        startMatch();
        return;
      }

      if (keyMomentPending && !keyMomentResolutionInput) {
        pauseMatch();
        return;
      }

      if (nextTimeRemaining === 0) {
        pauseMatch();
        possessionProgressRef.current = 0;

        if (isOvertime) {
          if (homeScore === awayScore) {
            const nextOvertime = overtimePeriod + 1;
            updateGame({
              timeRemaining: OVERTIME_SECONDS,
              isOvertime: true,
              overtimePeriod: nextOvertime,
            });
            addLog({
              id: `ot-${Date.now()}`,
              quarter,
              overtimePeriod,
              isUserAction: false,
              timeRemaining: 0,
              text: `End OT${overtimePeriod}. OT${nextOvertime} ready.`,
              type: "info",
              team: possession,
            });
            return;
          }

          endMatch();
          addLog({
            id: `end-${Date.now()}`,
            quarter,
            overtimePeriod,
            isUserAction: false,
            timeRemaining: 0,
            text: "Final buzzer",
            type: "info",
            team: possession,
          });
          return;
        }

        const nextQuarter = quarter + 1;
        if (nextQuarter > 4) {
          if (homeScore === awayScore) {
            updateGame({
              timeRemaining: OVERTIME_SECONDS,
              isOvertime: true,
              overtimePeriod: 1,
            });
            addLog({
              id: `ot-${Date.now()}`,
              quarter,
              isUserAction: false,
              timeRemaining: 0,
              text: "End Q4 tied. OT1 ready.",
              type: "info",
              team: possession,
            });
            return;
          }

          endMatch();
          addLog({
            id: `end-${Date.now()}`,
            quarter,
            isUserAction: false,
            timeRemaining: 0,
            text: "Final buzzer",
            type: "info",
            team: possession,
          });
          return;
        }

        updateGame({
          quarter: nextQuarter as 1 | 2 | 3 | 4,
          isOvertime: false,
          overtimePeriod: 0,
          timeRemaining: 720,
        });
        addLog({
          id: `q-${Date.now()}`,
          quarter,
          isUserAction: false,
          timeRemaining: 0,
          text: `End Q${quarter}. Q${nextQuarter} ready.`,
          type: "info",
          team: possession,
        });
        return;
      }

      possessionProgressRef.current += GAME_SECONDS_PER_TICK;
      if (possessionProgressRef.current < POSSESSION_LENGTH) {
        updateGame({ timeRemaining: nextTimeRemaining });
        return;
      }

      possessionProgressRef.current = 0;
      if (!contextRef.current) {
        contextRef.current = buildMatchContext(
          playerAttributes,
          playerName.trim().length > 0 ? playerName : "My Player",
          playerArchetype,
          playerPosition,
        );
      }

      if (!possessionStateRef.current) {
        possessionStateRef.current = initializePossession(contextRef.current, LeagueLevel.PRO, rngRef.current, nextTimeRemaining);
      }

      const possessionState: PossessionState = {
        ...possessionStateRef.current,
        offenseKey: possession,
        defenseKey: possession === "home" ? "away" : "home",
        score: { home: homeScore, away: awayScore },
        secondsRemaining: nextTimeRemaining,
      };
      const periodKey = getPeriodKey(quarter, isOvertime, overtimePeriod);

      if (simulationMode === "interactive" && !keyMomentPending && contextRef.current) {
        const keyMomentContext: KeyMomentContext = {
          id: `km-${periodKey}-${possessionState.possessionIndex}`,
          periodKey,
          quarter,
          overtimePeriod: isOvertime ? overtimePeriod : undefined,
          timeRemaining: nextTimeRemaining,
          offense: possession,
          defense: possession === "home" ? "away" : "home",
          userTeam: "home",
          userPlayerIndex,
          possessionIndex: possessionState.possessionIndex,
          score: { home: homeScore, away: awayScore },
        };

        const schedulerResult = keyMomentSchedulerRef.current.onPossessionBoundary({
          context: keyMomentContext,
          periodTotalSeconds: isOvertime ? OVERTIME_SECONDS : 720,
        });

        if (schedulerResult.trigger && schedulerResult.pending) {
          const pending: KeyMomentPending = {
            ...schedulerResult.pending,
            context: {
              ...schedulerResult.pending.context,
              offense: possession,
              defense: possession === "home" ? "away" : "home",
            },
          };
          setKeyMomentPending(pending);
          pauseMatch();
          return;
        }
      }

      const result = simulatePossession(contextRef.current, possessionState, LeagueLevel.PRO, rngRef.current);
      applyPossessionResult(result, possessionState);
    }, (REAL_SECONDS_PER_TICK * 1000) / simSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    addLog,
    clearKeyMomentFeedback,
    clearKeyMomentResolution,
    endMatch,
    gameFinished,
    homeBoxNames,
    initializeBoxScore,
    isPaused,
    isPlaying,
    pauseMatch,
    setKeyMomentPending,
    setKeyMomentFeedback,
    playerArchetype,
    playerAttributes,
    playerName,
    playerPosition,
    recordBoxScoreEvent,
    simulationMode,
    simSpeed,
    startMatch,
    updateGame,
    userPlayerIndex,
  ]);
};
