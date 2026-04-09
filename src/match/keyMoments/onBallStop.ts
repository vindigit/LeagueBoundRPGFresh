import type { KeyMomentBuildArgs, KeyMomentPending, KeyMomentResolutionInput, KeyMomentResolutionOutput } from "./types";
import { buildBaselineQuality, buildResolution, getResolvedChoiceId, getUserPlayer, makeOption, resolveEffectiveQuality } from "./shared";

const PROMPT = "Key Moment: Get the on-ball stop and force a bad shot.";

export const buildOnBallStopPending = (args: KeyMomentBuildArgs): KeyMomentPending | undefined => {
  if (args.context.offense === args.context.userTeam) {
    return undefined;
  }
  const player = getUserPlayer(args.matchContext, { context: args.context });
  return {
    id: args.id,
    type: "on_ball_stop",
    context: args.context,
    promptText: PROMPT,
    mode: "choice",
    options: [
      makeOption("shade_middle", "Shade Middle", "Angle the ball handler into traffic.", 0.08),
      makeOption("crowd_handle", "Crowd Handle", "Sit on the dribble and contest hard.", 0.03),
      makeOption("wall_up", "Wall Up", "Stay disciplined and absorb the drive.", -0.05),
    ],
    simBaselineQuality: buildBaselineQuality({
      player,
      possessionState: args.possessionState,
      pendingLike: { context: args.context },
      ratings: [
        { rating: "perimeterDefense", weight: 0.45 },
        { rating: "speed", weight: 0.2 },
        { rating: "strength", weight: 0.2 },
        { rating: "interiorDefense", weight: 0.15 },
      ],
      riskBias: 0.02,
    }),
    seedValue: args.seedValue,
  };
};

export const resolveOnBallStop = (args: {
  pending: KeyMomentPending;
  input: KeyMomentResolutionInput;
  possessionState: KeyMomentBuildArgs["possessionState"];
}): KeyMomentResolutionOutput | undefined => {
  const optionId = getResolvedChoiceId(args.pending, args.input);
  const quality = resolveEffectiveQuality(args.pending, args.input);

  if (optionId === "shade_middle") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "dribble",
      eventType: quality >= 0.68 ? "miss" : "made_2",
      shotZone: "midrange",
      points: quality >= 0.68 ? 0 : 2,
      madeShot: quality < 0.68,
      turnoverLikeFailure: false,
      success: quality >= 0.68,
      resultSummaryText: quality >= 0.68 ? "You cut off the lane and forced a bad miss." : "The ball handler slipped through for two.",
      defenderInvolved: true,
    });
  }

  if (optionId === "crowd_handle") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "shoot",
      eventType: quality >= 0.72 ? "block" : quality >= 0.45 ? "miss" : "made_2",
      shotZone: "rim",
      points: quality >= 0.45 ? 0 : 2,
      madeShot: quality < 0.45,
      turnoverLikeFailure: false,
      success: quality >= 0.45,
      resultSummaryText: quality >= 0.72 ? "You crowded the handle and erased the shot." : quality >= 0.45 ? "You stayed attached and forced a miss." : "The pressure was late and the offense converted.",
      defenderInvolved: true,
    });
  }

  if (optionId === "wall_up") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "shoot",
      eventType: quality >= 0.62 ? "miss" : "made_2",
      shotZone: "rim",
      points: quality >= 0.62 ? 0 : 2,
      madeShot: quality < 0.62,
      turnoverLikeFailure: false,
      success: quality >= 0.62,
      resultSummaryText: quality >= 0.62 ? "You held your ground and forced a tough miss." : "The offense finished through contact.",
      defenderInvolved: true,
    });
  }

  return undefined;
};
