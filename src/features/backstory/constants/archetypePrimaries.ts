import type { PlayerArchetype, PlayerAttributes } from "../../../types/player";

type AttributeKey = keyof PlayerAttributes;

/**
 * Two primary attributes for each archetype.
 *
 * Generator uses these keys to grant a small primary-identity bonus when building caps.
 */
export const ARCHETYPE_PRIMARY_ATTRIBUTES: Record<PlayerArchetype, readonly [AttributeKey, AttributeKey]> = {
  Slasher: ["finishing", "athleticism"],
  Sharpshooter: ["shooting", "bbiq"],
  Playmaker: ["vision", "handle"],
  "Lockdown Defender": ["defense", "athleticism"],
  "Paint Beast": ["rebounding", "finishing"],
  "Stretch Big": ["shooting", "rebounding"],
};
