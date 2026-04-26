import type { FreeThrowSequence } from "../../matchEngine";
import type { KeyMomentBuildArgs, KeyMomentPending, KeyMomentResolutionInput, KeyMomentResolutionOutput } from "./types";
import { buildBaselineQuality, buildResolution, getResolvedChoiceId, getUserPlayer, resolveEffectiveQuality } from "./shared";
import { buildContextualFoulPressureOptions } from "./contextualOptions";

const OFFENSE_PROMPT = "Key Moment: Put pressure on the rim and force the whistle.";
const DEFENSE_PROMPT = "Key Moment: Contest the drive without bailing the offense out.";

const buildFreeThrowSequence = (
  mode: "one_and_one" | "two_shots",
  quality: number,
  shooterIndex: number,
  foulOnTeam: "home" | "away",
  foulOnPlayerIndex?: number,
): FreeThrowSequence => {
  if (mode === "one_and_one") {
    const firstMade = quality >= 0.45;
    const secondMade = quality >= 0.78;
    const attempted = firstMade ? 2 : 1;
    const made = (firstMade ? 1 : 0) + (firstMade && secondMade ? 1 : 0);
    return {
      mode,
      attempted,
      made,
      shooterIndex,
      foulOnTeam,
      foulOnPlayerIndex,
    };
  }

  const firstMade = quality >= 0.33;
  const secondMade = quality >= 0.7;
  return {
    mode,
    attempted: 2,
    made: (firstMade ? 1 : 0) + (secondMade ? 1 : 0),
    shooterIndex,
    foulOnTeam,
    foulOnPlayerIndex,
  };
};

const buildFreeThrowSummary = (
  sequence: FreeThrowSequence,
  offenseIsUser: boolean,
): string => {
  const prefix = offenseIsUser ? "You forced contact" : "You sent the shooter to the line";
  return `${prefix} and ${sequence.made === sequence.attempted ? "converted" : sequence.made > 0 ? "split" : "missed"} ${sequence.made} of ${sequence.attempted}.`;
};

export const buildFoulPressurePending = (args: KeyMomentBuildArgs): KeyMomentPending | undefined => {
  const offenseIsUser = args.context.offense === args.context.userTeam;
  const player = getUserPlayer(args.matchContext, { context: args.context });
  const defenderTeamFoulsInSegment = args.defenderTeamFoulsInSegment ?? 0;
  const nextDefenderTeamFouls = defenderTeamFoulsInSegment + 1;
  const foulType = offenseIsUser ? "shooting" : "bonus";
  const freeThrowMode =
    offenseIsUser || nextDefenderTeamFouls >= 10
      ? "two_shots"
      : nextDefenderTeamFouls >= 7
        ? "one_and_one"
        : "two_shots";

  return {
    id: args.id,
    type: "foul_pressure",
    context: args.context,
    promptText: offenseIsUser ? OFFENSE_PROMPT : DEFENSE_PROMPT,
    mode: "choice",
    options: buildContextualFoulPressureOptions(args),
    foulType,
    freeThrowMode,
    defenderTeamFoulsInSegment,
    simBaselineQuality: buildBaselineQuality({
      player,
      possessionState: args.possessionState,
      pendingLike: { context: args.context },
      ratings: offenseIsUser
        ? [
            { rating: "shortRange", weight: 0.35 },
            { rating: "dunking", weight: 0.2 },
            { rating: "handle", weight: 0.25 },
            { rating: "strength", weight: 0.2 },
          ]
        : [
            { rating: "interiorDefense", weight: 0.35 },
            { rating: "perimeterDefense", weight: 0.25 },
            { rating: "strength", weight: 0.2 },
            { rating: "speed", weight: 0.2 },
          ],
      riskBias: offenseIsUser ? 0.02 : -0.01,
    }),
    seedValue: args.seedValue,
  };
};

export const resolveFoulPressure = (args: {
  pending: KeyMomentPending;
  input: KeyMomentResolutionInput;
  possessionState: KeyMomentBuildArgs["possessionState"];
}): KeyMomentResolutionOutput | undefined => {
  const optionId = getResolvedChoiceId(args.pending, args.input);
  const quality = resolveEffectiveQuality(args.pending, args.input);
  const offenseIsUser = args.pending.context.offense === args.pending.context.userTeam;
  const userIndex = args.pending.context.userPlayerIndex;
  const shooterIndex = offenseIsUser ? userIndex : (userIndex + 1) % 5;
  const foulOnTeam = args.possessionState.defenseKey;
  const foulOnPlayerIndex = offenseIsUser ? (userIndex + 1) % 5 : userIndex;

  if (!offenseIsUser && optionId === "wall_up" && quality >= 0.72) {
    return buildResolution({
      pending: args.pending,
      possessionState: args.possessionState,
      input: args.input,
      action: "shoot",
      eventType: "miss",
      shotZone: "rim",
      points: 0,
      madeShot: false,
      turnoverLikeFailure: false,
      success: true,
      resultSummaryText: "You stayed vertical and forced a clean miss without fouling.",
      shooterIndexOverride: shooterIndex,
      defenderIndexOverride: userIndex,
    });
  }

  const sequence = buildFreeThrowSequence(
    args.pending.freeThrowMode ?? "two_shots",
    quality,
    shooterIndex,
    foulOnTeam,
    foulOnPlayerIndex,
  );

  return buildResolution({
    pending: args.pending,
    possessionState: args.possessionState,
    input: args.input,
    action: offenseIsUser ? "dribble" : "shoot",
    eventType: "free_throws",
    shotZone: "rim",
    points: sequence.made as 0 | 1 | 2,
    madeShot: sequence.made > 0,
    turnoverLikeFailure: false,
    success: offenseIsUser ? sequence.made >= 1 : sequence.made <= 1,
    resultSummaryText: buildFreeThrowSummary(sequence, offenseIsUser),
    shooterIndexOverride: shooterIndex,
    defenderIndexOverride: foulOnPlayerIndex,
    freeThrows: sequence,
  });
};
