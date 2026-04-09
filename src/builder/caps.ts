import type { BodyFrame, GrowthCurve, HeightPreset, WeightPreset } from "../types/backstory";
import type { PlayerArchetype, PlayerAttributes, Position, WingspanPreset } from "../types/player";
import { ARCHETYPE_BASE_CAPS } from "../features/backstory/constants/archetypeCaps";
import { ARCHETYPE_PRIMARY_ATTRIBUTES } from "../features/backstory/constants/archetypePrimaries";
import { HEIGHT_PRESET_CONFIG, WEIGHT_PRESET_CONFIG } from "../features/backstory/constants/bodyPresets";
import { DEFAULT_WINGSPAN_PRESET, WINGSPAN_PRESET_CONFIG } from "./constants/wingspanPresets";

export const ATTRIBUTE_KEYS: ReadonlyArray<keyof PlayerAttributes> = [
  "shortRange",
  "dunking",
  "midrange",
  "threePoint",
  "handle",
  "passing",
  "vision",
  "perimeterDefense",
  "interiorDefense",
  "stealing",
  "blocking",
  "offRebounding",
  "defRebounding",
  "speed",
  "strength",
  "stamina",
];

type AttributeModifiers = Partial<Record<keyof PlayerAttributes, number>>;

const FRAME_BONUSES: Record<BodyFrame, AttributeModifiers> = {
  Lean: {
    speed: 1,
    handle: 1,
    passing: 1,
    offRebounding: -1,
    interiorDefense: -1,
    strength: -1,
  },
  Athletic: {
    speed: 2,
    dunking: 1,
    shortRange: 1,
    perimeterDefense: 1,
  },
  Stocky: {
    offRebounding: 1,
    defRebounding: 1,
    interiorDefense: 1,
    strength: 2,
    handle: -1,
    speed: -1,
    threePoint: -1,
  },
};

const CURVE_CAP_BONUSES: Record<GrowthCurve, AttributeModifiers> = {
  EARLY_STARTER: {
    passing: 1,
    vision: 1,
    threePoint: 1,
  },
  STEADY: {},
  LATE_BLOOMER: {
    shortRange: 1,
    dunking: 1,
    speed: 1,
    stamina: 1,
  },
};

const POSITION_CAP_BONUSES: Record<Position, AttributeModifiers> = {
  PG: { passing: 2, vision: 2, handle: 2, perimeterDefense: 1, defRebounding: -1, blocking: -1 },
  SG: { threePoint: 2, midrange: 1, handle: 1, passing: 1, perimeterDefense: 1 },
  SF: { shortRange: 1, midrange: 1, speed: 1, perimeterDefense: 1, defRebounding: 1 },
  PF: { shortRange: 1, dunking: 1, interiorDefense: 2, offRebounding: 2, defRebounding: 2, strength: 1, handle: -1 },
  C: { shortRange: 1, dunking: 1, interiorDefense: 2, blocking: 2, offRebounding: 2, defRebounding: 2, strength: 2, handle: -2, threePoint: -1 },
};

const SECONDARY_POSITION_SCALE = 0.5;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const asCap = (value: number): PlayerAttributes["shortRange"] =>
  clamp(Math.round(value), 40, 99) as PlayerAttributes["shortRange"];

const getPotentialBonus = (potential: number): number => {
  if (potential >= 90) {
    return 6;
  }
  if (potential >= 80) {
    return 3;
  }
  if (potential >= 65) {
    return 0;
  }
  return -5;
};

const combineBonuses = (...sources: AttributeModifiers[]): AttributeModifiers => {
  const combined: AttributeModifiers = {};
  for (const source of sources) {
    for (const key of ATTRIBUTE_KEYS) {
      combined[key] = (combined[key] ?? 0) + (source[key] ?? 0);
    }
  }
  return combined;
};

const scaleBonus = (source: AttributeModifiers, factor: number): AttributeModifiers => {
  const scaled: AttributeModifiers = {};
  for (const key of ATTRIBUTE_KEYS) {
    const value = source[key];
    if (value !== undefined) {
      scaled[key] = Math.round(value * factor);
    }
  }
  return scaled;
};

const getPrimaryBonus = (attribute: keyof PlayerAttributes, archetype: PlayerArchetype): number => {
  const primaries = ARCHETYPE_PRIMARY_ATTRIBUTES[archetype];
  return primaries.includes(attribute) ? 2 : 0;
};

export interface BuilderCapInput {
  archetype: PlayerArchetype;
  potential: number;
  frame: BodyFrame;
  growthCurve: GrowthCurve;
  primaryPosition: Position;
  secondaryPosition: Position;
  heightPreset: HeightPreset;
  weightPreset: WeightPreset;
  wingspanPreset?: WingspanPreset;
}

export const buildBuilderCaps = (input: BuilderCapInput): PlayerAttributes => {
  const archetypeBaseCaps = ARCHETYPE_BASE_CAPS[input.archetype];
  const frameBonus = FRAME_BONUSES[input.frame];
  const curveBonus = CURVE_CAP_BONUSES[input.growthCurve];
  const primaryPositionBonus = POSITION_CAP_BONUSES[input.primaryPosition];
  const secondaryPositionBonus = scaleBonus(POSITION_CAP_BONUSES[input.secondaryPosition], SECONDARY_POSITION_SCALE);
  const heightBonus = HEIGHT_PRESET_CONFIG[input.heightPreset].capBonus;
  const weightBonus = WEIGHT_PRESET_CONFIG[input.weightPreset].capBonus;
  const wingspanBonus = WINGSPAN_PRESET_CONFIG[input.wingspanPreset ?? DEFAULT_WINGSPAN_PRESET].capBonus;
  const buildBonus = combineBonuses(primaryPositionBonus, secondaryPositionBonus, heightBonus, weightBonus, wingspanBonus);
  const potentialBonus = getPotentialBonus(input.potential);

  const caps = {} as PlayerAttributes;
  for (const key of ATTRIBUTE_KEYS) {
    const value =
      archetypeBaseCaps[key] +
      potentialBonus +
      (frameBonus[key] ?? 0) +
      (curveBonus[key] ?? 0) +
      (buildBonus[key] ?? 0) +
      getPrimaryBonus(key, input.archetype);
    caps[key] = asCap(value) as PlayerAttributes[typeof key];
  }

  return caps;
};
