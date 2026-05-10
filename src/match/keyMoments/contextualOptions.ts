import type { Player } from "../../types/player";
import type { KeyMomentBuildArgs, KeyMomentOption } from "./types";
import { getFatigue, getUserPlayer, getWeightedSkill, makeOption } from "./shared";

type ScoreBand = "trailing" | "close" | "leading";
type ClockBand = "early" | "mid" | "late" | "critical";
type Band = "low" | "medium" | "high";

interface ChoiceContext {
  player?: Player;
  offenseIsUser: boolean;
  scoreBand: ScoreBand;
  clockBand: ClockBand;
  workRateBand: Band;
  focusBand: Band;
  fatigueBand: Band;
  userMargin: number;
  scoreText: string;
  clockText: string;
  focusText: string;
  workRateText: string;
  buildText: string;
  playmakingSkill: number;
  downhillSkill: number;
  shootingSkill: number;
  interiorDefenseSkill: number;
  perimeterDefenseSkill: number;
  gambleSkill: number;
}

const toBand = (value: number, lowCutoff: number, highCutoff: number): Band => {
  if (value >= highCutoff) {
    return "high";
  }
  if (value <= lowCutoff) {
    return "low";
  }
  return "medium";
};

const clampDelta = (value: number): number => Math.max(-0.12, Math.min(0.14, Math.round(value * 100) / 100));

const getScoreBand = (margin: number): ScoreBand => {
  if (margin <= -4) {
    return "trailing";
  }
  if (margin >= 4) {
    return "leading";
  }
  return "close";
};

const getClockBand = (timeRemaining: number): ClockBand => {
  if (timeRemaining <= 90) {
    return "critical";
  }
  if (timeRemaining <= 240) {
    return "late";
  }
  if (timeRemaining <= 480) {
    return "mid";
  }
  return "early";
};

const getUserMargin = (args: KeyMomentBuildArgs): number =>
  args.context.userTeam === "home"
    ? args.context.score.home - args.context.score.away
    : args.context.score.away - args.context.score.home;

const describeScore = (margin: number): string => {
  if (margin <= -6) {
    return `down ${Math.abs(margin)}`;
  }
  if (margin < 0) {
    return `down ${Math.abs(margin)} in a one-possession game`;
  }
  if (margin >= 6) {
    return `up ${margin}`;
  }
  if (margin > 0) {
    return `up ${margin} in a one-possession game`;
  }
  return "in a tied game";
};

const describeClock = (timeRemaining: number, clockBand: ClockBand): string => {
  const minutes = Math.floor(Math.max(0, timeRemaining) / 60);
  const seconds = Math.max(0, timeRemaining) % 60;
  const raw = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  if (clockBand === "critical") {
    return `${raw} left in crunch time`;
  }
  if (clockBand === "late") {
    return `${raw} left with the clock shrinking`;
  }
  if (clockBand === "mid") {
    return `${raw} left in the quarter`;
  }
  return `${raw} left`;
};

const describeFocus = (focusBand: Band, offenseIsUser: boolean): string => {
  if (focusBand === "low") {
    return offenseIsUser ? "with your eyes on protecting the ball" : "staying home first";
  }
  if (focusBand === "high") {
    return offenseIsUser ? "looking to press the attack" : "looking to blow up the action";
  }
  return offenseIsUser ? "reading the floor" : "sitting in balanced coverage";
};

const describeWorkRate = (workRateBand: Band, fatigueBand: Band): string => {
  if (workRateBand === "high" && fatigueBand !== "low") {
    return "with your motor still revving";
  }
  if (fatigueBand === "high") {
    return "on heavy legs";
  }
  if (workRateBand === "low") {
    return "while pacing yourself";
  }
  return "with steady legs";
};

const describeBuild = (player: Player | undefined, ctx: Omit<ChoiceContext, "buildText">): string => {
  const archetype = player?.archetype;
  if (archetype === "Playmaker" || ctx.playmakingSkill >= Math.max(ctx.downhillSkill, ctx.shootingSkill) + 3) {
    return "as a playmaking guard";
  }
  if (archetype === "Sharpshooter" || ctx.shootingSkill >= Math.max(ctx.playmakingSkill, ctx.downhillSkill) + 3) {
    return "as a shooting threat";
  }
  if (archetype === "Slasher" || ctx.downhillSkill >= Math.max(ctx.playmakingSkill, ctx.shootingSkill) + 3) {
    return "as a downhill creator";
  }
  if (archetype === "Paint Beast" || archetype === "Stretch Big") {
    return "as a frontcourt option";
  }
  if (archetype === "Lockdown Defender") {
    return "as a stopper";
  }
  return "for your build";
};

