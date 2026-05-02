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
}

export interface KeyMomentSchedulerConfig {
  targetPerPeriod?: number;
  cooldownPossessions?: number;
}

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
  };
  store.set(periodKey, next);
  return next;
};

const getTargetPerPeriod = (input: KeyMomentSchedulerInput, config: KeyMomentSchedulerConfig): number => {
  if (config.targetPerPeriod) {
    return config.targetPerPeriod;
  }
  if (input.context.workRate === "high") {
    return 4;
  }
  if (input.context.workRate === "low") {
    return 2;
  }
  return 3;
};

const getCooldown = (input: KeyMomentSchedulerInput, config: KeyMomentSchedulerConfig): number => {
  if (config.cooldownPossessions) {
    return config.cooldownPossessions;
  }
  if (input.context.workRate === "high") {
    return 4;
  }
  if (input.context.workRate === "low") {
    return 7;
  }
  return 5;
};

const getFocusAlignmentBonus = (input: KeyMomentSchedulerInput): number => {
  const userOnOffense = input.context.offense === input.context.userTeam;
  if (userOnOffense) {
    if (input.context.focus === "offense") {
      return 0.2;
    }
    if (input.context.focus === "defense") {
      return -0.16;
    }
  } else {
    if (input.context.focus === "defense") {
      return 0.2;
    }
    if (input.context.focus === "offense") {
      return -0.16;
    }
  }
  return 0.04;
};

const pickScheduledPending = (input: KeyMomentSchedulerInput, seedValue: number): KeyMomentPending | undefined => {
  const userOnOffense = input.context.offense === input.context.userTeam;
  const focus = input.context.focus;
  const eligible = KEY_MOMENT_DEFINITIONS.filter((definition) => {
    if (userOnOffense) {
      if (focus === "offense") {
        return definition.type === "create_shot" || definition.type === "make_the_read" || definition.type === "foul_pressure";
      }
      return definition.type === "make_the_read" || definition.type === "foul_pressure" || definition.type === "create_shot";
    }
    if (focus === "defense") {
      return definition.type === "jump_lane" || definition.type === "on_ball_stop" || definition.type === "foul_pressure";
    }
    return definition.type === "on_ball_stop" || definition.type === "jump_lane" || definition.type === "foul_pressure";
  });
  const definition = eligible[Math.abs(Math.floor(seedValue)) % eligible.length];
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
    const state = getPeriodState(periodState, input.context.periodKey);
    const targetPerPeriod = getTargetPerPeriod(input, config);
    const cooldownPossessions = getCooldown(input, config);
    const possessionsSinceLast = input.context.possessionIndex - state.lastTriggeredPossessionIndex;
    const elapsedShare = 1 - input.context.timeRemaining / Math.max(1, input.periodTotalSeconds);
    const expectedByNow = Math.floor(targetPerPeriod * elapsedShare);
    const phasePressure = expectedByNow - state.triggeredCount;
    const seedValue = input.context.possessionIndex * 17 + state.triggeredCount * 13 + Math.round(elapsedShare * 100);
    const triggerChance = 0.3 + getFocusAlignmentBonus(input) + Math.max(0, phasePressure) * 0.18;

    if (input.forceTrigger && possessionsSinceLast > 1) {
      state.triggeredCount += 1;
      state.lastTriggeredPossessionIndex = input.context.possessionIndex;
      const pending = pickScheduledPending(input, seedValue);
      return pending ? { trigger: true, pending } : { trigger: false };
    }

    if (state.triggeredCount >= targetPerPeriod || possessionsSinceLast < cooldownPossessions) {
      return { trigger: false };
    }

    const mustCatchUp = state.triggeredCount < expectedByNow;
    const deterministicRoll = ((seedValue % 100) + 1) / 100;
    if (!mustCatchUp && deterministicRoll > triggerChance) {
      return { trigger: false };
    }

    state.triggeredCount += 1;
    state.lastTriggeredPossessionIndex = input.context.possessionIndex;
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
