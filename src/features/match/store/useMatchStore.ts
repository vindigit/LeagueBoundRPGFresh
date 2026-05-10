import { create } from "zustand";
import type { MatchConsequence } from "../../../types/careerProgression";

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

export interface MatchMomentSummary {
  id: string;
  promptText: string;
  resultText: string;
  ratingDelta: number;
  success: boolean;
  quarter: 1 | 2 | 3 | 4;
  timeRemaining: number;
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
  tpm?: number;
  tpa?: number;
  ftm: number;
  fta: number;
  pf: number;
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
  tpm?: number;
  tpa?: number;
  ftm: number;
  fta: number;
  pf: number;
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
  presentationMode: "moment" | "broadcast";
  activeTab: "moment" | "log" | "box_score" | "shot_chart";
  momentPhase: "pregame" | "live" | "postgame";
  broadcastUnlocked: boolean;
  homeScore: number;
  awayScore: number;
  quarter: 1 | 2 | 3 | 4;
  isOvertime: boolean;
  overtimePeriod: number;
  simSpeed: number;
  timeRemaining: number;
  possession: "home" | "away";
  keyMomentFeedback?: { id: string; success: boolean; text: string };
  latestMomentSummary?: MatchMomentSummary;
  momentHistory: MatchMomentSummary[];
  matchConsequences: MatchConsequence[];
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
  setPresentationMode: (mode: MatchState["presentationMode"]) => void;
  setActiveTab: (tab: MatchState["activeTab"]) => void;
  setSimSpeed: (speed: number) => void;
  setKeyMomentFeedback: (feedback: MatchState["keyMomentFeedback"] | undefined) => void;
  clearKeyMomentFeedback: () => void;
  pushMomentSummary: (summary: MatchMomentSummary) => void;
  addMatchConsequences: (consequences: MatchConsequence[]) => void;
  updateGame: (
    partialState: Partial<Pick<MatchState, "homeScore" | "awayScore" | "quarter" | "isOvertime" | "overtimePeriod" | "timeRemaining" | "possession">>,
  ) => void;
  recordBoxScoreEvent: (event: {
    scoringTeam?: "home" | "away";
    shooterIndex?: number;
    points?: number;
    shotAttempted?: boolean;
    shotMade?: boolean;
    wasThreePointAttempt?: boolean;
    assisterIndex?: number;
    turnoverTeam?: "home" | "away";
    turnoverPlayerIndex?: number;
    defenderTeam?: "home" | "away";
    stealDefenderIndex?: number;
    blockDefenderIndex?: number;
    reboundTeam?: "home" | "away";
    rebounderIndex?: number;
    freeThrowMade?: number;
    freeThrowAttempted?: number;
    foulOnTeam?: "home" | "away";
    foulOnPlayerIndex?: number;
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
  tpm: 0,
  tpa: 0,
  ftm: 0,
  fta: 0,
  pf: 0,
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
  tpm: 0,
  tpa: 0,
  ftm: 0,
  fta: 0,
  pf: 0,
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
      tpm: (totals.tpm ?? 0) + (player.tpm ?? 0),
      tpa: (totals.tpa ?? 0) + (player.tpa ?? 0),
      ftm: totals.ftm + player.ftm,
      fta: totals.fta + player.fta,
      pf: totals.pf + player.pf,
    }),
    emptyTeamTotals(),
  );

const withPlayerStatDelta = (
  players: PlayerBoxScoreLine[],
  index: number | undefined,
  delta: Partial<Pick<PlayerBoxScoreLine, "pts" | "reb" | "ast" | "stl" | "blk" | "to" | "fgm" | "fga" | "tpm" | "tpa" | "ftm" | "fta" | "pf">>,
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
      tpm: player.tpm + (delta.tpm ?? 0),
      tpa: player.tpa + (delta.tpa ?? 0),
      ftm: player.ftm + (delta.ftm ?? 0),
      fta: player.fta + (delta.fta ?? 0),
      pf: player.pf + (delta.pf ?? 0),
    };
  });
};

const initialMatchState: MatchState = {
  isPlaying: false,
  isPaused: false,
  gameFinished: false,
  simulationMode: "interactive",
  presentationMode: "moment",
  activeTab: "moment",
  momentPhase: "pregame",
  broadcastUnlocked: false,
  homeScore: 0,
  awayScore: 0,
  quarter: 1,
  isOvertime: false,
  overtimePeriod: 0,
  simSpeed: 1,
  timeRemaining: 720,
  possession: "home",
  keyMomentFeedback: undefined,
  latestMomentSummary: undefined,
  momentHistory: [],
  matchConsequences: [],
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
    set((state) => ({
      isPlaying: true,
      isPaused: false,
      gameFinished: false,
      momentPhase: state.momentHistory.length > 0 ? "live" : "pregame",
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
      momentPhase: "postgame",
    }));
  },
  setSimulationMode: (mode) => {
    set(() => ({ simulationMode: mode }));
  },
  setPresentationMode: (mode) => {
    set(() => ({
      presentationMode: mode,
      activeTab: mode === "broadcast" ? "log" : "moment",
      broadcastUnlocked: true,
    }));
  },
  setActiveTab: (tab) => {
    set(() => ({
      activeTab: tab,
      presentationMode: tab === "moment" ? "moment" : "broadcast",
      broadcastUnlocked: tab === "moment" ? true : true,
    }));
  },
  setSimSpeed: (speed) => {
    const clampedSpeed = Math.min(4, Math.max(0.5, speed));
    set(() => ({ simSpeed: clampedSpeed }));
  },
  setKeyMomentFeedback: (feedback) => {
    set(() => ({ keyMomentFeedback: feedback }));
  },
  clearKeyMomentFeedback: () => {
    set(() => ({ keyMomentFeedback: undefined }));
  },
  pushMomentSummary: (summary) => {
    set((state) => ({
      latestMomentSummary: summary,
      momentHistory: [...state.momentHistory, summary].slice(-10),
      momentPhase: "live",
      broadcastUnlocked: true,
    }));
  },
  addMatchConsequences: (consequences) => {
    if (consequences.length === 0) {
      return;
    }

    set((state) => ({
      matchConsequences: [...state.matchConsequences, ...consequences],
    }));
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
          tpa: event.wasThreePointAttempt ? 1 : 0,
          tpm: event.wasThreePointAttempt && event.shotMade ? 1 : 0,
          ftm: event.freeThrowMade ?? 0,
          fta: event.freeThrowAttempted ?? 0,
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
          tpa: event.wasThreePointAttempt ? 1 : 0,
          tpm: event.wasThreePointAttempt && event.shotMade ? 1 : 0,
          ftm: event.freeThrowMade ?? 0,
          fta: event.freeThrowAttempted ?? 0,
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

      if (event.foulOnTeam === "home") {
        homePlayers = withPlayerStatDelta(homePlayers, event.foulOnPlayerIndex, { pf: event.foulOnPlayerIndex !== undefined ? 1 : 0 });
      }
      if (event.foulOnTeam === "away") {
        awayPlayers = withPlayerStatDelta(awayPlayers, event.foulOnPlayerIndex, { pf: event.foulOnPlayerIndex !== undefined ? 1 : 0 });
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