const getChoiceContext = (args: KeyMomentBuildArgs): ChoiceContext => {
  const player = getUserPlayer(args.matchContext, { context: args.context });
  const userMargin = getUserMargin(args);
  const scoreBand = getScoreBand(userMargin);
  const clockBand = getClockBand(args.context.timeRemaining);
  const workRateBand = args.context.workRate === "high" ? "high" : args.context.workRate === "low" ? "low" : "medium";
  const offenseIsUser = args.context.offense === args.context.userTeam;
  const focusBand =
    args.context.focus === "balanced"
      ? "medium"
      : offenseIsUser
        ? args.context.focus === "offense"
          ? "high"
          : "low"
        : args.context.focus === "defense"
          ? "high"
          : "low";
  const fatigueBand = toBand((args.context.fatigue + getFatigue(args.possessionState, { context: args.context })) * 50, 25, 60);
  const playmakingSkill = getWeightedSkill(player, [
    { rating: "vision", weight: 0.45 },
    { rating: "passing", weight: 0.35 },
    { rating: "handle", weight: 0.2 },
  ]);
  const downhillSkill = getWeightedSkill(player, [
    { rating: "handle", weight: 0.25 },
    { rating: "speed", weight: 0.25 },
    { rating: "shortRange", weight: 0.25 },
    { rating: "dunking", weight: 0.25 },
  ]);
  const shootingSkill = getWeightedSkill(player, [
    { rating: "threePoint", weight: 0.55 },
    { rating: "midrange", weight: 0.3 },
    { rating: "handle", weight: 0.15 },
  ]);
  const interiorDefenseSkill = getWeightedSkill(player, [
    { rating: "interiorDefense", weight: 0.45 },
    { rating: "strength", weight: 0.25 },
    { rating: "blocking", weight: 0.2 },
    { rating: "speed", weight: 0.1 },
  ]);
  const perimeterDefenseSkill = getWeightedSkill(player, [
    { rating: "perimeterDefense", weight: 0.45 },
    { rating: "speed", weight: 0.25 },
    { rating: "strength", weight: 0.1 },
    { rating: "stealing", weight: 0.2 },
  ]);
  const gambleSkill = getWeightedSkill(player, [
    { rating: "stealing", weight: 0.45 },
    { rating: "vision", weight: 0.25 },
    { rating: "speed", weight: 0.15 },
    { rating: "perimeterDefense", weight: 0.15 },
  ]);
  const base = {
    player,
    offenseIsUser,
    scoreBand,
    clockBand,
    workRateBand,
    focusBand,
    fatigueBand,
    userMargin,
    scoreText: describeScore(userMargin),
    clockText: describeClock(args.context.timeRemaining, clockBand),
    focusText: describeFocus(focusBand, offenseIsUser),
    workRateText: describeWorkRate(workRateBand, fatigueBand),
    playmakingSkill,
    downhillSkill,
    shootingSkill,
    interiorDefenseSkill,
    perimeterDefenseSkill,
    gambleSkill,
  };

  return {
    ...base,
    buildText: describeBuild(player, base),
  };
};

const mentionsLatePressure = (ctx: ChoiceContext): boolean =>
  ctx.clockBand === "late" || ctx.clockBand === "critical" || ctx.focusBand === "low";

export const buildContextualMakeTheReadOptions = (args: KeyMomentBuildArgs): KeyMomentOption[] => {
  const ctx = getChoiceContext(args);
  const kickOutDelta =
    (ctx.playmakingSkill >= 74 ? 0.05 : 0) +
    (ctx.shootingSkill >= 76 ? 0.02 : 0) +
    (ctx.scoreBand === "trailing" ? 0.02 : 0) -
    (ctx.focusBand === "low" ? 0.02 : 0);
  const attackGapDelta =
    (ctx.downhillSkill >= 74 ? 0.05 : 0) +
    (ctx.workRateBand === "high" ? 0.02 : 0) +
    (ctx.clockBand === "critical" ? 0.02 : 0) -
    (ctx.focusBand === "low" ? 0.03 : 0);
  const resetSpaceDelta =
    (ctx.scoreBand === "leading" ? 0.06 : 0) +
    (mentionsLatePressure(ctx) ? 0.03 : -0.03) +
    (ctx.focusBand === "low" ? 0.03 : 0) -
    (ctx.scoreBand === "trailing" ? 0.03 : 0);

  return [
    makeOption(
      "kick_out",
      ctx.playmakingSkill >= ctx.downhillSkill ? "Hit Weak-Side" : "Spray It Out",
      `${ctx.scoreText}, ${ctx.clockText}. Move the help and fire the weak-side kick-out, ${ctx.focusText}.`,
      clampDelta(kickOutDelta),
    ),
    makeOption(
      "attack_gap",
      ctx.downhillSkill >= ctx.playmakingSkill ? "Collapse Gap" : "Knife Through Help",
      `${ctx.clockText}. Turn the corner and attack the seam ${ctx.workRateText}.`,
      clampDelta(attackGapDelta),
    ),
    makeOption(
      "reset_space",
      ctx.scoreBand === "leading" ? "Settle Possession" : "Bail Out Reset",
      `${ctx.scoreText}, ${ctx.clockText}. Reset the floor and make them guard one more action.`,
      clampDelta(resetSpaceDelta),
    ),
  ];
};

