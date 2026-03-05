import { LeagueLevel } from "../../../types/career";
import type { AttributeGainSource, GrowthCurve } from "../../../types/backstory";
import type { PlayerArchetype, PlayerAttributes } from "../../../types/player";

export type PlaystyleProfile =
  | "SLASHER_INSIDE_FINISHER"
  | "PERIMETER_SHOT_CREATOR"
  | "PRIMARY_PLAYMAKER"
  | "DEFENSIVE_ANCHOR_REBOUNDER"
  | "BALANCED_CONTROL";

export const PLAYSTYLE_PROFILE_BY_ARCHETYPE: Record<PlayerArchetype, PlaystyleProfile> = {
  Slasher: "SLASHER_INSIDE_FINISHER",
  Sharpshooter: "PERIMETER_SHOT_CREATOR",
  Playmaker: "PRIMARY_PLAYMAKER",
  "Lockdown Defender": "DEFENSIVE_ANCHOR_REBOUNDER",
  "Paint Beast": "DEFENSIVE_ANCHOR_REBOUNDER",
  "Stretch Big": "BALANCED_CONTROL",
};

export const GROWTH_CURVE_MULTIPLIERS: Record<GrowthCurve, Record<LeagueLevel, number>> = {
  EARLY_STARTER: {
    [LeagueLevel.MIDDLE_SCHOOL]: 1.32,
    [LeagueLevel.HIGH_SCHOOL]: 1.0,
    [LeagueLevel.COLLEGE]: 0.82,
    [LeagueLevel.PRO]: 0.72,
  },
  STEADY: {
    [LeagueLevel.MIDDLE_SCHOOL]: 1.0,
    [LeagueLevel.HIGH_SCHOOL]: 1.0,
    [LeagueLevel.COLLEGE]: 1.0,
    [LeagueLevel.PRO]: 1.0,
  },
  LATE_BLOOMER: {
    [LeagueLevel.MIDDLE_SCHOOL]: 0.72,
    [LeagueLevel.HIGH_SCHOOL]: 1.08,
    [LeagueLevel.COLLEGE]: 1.24,
    [LeagueLevel.PRO]: 1.34,
  },
};

export const PROFILE_ATTRIBUTE_COEFFICIENTS: Record<PlaystyleProfile, Record<keyof PlayerAttributes, number>> = {
  SLASHER_INSIDE_FINISHER: {
    shortRange: 1.22,
    dunking: 1.28,
    midrange: 0.82,
    threePoint: 0.82,
    handle: 1.0,
    passing: 0.9,
    vision: 0.92,
    perimeterDefense: 0.96,
    interiorDefense: 1.02,
    stealing: 1.0,
    blocking: 1.02,
    offRebounding: 1.06,
    defRebounding: 1.06,
    speed: 1.22,
    strength: 1.18,
    stamina: 1.08,
  },
  PERIMETER_SHOT_CREATOR: {
    shortRange: 0.9,
    dunking: 0.78,
    midrange: 1.22,
    threePoint: 1.3,
    handle: 1.12,
    passing: 1.02,
    vision: 1.06,
    perimeterDefense: 0.86,
    interiorDefense: 0.78,
    stealing: 0.9,
    blocking: 0.8,
    offRebounding: 0.8,
    defRebounding: 0.8,
    speed: 0.94,
    strength: 0.88,
    stamina: 0.92,
  },
  PRIMARY_PLAYMAKER: {
    shortRange: 0.9,
    dunking: 0.82,
    midrange: 0.96,
    threePoint: 1.0,
    handle: 1.3,
    passing: 1.28,
    vision: 1.16,
    perimeterDefense: 0.9,
    interiorDefense: 0.78,
    stealing: 0.92,
    blocking: 0.78,
    offRebounding: 0.8,
    defRebounding: 0.8,
    speed: 1.0,
    strength: 0.9,
    stamina: 0.98,
  },
  DEFENSIVE_ANCHOR_REBOUNDER: {
    shortRange: 1.0,
    dunking: 1.04,
    midrange: 0.76,
    threePoint: 0.74,
    handle: 0.76,
    passing: 0.82,
    vision: 1.04,
    perimeterDefense: 1.3,
    interiorDefense: 1.38,
    stealing: 1.16,
    blocking: 1.22,
    offRebounding: 1.3,
    defRebounding: 1.38,
    speed: 1.02,
    strength: 1.2,
    stamina: 1.18,
  },
  BALANCED_CONTROL: {
    shortRange: 1.0,
    dunking: 1.0,
    midrange: 1.0,
    threePoint: 1.0,
    handle: 1.0,
    passing: 1.0,
    vision: 1.0,
    perimeterDefense: 1.0,
    interiorDefense: 1.0,
    stealing: 1.0,
    blocking: 1.0,
    offRebounding: 1.0,
    defRebounding: 1.0,
    speed: 1.0,
    strength: 1.0,
    stamina: 1.0,
  },
};

export const PROFILE_ADDITIVE_BIAS: Record<PlaystyleProfile, Partial<Record<keyof PlayerAttributes, number>>> = {
  SLASHER_INSIDE_FINISHER: { shortRange: 0.08, dunking: 0.12, speed: 0.05 },
  PERIMETER_SHOT_CREATOR: { threePoint: 0.12, midrange: 0.08, handle: 0.06 },
  PRIMARY_PLAYMAKER: { passing: 0.14, handle: 0.1, vision: 0.05 },
  DEFENSIVE_ANCHOR_REBOUNDER: { interiorDefense: 0.12, defRebounding: 0.12, stamina: 0.08 },
  BALANCED_CONTROL: {},
};

export const GROWTH_SOURCE_MULTIPLIERS: Record<AttributeGainSource, number> = {
  NARRATIVE: 1.0,
  MATCH_REWARD: 0.9,
  TRAINING: 1.15,
  SYSTEM: 1.0,
};

export const NEAR_CAP_DAMPENING = {
  startRatio: 0.72,
  minFactor: 0.25,
} as const;

export interface CpiComponents {
  throughputIndex: number;
  survivabilityIndex: number;
  economyIndex: number;
}

export const CPI_WEIGHTS = {
  throughput: 0.5,
  survivability: 0.3,
  economy: 0.2,
} as const;

export const CPI_TARGET_BAND = {
  min: 1.25,
  max: 1.35,
  dominanceMax: 1.4,
} as const;

export const CPI_CHECKPOINTS = [
  { label: "L1", cycleCount: 0 },
  { label: "L10", cycleCount: 9 },
  { label: "L30", cycleCount: 29 },
] as const;

export const calculateCpi = (components: CpiComponents): number =>
  CPI_WEIGHTS.throughput * components.throughputIndex +
  CPI_WEIGHTS.survivability * components.survivabilityIndex +
  CPI_WEIGHTS.economy * components.economyIndex;

export const getCpiRatio = (profileCpi: number, controlCpi: number): number =>
  controlCpi > 0 ? profileCpi / controlCpi : 0;

export const isCpiRatioWithinTargetBand = (ratio: number): boolean =>
  ratio >= CPI_TARGET_BAND.min && ratio <= CPI_TARGET_BAND.max;

export const violatesCpiDominanceGuard = (ratio: number): boolean =>
  ratio > CPI_TARGET_BAND.dominanceMax;
