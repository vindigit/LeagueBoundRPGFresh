import {
  createMatchEngineAdapter,
  type AdapterStepOutput,
  type MatchEngineAdapter,
  type MatchEngineAdapterOptions,
  type PendingPossession,
  type ResolvedKeyMoment,
  type UserPlayerLocation,
} from "./matchEngineAdapter";
import type { KeyMomentPending, KeyMomentResolutionInput } from "./match/keyMoments/types";
import type { MatchContext, MatchFocus, MatchWorkRate, PossessionResult, PossessionState, SimMetrics, UserMatchState } from "./matchEngine";

export type AutoSaveReason = "week_advance" | "key_moment_resolution";
export type MatchSimulationMode = "interactive" | "full_game";

export interface AutoSaveEvent {
  reason: AutoSaveReason;
  timestamp: number;
}

export interface MatchEngineStepTrace {
  id: number;
  kind: "start" | "step" | "resolved_key_moment";
  beforeState?: PossessionState;
  afterState: PossessionState;
  metrics: SimMetrics;
  result?: PossessionResult;
  pendingKeyMoment?: KeyMomentPending;
  pendingPossession?: PendingPossession;
  resolvedKeyMoment?: ResolvedKeyMoment;
}

export interface MatchEngineStoreState {
  started: boolean;
  simulationMode: MatchSimulationMode;
  pausedForKeyMoment: boolean;
  pausedForPendingPossession: boolean;
  totalSeconds: number;
  matchContext?: MatchContext;
  userPlayerId?: string;
  userPlayerLocation?: UserPlayerLocation;
  userMatchState?: UserMatchState;
  currentPossession?: PossessionState;
  keyMoment?: KeyMomentPending;
  pendingKeyMoment?: KeyMomentPending;
  pendingPossession?: PendingPossession;
  lastStep?: AdapterStepOutput;
  lastTrace?: MatchEngineStepTrace;
  autosaveEvents: AutoSaveEvent[];
}

export interface MatchEngineStoreStartOptions extends MatchEngineAdapterOptions {
  simulationMode?: MatchSimulationMode;
  totalSeconds?: number;
}

export interface MatchEngineStore {
  getState(): MatchEngineStoreState;
  subscribe(listener: (state: MatchEngineStoreState) => void): () => void;
  startMatch(options: MatchEngineStoreStartOptions): MatchEngineStoreState;
  stepPossession(): MatchEngineStoreState;
  runPossessions(possessions: number): MatchEngineStoreState;
  setWorkRate(workRate: MatchWorkRate): MatchEngineStoreState;
  setFocus(focus: MatchFocus): MatchEngineStoreState;
  resolveKeyMoment(input: KeyMomentResolutionInput): MatchEngineStoreState;
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
  let adapter: MatchEngineAdapter | undefined;
  let traceId = 0;
  let state: MatchEngineStoreState = {
    started: false,
    simulationMode: "interactive",
    pausedForKeyMoment: false,
    pausedForPendingPossession: false,
    totalSeconds: 20 * 60,
    autosaveEvents: [],
  };
  const listeners = new Set<(next: MatchEngineStoreState) => void>();

