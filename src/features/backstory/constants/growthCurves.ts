import { LeagueLevel } from "../../../types/career";
import type { GrowthCurve } from "../../../types/backstory";
import { GROWTH_CURVE_MULTIPLIERS } from "./growthModel";

/**
 * Per-league growth multipliers for each growth curve.
 *
 * Meaning of curves:
 * - `EARLY_STARTER`: develops faster in middle school, then slows relative to peers later.
 * - `STEADY`: no curve bias; progresses at baseline pace each league.
 * - `LATE_BLOOMER`: slower early development, stronger high school/college growth.
 *
 * These multipliers are applied to positive attribute gains in the career store.
 */
export const GROWTH_BY_CURVE: Record<GrowthCurve, Record<LeagueLevel, number>> = {
  ...GROWTH_CURVE_MULTIPLIERS,
};

/**
 * Public summary copy for growth curves shown in backstory preview and player card.
 */
export const GROWTH_OUTLOOK_BY_CURVE: Record<GrowthCurve, string> = {
  EARLY_STARTER: "Fast start, tougher late climb",
  STEADY: "Consistent progression path",
  LATE_BLOOMER: "Slow start, big upside later",
};
