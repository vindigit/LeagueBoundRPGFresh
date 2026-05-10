import type {
  BuzzAuthorType,
  BuzzSentiment,
  CareerNewsItem,
  FeatureReason,
  PlayerIdentity,
  RecapStyle,
  RecapTier,
  StoryAngleTag,
  StoryBuzz,
  StoryBuzzPost,
  StoryDetail,
  StoryStakesTag,
} from "../../types/backstory";
import { LeagueLevel, type LastMatchResult } from "../../types/career";
import { formatSchoolPathLabel } from "../../constants/schoolPaths";
import type { SchoolPath } from "../../types/careerProgression";

const createNewsId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const createStoryId = (): string => createNewsId("story");
const toPossessive = (value: string): string => (value.endsWith("s") ? `${value}'` : `${value}'s`);
const countWords = (value: string): number => value.trim().split(/\s+/).filter(Boolean).length;

/**
 * Creates the first hometown headline shown when a career is initialized.
 */
export const createCareerCreationNewsItem = (
  identity: PlayerIdentity,
  week: number,
): CareerNewsItem => ({
  id: createNewsId("career"),
  createdAt: Date.now(),
  week,
  category: "LOCAL_BUZZ",
  headline: `${toPossessive(identity.hometown.city)} ${identity.lastName} enters the spotlight as a ${identity.archetype} prospect.`,
  isTappable: false,
});

const getPlayerLine = (result: LastMatchResult) => result.boxScore.homePlayers[0];

/**
 * Builds a postgame hometown recap headline from the latest result.
 */
export const createPostgameNewsItem = (
  identity: PlayerIdentity,
  result: LastMatchResult,
  storyId?: string,
): CareerNewsItem => {
  const playerPoints = getPlayerLine(result)?.pts ?? 0;
  const hometown = identity.hometown.city;
  const lastName = identity.lastName;

  let headline = `${toPossessive(hometown)} ${lastName} battles through a quiet night.`;
  if (result.didWin && playerPoints >= 20) {
    headline = `${toPossessive(hometown)} ${lastName} shines in a statement win.`;
  } else if (result.didWin) {
    headline = `${toPossessive(hometown)} ${lastName} helps close out another win.`;
  } else if (!result.didWin && playerPoints >= 18) {
    headline = `${toPossessive(hometown)} ${lastName} fights hard in a tough loss.`;
  } else if (!result.didWin) {
    headline = `${toPossessive(hometown)} ${lastName} looks to bounce back after a tough loss.`;
  }

  return {
    id: createNewsId("postgame"),
    createdAt: Date.now(),
    week: result.weekAfter,
    category: "POSTGAME_RECAP",
    headline,
    subhead: `Final: ${result.homeScore}-${result.awayScore}`,
    isTappable: true,
    storyId,
  };
};

export const createSchoolPathCommitmentNewsItem = (
  identity: PlayerIdentity,
  schoolPath: SchoolPath,
  week: number,
): CareerNewsItem => ({
  id: createNewsId("school-path"),
  createdAt: Date.now(),
  week,
  category: "LOCAL_BUZZ",
  headline: `${toPossessive(identity.hometown.city)} ${identity.lastName} commits to the ${formatSchoolPathLabel(schoolPath)} route.`,
  subhead: `New stage unlocked: ${formatSchoolPathLabel(schoolPath)} high school ball.`,
  isTappable: false,
});

const getStoryStakesTag = (leagueLevel: LeagueLevel, currentWeek: number): StoryStakesTag => {
  if (currentWeek >= 4) {
    return "SEASON_ENDING";
  }
  if (leagueLevel === LeagueLevel.HIGH_SCHOOL && currentWeek >= 3) {
    return "TOURNAMENT";
  }
  return "REGULAR_SEASON";
};

const getFeatureReason = (result: LastMatchResult, stakesTag: StoryStakesTag): FeatureReason | undefined => {
  const playerLine = getPlayerLine(result);
  const points = playerLine?.pts ?? 0;
  const margin = Math.abs(result.homeScore - result.awayScore);

  if (stakesTag === "PLAYOFF") return "PLAYOFF_GAME";
  if (stakesTag === "TOURNAMENT") return "TOURNAMENT_GAME";
  if (stakesTag === "RIVALRY") return "RIVALRY_GAME";
  if (stakesTag === "CHAMPIONSHIP") return "CHAMPIONSHIP_GAME";
  if (stakesTag === "SEASON_ENDING" && !result.didWin) return "SEASON_ENDING_LOSS";
  if (result.consequences.some((consequence) => consequence.kind === "injury")) return "INJURY_GAME";
  if (result.overtimePeriods > 0) return "OVERTIME";
  if (margin <= 3) return "CLOSE_GAME";
  if (points >= 25) return "BIG_SCORING_NIGHT";
  if (!result.didWin && points >= 20) return "STRONG_LOSS";
  if (result.matchRating >= 8.5) return "ELITE_MATCH_RATING";
  return undefined;
};

