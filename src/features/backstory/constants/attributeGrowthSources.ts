import type { AttributeGainSource } from "../../../types/backstory";
import { GROWTH_SOURCE_MULTIPLIERS } from "./growthModel";

/**
 * Source multipliers applied when positive attribute gains are processed.
 *
 * Final gain = `round(delta * sourceMultiplier * growthByLeague[currentLeague])`.
 * Negative deltas bypass growth multipliers in store logic.
 */
export const ATTRIBUTE_SOURCE_MULTIPLIERS: Record<AttributeGainSource, number> = {
  ...GROWTH_SOURCE_MULTIPLIERS,
};
