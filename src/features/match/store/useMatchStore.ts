import { create } from "zustand";
import type { KeyMomentPending, KeyMomentResolutionInput } from "../../../match/keyMoments/types";

export interface PlayLog {
  id: string;
  quarter: 1 | 2 | 3 | 4;
  overtimePeriod?: number;
  isUserAction: boolean;
  timeRemaining: number;
  text: string;
  type: "score" | "miss" | "turnover" | "info";
  team: "home" | "away";
}

export interface PlayerBoxScoreLine {
  id: string;
  name: string;
  team: "home" | "away";
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fgm: number;
  fga: number;
}

export interface TeamBoxScoreTotals {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fgm: number;
  fga: number;
}

export interface MatchBoxScore {
  homePlayers: PlayerBoxScoreLine[];
  awayPlayers: PlayerBoxScoreLine[];
  homeTotals: TeamBoxScoreTotals;
  awayTotals: TeamBoxScoreTotals;
}

export interface MatchState {
  isPlaying: boolean;
  isPaused: boolean;
  gameFinished: boolean;
  simulationMode: "interactive" | "full_game";
  homeScore: number;
  awayScore: number;
  quarter: 1 | 2 | 3 | 4;
  isOvertime: boolean;
  overtimePeriod: number;
  simSpeed: number;
  timeRemaining: number;
  possession: "home" | "away";
  keyMomentPending?: KeyMomentPending;
  keyMomentResolutionInput?: KeyMomentResolutionInput;
  keyMomentFeedback?: { id: string; success: boolean; text: string };
  logs: PlayLog[];
  matchBoxScore: MatchBoxScore;
}

interface MatchActions {
  initializeMatch: (homeName: string, awayName: string) => void;
  initializeBoxScore: (homeNames: string[], awayNames: string[]) => void;
  startMatch: () => void;
  pauseMatch: () => void;
  endMatch: () => void;
  setSimulationMode: (mode: MatchState["simulationMode"]) => void;
  setSimSpeed: (speed: number) => void;
  setKeyMomentPending: (pending: KeyMomentPending | undefined) => void;
  resolveKeyMoment: (input: KeyMomentResolutionInput) => void;
  clearKeyMomentResolution: () => void;
  setKeyMomentFeedback: (feedback: MatchState["keyMomentFeedback"] | undefined) => void;
  clearKeyMomentFeedback: () => void;
  updateGame: (
    partialState: Partial<Pick<MatchState, "homeScore" | "awayScore" | "quarter" | "isOvertime" | "overtimePeriod" | "timeRemaining" | "possession">>,
  ) => void;
  recordBoxScoreEvent: (event: {
    scoringTeam?: "home" | "away";
    shooterIndex?: number;
    points?: number;
    shotAttempted?: boolean;
    shotMade?: boolean;
    assisterIndex?: number;
    turnoverTeam?: "home" | "away";
    turnoverPlayerIndex?: number;
    defenderTeam?: "home" | "away";
    stealDefenderIndex?: number;
    blockDefenderIndex?: number;
    reboundTeam?: "home" | "away";
    rebounderIndex?: number;
  }) => void;
  addLog: (log: PlayLog) => void;
}

type MatchStore = MatchState & MatchActions;

const emptyTeamTotals = (): TeamBoxScoreTotals => ({
  pts: 0,
  reb: 0,
  ast: 0,
  stl: 0,
  blk: 0,
  to: 0,
  fgm: 0,
  fga: 0,
});

const createPlayerLine = (id: string, name: string, team: "home" | "away"): PlayerBoxScoreLine => ({
  id,
  name,
  team,
  pts: 0,
  reb: 0,
  ast: 0,
  stl: 0,
  blk: 0,
  to: 0,
  fgm: 0,
  fga: 0,
});

const DEFAULT_HOME_BOX_NAMES = ["My Player", "Home SG", "Home SF", "Home PF", "Home C"] as const;
const DEFAULT_AWAY_BOX_NAMES = ["Away PG", "Away SG", "Away SF", "Away PF", "Away C"] as const;

