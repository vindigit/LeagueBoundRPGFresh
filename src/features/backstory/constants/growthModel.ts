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
    shooting: 0.82,
    finishing: 1.28,
    vision: 0.9,
    handle: 1.0,
    athleticism: 1.22,
    defense: 0.96,
    rebounding: 1.06,
    bbiq: 0.92,
    stamina: 1.08,
  },
  PERIMETER_SHOT_CREATOR: {
    shooting: 1.3,
    finishing: 0.84,
    vision: 1.02,
    handle: 1.12,
    athleticism: 0.94,
    defense: 0.86,
    rebounding: 0.8,
    bbiq: 1.06,
    stamina: 0.92,
  },
  PRIMARY_PLAYMAKER: {
    shooting: 0.96,
    finishing: 0.88,
    vision: 1.28,
    handle: 1.3,
    athleticism: 1.0,
    defense: 0.9,
    rebounding: 0.8,
    bbiq: 1.16,
    stamina: 0.98,
  },
  DEFENSIVE_ANCHOR_REBOUNDER: {
    shooting: 0.76,
    finishing: 1.0,
    vision: 0.82,
    handle: 0.76,
    athleticism: 1.02,
    defense: 1.34,
    rebounding: 1.34,
    bbiq: 1.04,
    stamina: 1.18,
  },
  BALANCED_CONTROL: {
    shooting: 1.0,
    finishing: 1.0,
    vision: 1.0,
    handle: 1.0,
    athleticism: 1.0,
    defense: 1.0,
    rebounding: 1.0,
    bbiq: 1.0,
    stamina: 1.0,
  },
};

export const PROFILE_ADDITIVE_BIAS: Record<PlaystyleProfile, Partial<Record<keyof PlayerAttributes, number>>> = {
  SLASHER_INSIDE_FINISHER: { finishing: 0.1, athleticism: 0.05 },
  PERIMETER_SHOT_CREATOR: { shooting: 0.12, handle: 0.06 },
  PRIMARY_PLAYMAKER: { vision: 0.14, handle: 0.1, bbiq: 0.05 },
  DEFENSIVE_ANCHOR_REBOUNDER: { defense: 0.12, rebounding: 0.12, stamina: 0.08 },
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
