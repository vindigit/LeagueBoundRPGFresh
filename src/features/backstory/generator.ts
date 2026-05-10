import type {
  BackstoryInput,
  BasketballBackground,
  BuildBackstoryInput,
  ExactHeight,
  GeneratedBadgeProfile,
  GrowthCurve,
  HeightPreset,
  PlayerDNA,
  PlayerIdentity,
  WeightPreset,
} from "../../types/backstory";
import type { LegacyPlayerStateInput, PlayerArchetype, PlayerAttributes, Position } from "../../types/player";
import { classifyBuilderBuild, type BuilderClassification } from "../../builder/classify";
import {
  BASE_PUBLIC_ATTRIBUTES,
  PUBLIC_ATTRIBUTE_KEYS,
  STARTING_ARCHETYPES_BY_ID,
  deriveEngineRatings,
  getExpectedKeyMoments,
  getFuzzyScoutingSummary,
  getPlaystyleLabel,
  inferPublicAttributesFromEngine,
  legacyArchetypeForStartingArchetype,
  type PublicAttributes,
  type StartingArchetypeId,
} from "../../builder/publicAttributes";
import { resolveBuilderBadges } from "../../builder/badges/resolve";
import { clampHeight, clampWeight, heightFromPresetMidpoint, toHeightPreset, toWeightPreset, weightFromPresetMidpoint } from "./constants/bodyMapping";
import {
  getLegacyArchetypeBaseCaps,
  getLegacyArchetypePrimaryAttributes,
  getLegacyArchetypeStartDefaults,
} from "./constants/archetypeCompatibility";
import { HEIGHT_PRESET_CONFIG, WEIGHT_PRESET_CONFIG } from "./constants/bodyPresets";
import { GROWTH_BY_CURVE, GROWTH_OUTLOOK_BY_CURVE } from "./constants/growthCurves";
import { getPotentialTier } from "./constants/potentialTier";
import { findCityByLegacySlug, getDefaultCityForState, getDefaultStateCode, resolveHometown } from "./data/hometowns";

export interface GeneratedBackstory {
  identity: PlayerIdentity;
  dna: PlayerDNA;
  startingAttributes: PlayerAttributes;
  builderProfile: GeneratedBadgeProfile;
}

