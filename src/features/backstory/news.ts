import type { CareerNewsItem, PlayerIdentity } from "../../types/backstory";
import type { LastMatchResult } from "../../types/career";
import { formatSchoolPathLabel } from "../../constants/schoolPaths";
import type { SchoolPath } from "../../types/careerProgression";

const createNewsId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toPossessive = (value: string): string => (value.endsWith("s") ? `${value}'` : `${value}'s`);

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
});

const getPlayerPoints = (result: LastMatchResult): number => {
  const line = result.boxScore.homePlayers[0];
  return line?.pts ?? 0;
};

/**
 * Builds a postgame hometown recap headline from the latest result.
 *
 * Template priority favors standout wins first, then general wins/losses,
 * and falls back to a quiet-night line when no stronger condition is met.
 */
export const createPostgameNewsItem = (
  identity: PlayerIdentity,
  result: LastMatchResult,
): CareerNewsItem => {
  const playerPoints = getPlayerPoints(result);
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

  const scoreLine = `${result.homeScore}-${result.awayScore}`;

  return {
    id: createNewsId("postgame"),
    createdAt: Date.now(),
    week: result.weekAfter,
    category: "POSTGAME_RECAP",
    headline,
    subhead: `Final: ${scoreLine}`,
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
});
