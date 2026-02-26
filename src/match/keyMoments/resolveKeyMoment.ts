import type { PossessionEventType, PossessionResult } from "../../matchEngine";
import { KEY_MOMENT_BASELINE_QUALITY } from "./catalog";
import type { KeyMomentResolveArgs, KeyMomentResolutionOutput, KeyMomentPending } from "./types";

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const pickQuality = (args: KeyMomentResolveArgs): number => {
  const { pending, input } = args;
  if (pending.mode === "minigame" && typeof input.minigameQuality === "number") {
    return clamp01(input.minigameQuality);
  }
  if (pending.mode === "choice" && pending.options && input.choiceId) {
    const option = pending.options.find((entry) => entry.id === input.choiceId);
    if (option) {
      return clamp01(KEY_MOMENT_BASELINE_QUALITY + option.qualityDelta);
    }
  }
  return clamp01(pending.simBaselineQuality ?? KEY_MOMENT_BASELINE_QUALITY);
};

const pointsFromEvent = (eventType: PossessionEventType): 0 | 2 | 3 => {
  if (eventType === "made_3") {
    return 3;
  }
  if (eventType === "made_2" || eventType === "putback_make") {
    return 2;
  }
  return 0;
};

const summarize = (scenario: KeyMomentPending["scenario"], success: boolean): string => {
  if (scenario === "offense_shot") {
    return success ? "You nailed the timing window." : "You missed the shot window.";
  }
  if (scenario === "offense_choice") {
    return success ? "You made the right read." : "That decision backfired.";
  }
  return success ? "You forced a defensive stop." : "The defense broke down.";
};

const mapEventByScenario = (
  scenario: KeyMomentPending["scenario"],
  quality: number,
): {
  eventType: PossessionEventType;
  shotZone: "three" | "midrange" | "rim";
  turnoverLikeFailure: boolean;
  madeShot: boolean;
  success: boolean;
} => {
  if (scenario === "offense_shot") {
    if (quality >= 0.8) {
      return { eventType: "made_3", shotZone: "three", turnoverLikeFailure: false, madeShot: true, success: true };
    }
    if (quality >= 0.6) {
      return { eventType: "made_2", shotZone: "rim", turnoverLikeFailure: false, madeShot: true, success: true };
    }
    if (quality >= 0.3) {
      return { eventType: "miss", shotZone: "midrange", turnoverLikeFailure: false, madeShot: false, success: false };
    }
    return { eventType: "block", shotZone: "rim", turnoverLikeFailure: false, madeShot: false, success: false };
  }

  if (scenario === "offense_choice") {
    if (quality >= 0.8) {
      return { eventType: "made_3", shotZone: "three", turnoverLikeFailure: false, madeShot: true, success: true };
    }
    if (quality >= 0.6) {
      return { eventType: "made_2", shotZone: "rim", turnoverLikeFailure: false, madeShot: true, success: true };
    }
    if (quality >= 0.3) {
      return { eventType: "miss", shotZone: "midrange", turnoverLikeFailure: false, madeShot: false, success: false };
    }
    return { eventType: "turnover", shotZone: "midrange", turnoverLikeFailure: true, madeShot: false, success: false };
  }

  if (quality >= 0.75) {
    return { eventType: "steal", shotZone: "midrange", turnoverLikeFailure: true, madeShot: false, success: true };
  }
  if (quality >= 0.5) {
    return { eventType: "miss", shotZone: "midrange", turnoverLikeFailure: false, madeShot: false, success: true };
  }
  if (quality >= 0.3) {
    return { eventType: "made_2", shotZone: "rim", turnoverLikeFailure: false, madeShot: true, success: false };
  }
  return { eventType: "made_3", shotZone: "three", turnoverLikeFailure: false, madeShot: true, success: false };
};

export const resolveKeyMoment = (args: KeyMomentResolveArgs): KeyMomentResolutionOutput => {
  const quality = pickQuality(args);
  const { possessionState, pending } = args;
  const mapped = mapEventByScenario(pending.scenario, quality);
  const points = pointsFromEvent(mapped.eventType);

  const userIndex = pending.context.userPlayerIndex;
  const offenseIsHome = possessionState.offenseKey === "home";
  const offenseShooterIndex = offenseIsHome ? userIndex : (userIndex + 1) % 5;
  const defensiveUserIndex = userIndex;

  const nextScore =
    possessionState.offenseKey === "home"
      ? { home: possessionState.score.home + points, away: possessionState.score.away }
      : { home: possessionState.score.home, away: possessionState.score.away + points };

  const nextState = {
    possessionIndex: possessionState.possessionIndex + 1,
    secondsRemaining: Math.max(0, possessionState.secondsRemaining - 8),
    offenseKey: possessionState.defenseKey,
    defenseKey: possessionState.offenseKey,
    ballHandlerIndex: Math.max(0, Math.min(4, userIndex)),
    score: nextScore,
  } as const;

  const result: PossessionResult = {
    action: pending.mode === "choice" ? "pass" : "shoot",
    madeShot: mapped.madeShot,
    points,
    assisted: false,
    turnoverLikeFailure: mapped.turnoverLikeFailure,
    nextState,
    eventType: mapped.eventType,
    shotZone: mapped.shotZone,
    shooterIndex: offenseShooterIndex,
    assisterIndex: undefined,
    rebounderIndex: mapped.eventType === "def_reb" ? defensiveUserIndex : undefined,
    defensivePlay: {
      steal: mapped.eventType === "steal",
      block: mapped.eventType === "block",
      defenderIndex:
        mapped.eventType === "steal" || mapped.eventType === "block" || pending.scenario === "defense_choice"
          ? defensiveUserIndex
          : undefined,
    },
    offensiveRebound: false,
    putbackAttempted: false,
    trace: ["INIT_POSSESSION", "END_POSSESSION"],
  };

  return {
    quality,
    success: mapped.success,
    resultSummaryText: summarize(pending.scenario, mapped.success),
    result,
    isUserAction: true,
  };
};