export const buildContextualOnBallStopOptions = (args: KeyMomentBuildArgs): KeyMomentOption[] => {
  const ctx = getChoiceContext(args);
  const shadeMiddleDelta =
    (ctx.perimeterDefenseSkill >= 74 ? 0.04 : 0) +
    (ctx.clockBand === "late" || ctx.clockBand === "critical" ? 0.03 : 0) +
    (ctx.scoreBand === "leading" ? 0.02 : 0);
  const crowdHandleDelta =
    (ctx.perimeterDefenseSkill >= 72 ? 0.03 : 0) +
    (ctx.focusBand === "high" ? 0.02 : 0) +
    (ctx.scoreBand === "trailing" ? 0.03 : 0) -
    (ctx.fatigueBand === "high" ? 0.03 : 0);
  const wallUpDelta =
    (ctx.interiorDefenseSkill >= 72 ? 0.05 : 0) +
    (ctx.scoreBand === "leading" ? 0.04 : 0) +
    (ctx.focusBand === "low" ? 0.03 : 0) -
    (ctx.scoreBand === "trailing" ? 0.02 : 0);

  return [
    makeOption(
      "shade_middle",
      ctx.perimeterDefenseSkill >= ctx.interiorDefenseSkill ? "Cut Off Middle" : "Angle Into Traffic",
      `${ctx.scoreText}, ${ctx.clockText}. Sit on the middle and send the drive into help.`,
      clampDelta(shadeMiddleDelta),
    ),
    makeOption(
      "crowd_handle",
      ctx.scoreBand === "trailing" ? "Heat the Handle" : "Crowd the Dribble",
      `${ctx.clockText}. Crowd the dribble and take away rhythm, ${ctx.focusText}.`,
      clampDelta(crowdHandleDelta),
    ),
    makeOption(
      "wall_up",
      ctx.scoreBand === "leading" ? "Stay Vertical" : "Wall Up Rim",
      `${ctx.scoreText}, ${ctx.clockText}. Meet the drive chest-up and finish the stop ${ctx.workRateText}.`,
      clampDelta(wallUpDelta),
    ),
  ];
};

export const buildContextualJumpLaneOptions = (args: KeyMomentBuildArgs): KeyMomentOption[] => {
  const ctx = getChoiceContext(args);
  const shootGapDelta =
    (ctx.gambleSkill >= 74 ? 0.05 : 0) +
    (ctx.scoreBand === "trailing" ? 0.04 : 0) +
    (ctx.clockBand === "critical" ? 0.03 : 0) -
    (ctx.focusBand === "low" ? 0.04 : 0);
  const stuntRecoverDelta =
    (ctx.perimeterDefenseSkill >= 70 ? 0.03 : 0) +
    (ctx.focusBand !== "low" ? 0.02 : 0) +
    (ctx.scoreBand === "close" ? 0.02 : 0);
  const stayHomeDelta =
    (ctx.scoreBand === "leading" ? 0.05 : 0) +
    (ctx.focusBand === "low" ? 0.04 : 0) +
    (ctx.clockBand === "early" ? 0.02 : 0) -
    (ctx.scoreBand === "trailing" ? 0.04 : 0);

  return [
    makeOption(
      "shoot_gap",
      ctx.scoreBand === "trailing" ? "Jump the Lane" : "Shoot Passing Gap",
      `${ctx.scoreText}, ${ctx.clockText}. Jump it only if you see it early, ${ctx.focusText}.`,
      clampDelta(shootGapDelta),
    ),
    makeOption(
      "stunt_recover",
      "Show Help Back",
      `${ctx.clockText}. Stunt at the ball and recover before the skip opens up.`,
      clampDelta(stuntRecoverDelta),
    ),
    makeOption(
      "stay_home",
      ctx.scoreBand === "leading" ? "Stay Home" : "Stay Home Contain",
      `${ctx.scoreText}, ${ctx.clockText}. Stay attached and make them score over set coverage.`,
      clampDelta(stayHomeDelta),
    ),
  ];
};

