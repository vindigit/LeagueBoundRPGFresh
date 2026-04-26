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
    return `with ${raw} left in a critical stretch`;
  }
  if (clockBand === "late") {
    return `with ${raw} left and the clock tightening`;
  }
  if (clockBand === "mid") {
    return `with ${raw} left in the quarter`;
  }
  return `with ${raw} left and time to read it`;
};

const describeFocus = (focusBand: Band): string => {
  if (focusBand === "low") {
    return "while your focus is slipping";
  }
  if (focusBand === "high") {
    return "with your focus locked in";
  }
  return "while your focus is steady";
};

const describeWorkRate = (workRateBand: Band, fatigueBand: Band): string => {
  if (workRateBand === "high" && fatigueBand !== "low") {
    return "with your motor still running hot";
  }
  if (fatigueBand === "high") {
    return "with heavy legs";
  }
  if (workRateBand === "low") {
    return "while trying to conserve energy";
  }
  return "with enough juice to stay patient";
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
  const workRateBand = toBand(args.context.workRate, 45, 75);
  const focusBand = toBand(args.context.focus, 45, 70);
  const fatigueBand = toBand(getFatigue(args.possessionState, { context: args.context }) * 100, 25, 60);
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
    offenseIsUser: args.context.offense === args.context.userTeam,
    scoreBand,
    clockBand,
    workRateBand,
    focusBand,
    fatigueBand,
    userMargin,
    scoreText: describeScore(userMargin),
    clockText: describeClock(args.context.timeRemaining, clockBand),
    focusText: describeFocus(focusBand),
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
      ctx.playmakingSkill >= ctx.downhillSkill ? "Hit the Weak-Side Window" : "Spray It Out",
      `${ctx.scoreText} ${ctx.clockText}, trust your vision ${ctx.buildText} and find the kick-out three ${ctx.focusText}.`,
      clampDelta(kickOutDelta),
    ),
    makeOption(
      "attack_gap",
      ctx.downhillSkill >= ctx.playmakingSkill ? "Collapse the Gap" : "Knife Through the Help",
      `${ctx.clockText}, lean into your downhill game ${ctx.buildText} and pressure the lane ${ctx.workRateText}.`,
      clampDelta(attackGapDelta),
    ),
    makeOption(
      "reset_space",
      ctx.scoreBand === "leading" ? "Settle the Possession" : "Bail Out and Reset",
      `${ctx.scoreText} ${ctx.clockText}, reset the spacing and avoid a rushed read ${ctx.focusText}.`,
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
      ctx.perimeterDefenseSkill >= ctx.interiorDefenseSkill ? "Cut Off the Middle" : "Angle Into Traffic",
      `${ctx.scoreText} ${ctx.clockText}, use your feet ${ctx.buildText} to force the ball into help and away from a clean pull-up.`,
      clampDelta(shadeMiddleDelta),
    ),
    makeOption(
      "crowd_handle",
      ctx.scoreBand === "trailing" ? "Heat Up the Handle" : "Crowd the Dribble",
      `${ctx.clockText}, pressure the handle and deny rhythm without giving up a clean look ${ctx.focusText}.`,
      clampDelta(crowdHandleDelta),
    ),
    makeOption(
      "wall_up",
      ctx.scoreBand === "leading" ? "Stay Vertical, No Whistle" : "Wall Up at the Rim",
      `${ctx.scoreText} ${ctx.clockText}, trust your frame ${ctx.buildText} and do not bail them out with tired contact ${ctx.workRateText}.`,
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
      ctx.scoreBand === "trailing" ? "Jump the Lane for a Momentum Flip" : "Shoot the Passing Gap",
      `${ctx.scoreText} ${ctx.clockText}, trust your instincts ${ctx.buildText} and gamble only if your read is clean ${ctx.focusText}.`,
      clampDelta(shootGapDelta),
    ),
    makeOption(
      "stunt_recover",
      "Show Help, Snap Back",
      `${ctx.clockText}, stunt at the action and recover in rhythm to take away the easy pass ${ctx.workRateText}.`,
      clampDelta(stuntRecoverDelta),
    ),
    makeOption(
      "stay_home",
      ctx.scoreBand === "leading" ? "Stay Home, Protect the Lead" : "Stay Home and Contain",
      `${ctx.scoreText} ${ctx.clockText}, play the solid coverage and do not let a shaky read turn into a layup ${ctx.focusText}.`,
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
        ctx.scoreBand === "trailing" ? "Force the Whistle" : "Rip Through the Hip",
        `${ctx.scoreText} ${ctx.clockText}, attack the body ${ctx.buildText} and lean into contact ${pendingModeText}.`,
        clampDelta(ripThroughDelta),
      ),
      makeOption(
        "go_strong",
        "Finish Through the Chest",
        `${ctx.clockText}, play through the hit and trust your downhill burst ${ctx.workRateText}.`,
        clampDelta(goStrongDelta),
      ),
      makeOption(
        "fade_away",
        ctx.scoreBand === "leading" ? "Take the Safer Fade" : "Avoid a Whistle-Dependent Look",
        `${ctx.scoreText} ${ctx.clockText}, create space without depending on the call ${ctx.focusText}.`,
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
      ctx.scoreBand === "leading" ? "Stay Vertical, Do Not Stop the Clock" : "Wall Up Without Fouling",
      `${ctx.scoreText} ${ctx.clockText}, keep your chest clean ${ctx.buildText} ${pendingModeText}.`,
      clampDelta(wallUpDelta),
    ),
    makeOption(
      "swipe_down",
      ctx.scoreBand === "trailing" ? "Swipe for the Disruption" : "Swipe Down and Recover",
      `${ctx.clockText}, reach only if the ball is exposed because ${pendingModeText} ${ctx.focusText}.`,
      clampDelta(swipeDownDelta),
    ),
    makeOption(
      "body_check",
      ctx.scoreBand === "leading" ? "Body Up, No Cheap Bonus" : "Cut Off the Chest Line",
      `${ctx.scoreText} ${ctx.clockText}, absorb the drive carefully and avoid gifting the line ${pendingModeText}.`,
      clampDelta(bodyCheckDelta),
    ),
  ];
};
