import { getKeyMomentDefinition } from "./catalog";
import type { KeyMomentResolveArgs, KeyMomentResolutionOutput } from "./types";

export const tryResolveKeyMoment = (args: KeyMomentResolveArgs): KeyMomentResolutionOutput | undefined => {
  const definition = getKeyMomentDefinition(args.pending.type);
  if (!definition) {
    return undefined;
  }
  return definition.resolve(args);
};

export const resolveKeyMoment = (args: KeyMomentResolveArgs): KeyMomentResolutionOutput => {
  const resolved = tryResolveKeyMoment(args);
  if (resolved) {
    return resolved;
  }

  return {
    quality: args.pending.simBaselineQuality,
    success: false,
    resultSummaryText: "The moment slipped away before you could change the possession.",
    result: {
      action: "pass",
      madeShot: false,
      points: 0,
      assisted: false,
      turnoverLikeFailure: false,
      nextState: {
        ...args.possessionState,
        possessionIndex: args.possessionState.possessionIndex + 1,
        secondsRemaining: Math.max(0, args.possessionState.secondsRemaining - 8),
        offenseKey: args.possessionState.defenseKey,
        defenseKey: args.possessionState.offenseKey,
      },
      eventType: "miss",
      shotZone: "midrange",
      shooterIndex: args.pending.context.userPlayerIndex,
      assisterIndex: undefined,
      rebounderIndex: undefined,
      defensivePlay: {
        steal: false,
        block: false,
      },
      offensiveRebound: false,
      putbackAttempted: false,
      trace: ["INIT_POSSESSION", "END_POSSESSION"],
    },
    isUserAction: true,
  };
};
