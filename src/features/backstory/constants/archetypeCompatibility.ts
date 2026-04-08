import { ARCHETYPE_DEFAULTS } from "../../../constants/archetypes";
import type { PlayerArchetype, PlayerAttributes } from "../../../types/player";
import { ARCHETYPE_BASE_CAPS } from "./archetypeCaps";
import { ARCHETYPE_PRIMARY_ATTRIBUTES } from "./archetypePrimaries";

/**
 * Explicit compatibility adapter for legacy archetype-authored defaults.
 *
 * New classification-driven code should only consume archetype-authored values
 * through this file so the remaining dependency surface is visible and removable.
 */
export const getLegacyArchetypeBaseCaps = (archetype: PlayerArchetype): PlayerAttributes => ARCHETYPE_BASE_CAPS[archetype];

export const getLegacyArchetypeStartDefaults = (archetype: PlayerArchetype): PlayerAttributes => ARCHETYPE_DEFAULTS[archetype];

export const getLegacyArchetypePrimaryAttributes = (
  archetype: PlayerArchetype,
): readonly [keyof PlayerAttributes, keyof PlayerAttributes] => ARCHETYPE_PRIMARY_ATTRIBUTES[archetype];
