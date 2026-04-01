import type { PlayerAttributes, WingspanPreset } from "../../types/player";

type AttributeModifiers = Partial<Record<keyof PlayerAttributes, number>>;

export interface WingspanPresetConfig {
  key: WingspanPreset;
  label: string;
  capBonus: AttributeModifiers;
}

/**
 * Conservative builder-only wingspan presets.
 *
 * Neutral preset preserves current cap outputs so legacy generation remains comparable.
 * Longer presets trade perimeter skill for interior reach; shorter presets do the inverse.
 */
export const WINGSPAN_PRESET_CONFIG: Record<WingspanPreset, WingspanPresetConfig> = {
  "5_10_6_0": {
    key: "5_10_6_0",
    label: `5'10" - 6'0"`,
    capBonus: { handle: 2, threePoint: 1, perimeterDefense: 1, interiorDefense: -2, blocking: -2, offRebounding: -1 },
  },
  "6_1_6_3": {
    key: "6_1_6_3",
    label: `6'1" - 6'3"`,
    capBonus: { handle: 1, threePoint: 1, perimeterDefense: 1, interiorDefense: -1, blocking: -1 },
  },
  "6_4_6_6": {
    key: "6_4_6_6",
    label: `6'4" - 6'6"`,
    capBonus: {},
  },
  "6_7_6_9": {
    key: "6_7_6_9",
    label: `6'7" - 6'9"`,
    capBonus: { interiorDefense: 1, blocking: 1, defRebounding: 1, handle: -1 },
  },
  "6_10_7_0": {
    key: "6_10_7_0",
    label: `6'10" - 7'0"`,
    capBonus: { interiorDefense: 1, blocking: 2, offRebounding: 1, defRebounding: 1, handle: -1, threePoint: -1 },
  },
  "7_1_7_3": {
    key: "7_1_7_3",
    label: `7'1" - 7'3"`,
    capBonus: { interiorDefense: 2, blocking: 2, offRebounding: 1, defRebounding: 2, handle: -2, threePoint: -1, speed: -1 },
  },
};

export const DEFAULT_WINGSPAN_PRESET: WingspanPreset = "6_4_6_6";

export const WINGSPAN_PRESETS = Object.keys(WINGSPAN_PRESET_CONFIG) as WingspanPreset[];