const buildBoxScoreFromNames = (homeNames: readonly string[], awayNames: readonly string[]): MatchBoxScore => ({
  homePlayers: homeNames.map((name, index) => createPlayerLine(`home-${index}`, name, "home")),
  awayPlayers: awayNames.map((name, index) => createPlayerLine(`away-${index}`, name, "away")),
  homeTotals: emptyTeamTotals(),
  awayTotals: emptyTeamTotals(),
});

const createInitialBoxScore = (): MatchBoxScore => ({
  homePlayers: [],
  awayPlayers: [],
  homeTotals: emptyTeamTotals(),
  awayTotals: emptyTeamTotals(),
});

const sumTeamTotals = (players: PlayerBoxScoreLine[]): TeamBoxScoreTotals =>
  players.reduce(
    (totals, player) => ({
      pts: totals.pts + player.pts,
      reb: totals.reb + player.reb,
      ast: totals.ast + player.ast,
      stl: totals.stl + player.stl,
      blk: totals.blk + player.blk,
      to: totals.to + player.to,
      fgm: totals.fgm + player.fgm,
      fga: totals.fga + player.fga,
    }),
    emptyTeamTotals(),
  );

const withPlayerStatDelta = (
  players: PlayerBoxScoreLine[],
  index: number | undefined,
  delta: Partial<Pick<PlayerBoxScoreLine, "pts" | "reb" | "ast" | "stl" | "blk" | "to" | "fgm" | "fga">>,
): PlayerBoxScoreLine[] => {
  if (index === undefined || !Number.isInteger(index) || index < 0 || index >= players.length) {
    return players;
  }

  return players.map((player, playerIndex) => {
    if (playerIndex !== index) {
      return player;
    }

    return {
      ...player,
      pts: player.pts + (delta.pts ?? 0),
      reb: player.reb + (delta.reb ?? 0),
      ast: player.ast + (delta.ast ?? 0),
      stl: player.stl + (delta.stl ?? 0),
      blk: player.blk + (delta.blk ?? 0),
      to: player.to + (delta.to ?? 0),
      fgm: player.fgm + (delta.fgm ?? 0),
      fga: player.fga + (delta.fga ?? 0),
    };
  });
};

const initialMatchState: MatchState = {
  isPlaying: false,
  isPaused: false,
  gameFinished: false,
  simulationMode: "interactive",
  homeScore: 0,
  awayScore: 0,
  quarter: 1,
  isOvertime: false,
  overtimePeriod: 0,
  simSpeed: 1,
  timeRemaining: 720,
  possession: "home",
  keyMomentPending: undefined,
  keyMomentResolutionInput: undefined,
  keyMomentFeedback: undefined,
  logs: [],
  matchBoxScore: createInitialBoxScore(),
};

