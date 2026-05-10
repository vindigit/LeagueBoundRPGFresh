import { LeagueLevel } from "../../types/career";

export const HIGH_SCHOOL_BADGE_UNLOCK_SEASON = 4;

export const isBadgeSystemAvailable = (
  leagueLevel: LeagueLevel,
  seasonNumber: number,
): boolean =>
  leagueLevel === LeagueLevel.COLLEGE ||
  leagueLevel === LeagueLevel.PRO ||
  (leagueLevel === LeagueLevel.HIGH_SCHOOL && seasonNumber >= HIGH_SCHOOL_BADGE_UNLOCK_SEASON);
