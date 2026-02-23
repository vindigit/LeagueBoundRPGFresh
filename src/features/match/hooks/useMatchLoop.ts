import { useEffect, useMemo, useRef } from "react";
import { LeagueLevel } from "../../../types/career";
import type { Player, PlayerAttributes, PlayerGameStats, PlayerArchetype, Position } from "../../../types/player";
import type { Team } from "../../../types/team";
import { createSeededRng, initializePossession, simulatePossession, type MatchContext, type PossessionResult, type PossessionState } from "../../../matchEngine";
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

const clampRating = (value: number): PlayerAttributes["shooting"] =>
  Math.max(0, Math.min(99, Math.round(value))) as PlayerAttributes["shooting"];

const withDelta = (attrs: PlayerAttributes, delta: Partial<Record<keyof PlayerAttributes, number>>): PlayerAttributes => ({
  shooting: clampRating(attrs.shooting + (delta.shooting ?? 0)),
  finishing: clampRating(attrs.finishing + (delta.finishing ?? 0)),
  vision: clampRating(attrs.vision + (delta.vision ?? 0)),
  handle: clampRating(attrs.handle + (delta.handle ?? 0)),
  athleticism: clampRating(attrs.athleticism + (delta.athleticism ?? 0)),
  defense: clampRating(attrs.defense + (delta.defense ?? 0)),
  rebounding: clampRating(attrs.rebounding + (delta.rebounding ?? 0)),
  bbiq: clampRating(attrs.bbiq + (delta.bbiq ?? 0)),
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

const buildHomeBoxNames = (userDisplayName: string, userPosition: Position): string[] =>
  POSITIONS.map((position) => (position === userPosition ? userDisplayName : getHomeNameForPosition(position)));

const teammateProfileByPosition: Record<Position, { archetype: PlayerArchetype; delta: Partial<Record<keyof PlayerAttributes, number>> }> = {
  PG: { archetype: "Playmaker", delta: { vision: 7, handle: 6, defense: -3 } },
  SG: { archetype: "Sharpshooter", delta: { shooting: 8, finishing: -6, vision: -4, defense: -2 } },
  SF: { archetype: "Slasher", delta: { finishing: 7, athleticism: 6, shooting: -5, vision: -2 } },
  PF: { archetype: "Stretch Big", delta: { rebounding: 8, defense: 7, shooting: 4, handle: -12 } },
  C: { archetype: "Paint Beast", delta: { finishing: 11, rebounding: 13, defense: 10, shooting: -14, handle: -18 } },
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
  });

  const home: Team = {
    name: "Home",
    teamOvr: 0,
    roster: homeRoster,
  };

  const awayBase: PlayerAttributes = {
    shooting: 69,
    finishing: 70,
    vision: 66,
    handle: 67,
    athleticism: 71,
    defense: 70,
    rebounding: 69,
    bbiq: 68,
    stamina: 72,
  };

  const away: Team = {
    name: "Away",
    teamOvr: 0,
    roster: [
      makePlayer("a1", "Away PG", "Playmaker", "PG", withDelta(awayBase, { vision: 7, handle: 6, defense: -3 })),
      makePlayer("a2", "Away SG", "Sharpshooter", "SG", withDelta(awayBase, { shooting: 9, finishing: -4 })),
      makePlayer("a3", "Away SF", "Lockdown Defender", "SF", withDelta(awayBase, { defense: 10, athleticism: 4, shooting: -4 })),
      makePlayer("a4", "Away PF", "Stretch Big", "PF", withDelta(awayBase, { rebounding: 8, shooting: 5, handle: -12 })),
      makePlayer("a5", "Away C", "Paint Beast", "C", withDelta(awayBase, { finishing: 9, rebounding: 12, defense: 8, shooting: -12, handle: -16 })),
    ],
  };

  return { home, away };
};