const getRecapTier = (featureReason?: FeatureReason): RecapTier => (featureReason ? "FEATURE" : "STANDARD");
const getRecapStyle = (tier: RecapTier): RecapStyle => (tier === "FEATURE" ? "ATHLETIC" : "ESPN");

const getAngleTag = (result: LastMatchResult, featureReason?: FeatureReason): StoryAngleTag => {
  const playerLine = getPlayerLine(result);
  const points = playerLine?.pts ?? 0;
  const margin = Math.abs(result.homeScore - result.awayScore);

  if (featureReason === "INJURY_GAME") return "INJURY_SHADOWED";
  if (result.overtimePeriods > 0) return "OVERTIME_TEST";
  if (result.didWin && points >= 25) return "BREAKOUT_PERFORMANCE";
  if (result.didWin && margin >= 12) return "STATEMENT_WIN";
  if (result.didWin) return "STEADY_CONTROL";
  if (!result.didWin && points >= 20) return "GRITTY_LOSS";
  return "TOUGH_SHOOTING_NIGHT";
};

const buildStandardRecapBody = (identity: PlayerIdentity, result: LastMatchResult): string => {
  const playerLine = getPlayerLine(result);
  const points = playerLine?.pts ?? 0;
  const rebounds = playerLine?.reb ?? 0;
  const assists = playerLine?.ast ?? 0;
  const hometown = identity.hometown.city;
  const lastName = identity.lastName;

  return `${toPossessive(hometown)} ${lastName} delivered a steady showing in Houston's ${result.homeScore}-${result.awayScore} ${result.didWin ? "win" : "loss"}, giving the home side a dependable option whenever the possession needed direction. ${result.didWin ? "He helped Houston settle the game and keep the pressure on." : "Even as the result slipped away, he kept Houston attached with composed stretches."}

Alexander finished with ${points} points, ${rebounds} rebounds and ${assists} assists, numbers that matched the shape of the night. ${result.didWin ? "When Houston needed the game to stay on its terms, he usually supplied the cleanest answer." : "The final margin told one story, but his production still gave Houston its clearest offensive structure."}`;
};

const buildFeatureRecapBody = (result: LastMatchResult, stakesTag: StoryStakesTag): string => {
  const playerLine = getPlayerLine(result);
  const points = playerLine?.pts ?? 0;
  const rebounds = playerLine?.reb ?? 0;
  const assists = playerLine?.ast ?? 0;
  const margin = Math.abs(result.homeScore - result.awayScore);
  const stakesFrame =
    stakesTag === "TOURNAMENT"
      ? "With the game carrying tournament weight, the performance landed with a little more force."
      : stakesTag === "SEASON_ENDING"
        ? "With the season leaning toward a hinge point, every possession seemed to carry extra gravity."
        : "The night asked for more than routine production, and Houston found that in Alexander.";

  return `For long stretches, Houston did not need spectacle so much as control. It found that in Alexander, who gave the game its clearest shape in a ${result.homeScore}-${result.awayScore} ${result.didWin ? "win" : "loss"}.

${stakesFrame} He finished with ${points} points, ${rebounds} rebounds and ${assists} assists, but the value of the night was less about the total than the timing. When the game tightened, he supplied the cleanest possessions Houston had, either by creating a look himself or by moving the ball before the defense could reset.

The box score captures the output. The flow of the evening explained the influence. Houston's most stable stretches bent around his decisions, and even the messy minutes still seemed to run through his ability to calm a possession. ${result.didWin ? `That helped turn a competitive game into a ${margin}-point result that felt more controlled than the final margin alone would suggest.` : "That kept Houston close enough to matter longer than the final score would imply."}

What remained after the buzzer was not just the stat line, but the broader impression it left. ${result.didWin ? "This was the sort of performance that made the result feel authored." : "This was the sort of loss that still revealed who Houston trusted when the game needed a pulse."}`;
};

const createBuzzPost = (
  authorName: string,
  authorType: BuzzAuthorType,
  text: string,
  sentiment: BuzzSentiment,
  likes: number,
  reposts: number,
  timestampLabel: string,
): StoryBuzzPost => ({
  id: createNewsId("buzz"),
  authorName,
  authorType,
  text,
  sentiment,
  likes,
  reposts,
  timestampLabel,
});

