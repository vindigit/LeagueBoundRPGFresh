import { buildChallengePending, createTimingShotChallenge } from "./actionChallenges";
import type { KeyMomentBuildArgs, KeyMomentPending, KeyMomentResolutionInput, KeyMomentResolutionOutput } from "./types";
import { buildBaselineQuality, buildResolution, getResolvedChoiceId, getUserPlayer, makeOption, resolveEffectiveQuality } from "./shared";

const PROMPT = "Create separation and rise up.";
const CREATE_SHOT_OPTION_ID = "timing_release_jump_shot";

export const buildCreateShotPending = (args: KeyMomentBuildArgs): KeyMomentPending | undefined => {
  if (args.context.offense !== args.context.userTeam) {
    return undefined;
  }
  const player = getUserPlayer(args.matchContext, { context: args.context });
  const challenge = createTimingShotChallenge({
    id: `${args.id}-challenge`,
    promptText: PROMPT,
    context: "pullup",
    player,
    keyMomentContext: args.context,
    variant: "pullup",
  });
  return buildChallengePending({
    id: args.id,
    type: "create_shot",
    context: args.context,
    promptText: PROMPT,
    mode: "minigame",
    options: [
      makeOption(
        CREATE_SHOT_OPTION_ID,
        "Timing Release Jumper",
        "Create space and time the release in rhythm.",
        0,
      ),
    ],
    challenge,
    simBaselineQuality: buildBaselineQuality({
      player,
      possessionState: args.possessionState,
      pendingLike: { context: args.context },
      ratings: [
        { rating: "threePoint", weight: 0.4 },
        { rating: "midrange", weight: 0.25 },
        { rating: "handle", weight: 0.2 },
        { rating: "speed", weight: 0.15 },
      ],
      riskBias: 0.03,
    }),
    seedValue: args.seedValue,
  });
};

export const resolveCreateShot = (args: {
  pending: KeyMomentPending;
  input: KeyMomentResolutionInput;
  possessionState: KeyMomentBuildArgs["possessionState"];
}): KeyMomentResolutionOutput | undefined => {
  const optionId = getResolvedChoiceId(args.pending, args.input);
  const quality = resolveEffectiveQuality(args.pending, args.input);

  if (optionId === CREATE_SHOT_OPTION_ID) {
    if (quality >= 0.66) {
      return buildResolution({
        pending: args.pending,
        possessionState: args.possessionState,
        input: args.input,
        action: "shoot",
        eventType: "made_3",
        shotZone: "three",
        points: 3,
        madeShot: true,
        turnoverLikeFailure: false,
        success: true,
        resultSummaryText: "You created space and buried the three.",
      });
    }
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "shoot",
      eventType: quality >= 0.3 ? "miss" : "block",
      shotZone: "three",
      points: 0,
      madeShot: false,
      turnoverLikeFailure: false,
      success: false,
      resultSummaryText: quality >= 0.3 ? "You got the look, but the shot stayed out." : "The defense swallowed the pull-up.",
      defenderInvolved: quality < 0.3,
    });
  }

  if (optionId === "turn_the_corner") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "dribble",
      eventType: quality >= 0.58 ? "made_2" : quality >= 0.28 ? "miss" : "block",
      shotZone: "rim",
      points: quality >= 0.58 ? 2 : 0,
      madeShot: quality >= 0.58,
      turnoverLikeFailure: false,
      success: quality >= 0.58,
      resultSummaryText: quality >= 0.58 ? "You beat the defender and finished at the rim." : "You got into the paint, but the defense recovered.",
      defenderInvolved: quality < 0.28,
    });
  }

  if (optionId === "protect_ball") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "shoot",
      eventType: quality >= 0.54 ? "made_2" : "miss",
      shotZone: "midrange",
      points: quality >= 0.54 ? 2 : 0,
      madeShot: quality >= 0.54,
      turnoverLikeFailure: false,
      success: quality >= 0.54,
      resultSummaryText: quality >= 0.54 ? "You stayed under control and knocked down the jumper." : "You protected the possession, but the shot rimmed out.",
    });
  }

  return undefined;
};
