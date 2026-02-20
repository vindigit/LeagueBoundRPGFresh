import { useEffect, useRef } from "react";
import { LeagueLevel } from "../../../types/career";
import type { Player, PlayerAttributes, PlayerGameStats, PlayerArchetype, Position } from "../../../types/player";
import type { Team } from "../../../types/team";
import { createSeededRng, initializePossession, simulatePossession, type MatchContext, type PossessionResult, type PossessionState } from "../../../matchEngine";
import { useCareerStore } from "../../../store/useCareerStore";
import { useMatchStore } from "../store/useMatchStore";

const REAL_SECONDS_PER_TICK = 1;
const GAME_SECONDS_PER_TICK = 10;
const POSSESSION_LENGTH = 24;

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
  BankBalance: 0,
  Morale: 50,
  Position: position,
  bankBalance: 0,
  morale: 50,
  position,
  archetype,
  attributes,
  gameStats: { ...defaultGameStats },
});

const buildMatchContext = (userAttributes: PlayerAttributes): MatchContext => {
  const home: Team = {
    name: "Home",
    teamOvr: 0,
    roster: [
      makePlayer("h1", "User", "Playmaker", "PG", userAttributes),
      makePlayer("h2", "Home SG", "Sharpshooter", "SG", withDelta(userAttributes, { shooting: 8, finishing: -6, vision: -4, defense: -2 })),
      makePlayer("h3", "Home SF", "Slasher", "SF", withDelta(userAttributes, { finishing: 7, athleticism: 6, shooting: -5, vision: -2 })),
      makePlayer("h4", "Home PF", "Stretch Big", "PF", withDelta(userAttributes, { rebounding: 8, defense: 7, shooting: 4, handle: -12 })),
      makePlayer("h5", "Home C", "Paint Beast", "C", withDelta(userAttributes, { finishing: 11, rebounding: 13, defense: 10, shooting: -14, handle: -18 })),
    ],
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
  const pauseMatch = useMatchStore((state) => state.pauseMatch);
  const endMatch = useMatchStore((state) => state.endMatch);
  const updateGame = useMatchStore((state) => state.updateGame);
  const addLog = useMatchStore((state) => state.addLog);

  const playerAttributes = useCareerStore((state) => state.player.attributes);

  useEffect(() => {
    if (!isPlaying && !isPaused && !gameFinished) {
      const snapshot = useMatchStore.getState();
      if (
        snapshot.quarter === 1 &&
        snapshot.timeRemaining === 720 &&
        snapshot.homeScore === 0 &&
        snapshot.awayScore === 0
      ) {
        contextRef.current = null;
        possessionStateRef.current = null;
        possessionProgressRef.current = 0;
        rngRef.current = createSeededRng(Date.now());
      }
    }
  }, [gameFinished, isPaused, isPlaying]);

  useEffect(() => {
    if (!isPlaying || isPaused || gameFinished) {
      return;
    }

    if (!contextRef.current) {
      contextRef.current = buildMatchContext(playerAttributes);
    }

    const intervalId = setInterval(() => {
      const { timeRemaining, quarter, possession, homeScore, awayScore } = useMatchStore.getState();
      const nextTimeRemaining = Math.max(0, timeRemaining - GAME_SECONDS_PER_TICK);

      if (nextTimeRemaining === 0) {
        pauseMatch();
        possessionProgressRef.current = 0;
        const nextQuarter = quarter + 1;

        if (nextQuarter > 4) {
          endMatch();
          addLog({
            id: `end-${Date.now()}`,
            quarter,
            timeRemaining: 0,
            text: "Final buzzer",
            type: "info",
            team: possession,
          });
          return;
        }

        updateGame({
          quarter: nextQuarter as 1 | 2 | 3 | 4,
          timeRemaining: 720,
        });
        addLog({
          id: `q-${Date.now()}`,
          quarter,
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
        contextRef.current = buildMatchContext(playerAttributes);
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

      const result = simulatePossession(contextRef.current, possessionState, LeagueLevel.PRO, rngRef.current);
      possessionStateRef.current = {
        ...result.nextState,
        secondsRemaining: nextTimeRemaining,
      };

      updateGame({
        timeRemaining: nextTimeRemaining,
        homeScore: result.nextState.score.home,
        awayScore: result.nextState.score.away,
        possession: result.nextState.offenseKey,
      });

      const mappedLog = getLogFromEvent(result, possession);
      addLog({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        quarter,
        timeRemaining: nextTimeRemaining,
        text: mappedLog.text,
        type: mappedLog.type,
        team: possession,
      });
    }, REAL_SECONDS_PER_TICK * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [addLog, endMatch, gameFinished, isPaused, isPlaying, pauseMatch, playerAttributes, updateGame]);
};