const ALL_ATTRIBUTE_KEYS: ReadonlyArray<keyof PlayerAttributes> = [
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

const AGE_STARTED_MIN = 4;
const AGE_STARTED_MAX = 12;

const AGE_BAND_OFFSETS: Record<PlayerIdentity["ageStartedBand"], number> = {
  EARLY: 2,
  STANDARD: 0,
  LATE: -5,
};

export interface BasketballBackgroundOption {
  id: BasketballBackground;
  label: string;
  representativeAgeStarted: number;
  ageStartedBand: PlayerIdentity["ageStartedBand"];
  growthCurve: GrowthCurve;
  summary: string;
  currentPolish: string;
  developmentEmphasis: string;
}

const DEFAULT_STARTING_ARCHETYPE_ID: StartingArchetypeId = "all_around";

export const BASKETBALL_BACKGROUND_OPTIONS: readonly BasketballBackgroundOption[] = [
  {
    id: "EARLY_STARTER",
    label: "Early Starter",
    representativeAgeStarted: 6,
    ageStartedBand: "EARLY",
    growthCurve: "EARLY_STARTER",
    summary: "More polished now with a higher starting floor and steadier development.",
    currentPolish: "Higher starting floor",
    developmentEmphasis: "Steady growth curve",
  },
  {
    id: "BALANCED_PATH",
    label: "Balanced Path",
    representativeAgeStarted: 8,
    ageStartedBand: "STANDARD",
    growthCurve: "STEADY",
    summary: "Neutral starting point with a balanced growth path.",
    currentPolish: "Neutral starting polish",
    developmentEmphasis: "Balanced development",
  },
  {
    id: "LATE_BLOOMER",
    label: "Late Bloomer",
    representativeAgeStarted: 11,
    ageStartedBand: "LATE",
    growthCurve: "LATE_BLOOMER",
    summary: "Less polished now with a lower starting floor and more long-term upside emphasis.",
    currentPolish: "Lower starting floor",
    developmentEmphasis: "Long-term upside emphasis",
  },
];

export const BASKETBALL_BACKGROUND_BY_ID: Record<BasketballBackground, BasketballBackgroundOption> =
  BASKETBALL_BACKGROUND_OPTIONS.reduce(
    (byId, option) => ({
      ...byId,
      [option.id]: option,
    }),
    {} as Record<BasketballBackground, BasketballBackgroundOption>,
  );

const FRAME_BONUSES: Record<PlayerIdentity["bodyFrame"], Partial<Record<keyof PlayerAttributes, number>>> = {
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

const CURVE_CAP_BONUSES: Record<GrowthCurve, Partial<Record<keyof PlayerAttributes, number>>> = {
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

const POSITION_CAP_BONUSES: Record<Position, Partial<Record<keyof PlayerAttributes, number>>> = {
  PG: { passing: 2, vision: 2, handle: 2, perimeterDefense: 1, defRebounding: -1, blocking: -1 },
  SG: { threePoint: 2, midrange: 1, handle: 1, passing: 1, perimeterDefense: 1 },
  SF: { shortRange: 1, midrange: 1, speed: 1, perimeterDefense: 1, defRebounding: 1 },
  PF: { shortRange: 1, dunking: 1, interiorDefense: 2, offRebounding: 2, defRebounding: 2, strength: 1, handle: -1 },
  C: { shortRange: 1, dunking: 1, interiorDefense: 2, blocking: 2, offRebounding: 2, defRebounding: 2, strength: 2, handle: -2, threePoint: -1 },
};

const POSITION_START_BONUSES: Record<Position, Partial<Record<keyof PlayerAttributes, number>>> = {
  PG: { passing: 1, vision: 1, handle: 1 },
  SG: { threePoint: 1, midrange: 1 },
  SF: { shortRange: 1, speed: 1, perimeterDefense: 1 },
  PF: { dunking: 1, interiorDefense: 1, defRebounding: 1 },
  C: { interiorDefense: 1, blocking: 1, defRebounding: 1, strength: 1 },
};

const SECONDARY_POSITION_SCALE = 0.5;

const capitalize = (value: string): string => {
  if (value.length === 0) {
    return value;
  }
  return `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`;
};

const sanitizeNamePart = (value: string, fallback: string): string => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return fallback;
  }
  return trimmed
    .split(/\s+/)
    .map((part) => capitalize(part.replace(/[^a-zA-Z'-]/g, "")))
    .filter((part) => part.length > 0)
    .join(" ")
    .trim() || fallback;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const asRating = (value: number): PlayerAttributes["shortRange"] =>
  clamp(Math.round(value), 0, 99) as PlayerAttributes["shortRange"];

const asCap = (value: number): PlayerAttributes["shortRange"] =>
  clamp(Math.round(value), 40, 99) as PlayerAttributes["shortRange"];

const clampAttribute = (value: number): PlayerAttributes["shortRange"] =>
  clamp(Math.round(value), 0, 99) as PlayerAttributes["shortRange"];

const getAgeStartedBand = (ageStarted: number): PlayerIdentity["ageStartedBand"] => {
  if (ageStarted <= 6) {
    return "EARLY";
  }
  if (ageStarted <= 9) {
    return "STANDARD";
  }
  return "LATE";
};

const getGrowthCurveFromBand = (band: PlayerIdentity["ageStartedBand"]): GrowthCurve => {
  if (band === "EARLY") {
    return "EARLY_STARTER";
  }
  if (band === "LATE") {
    return "LATE_BLOOMER";
  }
  return "STEADY";
};

export const getBasketballBackgroundFromAgeStarted = (ageStarted: number): BasketballBackground =>
  getAgeStartedBand(ageStarted) === "EARLY"
    ? "EARLY_STARTER"
    : getAgeStartedBand(ageStarted) === "LATE"
      ? "LATE_BLOOMER"
      : "BALANCED_PATH";

export const getRepresentativeAgeStarted = (basketballBackground: BasketballBackground): number =>
  BASKETBALL_BACKGROUND_BY_ID[basketballBackground].representativeAgeStarted;

const resolveBasketballBackground = (
  input: Pick<BackstoryInput | BuildBackstoryInput, "ageStarted" | "basketballBackground">,
): {
  ageStarted: number;
  ageStartedBand: PlayerIdentity["ageStartedBand"];
  basketballBackground: BasketballBackground;
  growthCurve: GrowthCurve;
} => {
  if (input.basketballBackground) {
    const option = BASKETBALL_BACKGROUND_BY_ID[input.basketballBackground];
    return {
      ageStarted: option.representativeAgeStarted,
      ageStartedBand: option.ageStartedBand,
      basketballBackground: option.id,
      growthCurve: option.growthCurve,
    };
  }

  const ageStarted = clamp(Math.round(input.ageStarted), AGE_STARTED_MIN, AGE_STARTED_MAX);
  const ageStartedBand = getAgeStartedBand(ageStarted);
  const growthCurve = getGrowthCurveFromBand(ageStartedBand);
  return {
    ageStarted,
    ageStartedBand,
    basketballBackground: getBasketballBackgroundFromAgeStarted(ageStarted),
    growthCurve,
  };
};

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

const combineBonuses = (
  ...sources: Array<Partial<Record<keyof PlayerAttributes, number>>>
): Partial<Record<keyof PlayerAttributes, number>> => {
  const combined: Partial<Record<keyof PlayerAttributes, number>> = {};
  for (const source of sources) {
    for (const key of ALL_ATTRIBUTE_KEYS) {
      combined[key] = (combined[key] ?? 0) + (source[key] ?? 0);
    }
  }
  return combined;
};

const scaleBonus = (
  source: Partial<Record<keyof PlayerAttributes, number>>,
  factor: number,
): Partial<Record<keyof PlayerAttributes, number>> => {
  const scaled: Partial<Record<keyof PlayerAttributes, number>> = {};
  for (const key of ALL_ATTRIBUTE_KEYS) {
    const value = source[key];
    if (value !== undefined) {
      scaled[key] = Math.round(value * factor);
    }
  }
  return scaled;
};

/**
 * Internal compatibility fallback for player state shape.
 *
 * Builder-created players do not choose a secondary position. Future coaching
 * logic should infer real positional flexibility from size, attributes, role,
 * roster context, and development.
 */
export const getDefaultSecondaryPosition = (primaryPosition: Position): Position => {
  const defaults: Record<Position, Position> = {
    PG: "SG",
    SG: "PG",
    SF: "PF",
    PF: "C",
    C: "PF",
  };
  return defaults[primaryPosition];
};

const getCurveLabel = (growthCurve: GrowthCurve): string => {
  if (growthCurve === "EARLY_STARTER") {
    return "Early Starter";
  }
  if (growthCurve === "LATE_BLOOMER") {
    return "Late Bloomer";
  }
  return "Balanced Path";
};

/**
 * Lightweight deterministic PRNG (LCG).
 *
 * Same seed => same random sequence, which guarantees repeatable backstory generation
 * (potential roll, resulting tier, and derived caps) for identical inputs.
 */
const createSeededRng = (seed: number): (() => number) => {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/**
 * Weighted potential roll:
 * - 10%: 90-97
 * - 30%: 80-89
 * - 45%: 65-79
 * - 15%: 55-64
 */
const rollPotential = (rng: () => number): number => {
  const roll = rng();
  if (roll < 0.1) {
    return 90 + Math.floor(rng() * 8);
  }
  if (roll < 0.4) {
    return 80 + Math.floor(rng() * 10);
  }
  if (roll < 0.85) {
    return 65 + Math.floor(rng() * 15);
  }
  return 55 + Math.floor(rng() * 10);
};

const buildDisplayName = (firstName: string, lastName: string): string => `${firstName} ${lastName}`.trim();

const getPrimaryBonus = (attribute: keyof PlayerAttributes, archetype: PlayerIdentity["archetype"]): number => {
  const primaries = getLegacyArchetypePrimaryAttributes(archetype);
  return primaries.includes(attribute) ? 2 : 0;
};

const buildCapTable = (
  archetype: PlayerIdentity["archetype"],
  potential: number,
  frame: PlayerIdentity["bodyFrame"],
  growthCurve: GrowthCurve,
  primaryPosition: Position,
  secondaryPosition: Position,
  heightPreset: HeightPreset,
  weightPreset: WeightPreset,
  secondaryPositionScale = SECONDARY_POSITION_SCALE,
): PlayerAttributes => {
  const archetypeBaseCaps = getLegacyArchetypeBaseCaps(archetype);
  const frameBonus = FRAME_BONUSES[frame];
  const curveBonus = CURVE_CAP_BONUSES[growthCurve];
  const primaryPositionBonus = POSITION_CAP_BONUSES[primaryPosition];
  const secondaryPositionBonus = scaleBonus(POSITION_CAP_BONUSES[secondaryPosition], secondaryPositionScale);
  // Exact body values are mapped to presets first, then presets apply small cap deltas.
  const heightBonus = HEIGHT_PRESET_CONFIG[heightPreset].capBonus;
  const weightBonus = WEIGHT_PRESET_CONFIG[weightPreset].capBonus;
  const buildBonus = combineBonuses(primaryPositionBonus, secondaryPositionBonus, heightBonus, weightBonus);
  const potentialBonus = getPotentialBonus(potential);

  const caps = {} as PlayerAttributes;
  for (const key of ALL_ATTRIBUTE_KEYS) {
    const value =
      archetypeBaseCaps[key] +
      potentialBonus +
      (frameBonus[key] ?? 0) +
      (curveBonus[key] ?? 0) +
      (buildBonus[key] ?? 0) +
      getPrimaryBonus(key, archetype);
    caps[key] = asCap(value) as PlayerAttributes[typeof key];
  }
  return caps;
};

const buildStartingAttributes = (
  archetype: PlayerIdentity["archetype"],
  ageStartedBand: PlayerIdentity["ageStartedBand"],
  frame: PlayerIdentity["bodyFrame"],
  primaryPosition: Position,
  secondaryPosition: Position,
  heightPreset: HeightPreset,
  weightPreset: WeightPreset,
  caps: PlayerAttributes,
): PlayerAttributes => {
  const base = getLegacyArchetypeStartDefaults(archetype);
  const frameBonus = FRAME_BONUSES[frame];
  const ageOffset = AGE_BAND_OFFSETS[ageStartedBand];
  const primaryPositionBonus = POSITION_START_BONUSES[primaryPosition];
  const secondaryPositionBonus = scaleBonus(POSITION_START_BONUSES[secondaryPosition], SECONDARY_POSITION_SCALE);
  const heightBonus = HEIGHT_PRESET_CONFIG[heightPreset].startBonus;
  const weightBonus = WEIGHT_PRESET_CONFIG[weightPreset].startBonus;
  const buildBonus = combineBonuses(primaryPositionBonus, secondaryPositionBonus, heightBonus, weightBonus);
  const attributes = {} as PlayerAttributes;

  for (const key of ALL_ATTRIBUTE_KEYS) {
    const rawValue = base[key] + ageOffset + (frameBonus[key] ?? 0) + (buildBonus[key] ?? 0);
    const clamped = asRating(rawValue);
    attributes[key] = Math.min(clamped, caps[key]) as PlayerAttributes[typeof key];
  }

  return attributes;
};

/**
 * Returns player-facing growth copy for a curve key.
 */
export const getBackstoryGrowthOutlook = (growthCurve: GrowthCurve): string => GROWTH_OUTLOOK_BY_CURVE[growthCurve];

/**
 * Generates a stable seed from user-facing builder inputs.
 *
 * Seed effects:
 * - Drives deterministic RNG in `generateBackstoryFromInput`
 * - Controls hidden potential roll and resulting public tier
 * - Ensures Step 5 preview can match persisted career when same seed is reused
 */
export const createBackstorySeed = (input: BackstoryInput): number =>
  hashString(
    [
      input.firstName.trim().toLowerCase(),
      input.lastName.trim().toLowerCase(),
      input.stateCode.trim().toLowerCase(),
      input.citySlug.trim().toLowerCase(),
      input.archetype,
      input.primaryPosition,
      input.secondaryPosition,
      input.ageStarted,
      input.bodyFrame,
      input.dominantHand,
      input.height.feet,
      input.height.inches,
      input.weightLbs,
    ].join("|"),
  );

export const createBuildBackstorySeed = (input: BuildBackstoryInput): number =>
  hashString(
    [
      input.firstName.trim().toLowerCase(),
      input.lastName.trim().toLowerCase(),
      input.stateCode.trim().toLowerCase(),
      input.citySlug.trim().toLowerCase(),
      input.primaryPosition,
      input.bodyFrame,
      input.dominantHand,
      input.height.feet,
      input.height.inches,
      input.weightLbs,
      input.startingArchetypeId ?? input.archetypeId ?? "",
      ...(input.publicAttributes
        ? PUBLIC_ATTRIBUTE_KEYS.map((key) => input.publicAttributes?.[key] ?? BASE_PUBLIC_ATTRIBUTES[key])
        : ALL_ATTRIBUTE_KEYS.map((key) => input.buildAttributes?.[key] ?? 0)),
    ].join("|"),
  );

const clampAttributesToCaps = (attributes: PlayerAttributes, caps: PlayerAttributes): PlayerAttributes => {
  const clamped = {} as PlayerAttributes;

  for (const key of ALL_ATTRIBUTE_KEYS) {
    clamped[key] = Math.min(clampAttribute(attributes[key]), caps[key]) as PlayerAttributes[typeof key];
  }

  return clamped;
};

export const buildAgeAdjustedBuildAttributes = (
  attributes: PlayerAttributes,
  ageStartedBand: PlayerIdentity["ageStartedBand"],
  caps: PlayerAttributes,
): PlayerAttributes => {
  const ageOffset = AGE_BAND_OFFSETS[ageStartedBand];
  const adjusted = {} as PlayerAttributes;

  for (const key of ALL_ATTRIBUTE_KEYS) {
    const clamped = clampAttribute(attributes[key] + ageOffset);
    adjusted[key] = Math.min(clamped, caps[key]) as PlayerAttributes[typeof key];
  }

  return adjusted;
};

const buildBuilderProfile = (
  attributes: PlayerAttributes,
  caps: PlayerAttributes,
  position: Position,
): GeneratedBadgeProfile => {
  const classification = classifyBuilderBuild(attributes, position);
  return {
    classification,
    badges: resolveBuilderBadges({
      attributes,
      caps,
      classification,
    }),
  };
};

export const deriveGeneratedBadgeProfile = (
  attributes: PlayerAttributes,
  caps: PlayerAttributes,
  position: Position,
): GeneratedBadgeProfile => buildBuilderProfile(attributes, caps, position);

/**
 * Generates identity, DNA, and starting attributes from builder input.
 *
 * When `seedOverride` is provided, output is fully deterministic and should match
 * preview/start-career flows exactly for the same input+seed.
 */
export const generateBackstoryFromInput = (
  rawInput: BackstoryInput,
  options: { seedOverride?: number } = {},
): GeneratedBackstory => {
  const firstName = sanitizeNamePart(rawInput.firstName, "Unnamed");
  const lastName = sanitizeNamePart(rawInput.lastName, "Prospect");
  const hometown = resolveHometown(rawInput.stateCode, rawInput.citySlug);
  const { ageStarted, ageStartedBand, basketballBackground, growthCurve } = resolveBasketballBackground(rawInput);
  const normalizedHeight = clampHeight(rawInput.height);
  const normalizedWeight = clampWeight(rawInput.weightLbs);
  const heightPreset = toHeightPreset(normalizedHeight);
  const weightPreset = toWeightPreset(normalizedWeight);
  // Explicit override is used by preview/start-career flow to lock identical outcomes.
  const generationSeed = options.seedOverride ?? createBackstorySeed({ ...rawInput, firstName, lastName, ageStarted });
  const rng = createSeededRng(generationSeed);
  const potential = rollPotential(rng);
  const primaryPosition = rawInput.primaryPosition;
  const secondaryPosition =
    rawInput.secondaryPosition === rawInput.primaryPosition
      ? getDefaultSecondaryPosition(rawInput.primaryPosition)
      : rawInput.secondaryPosition;
  const caps = buildCapTable(
    rawInput.archetype,
    potential,
    rawInput.bodyFrame,
    growthCurve,
    primaryPosition,
    secondaryPosition,
    heightPreset,
    weightPreset,
  );
  const startingAttributes = buildStartingAttributes(
    rawInput.archetype,
    ageStartedBand,
    rawInput.bodyFrame,
    primaryPosition,
    secondaryPosition,
    heightPreset,
    weightPreset,
    caps,
  );
  const identity: PlayerIdentity = {
    firstName,
    lastName,
    displayName: buildDisplayName(firstName, lastName),
    hometown,
    ageStarted,
    ageStartedBand,
    basketballBackground,
    bodyFrame: rawInput.bodyFrame,
    dominantHand: rawInput.dominantHand,
    archetype: rawInput.archetype,
    primaryPosition,
    secondaryPosition,
    height: normalizedHeight,
    weightLbs: normalizedWeight,
  };
  const potentialTier = getPotentialTier(potential);
  const publicAttributes = inferPublicAttributesFromEngine(startingAttributes);
  const fuzzyScoutingSummary = getFuzzyScoutingSummary(potential, growthCurve, publicAttributes);
  const dna: PlayerDNA = {
    potential,
    potentialTier,
    growthCurve,
    generationSeed,
    growthByLeague: GROWTH_BY_CURVE[growthCurve],
    caps,
    growthResidue: {},
    publicTraits: [
      fuzzyScoutingSummary,
      getCurveLabel(growthCurve),
      `${rawInput.bodyFrame} Frame`,
      `${hometown.city} Hooper`,
    ],
    publicAttributes,
    hiddenEngineAttributes: startingAttributes,
    fuzzyScoutingSummary,
    builderProfile: undefined,
  };
  const builderProfile = buildBuilderProfile(
    startingAttributes,
    caps,
    primaryPosition,
  );
  dna.builderProfile = builderProfile;

  return {
    identity,
    dna,
    startingAttributes,
    builderProfile,
  };
};

const getBuildEngineAttributes = (
  input: BuildBackstoryInput,
  normalizedHeight: ExactHeight,
  normalizedWeight: number,
): PlayerAttributes => {
  if (input.publicAttributes) {
    return deriveEngineRatings({
      publicAttributes: input.publicAttributes,
      startingArchetypeId: input.startingArchetypeId ?? DEFAULT_STARTING_ARCHETYPE_ID,
      position: input.primaryPosition,
      height: normalizedHeight,
      weightLbs: normalizedWeight,
      bodyFrame: input.bodyFrame,
    });
  }

  if (input.buildAttributes) {
    return input.buildAttributes;
  }

  return deriveEngineRatings({
    publicAttributes: BASE_PUBLIC_ATTRIBUTES,
    startingArchetypeId: input.startingArchetypeId ?? DEFAULT_STARTING_ARCHETYPE_ID,
    position: input.primaryPosition,
    height: normalizedHeight,
    weightLbs: normalizedWeight,
    bodyFrame: input.bodyFrame,
  });
};

const deriveCompatibilityArchetype = (attributes: PlayerAttributes, position: Position): BuilderClassification =>
  classifyBuilderBuild(attributes, position);

export const generateBackstoryFromBuildInput = (
  rawInput: BuildBackstoryInput,
  options: { seedOverride?: number } = {},
): GeneratedBackstory => {
  const firstName = sanitizeNamePart(rawInput.firstName, "Unnamed");
  const lastName = sanitizeNamePart(rawInput.lastName, "Prospect");
  const hometown = resolveHometown(rawInput.stateCode, rawInput.citySlug);
  const { ageStarted, ageStartedBand, basketballBackground, growthCurve } = resolveBasketballBackground(rawInput);
  const normalizedHeight = clampHeight(rawInput.height);
  const normalizedWeight = clampWeight(rawInput.weightLbs);
  const heightPreset = toHeightPreset(normalizedHeight);
  const weightPreset = toWeightPreset(normalizedWeight);
  const primaryPosition = rawInput.primaryPosition;
  const secondaryPosition = getDefaultSecondaryPosition(primaryPosition);
  const engineBuildAttributes = getBuildEngineAttributes(rawInput, normalizedHeight, normalizedWeight);
  const compatibilityClassification = deriveCompatibilityArchetype(engineBuildAttributes, primaryPosition);
  const compatibilityArchetype = rawInput.startingArchetypeId
    ? legacyArchetypeForStartingArchetype(rawInput.startingArchetypeId)
    : compatibilityClassification.legacyArchetype;
  const generationSeed =
    options.seedOverride ??
    createBuildBackstorySeed({
      ...rawInput,
      firstName,
      lastName,
      ageStarted,
      primaryPosition,
    });
  const rng = createSeededRng(generationSeed);
  const potential = rollPotential(rng);
  const caps = buildCapTable(
    compatibilityArchetype,
    potential,
    rawInput.bodyFrame,
    growthCurve,
    primaryPosition,
    secondaryPosition,
    heightPreset,
    weightPreset,
    0,
  );
  const startingAttributes = buildAgeAdjustedBuildAttributes(engineBuildAttributes, ageStartedBand, caps);
  const builderProfile = buildBuilderProfile(startingAttributes, caps, primaryPosition);
  const publicAttributes: PublicAttributes = rawInput.publicAttributes ?? inferPublicAttributesFromEngine(startingAttributes);
  const startingArchetypeId = rawInput.startingArchetypeId ?? DEFAULT_STARTING_ARCHETYPE_ID;
  const selectedArchetype = STARTING_ARCHETYPES_BY_ID[startingArchetypeId];
  const currentPlaystyle = rawInput.roleLabel ?? getPlaystyleLabel(publicAttributes, primaryPosition, startingArchetypeId);
  const fuzzyScoutingSummary = getFuzzyScoutingSummary(potential, growthCurve, publicAttributes);
  const expectedKeyMoments = getExpectedKeyMoments(startingArchetypeId);
  const identity: PlayerIdentity = {
    firstName,
    lastName,
    displayName: buildDisplayName(firstName, lastName),
    hometown,
    ageStarted,
    ageStartedBand,
    basketballBackground,
    bodyFrame: rawInput.bodyFrame,
    dominantHand: rawInput.dominantHand,
    archetype: builderProfile.classification.legacyArchetype,
    archetypeId: rawInput.archetypeId ?? startingArchetypeId,
    archetypeLabel: rawInput.archetypeLabel ?? selectedArchetype.label,
    roleLabel: currentPlaystyle,
    startingArchetypeId,
    currentPlaystyle,
    publicAttributes,
    fuzzyScoutingSummary,
    primaryPosition,
    secondaryPosition,
    height: normalizedHeight,
    weightLbs: normalizedWeight,
  };
  const potentialTier = getPotentialTier(potential);
  const dna: PlayerDNA = {
    potential,
    potentialTier,
    growthCurve,
    generationSeed,
    growthByLeague: GROWTH_BY_CURVE[growthCurve],
    caps,
    growthResidue: {},
    publicTraits: [
      fuzzyScoutingSummary,
      getCurveLabel(growthCurve),
      `${rawInput.bodyFrame} Frame`,
      `${hometown.city} Hooper`,
    ],
    startingArchetypeId,
    currentPlaystyle,
    publicAttributes,
    hiddenEngineAttributes: startingAttributes,
    fuzzyScoutingSummary,
    expectedKeyMoments,
    builderProfile: undefined,
  };
  dna.builderProfile = builderProfile;

  return {
    identity,
    dna,
    startingAttributes,
    builderProfile,
  };
};

const splitDisplayName = (name: string): { firstName: string; lastName: string } => {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { firstName: "Legacy", lastName: "Prospect" };
  }
  const [first, ...rest] = trimmed.split(/\s+/);
  return {
    firstName: sanitizeNamePart(first, "Legacy"),
    lastName: sanitizeNamePart(rest.join(" "), "Prospect"),
  };
};

/**
 * Backfills modern backstory input from legacy player data for migration flows.
 *
 * Returned values are deterministic from legacy fields + stable fallbacks so
 * rehydration does not depend on runtime randomness.
 */
export const synthesizeBackstoryInputFromLegacy = (player: LegacyPlayerStateInput): BackstoryInput => {
  const name = splitDisplayName(player.name);
  const seed = hashString(`${player.id}|${player.name}|${player.archetype}`);
  const defaultStateCode = getDefaultStateCode();
  const legacyHometown =
    player.identity?.hometown?.slug
      ? findCityByLegacySlug(player.identity.hometown.slug)
      : undefined;
  const stateCode = player.identity?.hometown?.stateCode ?? legacyHometown?.stateCode ?? defaultStateCode;
  const fallbackCity = getDefaultCityForState(stateCode);
  const citySlug = legacyHometown?.slug ?? fallbackCity.slug;
  const ageStarted = AGE_STARTED_MIN + (seed % (AGE_STARTED_MAX - AGE_STARTED_MIN + 1));
  const bodyFrame: PlayerIdentity["bodyFrame"] = seed % 3 === 0 ? "Lean" : seed % 3 === 1 ? "Athletic" : "Stocky";
  const dominantHand: PlayerIdentity["dominantHand"] = seed % 2 === 0 ? "Right" : "Left";
  const primaryPosition = player.position ?? "PG";
  const secondaryPosition = player.secondaryPosition ?? getDefaultSecondaryPosition(primaryPosition);
  const heightPresets: HeightPreset[] = ["5_8_5_10", "5_11_6_1", "6_2_6_4", "6_5_6_7", "6_8_6_10", "6_11_7_1"];
  const weightPresets: WeightPreset[] = ["150_165", "166_180", "181_200", "201_220", "221_245", "246_270"];
  const legacyHeightPreset = (player.identity as { heightPreset?: HeightPreset } | undefined)?.heightPreset ?? heightPresets[seed % heightPresets.length];
  const legacyWeightPreset = (player.identity as { weightPreset?: WeightPreset } | undefined)?.weightPreset ?? weightPresets[seed % weightPresets.length];
  const height: ExactHeight = player.identity?.height ?? heightFromPresetMidpoint(legacyHeightPreset);
  const weightLbs = player.identity?.weightLbs ?? weightFromPresetMidpoint(legacyWeightPreset);

  const compatibilityArchetype = player.archetype as PlayerArchetype;

  return {
    firstName: name.firstName,
    lastName: name.lastName,
    stateCode,
    citySlug,
    archetype: compatibilityArchetype,
    ageStarted,
    bodyFrame,
    dominantHand,
    primaryPosition,
    secondaryPosition,
    height,
    weightLbs,
  };
};

/**
 * Ensures generated caps never drop below already-earned current attributes.
 * Used during migration/rebuild paths to prevent stat regression.
 */
export const enforceCapsAtLeastCurrent = (caps: PlayerAttributes, current: PlayerAttributes): PlayerAttributes => {
  const adjusted = { ...caps };
  for (const key of ALL_ATTRIBUTE_KEYS) {
    adjusted[key] = Math.max(caps[key], current[key]) as PlayerAttributes[typeof key];
  }
  return adjusted;
};