const buildBuzz = (identity: PlayerIdentity, result: LastMatchResult): StoryBuzz => {
  const points = getPlayerLine(result)?.pts ?? 0;
  const hometown = identity.hometown.city;
  const posts = result.didWin
    ? [
        createBuzzPost(`${hometown} Hoops`, "STUDENT_ACCOUNT", `Alexander was everywhere tonight. ${points} points and the whole gym felt it.`, "POSITIVE", 184, 37, "12m ago"),
        createBuzzPost("Third Ward Fan", "LOCAL_FAN", "That game settled down once Alexander started dictating the pace.", "POSITIVE", 121, 18, "19m ago"),
        createBuzzPost("Bella R.", "CLASSMATE", "Man put up numbers and made it look normal.", "FUNNY", 87, 9, "25m ago"),
        createBuzzPost("Northside Neighbors", "COMMUNITY", "Big night for one of Houston's own. Proud of the poise as much as the scoring.", "MIXED", 64, 11, "33m ago"),
      ]
    : [
        createBuzzPost(`${hometown} Hoops`, "STUDENT_ACCOUNT", "Tough result, but Alexander kept Houston in it all night.", "MIXED", 131, 22, "11m ago"),
        createBuzzPost("Locker Room Talk", "CLASSMATE", "Loss hurts, but he was still hooping. The box score backs it up.", "MIXED", 92, 13, "20m ago"),
        createBuzzPost("Southside Fan", "LOCAL_FAN", "Need more help around him next game. Too much fell on Alexander tonight.", "NEGATIVE", 78, 16, "28m ago"),
        createBuzzPost("Hometown Pulse", "COMMUNITY", "One bad final doesn't erase a strong effort. He kept competing the whole way.", "POSITIVE", 55, 8, "36m ago"),
      ];

  return {
    tone: "LOCAL",
    scope: "LOCAL_ONLY",
    intro: `Local reaction from around ${hometown}`,
    pinnedPostId: posts[0]?.id,
    posts,
  };
};

export const createPostgameStoryDetail = (input: {
  identity: PlayerIdentity;
  result: LastMatchResult;
  leagueLevel: LeagueLevel;
  currentYear: number;
  currentWeek: number;
}): StoryDetail => {
  const createdAt = Date.now();
  const storyId = createStoryId();
  const headlineItem = createPostgameNewsItem(input.identity, input.result, storyId);
  const stakesTag = getStoryStakesTag(input.leagueLevel, input.currentWeek);
  const featureReason = getFeatureReason(input.result, stakesTag);
  const tier = getRecapTier(featureReason);
  const style = getRecapStyle(tier);
  const angleTag = getAngleTag(input.result, featureReason);
  const playerLine = getPlayerLine(input.result);
  const body = tier === "FEATURE" ? buildFeatureRecapBody(input.result, stakesTag) : buildStandardRecapBody(input.identity, input.result);

  return {
    id: storyId,
    storyType: "POSTGAME",
    createdAt,
    week: input.result.weekAfter,
    defaultTab: "RECAP",
    availableTabs: ["RECAP", "BOX_SCORE", "BUZZ"],
    headline: headlineItem.headline,
    subhead: headlineItem.subhead,
    context: {
      leagueLevel: input.leagueLevel,
      seasonYear: input.currentYear,
      week: input.result.weekAfter,
      playerTeamLabel: "My Player",
      opponentTeamLabel: "Rivals High",
      homeScore: input.result.homeScore,
      awayScore: input.result.awayScore,
      didWin: input.result.didWin,
      margin: Math.abs(input.result.homeScore - input.result.awayScore),
      overtimePeriods: input.result.overtimePeriods,
      stakesTag,
      featureReason,
      matchRating: input.result.matchRating,
    },
    recap: {
      tier,
      style,
      angleTag,
      headline: headlineItem.headline,
      subhead: headlineItem.subhead,
      body,
      wordCount: countWords(body),
      publishedAt: createdAt,
      keyPerformance: {
        points: playerLine?.pts ?? 0,
        rebounds: playerLine?.reb ?? 0,
        assists: playerLine?.ast ?? 0,
        fieldGoalsMade: playerLine?.fgm ?? 0,
        fieldGoalsAttempted: playerLine?.fga ?? 0,
        threePointsMade: playerLine?.tpm ?? 0,
        threePointsAttempted: playerLine?.tpa ?? 0,
      },
      impact: {
        fansDelta: input.result.meterDeltas.fans,
        coachTrustDelta: input.result.meterDeltas.coachTrust,
        teammatesDelta: input.result.meterDeltas.teammates,
      },
      momentOfTheNight:
        tier === "FEATURE"
          ? input.result.didWin
            ? "Houston's cleanest stretch came once Alexander settled the tempo and forced the game onto his terms."
            : "Even in defeat, Houston's most stable possessions still ran through Alexander's decision-making."
          : undefined,
    },
    boxScore: {
      summary: {
        homeScore: input.result.homeScore,
        awayScore: input.result.awayScore,
        didWin: input.result.didWin,
        overtimePeriods: input.result.overtimePeriods,
      },
      homeTeam: {
        label: "My Player",
        totals: input.result.boxScore.homeTotals,
        players: input.result.boxScore.homePlayers,
      },
      awayTeam: {
        label: "Rivals High",
        totals: input.result.boxScore.awayTotals,
        players: input.result.boxScore.awayPlayers,
      },
      highlightPlayerId: playerLine?.id ?? "home-0",
    },
    buzz: buildBuzz(input.identity, input.result),
  };
};
