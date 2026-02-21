import { ARCHETYPE_DEFAULTS } from "../../constants/archetypes";
import type { BackstoryInput, GrowthCurve, Hometown, PlayerDNA, PlayerIdentity } from "../../types/backstory";
import type { LegacyPlayerStateInput, PlayerAttributes } from "../../types/player";
import { ARCHETYPE_BASE_CAPS } from "./constants/archetypeCaps";
import { ARCHETYPE_PRIMARY_ATTRIBUTES } from "./constants/archetypePrimaries";
import { GROWTH_BY_CURVE, GROWTH_OUTLOOK_BY_CURVE } from "./constants/growthCurves";
import { DEFAULT_HOMETOWN, getHometownBySlug } from "./data/hometowns";

export interface GeneratedBackstory {
  identity: PlayerIdentity;
  dna: PlayerDNA;
  startingAttributes: PlayerAttributes;
}

const ALL_ATTRIBUTE_KEYS: ReadonlyArray<keyof PlayerAttributes> = [
  "shooting",
  "finishing",
  "vision",
  "handle",
  "athleticism",
  "defense",
  "rebounding",
  "bbiq",
  "stamina",
];

const AGE_STARTED_MIN = 4;
const AGE_STARTED_MAX = 14;

const AGE_BAND_OFFSETS: Record<PlayerIdentity["ageStartedBand"], number> = {
  EARLY: 2,
  STANDARD: 0,
  LATE: -5,
};

const FRAME_BONUSES: Record<PlayerIdentity["bodyFrame"], Partial<Record<keyof PlayerAttributes, number>>> = {
  Lean: {
    athleticism: 1,
    handle: 1,
    rebounding: -2,
    finishing: -1,
  },
  Athletic: {
    athleticism: 2,
    finishing: 1,
    defense: 1,
  },
  Stocky: {
    rebounding: 2,
    defense: 1,
    finishing: 1,
    handle: -1,
    shooting: -1,
  },
};

const CURVE_CAP_BONUSES: Record<GrowthCurve, Partial<Record<keyof PlayerAttributes, number>>> = {
  EARLY_STARTER: {
    bbiq: 1,
    vision: 1,
    shooting: 1,
  },
  STEADY: {},
  LATE_BLOOMER: {
    finishing: 1,
    athleticism: 1,
    stamina: 1,
  },
};

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

const asRating = (value: number): PlayerAttributes["shooting"] => clamp(Math.round(value), 0, 99) as PlayerAttributes["shooting"];

const asCap = (value: number): PlayerAttributes["shooting"] => clamp(Math.round(value), 60, 99) as PlayerAttributes["shooting"];

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

const getCurveLabel = (growthCurve: GrowthCurve): string => {
  if (growthCurve === "EARLY_STARTER") {
    return "Early Starter";
  }
  if (growthCurve === "LATE_BLOOMER") {
    return "Late Bloomer";
  }
  return "Steady Climber";
};

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

const resolveHometown = (hometownSlug: string): Hometown => getHometownBySlug(hometownSlug) ?? DEFAULT_HOMETOWN;

const buildDisplayName = (firstName: string, lastName: string): string => `${firstName} ${lastName}`.trim();

const getPrestigeBonus = (hometown: Hometown): number => hometown.prestige - 3;

const getPrimaryBonus = (attribute: keyof PlayerAttributes, archetype: PlayerIdentity["archetype"]): number => {
  const primaries = ARCHETYPE_PRIMARY_ATTRIBUTES[archetype];
  return primaries.includes(attribute) ? 2 : 0;
};

const buildCapTable = (
  archetype: PlayerIdentity["archetype"],
  potential: number,
  hometown: Hometown,
  frame: PlayerIdentity["bodyFrame"],
  growthCurve: GrowthCurve,
): PlayerAttributes => {
  const archetypeBaseCaps = ARCHETYPE_BASE_CAPS[archetype];
  const frameBonus = FRAME_BONUSES[frame];
  const curveBonus = CURVE_CAP_BONUSES[growthCurve];
  const potentialBonus = getPotentialBonus(potential);
  const prestigeBonus = getPrestigeBonus(hometown);

  const caps = {} as PlayerAttributes;
  for (const key of ALL_ATTRIBUTE_KEYS) {
    const value =
      archetypeBaseCaps[key] +
      potentialBonus +
      prestigeBonus +
      (frameBonus[key] ?? 0) +
      (curveBonus[key] ?? 0) +
      getPrimaryBonus(key, archetype);
    caps[key] = asCap(value) as PlayerAttributes[typeof key];
  }
  return caps;
};

