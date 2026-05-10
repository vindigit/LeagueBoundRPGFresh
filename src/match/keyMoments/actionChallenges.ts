import type { Player } from "../../types/player";
import { clamp01, getRating } from "./shared";
import type {
  ActionChallengeSpec,
  BasketballChallengeContext,
  ChallengeExecutionResult,
  ChallengeForgivenessProfile,
  KeyMomentBuildArgs,
  KeyMomentContext,
  KeyMomentPending,
  MinigameSpec,
} from "./types";

const DEFAULT_FORGIVENESS: ChallengeForgivenessProfile = {
  windowRadiusBonus: 0,
  nearMissSoftener: 0,
  recoveryBonus: 0,
  fatigueResistance: 0,
};

const buildShootingForgiveness = (
  player: Player | undefined,
  context: Pick<KeyMomentContext, "fatigue">,
): ChallengeForgivenessProfile => {
  if (!player) {
    return DEFAULT_FORGIVENESS;
  }

  const shooting = (getRating(player, "threePoint") * 0.6 + getRating(player, "midrange") * 0.4) / 99;
  const stamina = getRating(player, "stamina") / 99;
  const athleticism = getRating(player, "speed") / 99;
  const fatigueDrag = context.fatigue * (1 - stamina * 0.55);

  return {
    windowRadiusBonus: clamp01((shooting - 0.5) * 0.08) - fatigueDrag * 0.03,
    nearMissSoftener: clamp01((shooting - 0.45) * 0.18),
    recoveryBonus: clamp01((athleticism - 0.45) * 0.12),
    fatigueResistance: clamp01(stamina * 0.14),
  };
};

export const createTimingShotChallenge = (args: {
  id: string;
  promptText: string;
  context: BasketballChallengeContext;
  player?: Player;
  keyMomentContext: KeyMomentContext;
  variant?: "catch_shoot" | "pullup" | "free_throw";
}): ActionChallengeSpec => {
  const forgiveness = buildShootingForgiveness(args.player, args.keyMomentContext);
  const variant = args.variant ?? "pullup";
  const timingRadius = variant === "free_throw" ? 0.115 : variant === "catch_shoot" ? 0.11 : 0.1;
  const durationMs = variant === "free_throw" ? 1500 : variant === "catch_shoot" ? 1280 : 1400;

  return {
    id: args.id,
    kind: "timing",
    context: args.context,
    title: variant === "free_throw" ? "Free Throw Release" : "Timing Release",
    subtitle:
      variant === "free_throw"
        ? "Settle in and release through the center of the window."
        : "Tap when the marker hits the green release window.",
    buttonLabel: variant === "free_throw" ? "Release Free Throw" : "Tap to Release",
    execution: {
      kind: "timing",
      timing: {
        durationMs,
        targetCenter: 0.72,
        targetRadius: timingRadius,
        markerLabel: args.promptText,
      },
    },
    scoring: {
      successThreshold: 0.66,
      nearMissThreshold: 0.3,
      baselineFloor: 0.72,
      outsideWindowPenalty: 0.5,
      fallbackPenalty: 0.06,
    },
    forgiveness,
    hooks: {
      statImpactKey: "shooting",
      ratingImpactKey: "shooting",
      careerImpactKey: "confidence",
    },
  };
};

export const createReactionLaneChallenge = (args: {
  id: string;
  promptText: string;
  context: BasketballChallengeContext;
}): ActionChallengeSpec => ({
  id: args.id,
  kind: "reaction",
  context: args.context,
  title: "Steal Lane",
  subtitle: "Tap when the passing lane flashes open.",
  buttonLabel: "Jump the Lane",
  execution: {
    kind: "reaction",
    reaction: {
      durationMs: 1100,
      cueAtProgress: 0.58,
      cueRadius: 0.09,
    },
  },
  scoring: {
    successThreshold: 0.72,
    nearMissThreshold: 0.42,
    baselineFloor: 0.65,
    outsideWindowPenalty: 0.7,
    fallbackPenalty: 0.06,
  },
  forgiveness: DEFAULT_FORGIVENESS,
  hooks: {
    statImpactKey: "defense",
    ratingImpactKey: "defending",
    careerImpactKey: "momentum",
  },
});

export const adaptChallengeToMinigame = (challenge: ActionChallengeSpec): MinigameSpec | undefined => {
  if (challenge.execution.kind === "timing") {
    return {
      type: "timing_release",
      durationMs: challenge.execution.timing.durationMs,
      targetCenter: challenge.execution.timing.targetCenter,
      targetRadius: challenge.execution.timing.targetRadius,
    };
  }

  if (challenge.execution.kind === "reaction") {
    return {
      type: "steal_reaction",
      durationMs: challenge.execution.reaction.durationMs,
      targetCenter: challenge.execution.reaction.cueAtProgress,
      targetRadius: challenge.execution.reaction.cueRadius,
    };
  }

  return undefined;
};

export const buildChallengePending = (
  args: Omit<KeyMomentPending, "minigame"> & { challenge: ActionChallengeSpec },
): KeyMomentPending => ({
  ...args,
  minigame: adaptChallengeToMinigame(args.challenge),
});

export const scoreTimingChallenge = (progress: number, challenge: ActionChallengeSpec): ChallengeExecutionResult => {
  if (challenge.execution.kind !== "timing") {
    throw new Error("scoreTimingChallenge requires a timing challenge.");
  }

  const safeProgress = clamp01(progress);
  const timing = challenge.execution.timing;
  const adjustedRadius = Math.max(0.001, timing.targetRadius + challenge.forgiveness.windowRadiusBonus + challenge.forgiveness.fatigueResistance);
  const distance = Math.abs(safeProgress - timing.targetCenter);
  const normalizedDistance = distance / adjustedRadius;

  let normalizedScore =
    normalizedDistance <= 1
      ? challenge.scoring.baselineFloor + (1 - normalizedDistance) * (1 - challenge.scoring.baselineFloor)
      : challenge.scoring.baselineFloor -
        (normalizedDistance - 1) * Math.max(0.1, challenge.scoring.outsideWindowPenalty - challenge.forgiveness.nearMissSoftener - challenge.forgiveness.recoveryBonus);

  normalizedScore = clamp01(normalizedScore);

  const detail =
    normalizedScore >= 0.95
      ? "perfect"
      : normalizedScore >= challenge.scoring.successThreshold
        ? "solid"
        : normalizedScore >= challenge.scoring.nearMissThreshold
          ? "near_miss"
          : "miss";

  return {
    normalizedScore,
    source: "minigame",
    detail,
  };
};

export const scoreReactionChallenge = (progress: number, challenge: ActionChallengeSpec): ChallengeExecutionResult => {
  if (challenge.execution.kind !== "reaction") {
    throw new Error("scoreReactionChallenge requires a reaction challenge.");
  }

  const safeProgress = clamp01(progress);
  const reaction = challenge.execution.reaction;
  const distance = Math.abs(safeProgress - reaction.cueAtProgress);
  const normalizedDistance = distance / Math.max(reaction.cueRadius, 0.001);
  const normalizedScore =
    normalizedDistance <= 1
      ? clamp01(challenge.scoring.baselineFloor + (1 - normalizedDistance) * (1 - challenge.scoring.baselineFloor))
      : clamp01(challenge.scoring.baselineFloor - (normalizedDistance - 1) * challenge.scoring.outsideWindowPenalty);

  return {
    normalizedScore,
    source: "minigame",
    detail: normalizedScore >= challenge.scoring.successThreshold ? "solid" : normalizedScore >= challenge.scoring.nearMissThreshold ? "near_miss" : "miss",
  };
};
