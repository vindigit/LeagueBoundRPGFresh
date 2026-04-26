import { KEY_MOMENT_DEFINITIONS } from "./catalog";
import type {
  KeyMomentBuildArgs,
  KeyMomentPending,
  KeyMomentScheduler,
  KeyMomentSchedulerInput,
  KeyMomentSchedulerOutput,
  PeriodKey,
} from "./types";

interface SchedulerState {
  triggeredCount: number;
  lastTriggeredPossessionIndex: number;
  windowIndexReached: number;
}

export interface KeyMomentSchedulerConfig {
  targetPerPeriod?: number;
  cooldownPossessions?: number;
}

const clampInt = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.round(value)));

const getCurrentWindow = (
  contextSecondsRemaining: number,
  periodTotalSeconds: number,
  targetPerPeriod: number,
): number => {
  const elapsed = Math.max(0, periodTotalSeconds - contextSecondsRemaining);
  const windowSize = periodTotalSeconds / targetPerPeriod;
  const window = Math.floor(elapsed / Math.max(1, windowSize));
  return Math.min(targetPerPeriod - 1, Math.max(0, window));
};

const getPeriodState = (
  store: Map<PeriodKey, SchedulerState>,
  periodKey: PeriodKey,
): SchedulerState => {
  const existing = store.get(periodKey);
  if (existing) {
    return existing;
  }
  const next: SchedulerState = {
    triggeredCount: 0,
    lastTriggeredPossessionIndex: -999,
    windowIndexReached: -1,
  };
  store.set(periodKey, next);
  return next;
};

const pickScheduledPending = (input: KeyMomentSchedulerInput, seedValue: number): KeyMomentPending | undefined => {
  const eligible = KEY_MOMENT_DEFINITIONS.filter((definition) =>
    input.context.offense === input.context.userTeam
      ? definition.type === "create_shot" || definition.type === "make_the_read" || definition.type === "foul_pressure"
      : definition.type === "on_ball_stop" || definition.type === "jump_lane" || definition.type === "foul_pressure",
  );
  const pool = eligible.length > 0 ? eligible : KEY_MOMENT_DEFINITIONS;
  const definition = pool[Math.abs(Math.floor(seedValue)) % pool.length];
  const buildArgs: KeyMomentBuildArgs = {
    id: input.pendingId ?? `${definition.type}-${input.context.periodKey}-${input.context.possessionIndex}`,
    context: input.context,
    matchContext: input.matchContext,
    possessionState: input.possessionState ?? {
      possessionIndex: input.context.possessionIndex,
      secondsRemaining: input.context.timeRemaining,
      offenseKey: input.context.offense,
      defenseKey: input.context.defense,
      ballHandlerIndex: input.context.userPlayerIndex,
      homeTouches: [0, 0, 0, 0, 0],
      awayTouches: [0, 0, 0, 0, 0],
      score: input.context.score,
      homeStreak: 0,
      awayStreak: 0,
    },
    userMatchState: input.userMatchState,
    seedValue,
    defenderTeamFoulsInSegment: input.defenderTeamFoulsInSegment,
  };
  return definition.buildPending(buildArgs);
};

export const createKeyMomentScheduler = (config: KeyMomentSchedulerConfig = {}): KeyMomentScheduler => {
  const periodState = new Map<PeriodKey, SchedulerState>();

  const onPossessionBoundary = (input: KeyMomentSchedulerInput): KeyMomentSchedulerOutput => {
    const dynamicTargetPerPeriod = config.targetPerPeriod ?? clampInt(4 + input.context.workRate / 25, 4, 8);
    const dynamicCooldownPossessions =
      config.cooldownPossessions ??
      (input.context.workRate >= 67 ? 1 : input.context.workRate >= 34 ? 2 : 3);
    const state = getPeriodState(periodState, input.context.periodKey);
    const currentWindow = getCurrentWindow(input.context.timeRemaining, input.periodTotalSeconds, dynamicTargetPerPeriod);
    state.windowIndexReached = Math.max(state.windowIndexReached, currentWindow);

    const possessionsSinceLast = input.context.possessionIndex - state.lastTriggeredPossessionIndex;
    const cooldownPassed = possessionsSinceLast > dynamicCooldownPossessions;

    if (input.forceTrigger && cooldownPassed) {
      state.triggeredCount += 1;
      state.lastTriggeredPossessionIndex = input.context.possessionIndex;

      const seedValue = input.context.possessionIndex + currentWindow;
      const pending = pickScheduledPending(input, seedValue);
      return pending ? { trigger: true, pending } : { trigger: false };
    }

    if (state.triggeredCount >= dynamicTargetPerPeriod) {
      return { trigger: false };
    }
    const shouldPaceTrigger = cooldownPassed && currentWindow >= state.triggeredCount;

    const remainingBudget = dynamicTargetPerPeriod - state.triggeredCount;
    const remainingWindows = dynamicTargetPerPeriod - (currentWindow + 1);
    const mustTriggerToGuarantee = cooldownPassed && remainingWindows < remainingBudget;

    if (!shouldPaceTrigger && !mustTriggerToGuarantee) {
      return { trigger: false };
    }

    state.triggeredCount += 1;
    state.lastTriggeredPossessionIndex = input.context.possessionIndex;

    const seedValue = input.context.possessionIndex + currentWindow;
    const pending = pickScheduledPending(input, seedValue);
    return pending ? { trigger: true, pending } : { trigger: false };
  };

  return {
    reset: () => {
      periodState.clear();
    },
    onPossessionBoundary,
  };
};
