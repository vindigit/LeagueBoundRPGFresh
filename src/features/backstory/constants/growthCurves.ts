import { LeagueLevel } from "../../../types/career";
import type { GrowthCurve } from "../../../types/backstory";

export const GROWTH_BY_CURVE: Record<GrowthCurve, Record<LeagueLevel, number>> = {
  EARLY_STARTER: {
    [LeagueLevel.MIDDLE_SCHOOL]: 1.05,
    [LeagueLevel.HIGH_SCHOOL]: 0.98,
    [LeagueLevel.COLLEGE]: 0.92,
    [LeagueLevel.PRO]: 0.88,
  },
  STEADY: {
    [LeagueLevel.MIDDLE_SCHOOL]: 1.0,
    [LeagueLevel.HIGH_SCHOOL]: 1.0,
    [LeagueLevel.COLLEGE]: 1.0,
    [LeagueLevel.PRO]: 1.0,
  },
  LATE_BLOOMER: {
    [LeagueLevel.MIDDLE_SCHOOL]: 0.85,
    [LeagueLevel.HIGH_SCHOOL]: 1.1,
    [LeagueLevel.COLLEGE]: 1.2,
    [LeagueLevel.PRO]: 1.05,
  },
};

export const GROWTH_OUTLOOK_BY_CURVE: Record<GrowthCurve, string> = {
  EARLY_STARTER: "Fast start, tougher late climb",
  STEADY: "Consistent progression path",
  LATE_BLOOMER: "Slow start, big upside later",
};
