import { getNextMomentumStreaks, type MatchContext, type PossessionAction, type PossessionEventType, type PossessionResult, type PossessionState, type ShotZone } from "../../matchEngine";
import type { Player } from "../../types/player";
import type {
  KeyMomentBuildArgs,
  KeyMomentOption,
  KeyMomentPending,
  KeyMomentResolutionInput,
  KeyMomentResolutionOutput,
  KeyMomentType,
} from "./types";

export interface KeyMomentDefinition {
  type: KeyMomentType;
  buildPending(args: KeyMomentBuildArgs): KeyMomentPending | undefined;
  resolve(args: {
    pending: KeyMomentPending;
    input: KeyMomentResolutionInput;
    context: MatchContext;
    possessionState: PossessionState;
  }): KeyMomentResolutionOutput | undefined;
}

export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const getOptionById = (pending: KeyMomentPending, choiceId?: string): KeyMomentOption | undefined =>
  pending.options.find((option) => option.id === choiceId);

export const getTeamPlayer = (
  context: MatchContext | undefined,
  teamKey: "home" | "away",
  playerIndex: number,
): Player | undefined => {
  if (!context) {
    return undefined;
  }
  const roster = teamKey === "home" ? context.home.roster : context.away.roster;
  return roster[Math.max(0, Math.min(4, playerIndex))];
};

export const getUserPlayer = (context: MatchContext | undefined, pending: Pick<KeyMomentPending, "context">): Player | undefined =>
  getTeamPlayer(context, pending.context.userTeam, pending.context.userPlayerIndex);

export const getTouchesForUser = (state: PossessionState, pending: Pick<KeyMomentPending, "context">): number => {
  const touches = pending.context.userTeam === "home" ? state.homeTouches : state.awayTouches;
  return touches[Math.max(0, Math.min(4, pending.context.userPlayerIndex))] ?? 0;
};

export const getPressure = (pending: Pick<KeyMomentPending, "context">): number => {
  const timePressure = clamp01((120 - pending.context.timeRemaining) / 120);
  const scorePressure = clamp01((8 - Math.abs(pending.context.score.home - pending.context.score.away)) / 8);
  return clamp01(timePressure * 0.7 + scorePressure * 0.3);
};

export const getFatigue = (state: PossessionState, pending: Pick<KeyMomentPending, "context">): number =>
  clamp01(getTouchesForUser(state, pending) / 12);

export const getRating = (player: Player | undefined, rating: keyof Player["attributes"]): number =>
  player?.attributes[rating] ?? 60;

export const getWeightedSkill = (
  player: Player | undefined,
  ratings: Array<{ rating: keyof Player["attributes"]; weight: number }>,
): number => {
  const totalWeight = ratings.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) {
    return 60;
  }
  return ratings.reduce((sum, entry) => sum + getRating(player, entry.rating) * entry.weight, 0) / totalWeight;
};

export const buildBaselineQuality = (args: {
  player?: Player;
  possessionState: PossessionState;
  pendingLike: Pick<KeyMomentPending, "context">;
  ratings: Array<{ rating: keyof Player["attributes"]; weight: number }>;
  riskBias?: number;
}): number => {
  const skill = getWeightedSkill(args.player, args.ratings) / 99;
  const pressurePenalty = getPressure(args.pendingLike) * 0.12;
  const fatiguePenalty = getFatigue(args.possessionState, args.pendingLike) * 0.1;
  return clamp01(0.38 + skill * 0.42 - pressurePenalty - fatiguePenalty + (args.riskBias ?? 0));
};

export const choiceQuality = (pending: KeyMomentPending, input: KeyMomentResolutionInput): number =>
  clamp01((pending.simBaselineQuality ?? 0.55) + (getOptionById(pending, input.choiceId)?.qualityDelta ?? 0));

export const makeOption = (
  id: string,
  label: string,
  description: string,
  qualityDelta: number,
): KeyMomentOption => ({
  id,
  label,
  description,
  qualityDelta,
});

export const buildNextState = (
  possessionState: PossessionState,
  points: 0 | 2 | 3,
  madeShot: boolean,
  turnoverLikeFailure: boolean,
  nextBallHandlerIndex: number,
): PossessionState => {
  const score =
    possessionState.offenseKey === "home"
      ? { home: possessionState.score.home + points, away: possessionState.score.away }
      : { home: possessionState.score.home, away: possessionState.score.away + points };
  const nextStreaks = getNextMomentumStreaks(
    possessionState,
    possessionState.offenseKey,
    madeShot,
    turnoverLikeFailure,
  );
  return {
    ...possessionState,
    possessionIndex: possessionState.possessionIndex + 1,
    secondsRemaining: Math.max(0, possessionState.secondsRemaining - 8),
    offenseKey: possessionState.defenseKey,
    defenseKey: possessionState.offenseKey,
    ballHandlerIndex: Math.max(0, Math.min(4, nextBallHandlerIndex)),
    score,
    homeStreak: nextStreaks.homeStreak,
    awayStreak: nextStreaks.awayStreak,
  };
};

export const buildResolution = (args: {
  pending: KeyMomentPending;
  possessionState: PossessionState;
  input: KeyMomentResolutionInput;
  action: PossessionAction;
  eventType: PossessionEventType;
  shotZone: ShotZone;
  points: 0 | 2 | 3;
  madeShot: boolean;
  turnoverLikeFailure: boolean;
  success: boolean;
  resultSummaryText: string;
  defenderInvolved?: boolean;
}): KeyMomentResolutionOutput => {
  const offenseIsHome = args.possessionState.offenseKey === "home";
  const userIndex = args.pending.context.userPlayerIndex;
  const shooterIndex = offenseIsHome ? userIndex : (userIndex + 1) % 5;
  const defenderIndex = args.defenderInvolved ? userIndex : undefined;
  const nextState = buildNextState(
    args.possessionState,
    args.points,
    args.madeShot,
    args.turnoverLikeFailure,
    userIndex,
  );
  const result: PossessionResult = {
    action: args.action,
    madeShot: args.madeShot,
    points: args.points,
    assisted: false,
    turnoverLikeFailure: args.turnoverLikeFailure,
    nextState,
    eventType: args.eventType,
    shotZone: args.shotZone,
    shooterIndex,
    assisterIndex: undefined,
    rebounderIndex: undefined,
    defensivePlay: {
      steal: args.eventType === "steal",
      block: args.eventType === "block",
      defenderIndex,
    },
    offensiveRebound: false,
    putbackAttempted: false,
    trace: ["INIT_POSSESSION", "END_POSSESSION"],
  };

  return {
    quality: choiceQuality(args.pending, args.input),
    success: args.success,
    resultSummaryText: args.resultSummaryText,
    result,
    isUserAction: true,
  };
};