const buildStartingAttributes = (
  archetype: PlayerIdentity["archetype"],
  ageStartedBand: PlayerIdentity["ageStartedBand"],
  frame: PlayerIdentity["bodyFrame"],
  caps: PlayerAttributes,
): PlayerAttributes => {
  const base = ARCHETYPE_DEFAULTS[archetype];
  const frameBonus = FRAME_BONUSES[frame];
  const ageOffset = AGE_BAND_OFFSETS[ageStartedBand];
  const attributes = {} as PlayerAttributes;

  for (const key of ALL_ATTRIBUTE_KEYS) {
    const rawValue = base[key] + ageOffset + (frameBonus[key] ?? 0);
    const clamped = asRating(rawValue);
    attributes[key] = Math.min(clamped, caps[key]) as PlayerAttributes[typeof key];
  }

  return attributes;
};

export const getBackstoryGrowthOutlook = (growthCurve: GrowthCurve): string => GROWTH_OUTLOOK_BY_CURVE[growthCurve];

export const createBackstorySeed = (input: BackstoryInput): number =>
  hashString(
    [
      input.firstName.trim().toLowerCase(),
      input.lastName.trim().toLowerCase(),
      input.hometownSlug.trim().toLowerCase(),
      input.archetype,
      input.ageStarted,
      input.bodyFrame,
      input.dominantHand,
    ].join("|"),
  );

export const generateBackstoryFromInput = (
  rawInput: BackstoryInput,
  options: { seedOverride?: number } = {},
): GeneratedBackstory => {
  const firstName = sanitizeNamePart(rawInput.firstName, "Unnamed");
  const lastName = sanitizeNamePart(rawInput.lastName, "Prospect");
  const hometown = resolveHometown(rawInput.hometownSlug);
  const ageStarted = clamp(Math.round(rawInput.ageStarted), AGE_STARTED_MIN, AGE_STARTED_MAX);
  const ageStartedBand = getAgeStartedBand(ageStarted);
  const growthCurve = getGrowthCurveFromBand(ageStartedBand);
  const generationSeed = options.seedOverride ?? createBackstorySeed({ ...rawInput, firstName, lastName, ageStarted });
  const rng = createSeededRng(generationSeed);
  const potential = rollPotential(rng);
  const caps = buildCapTable(rawInput.archetype, potential, hometown, rawInput.bodyFrame, growthCurve);
  const identity: PlayerIdentity = {
    firstName,
    lastName,
    displayName: buildDisplayName(firstName, lastName),
    hometown,
    ageStarted,
    ageStartedBand,
    bodyFrame: rawInput.bodyFrame,
    dominantHand: rawInput.dominantHand,
    archetype: rawInput.archetype,
  };
  const dna: PlayerDNA = {
    potential,
    growthCurve,
    generationSeed,
    growthByLeague: GROWTH_BY_CURVE[growthCurve],
    caps,
    publicTraits: [getCurveLabel(growthCurve), `${rawInput.bodyFrame} Frame`, `${hometown.city} Hooper`],
  };

  return {
    identity,
    dna,
    startingAttributes: buildStartingAttributes(rawInput.archetype, ageStartedBand, rawInput.bodyFrame, caps),
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

export const synthesizeBackstoryInputFromLegacy = (player: LegacyPlayerStateInput): BackstoryInput => {
  const name = splitDisplayName(player.name);
  const seed = hashString(`${player.id}|${player.name}|${player.archetype}`);
  const hometown = DEFAULT_HOMETOWN;
  const ageStarted = AGE_STARTED_MIN + (seed % (AGE_STARTED_MAX - AGE_STARTED_MIN + 1));
  const bodyFrame: PlayerIdentity["bodyFrame"] = seed % 3 === 0 ? "Lean" : seed % 3 === 1 ? "Athletic" : "Stocky";
  const dominantHand: PlayerIdentity["dominantHand"] = seed % 2 === 0 ? "Right" : "Left";

  return {
    firstName: name.firstName,
    lastName: name.lastName,
    hometownSlug: hometown.slug,
    archetype: player.archetype,
    ageStarted,
    bodyFrame,
    dominantHand,
  };
};

export const enforceCapsAtLeastCurrent = (caps: PlayerAttributes, current: PlayerAttributes): PlayerAttributes => {
  const adjusted = { ...caps };
  for (const key of ALL_ATTRIBUTE_KEYS) {
    adjusted[key] = Math.max(caps[key], current[key]) as PlayerAttributes[typeof key];
  }
  return adjusted;
};