const describeFreeThrowMode = (mode: "one_and_one" | "two_shots" | undefined): string => {
  if (mode === "one_and_one") {
    return "with a one-and-one on the table";
  }
  return "with two free throws waiting on contact";
};

export const buildContextualFoulPressureOptions = (args: KeyMomentBuildArgs): KeyMomentOption[] => {
  const ctx = getChoiceContext(args);
  const offenseIsUser = ctx.offenseIsUser;
  const pendingModeText = describeFreeThrowMode(
    offenseIsUser
      ? "two_shots"
      : (args.defenderTeamFoulsInSegment ?? 0) + 1 >= 10
        ? "two_shots"
        : (args.defenderTeamFoulsInSegment ?? 0) + 1 >= 7
          ? "one_and_one"
          : "two_shots",
  );

  if (offenseIsUser) {
    const ripThroughDelta =
      (ctx.downhillSkill >= 72 ? 0.05 : 0) +
      (ctx.scoreBand === "trailing" ? 0.03 : 0) +
      (ctx.focusBand === "high" ? 0.02 : 0);
    const goStrongDelta =
      (ctx.downhillSkill >= 76 ? 0.04 : 0) +
      (ctx.workRateBand === "high" ? 0.03 : 0) -
      (ctx.fatigueBand === "high" ? 0.03 : 0);
    const fadeAwayDelta =
      (ctx.scoreBand === "leading" ? 0.05 : -0.04) +
      (ctx.focusBand === "low" ? 0.03 : 0);

    return [
      makeOption(
        "rip_through",
        ctx.scoreBand === "trailing" ? "Force Whistle" : "Rip Through Hip",
        `${ctx.scoreText}, ${ctx.clockText}. Get downhill and make the defender absorb contact ${pendingModeText}.`,
        clampDelta(ripThroughDelta),
      ),
      makeOption(
        "go_strong",
        "Finish Through Chest",
        `${ctx.clockText}. Power through the hit and finish on balance ${ctx.workRateText}.`,
        clampDelta(goStrongDelta),
      ),
      makeOption(
        "fade_away",
        ctx.scoreBand === "leading" ? "Take Safer Fade" : "Avoid Whistle Hunt",
        `${ctx.scoreText}, ${ctx.clockText}. Create space and score without hunting the whistle.`,
        clampDelta(fadeAwayDelta),
      ),
    ];
  }

  const wallUpDelta =
    (ctx.interiorDefenseSkill >= 72 ? 0.05 : 0) +
    (ctx.scoreBand === "leading" ? 0.05 : 0) +
    (ctx.focusBand === "low" ? 0.03 : 0);
  const swipeDownDelta =
    (ctx.gambleSkill >= 72 ? 0.02 : -0.01) +
    (ctx.scoreBand === "trailing" ? 0.03 : -0.03) -
    (ctx.focusBand === "low" ? 0.04 : 0);
  const bodyCheckDelta =
    (ctx.interiorDefenseSkill >= 70 ? 0.01 : -0.02) -
    (ctx.scoreBand === "leading" ? 0.04 : 0) -
    (ctx.focusBand === "low" ? 0.03 : 0);

  return [
    makeOption(
      "wall_up",
      ctx.scoreBand === "leading" ? "Stay Vertical" : "Wall Up Clean",
      `${ctx.scoreText}, ${ctx.clockText}. Stay vertical and keep them off the line ${pendingModeText}.`,
      clampDelta(wallUpDelta),
    ),
    makeOption(
      "swipe_down",
      ctx.scoreBand === "trailing" ? "Swipe for Disruption" : "Swipe Down Recover",
      `${ctx.clockText}. Swipe only when the ball is loose because ${pendingModeText}.`,
      clampDelta(swipeDownDelta),
    ),
    makeOption(
      "body_check",
      ctx.scoreBand === "leading" ? "Body Up Clean" : "Cut Off Chest",
      `${ctx.scoreText}, ${ctx.clockText}. Beat the drive to the spot and avoid gifting free throws.`,
      clampDelta(bodyCheckDelta),
    ),
  ];
};