  const notify = (): void => {
    listeners.forEach((listener) => {
      listener(state);
    });
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

  const buildTrace = (input: Omit<MatchEngineStepTrace, "id">): MatchEngineStepTrace => ({
    ...input,
    id: traceId += 1,
  });

  const startMatch = (adapterOptions: MatchEngineStoreStartOptions): MatchEngineStoreState => {
    const totalSeconds = adapterOptions.totalSeconds ?? adapterOptions.secondsRemaining ?? 20 * 60;
    const simulationMode = adapterOptions.simulationMode ?? "interactive";
    adapter = createMatchEngineAdapter({
      ...adapterOptions,
      secondsRemaining: totalSeconds,
      enableKeyMoments: simulationMode !== "full_game",
    });

    const started = adapter.startGame();
    const lastTrace = buildTrace({
      kind: "start",
      afterState: started.state,
      metrics: started.metrics,
    });

    return setState({
      started: true,
      simulationMode,
      pausedForKeyMoment: false,
      pausedForPendingPossession: false,
      totalSeconds,
      matchContext: adapter.getContext(),
      userPlayerId: adapterOptions.userPlayerId,
      userPlayerLocation: adapter.getUserPlayerLocation(),
      currentPossession: started.state,
      userMatchState: started.userMatchState,
      keyMoment: undefined,
      pendingKeyMoment: started.pendingKeyMoment,
      pendingPossession: started.pendingPossession,
      lastStep: started,
      lastTrace,
      autosaveEvents: [],
    });
  };

  const stepPossession = (): MatchEngineStoreState => {
    if (!adapter || !state.started || state.pausedForPendingPossession) {
      return state;
    }

    const step = adapter.stepPossession();
    const isPending = Boolean(step.pendingPossession);
    const lastTrace = buildTrace({
      kind: "step",
      beforeState: state.currentPossession,
      afterState: step.result?.nextState ?? step.pendingPossession?.state ?? step.state,
      metrics: step.metrics,
      result: step.result,
      pendingKeyMoment: step.pendingKeyMoment,
      pendingPossession: step.pendingPossession,
    });

    return setState({
      ...state,
      currentPossession: step.state,
      userMatchState: step.userMatchState,
      lastStep: step,
      lastTrace,
      pausedForKeyMoment: Boolean(step.pendingKeyMoment),
      pausedForPendingPossession: isPending,
      keyMoment: step.keyMoment,
      pendingKeyMoment: step.pendingKeyMoment,
      pendingPossession: step.pendingPossession,
    });
  };

  const runPossessions = (possessions: number): MatchEngineStoreState => {
    if (!adapter || !state.started || possessions <= 0) {
      return state;
    }

    let remaining = possessions;
    while (remaining > 0 && !state.pausedForPendingPossession) {
      stepPossession();
      remaining -= 1;
    }
    if (state.pausedForPendingPossession) {
      return state;
    }
    return setState(emitAutoSave(state, "week_advance", options.onAutoSave));
  };

  const setWorkRate = (workRate: MatchWorkRate): MatchEngineStoreState => {
    if (!adapter || !state.started) {
      return state;
    }
    const next = adapter.setWorkRate(workRate);
    return setState({
      ...state,
      userMatchState: next.userMatchState,
      lastStep: next,
    });
  };

  const setFocus = (focus: MatchFocus): MatchEngineStoreState => {
    if (!adapter || !state.started) {
      return state;
    }
    const next = adapter.setFocus(focus);
    return setState({
      ...state,
      userMatchState: next.userMatchState,
      lastStep: next,
    });
  };

  const resolveKeyMoment = (input: KeyMomentResolutionInput): MatchEngineStoreState => {
    if (!adapter || !state.pendingKeyMoment || !state.pendingPossession || !state.lastStep?.userInkState) {
      return state;
    }
    if (input.pendingId !== state.pendingKeyMoment.id) {
      return state;
    }

    const userInkState = { ...state.lastStep.userInkState };
    const selectedOption = state.pendingKeyMoment.options.find((option) => option.id === input.choiceId);
    if ((selectedOption?.qualityDelta ?? 0) > 0) {
      userInkState.Morale = Math.min(99, userInkState.Morale + 1);
    } else if ((selectedOption?.qualityDelta ?? 0) < 0) {
      userInkState.Morale = Math.max(0, userInkState.Morale - 1);
    } else {
      userInkState.BankBalance -= 50;
    }

    const adapterSynced = adapter.updateUserInkState({
      BankBalance: userInkState.BankBalance,
      Morale: userInkState.Morale,
      Position: userInkState.Position,
    });
    const resumed = adapter.resolvePendingKeyMoment(input);
    const lastTrace = buildTrace({
      kind: "resolved_key_moment",
      beforeState: state.currentPossession,
      afterState: resumed.result?.nextState ?? resumed.state,
      metrics: resumed.metrics,
      result: resumed.result,
      resolvedKeyMoment: resumed.resolvedKeyMoment,
    });

    return setState(
      emitAutoSave(
        {
          ...state,
          currentPossession: resumed.state,
          userMatchState: resumed.userMatchState,
          pausedForKeyMoment: false,
          pausedForPendingPossession: false,
          keyMoment: undefined,
          pendingKeyMoment: undefined,
          pendingPossession: undefined,
          lastTrace,
          lastStep: {
            ...adapterSynced,
            ...resumed,
            userInkState,
          },
        },
        "key_moment_resolution",
        options.onAutoSave,
      ),
    );
  };

  return {
    getState,
    subscribe,
    startMatch,
    stepPossession,
    runPossessions,
    setWorkRate,
    setFocus,
    resolveKeyMoment,
  };
};
