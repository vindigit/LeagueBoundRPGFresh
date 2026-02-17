import { create } from "zustand";

export interface PlayLog {
  id: string;
  quarter: 1 | 2 | 3 | 4;
  timeRemaining: number;
  text: string;
  type: "score" | "miss" | "turnover" | "info";
  team: "home" | "away";
}

export interface MatchState {
  isPlaying: boolean;
  isPaused: boolean;
  gameFinished: boolean;
  homeScore: number;
  awayScore: number;
  quarter: 1 | 2 | 3 | 4;
  timeRemaining: number;
  possession: "home" | "away";
  logs: PlayLog[];
}

interface MatchActions {
  initializeMatch: (homeName: string, awayName: string) => void;
  startMatch: () => void;
  pauseMatch: () => void;
  endMatch: () => void;
  updateGame: (partialState: Partial<Pick<MatchState, "homeScore" | "awayScore" | "quarter" | "timeRemaining" | "possession">>) => void;
  addLog: (log: PlayLog) => void;
}

type MatchStore = MatchState & MatchActions;

const initialMatchState: MatchState = {
  isPlaying: false,
  isPaused: false,
  gameFinished: false,
  homeScore: 0,
  awayScore: 0,
  quarter: 1,
  timeRemaining: 720,
  possession: "home",
  logs: [],
};

export const useMatchStore = create<MatchStore>((set) => ({
  ...initialMatchState,
  initializeMatch: (_homeName, _awayName) => {
    set(() => ({ ...initialMatchState }));
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
  updateGame: (partialState) => {
    set(() => ({ ...partialState }));
  },
  addLog: (log) => {
    set((state) => ({
      logs: [log, ...state.logs].slice(0, 50),
    }));
  },
}));