export const useMatchStore = create<MatchStore>((set) => ({
  ...initialMatchState,
  initializeMatch: (homeName, _awayName) => {
    const homeNames = [homeName, ...DEFAULT_HOME_BOX_NAMES.slice(1)];
    set(() => ({
      ...initialMatchState,
      matchBoxScore: buildBoxScoreFromNames(homeNames, DEFAULT_AWAY_BOX_NAMES),
    }));
  },
  initializeBoxScore: (homeNames, awayNames) => {
    set(() => ({
      matchBoxScore: buildBoxScoreFromNames(homeNames, awayNames),
    }));
  },
  startMatch: () => {
    set(() => ({
      isPlaying: true,
      isPaused: false,
      gameFinished: false,
    }));
  },
  pauseMatch: () => {
    set(() => ({
      isPlaying: false,
      isPaused: true,
    }));
  },
  endMatch: () => {
    set(() => ({
      isPlaying: false,
      isPaused: false,
      gameFinished: true,
    }));
  },
  setSimulationMode: (mode) => {
    set(() => ({ simulationMode: mode }));
  },
  setSimSpeed: (speed) => {
    const clampedSpeed = Math.min(4, Math.max(0.5, speed));
    set(() => ({ simSpeed: clampedSpeed }));
  },
  setKeyMomentPending: (pending) => {
    set(() => ({
      keyMomentPending: pending,
      keyMomentResolutionInput: undefined,
    }));
  },
  resolveKeyMoment: (input) => {
    set((state) => {
      if (!state.keyMomentPending || state.keyMomentPending.id !== input.pendingId || state.keyMomentResolutionInput) {
        return {};
      }
      return {
        keyMomentResolutionInput: input,
        isPlaying: true,
        isPaused: false,
      };
    });
  },
  clearKeyMomentResolution: () => {
    set(() => ({ keyMomentResolutionInput: undefined }));
  },
  setKeyMomentFeedback: (feedback) => {
    set(() => ({ keyMomentFeedback: feedback }));
  },
  clearKeyMomentFeedback: () => {
    set(() => ({ keyMomentFeedback: undefined }));
  },
  updateGame: (partialState) => {
    set(() => ({ ...partialState }));
  },
  recordBoxScoreEvent: (event) => {
    set((state) => {
      let homePlayers = [...state.matchBoxScore.homePlayers];
      let awayPlayers = [...state.matchBoxScore.awayPlayers];

      if (event.scoringTeam === "home") {
        homePlayers = withPlayerStatDelta(homePlayers, event.shooterIndex, {
          pts: event.points ?? 0,
          fga: event.shotAttempted ? 1 : 0,
          fgm: event.shotMade ? 1 : 0,
        });
        homePlayers = withPlayerStatDelta(homePlayers, event.assisterIndex, {
          ast: event.assisterIndex !== undefined && (event.points ?? 0) > 0 ? 1 : 0,
        });
      }

      if (event.scoringTeam === "away") {
        awayPlayers = withPlayerStatDelta(awayPlayers, event.shooterIndex, {
          pts: event.points ?? 0,
          fga: event.shotAttempted ? 1 : 0,
          fgm: event.shotMade ? 1 : 0,
        });
        awayPlayers = withPlayerStatDelta(awayPlayers, event.assisterIndex, {
          ast: event.assisterIndex !== undefined && (event.points ?? 0) > 0 ? 1 : 0,
        });
      }

      if (event.turnoverTeam === "home") {
        homePlayers = withPlayerStatDelta(homePlayers, event.turnoverPlayerIndex, { to: 1 });
      }
      if (event.turnoverTeam === "away") {
        awayPlayers = withPlayerStatDelta(awayPlayers, event.turnoverPlayerIndex, { to: 1 });
      }

      if (event.defenderTeam === "home") {
        homePlayers = withPlayerStatDelta(homePlayers, event.stealDefenderIndex, { stl: event.stealDefenderIndex !== undefined ? 1 : 0 });
        homePlayers = withPlayerStatDelta(homePlayers, event.blockDefenderIndex, { blk: event.blockDefenderIndex !== undefined ? 1 : 0 });
      }
      if (event.defenderTeam === "away") {
        awayPlayers = withPlayerStatDelta(awayPlayers, event.stealDefenderIndex, { stl: event.stealDefenderIndex !== undefined ? 1 : 0 });
        awayPlayers = withPlayerStatDelta(awayPlayers, event.blockDefenderIndex, { blk: event.blockDefenderIndex !== undefined ? 1 : 0 });
      }

      if (event.reboundTeam === "home") {
        homePlayers = withPlayerStatDelta(homePlayers, event.rebounderIndex, { reb: event.rebounderIndex !== undefined ? 1 : 0 });
      }
      if (event.reboundTeam === "away") {
        awayPlayers = withPlayerStatDelta(awayPlayers, event.rebounderIndex, { reb: event.rebounderIndex !== undefined ? 1 : 0 });
      }

      return {
        matchBoxScore: {
          homePlayers,
          awayPlayers,
          homeTotals: sumTeamTotals(homePlayers),
          awayTotals: sumTeamTotals(awayPlayers),
        },
      };
    });
  },
  addLog: (log) => {
    set((state) => ({
      logs: [log, ...state.logs].slice(0, 50),
    }));
  },
}));
