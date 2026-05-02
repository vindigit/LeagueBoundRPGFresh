import { create } from "zustand";
import {
  createMatchEngineStore,
  type MatchEngineStore,
  type MatchEngineStoreStartOptions,
  type MatchEngineStoreState,
} from "../../../matchEngineStore";
import type { KeyMomentResolutionInput } from "../../../match/keyMoments/types";
import type { MatchFocus, MatchWorkRate } from "../../../matchEngine";

interface MatchEngineUiState {
  runtimeStore: MatchEngineStore | null;
  unsubscribeRuntime: (() => void) | null;
  snapshot: MatchEngineStoreState;
}

interface MatchEngineUiActions {
  initializeRuntime: (options: MatchEngineStoreStartOptions) => MatchEngineStoreState;
  resetRuntime: () => void;
  stepPossession: () => MatchEngineStoreState | undefined;
  setWorkRate: (workRate: MatchWorkRate) => MatchEngineStoreState | undefined;
  setFocus: (focus: MatchFocus) => MatchEngineStoreState | undefined;
  resolveKeyMoment: (input: KeyMomentResolutionInput) => MatchEngineStoreState | undefined;
}

type MatchEngineUiStore = MatchEngineUiState & MatchEngineUiActions;

const createInitialSnapshot = (): MatchEngineStoreState => ({
  started: false,
  simulationMode: "interactive",
  pausedForKeyMoment: false,
  pausedForPendingPossession: false,
  totalSeconds: 20 * 60,
  autosaveEvents: [],
});

const cleanupRuntime = (state: MatchEngineUiState): Pick<MatchEngineUiState, "runtimeStore" | "unsubscribeRuntime" | "snapshot"> => {
  state.unsubscribeRuntime?.();
  return {
    runtimeStore: null,
    unsubscribeRuntime: null,
    snapshot: createInitialSnapshot(),
  };
};

export const useMatchEngineStore = create<MatchEngineUiStore>((set, get) => ({
  runtimeStore: null,
  unsubscribeRuntime: null,
  snapshot: createInitialSnapshot(),
  initializeRuntime: (options) => {
    const current = get();
    current.unsubscribeRuntime?.();

    const runtimeStore = createMatchEngineStore();
    const unsubscribeRuntime = runtimeStore.subscribe((snapshot) => {
      set(() => ({ snapshot }));
    });
    const snapshot = runtimeStore.startMatch(options);

    set(() => ({
      runtimeStore,
      unsubscribeRuntime,
      snapshot,
    }));

    return snapshot;
  },
  resetRuntime: () => {
    set((state) => cleanupRuntime(state));
  },
  stepPossession: () => {
    const runtimeStore = get().runtimeStore;
    if (!runtimeStore) {
      return undefined;
    }

    const snapshot = runtimeStore.stepPossession();
    set(() => ({ snapshot }));
    return snapshot;
  },
  setWorkRate: (workRate) => {
    const runtimeStore = get().runtimeStore;
    if (!runtimeStore) {
      return undefined;
    }
    const snapshot = runtimeStore.setWorkRate(workRate);
    set(() => ({ snapshot }));
    return snapshot;
  },
  setFocus: (focus) => {
    const runtimeStore = get().runtimeStore;
    if (!runtimeStore) {
      return undefined;
    }
    const snapshot = runtimeStore.setFocus(focus);
    set(() => ({ snapshot }));
    return snapshot;
  },
  resolveKeyMoment: (input) => {
    const runtimeStore = get().runtimeStore;
    if (!runtimeStore) {
      return undefined;
    }

    const snapshot = runtimeStore.resolveKeyMoment(input);
    set(() => ({ snapshot }));
    return snapshot;
  },
}));
