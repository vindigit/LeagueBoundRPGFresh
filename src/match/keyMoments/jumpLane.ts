import type { KeyMomentBuildArgs, KeyMomentPending, KeyMomentResolutionInput, KeyMomentResolutionOutput } from "./types";
import { buildBaselineQuality, buildResolution, getResolvedChoiceId, getUserPlayer, resolveEffectiveQuality } from "./shared";
import { buildContextualJumpLaneOptions } from "./contextualOptions";

const PROMPT = "Read the pass and break on the lane.";
const STEAL_LANE_OPTION_ID = "steal_lane_tap";

export const buildJumpLanePending = (args: KeyMomentBuildArgs): KeyMomentPending | undefined => {
  if (args.context.offense === args.context.userTeam) {
    return undefined;
  }
  const player = getUserPlayer(args.matchContext, { context: args.context });
  return {
    id: args.id,
    type: "jump_lane",
    context: args.context,
    promptText: PROMPT,
    mode: "minigame",
    options: [
      {
        id: STEAL_LANE_OPTION_ID,
        label: "Steal Lane Jump",
        description: "Break as the passing window opens and take it clean.",
        qualityDelta: 0,
      },
      ...buildContextualJumpLaneOptions(args),
    ],
    minigame: {
      type: "steal_reaction",
      durationMs: 1100,
      targetCenter: 0.58,
      targetRadius: 0.09,
    },
    simBaselineQuality: buildBaselineQuality({
      player,
      possessionState: args.possessionState,
      pendingLike: { context: args.context },
      ratings: [
        { rating: "stealing", weight: 0.45 },
        { rating: "vision", weight: 0.2 },
        { rating: "speed", weight: 0.2 },
        { rating: "perimeterDefense", weight: 0.15 },
      ],
      riskBias: 0.01,
    }),
    seedValue: args.seedValue,
  };
};

export const resolveJumpLane = (args: {
  pending: KeyMomentPending;
  input: KeyMomentResolutionInput;
  possessionState: KeyMomentBuildArgs["possessionState"];
}): KeyMomentResolutionOutput | undefined => {
  const optionId = getResolvedChoiceId(args.pending, args.input);
  const quality = resolveEffectiveQuality(args.pending, args.input);

  if (optionId === STEAL_LANE_OPTION_ID || optionId === "shoot_gap") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "pass",
      eventType: quality >= 0.72 ? "steal" : quality >= 0.42 ? "miss" : "made_3",
      shotZone: "three",
      points: quality >= 0.42 ? 0 : 3,
      madeShot: quality < 0.42,
      turnoverLikeFailure: quality >= 0.72,
      success: quality >= 0.42,
      resultSummaryText: quality >= 0.72 ? "You shot the gap and took the ball away." : quality >= 0.42 ? "You disrupted the action and forced a miss." : "You gambled and the offense burned you from deep.",
      defenderInvolved: true,
    });
  }

  if (optionId === "stunt_recover") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "pass",
      eventType: quality >= 0.6 ? "miss" : "made_2",
      shotZone: "midrange",
      points: quality >= 0.6 ? 0 : 2,
      madeShot: quality < 0.6,
      turnoverLikeFailure: false,
      success: quality >= 0.6,
      resultSummaryText: quality >= 0.6 ? "You showed help, recovered, and forced a miss." : "The stunt opened just enough space for a bucket.",
      defenderInvolved: true,
    });
  }

  if (optionId === "stay_home") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "pass",
      eventType: quality >= 0.58 ? "miss" : "made_2",
      shotZone: "rim",
      points: quality >= 0.58 ? 0 : 2,
      madeShot: quality < 0.58,
      turnoverLikeFailure: false,
      success: quality >= 0.58,
      resultSummaryText: quality >= 0.58 ? "You stayed home and still forced a bad look." : "Playing it safe gave the offense a lane to finish.",
      defenderInvolved: true,
    });
  }

  return undefined;
};
