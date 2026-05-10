import { KEY_MOMENT_DEFINITIONS } from "./catalog";
import type {
  KeyMomentBuildArgs,
  KeyMomentPending,
  KeyMomentScheduler,
  KeyMomentSchedulerInput,
  KeyMomentSchedulerOutput,
} from "./types";

interface SchedulerState {
  triggeredCount: number;
  lastTriggeredPossessionIndex: number;
}

export interface KeyMomentSchedulerConfig {
  targetPerPeriod?: number;
  cooldownPossessions?: number;
}

const getTargetPerPeriod = (input: KeyMomentSchedulerInput, config: KeyMomentSchedulerConfig): number => {
  if (config.targetPerPeriod) {
    return config.targetPerPeriod;
  }
  const trust = input.context.coachTrust ?? 50;
  const fatigue = input.context.fatigue;
  const stamina = input.context.staminaRating ?? 70;
  let target = 5;

  if (trust >= 75) {
    target += 1;
  } else if (trust <= 35) {
    target -= 1;
  }

  if (fatigue >= 0.7 || stamina <= 45) {
    target -= 1;
  } else if (fatigue <= 0.3 && stamina >= 75) {
    target += 1;
  }

  if (input.context.workRate === "high") {
    target += 1;
  }
  if (input.context.workRate === "low") {
    target -= 1;
  }

  return Math.max(3, Math.min(7, target));
};

const getCooldown = (input: KeyMomentSchedulerInput, config: KeyMomentSchedulerConfig): number => {
  if (config.cooldownPossessions) {
    return config.cooldownPossessions;
  }
  const trust = input.context.coachTrust ?? 50;
  const fatigue = input.context.fatigue;
  let cooldown = 16;

  if (trust >= 75) {
    cooldown -= 2;
  } else if (trust <= 35) {
    cooldown += 2;
  }
  if (input.context.workRate === "high") {
    cooldown -= 1;
  } else if (input.context.workRate === "low") {
    cooldown += 1;
  }
  if (fatigue >= 0.7) {
    cooldown += 2;
  }

  return Math.max(8, cooldown);
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

const getLeverageBonus = (input: KeyMomentSchedulerInput): number => {
  const trust = input.context.coachTrust ?? 50;
  const secondsRemaining = input.possessionState?.secondsRemaining ?? input.context.timeRemaining;
  const score = input.context.score;
  const scoreDiff = Math.abs(score.home - score.away);
  const clutchWindow = secondsRemaining <= 120 && scoreDiff <= 8;
  const highLeverageWindow = secondsRemaining <= 240 && scoreDiff <= 10;

  if (clutchWindow) {
    return trust >= 70 ? 0.28 : trust <= 35 ? -0.12 : 0.12;
  }
  if (highLeverageWindow) {
    return trust >= 70 ? 0.14 : trust <= 35 ? -0.06 : 0.05;
  }
  return 0;
};

export const createKeyMomentScheduler = (config: KeyMomentSchedulerConfig = {}): KeyMomentScheduler => {
  const state: SchedulerState = {
    triggeredCount: 0,
    lastTriggeredPossessionIndex: -999,
  };

  const onPossessionBoundary = (input: KeyMomentSchedulerInput): KeyMomentSchedulerOutput => {
    const targetPerPeriod = getTargetPerPeriod(input, config);
    const cooldownPossessions = getCooldown(input, config);
    const possessionsSinceLast = input.context.possessionIndex - state.lastTriggeredPossessionIndex;
    const matchTotalSeconds = input.matchTotalSeconds ?? input.periodTotalSeconds * 4;
    const secondsRemaining = input.possessionState?.secondsRemaining ?? input.context.timeRemaining;
    const elapsedShare = 1 - secondsRemaining / Math.max(1, matchTotalSeconds);
    const expectedByNow = Math.floor(targetPerPeriod * elapsedShare);
    const phasePressure = expectedByNow - state.triggeredCount;
    const seedValue = input.context.possessionIndex * 17 + state.triggeredCount * 13 + Math.round(elapsedShare * 100);
    const trust = input.context.coachTrust ?? 50;
    const fatiguePenalty = input.context.fatigue >= 0.72 ? 0.14 : input.context.fatigue >= 0.5 ? 0.07 : 0;
    const trustBonus = trust >= 75 ? 0.08 : trust <= 35 ? -0.08 : 0;
    const triggerChance =
      0.16 +
      getFocusAlignmentBonus(input) +
      getLeverageBonus(input) +
      trustBonus -
      fatiguePenalty +
      Math.max(0, phasePressure) * 0.2;

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
      state.triggeredCount = 0;
      state.lastTriggeredPossessionIndex = -999;
    },
    onPossessionBoundary,
  };
};
