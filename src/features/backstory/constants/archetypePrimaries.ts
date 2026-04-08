import type { PlayerArchetype, PlayerAttributes } from "../../../types/player";

type AttributeKey = keyof PlayerAttributes;

/**
 * Two primary attributes for each archetype.
 *
 * Compatibility only during the builder migration.
 * New generator code should consume this data through `archetypeCompatibility.ts`.
 */
export const ARCHETYPE_PRIMARY_ATTRIBUTES: Record<PlayerArchetype, readonly [AttributeKey, AttributeKey]> = {
  Slasher: ["shortRange", "dunking"],
  Sharpshooter: ["threePoint", "midrange"],
  Playmaker: ["passing", "handle"],
  "Lockdown Defender": ["perimeterDefense", "stealing"],
  "Paint Beast": ["interiorDefense", "defRebounding"],
  "Stretch Big": ["threePoint", "defRebounding"],
};
