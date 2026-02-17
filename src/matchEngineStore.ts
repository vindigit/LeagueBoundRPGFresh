import {
  createMatchEngineAdapter,
  type AdapterStepOutput,
  type KeyMomentEvent,
  type MatchEngineAdapterOptions,
} from "./matchEngineAdapter";

export type AutoSaveReason = "week_advance" | "key_moment_resolution";

export interface AutoSaveEvent {
  reason: AutoSaveReason;
  timestamp: number;
}

export interface MatchEngineStoreState {
  started: boolean;
  pausedForKeyMoment: boolean;
  keyMoment?: KeyMomentEvent;
  lastStep?: AdapterStepOutput;
  autosaveEvents: AutoSaveEvent[];
}

export interface MatchEngineStore {
  getState(): MatchEngineStoreState;
  subscribe(listener: (state: MatchEngineStoreState) => void): () => void;
  startMatch(options: MatchEngineAdapterOptions): MatchEngineStoreState;
  stepPossession(): MatchEngineStoreState;
  runPossessions(possessions: number): MatchEngineStoreState;
  resolveKeyMomentChoice(choiceId: "force_shot" | "pass_to_corner" | "reset"): MatchEngineStoreState;
}

export interface MatchEngineStoreOptions {
  onAutoSave?: (event: AutoSaveEvent) => void;
}

const emitAutoSave = (
  state: MatchEngineStoreState,
  reason: AutoSaveReason,
  onAutoSave?: (event: AutoSaveEvent) => void,
): MatchEngineStoreState => {
  const event: AutoSaveEvent = { reason, timestamp: Date.now() };
  onAutoSave?.(event);
  return {
    ...state,
    autosaveEvents: [...state.autosaveEvents, event],
  };
};

export const createMatchEngineStore = (options: MatchEngineStoreOptions = {}): MatchEngineStore => {
  let adapter: ReturnType<typeof createMatchEngineAdapter> | undefined;
  let state: MatchEngineStoreState = {
    started: false,
    pausedForKeyMoment: false,
    autosaveEvents: [],
  };
  const listeners = new Set<(next: MatchEngineStoreState) => void>();

  const notify = (): void => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  const setState = (next: MatchEngineStoreState): MatchEngineStoreState => {
    state = next;
    notify();
    return state;
  };

  const getState = (): MatchEngineStoreState => state;

  const subscribe = (listener: (next: MatchEngineStoreState) => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const startMatch = (adapterOptions: MatchEngineAdapterOptions): MatchEngineStoreState => {
    adapter = createMatchEngineAdapter(adapterOptions);
    const started = adapter.startGame();
    return setState({
      started: true,
      pausedForKeyMoment: false,
      keyMoment: undefined,
      lastStep: started,
      autosaveEvents: [],
    });
  };

  const stepPossession = (): MatchEngineStoreState => {
    if (!adapter || !state.started || state.pausedForKeyMoment) {
      return state;
    }
    const step = adapter.stepPossession();
    return setState({
      ...state,
      lastStep: step,
      pausedForKeyMoment: Boolean(step.keyMoment),
      keyMoment: step.keyMoment,
    });
  };

  const runPossessions = (possessions: number): MatchEngineStoreState => {
    if (!adapter || !state.started || possessions <= 0) {
      return state;
    }
    let remaining = possessions;
    while (remaining > 0 && !state.pausedForKeyMoment) {
      stepPossession();
      remaining -= 1;
    }
    if (state.pausedForKeyMoment) {
      return state;
    }
    return setState(emitAutoSave(state, "week_advance", options.onAutoSave));
  };

  const resolveKeyMomentChoice = (
    choiceId: "force_shot" | "pass_to_corner" | "reset",
  ): MatchEngineStoreState => {
    if (!adapter || !state.keyMoment || !state.lastStep?.userInkState) {
      return state;
    }

    const userInkState = { ...state.lastStep.userInkState };
    if (choiceId === "force_shot") {
      userInkState.Morale = Math.max(0, userInkState.Morale - 1);
    } else if (choiceId === "pass_to_corner") {
      userInkState.Morale = Math.min(99, userInkState.Morale + 1);
    } else {
      userInkState.BankBalance = userInkState.BankBalance - 50;
    }

    const adapterSynced = adapter.updateUserInkState({
      BankBalance: userInkState.BankBalance,
      Morale: userInkState.Morale,
      Position: userInkState.Position,
    });

    return setState(emitAutoSave({
      ...state,
      pausedForKeyMoment: false,
      keyMoment: undefined,
      lastStep: {
        ...adapterSynced,
        userInkState,
      },
    }, "key_moment_resolution", options.onAutoSave));
  };

  return {
    getState,
    subscribe,
    startMatch,
    stepPossession,
    runPossessions,
    resolveKeyMomentChoice,
  };
};
