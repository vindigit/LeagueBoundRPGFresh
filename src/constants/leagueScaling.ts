import { LeagueLevel } from "../types/career";

export const LEAGUE_MODIFIERS: Record<LeagueLevel, number> = {
  [LeagueLevel.MIDDLE_SCHOOL]: 0.6,
  [LeagueLevel.HIGH_SCHOOL]: 0.75,
  [LeagueLevel.COLLEGE]: 0.9,
  [LeagueLevel.PRO]: 1.0,
};
