import type { AttributeGainSource } from "../../../types/backstory";

export const ATTRIBUTE_SOURCE_MULTIPLIERS: Record<AttributeGainSource, number> = {
  NARRATIVE: 1.0,
  MATCH_REWARD: 0.9,
  TRAINING: 1.15,
  SYSTEM: 1.0,
};
