import type { HeightPreset, WeightPreset } from "../../../types/backstory";
import type { PlayerAttributes } from "../../../types/player";

type AttributeModifiers = Partial<Record<keyof PlayerAttributes, number>>;

export interface HeightPresetConfig {
  key: HeightPreset;
  label: string;
  capBonus: AttributeModifiers;
  startBonus: AttributeModifiers;
}

export interface WeightPresetConfig {
  key: WeightPreset;
  label: string;
  capBonus: AttributeModifiers;
  startBonus: AttributeModifiers;
}

/**
 * Body preset balance table used by generator math.
 *
 * Why this exists:
 * - Exact height/weight are user-facing identity values.
 * - Gameplay uses bounded preset buckets so balance stays predictable.
 * - Taller/heavier presets generally trade perimeter skill for interior impact.
 *
 * `capBonus` affects long-term ceilings, `startBonus` affects initial ratings only.
 */
export const HEIGHT_PRESET_CONFIG: Record<HeightPreset, HeightPresetConfig> = {
  "5_8_5_10": {
    key: "5_8_5_10",
    label: "5'8\" - 5'10\"",
    capBonus: { handle: 1, vision: 1, rebounding: -2 },
    startBonus: { handle: 1, athleticism: 1, rebounding: -1 },
  },
  "5_11_6_1": {
    key: "5_11_6_1",
    label: "5'11\" - 6'1\"",
    capBonus: { handle: 1, vision: 1 },
    startBonus: { handle: 1 },
  },
  "6_2_6_4": {
    key: "6_2_6_4",
    label: "6'2\" - 6'4\"",
    capBonus: {},
    startBonus: {},
  },
  "6_5_6_7": {
    key: "6_5_6_7",
    label: "6'5\" - 6'7\"",
    capBonus: { defense: 1, rebounding: 1, handle: -1 },
    startBonus: { defense: 1 },
  },
  "6_8_6_10": {
    key: "6_8_6_10",
    label: "6'8\" - 6'10\"",
    capBonus: { rebounding: 2, finishing: 1, handle: -1 },
    startBonus: { rebounding: 1, finishing: 1 },
  },
  "6_11_7_1": {
    key: "6_11_7_1",
    label: "6'11\" - 7'1\"",
    capBonus: { rebounding: 2, defense: 1, handle: -2, shooting: -1 },
    startBonus: { rebounding: 1, defense: 1, handle: -1 },
  },
};

/**
 * Weight bucket balance table with small, bounded modifiers.
 * Heavier builds gain some interior durability/finishing at the cost of handle/explosiveness.
 */
export const WEIGHT_PRESET_CONFIG: Record<WeightPreset, WeightPresetConfig> = {
  "150_165": {
    key: "150_165",
    label: "150 - 165 lbs",
    capBonus: { handle: 1, athleticism: 1, finishing: -1 },
    startBonus: { athleticism: 1, handle: 1 },
  },
  "166_180": {
    key: "166_180",
    label: "166 - 180 lbs",
    capBonus: { handle: 1 },
    startBonus: { handle: 1 },
  },
  "181_200": {
    key: "181_200",
    label: "181 - 200 lbs",
    capBonus: {},
    startBonus: {},
  },
  "201_220": {
    key: "201_220",
    label: "201 - 220 lbs",
    capBonus: { finishing: 1, defense: 1, athleticism: -1 },
    startBonus: { finishing: 1 },
  },
  "221_245": {
    key: "221_245",
    label: "221 - 245 lbs",
    capBonus: { finishing: 1, defense: 1, rebounding: 1, handle: -1 },
    startBonus: { finishing: 1, rebounding: 1, handle: -1 },
  },
  "246_270": {
    key: "246_270",
    label: "246 - 270 lbs",
    capBonus: { finishing: 2, rebounding: 1, stamina: 1, handle: -2, athleticism: -1 },
    startBonus: { finishing: 1, rebounding: 1, stamina: 1, handle: -1 },
  },
};

export const HEIGHT_PRESETS = Object.keys(HEIGHT_PRESET_CONFIG) as HeightPreset[];
export const WEIGHT_PRESETS = Object.keys(WEIGHT_PRESET_CONFIG) as WeightPreset[];