const getLogFromEvent = (
  result: PossessionResult,
  offense: "home" | "away",
): { text: string; type: "score" | "miss" | "turnover" | "info" } => {
  const side = offense.toUpperCase();
  const zone = result.shotZone ? ` (${result.shotZone})` : "";

  switch (result.eventType) {
    case "made_3":
      return { text: `${side} made a 3PT${zone}`, type: "score" };
    case "made_2":
      return { text: `${side} made a 2PT${zone}`, type: "score" };
    case "putback_make":
      return { text: `${side} converted a putback`, type: "score" };
    case "steal":
      return { text: `${side} turnover forced by steal`, type: "turnover" };
    case "turnover":
      return { text: `${side} committed a turnover`, type: "turnover" };
    case "block":
      return { text: `${side} shot was blocked${zone}`, type: "miss" };
    case "off_reb":
      return { text: `${side} grabbed an offensive rebound`, type: "info" };
    case "def_reb":
      return { text: `${side} possession ended on defensive rebound`, type: "miss" };
    case "putback_miss":
      return { text: `${side} missed putback`, type: "miss" };
    default:
      return { text: `${side} missed${zone}`, type: "miss" };
  }
};

export const useMatchLoop = (): void => {
  const possessionProgressRef = useRef<number>(0);
  const contextRef = useRef<MatchContext | null>(null);
  const possessionStateRef = useRef<PossessionState | null>(null);
  const rngRef = useRef<() => number>(createSeededRng(Date.now()));

  const isPlaying = useMatchStore((state) => state.isPlaying);
  const isPaused = useMatchStore((state) => state.isPaused);
  const gameFinished = useMatchStore((state) => state.gameFinished);
  const simSpeed = useMatchStore((state) => state.simSpeed);
  const pauseMatch = useMatchStore((state) => state.pauseMatch);
  const endMatch = useMatchStore((state) => state.endMatch);
  const initializeBoxScore = useMatchStore((state) => state.initializeBoxScore);
  const recordBoxScoreEvent = useMatchStore((state) => state.recordBoxScoreEvent);
  const updateGame = useMatchStore((state) => state.updateGame);
  const addLog = useMatchStore((state) => state.addLog);

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

      const { matchBoxScore } = useMatchStore.getState();
      if (matchBoxScore.homePlayers.length === 0 || matchBoxScore.awayPlayers.length === 0) {
        initializeBoxScore(homeBoxNames, [...AWAY_ROSTER_NAMES]);
      }
    }
  }, [gameFinished, homeBoxNames, initializeBoxScore, isPaused, isPlaying]);

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
      const { timeRemaining, quarter, isOvertime, overtimePeriod, possession, homeScore, awayScore } = useMatchStore.getState();
      const nextTimeRemaining = Math.max(0, timeRemaining - GAME_SECONDS_PER_TICK);

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
      const wasUserBallHandler = possessionState.ballHandlerIndex === userPlayerIndex;

      const result = simulatePossession(contextRef.current, possessionState, LeagueLevel.PRO, rngRef.current);
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

      const mappedLog = getLogFromEvent(result, possession);
      const isUserOffenseAction =
        possession === "home" &&
        (result.shooterIndex === userPlayerIndex ||
          result.assisterIndex === userPlayerIndex ||
          (result.turnoverLikeFailure && wasUserBallHandler));
      const isUserDefenseAction =
        possession === "away" &&
        (result.eventType === "steal" || result.eventType === "block") &&
        result.defensivePlay.defenderIndex === userPlayerIndex;
      const isUserAction = isUserOffenseAction || isUserDefenseAction;

      addLog({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        quarter,
        overtimePeriod: isOvertime ? overtimePeriod : undefined,
        isUserAction,
        timeRemaining: nextTimeRemaining,
        text: mappedLog.text,
        type: mappedLog.type,
        team: possession,
      });
    }, (REAL_SECONDS_PER_TICK * 1000) / simSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    addLog,
    endMatch,
    gameFinished,
    homeBoxNames,
    initializeBoxScore,
    isPaused,
    isPlaying,
    pauseMatch,
    playerArchetype,
    playerAttributes,
    playerName,
    playerPosition,
    recordBoxScoreEvent,
    simSpeed,
    updateGame,
    userPlayerIndex,
  ]);
};
