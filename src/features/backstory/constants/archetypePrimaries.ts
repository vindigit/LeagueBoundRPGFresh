import type { PlayerArchetype, PlayerAttributes } from "../../../types/player";

type AttributeKey = keyof PlayerAttributes;

/**
 * Two primary attributes for each archetype.
 *
 * Generator uses these keys to grant a small primary-identity bonus when building caps.
 */
export const ARCHETYPE_PRIMARY_ATTRIBUTES: Record<PlayerArchetype, readonly [AttributeKey, AttributeKey]> = {
  Slasher: ["shortRange", "dunking"],
  Sharpshooter: ["threePoint", "midrange"],
  Playmaker: ["passing", "handle"],
  "Lockdown Defender": ["perimeterDefense", "stealing"],
  "Paint Beast": ["interiorDefense", "defRebounding"],
  "Stretch Big": ["threePoint", "defRebounding"],
};
