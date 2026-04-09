import type { KeyMomentBuildArgs, KeyMomentPending, KeyMomentResolutionOutput } from "./types";
import { buildBaselineQuality, buildResolution, choiceQuality, getUserPlayer, makeOption } from "./shared";

const PROMPT = "Key Moment: Make the read before the help defense closes.";

export const buildMakeTheReadPending = (args: KeyMomentBuildArgs): KeyMomentPending | undefined => {
  if (args.context.offense !== args.context.userTeam) {
    return undefined;
  }
  const player = getUserPlayer(args.matchContext, { context: args.context });
  return {
    id: args.id,
    type: "make_the_read",
    context: args.context,
    promptText: PROMPT,
    mode: "choice",
    options: [
      makeOption("kick_out", "Kick Out", "Trust the weak-side pass for the cleanest shot.", 0.1),
      makeOption("attack_gap", "Attack Gap", "Turn the lane opening into a quick finish.", 0.02),
      makeOption("reset_space", "Reset Space", "Pull it back and force a tougher late-clock shot.", -0.08),
    ],
    simBaselineQuality: buildBaselineQuality({
      player,
      possessionState: args.possessionState,
      pendingLike: { context: args.context },
      ratings: [
        { rating: "vision", weight: 0.4 },
        { rating: "passing", weight: 0.35 },
        { rating: "handle", weight: 0.15 },
        { rating: "threePoint", weight: 0.1 },
      ],
      riskBias: 0.01,
    }),
    seedValue: args.seedValue,
  };
};

export const resolveMakeTheRead = (args: {
  pending: KeyMomentPending;
  input: { pendingId: string; choiceId?: string };
  possessionState: KeyMomentBuildArgs["possessionState"];
}): KeyMomentResolutionOutput | undefined => {
  const optionId = args.input.choiceId;
  const quality = choiceQuality(args.pending, args.input);

  if (optionId === "kick_out") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "pass",
      eventType: quality >= 0.64 ? "made_3" : "miss",
      shotZone: "three",
      points: quality >= 0.64 ? 3 : 0,
      madeShot: quality >= 0.64,
      turnoverLikeFailure: false,
      success: quality >= 0.64,
      resultSummaryText: quality >= 0.64 ? "You found the shooter for a clean triple." : "The pass was right, but the shot did not fall.",
    });
  }

  if (optionId === "attack_gap") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "dribble",
      eventType: quality >= 0.56 ? "made_2" : "turnover",
      shotZone: "rim",
      points: quality >= 0.56 ? 2 : 0,
      madeShot: quality >= 0.56,
      turnoverLikeFailure: quality < 0.56,
      success: quality >= 0.56,
      resultSummaryText: quality >= 0.56 ? "You made the read and finished through the gap." : "You forced the lane and coughed the ball up.",
    });
  }

  if (optionId === "reset_space") {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "pass",
      eventType: quality >= 0.52 ? "made_2" : "miss",
      shotZone: "midrange",
      points: quality >= 0.52 ? 2 : 0,
      madeShot: quality >= 0.52,
      turnoverLikeFailure: false,
      success: quality >= 0.52,
      resultSummaryText: quality >= 0.52 ? "You reset the action and got to a solid pull-up." : "The reset kept it safe, but the late-clock look missed.",
    });
  }

  return undefined;
};
