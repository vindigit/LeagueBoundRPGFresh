import type { AttributeGainSource } from "../../../types/backstory";
import { LeagueLevel } from "../../../types/career";
import type { PlayerArchetype, PlayerAttributes } from "../../../types/player";
import { ATTRIBUTE_SOURCE_MULTIPLIERS } from "../constants/attributeGrowthSources";
import {
  NEAR_CAP_DAMPENING,
  PLAYSTYLE_PROFILE_BY_ARCHETYPE,
  PROFILE_ADDITIVE_BIAS,
  PROFILE_ATTRIBUTE_COEFFICIENTS,
} from "../constants/growthModel";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export interface CalculateAttributeGainInput {
  attribute: keyof PlayerAttributes;
  amount: number;
  currentValue: number;
  cap: number;
  source: AttributeGainSource;
  leagueLevel: LeagueLevel;
  growthByLeague: Record<LeagueLevel, number>;
  archetype: PlayerArchetype;
  residue?: number;
}

export interface CalculateAttributeGainResult {
  nextValue: number;
  appliedDelta: number;
  nextResidue: number;
  rawDelta: number;
}

const applyNearCapDampening = (rawDelta: number, currentValue: number, cap: number): number => {
  if (cap <= 0 || rawDelta <= 0) {
    return Math.max(0, rawDelta);
  }

  const capRatio = clamp(currentValue / Math.max(1, cap), 0, 1);
  if (capRatio <= NEAR_CAP_DAMPENING.startRatio) {
    return rawDelta;
  }

  const normalized = (capRatio - NEAR_CAP_DAMPENING.startRatio) / (1 - NEAR_CAP_DAMPENING.startRatio);
  const dampeningFactor = clamp(
    1 - normalized * (1 - NEAR_CAP_DAMPENING.minFactor),
    NEAR_CAP_DAMPENING.minFactor,
    1,
  );

  return rawDelta * dampeningFactor;
};

export const calculateAttributeGain = (input: CalculateAttributeGainInput): CalculateAttributeGainResult => {
  const currentValue = clamp(input.currentValue, 0, 99);
  const cap = clamp(input.cap, 0, 99);
  const baselineResidue = Math.max(0, input.residue ?? 0);

  if (input.amount <= 0) {
    const uncappedNext = clamp(currentValue + input.amount, 0, 99);
    const nextValue = Math.min(uncappedNext, cap);
    return {
      nextValue,
      appliedDelta: nextValue - currentValue,
      nextResidue: baselineResidue,
      rawDelta: input.amount,
    };
  }

  const sourceMultiplier = ATTRIBUTE_SOURCE_MULTIPLIERS[input.source] ?? 1;
  const curveMultiplier = input.growthByLeague[input.leagueLevel] ?? 1;
  const profile = PLAYSTYLE_PROFILE_BY_ARCHETYPE[input.archetype];
  const profileCoefficient = PROFILE_ATTRIBUTE_COEFFICIENTS[profile][input.attribute] ?? 1;
  const additiveBias = PROFILE_ADDITIVE_BIAS[profile][input.attribute] ?? 0;

  const rawDelta = input.amount * sourceMultiplier * curveMultiplier * profileCoefficient + additiveBias;
  const dampenedRawDelta = applyNearCapDampening(rawDelta, currentValue, cap);
  const carry = baselineResidue + Math.max(0, dampenedRawDelta);
  const integerDelta = Math.floor(carry);
  let nextResidue = carry - integerDelta;

  const uncappedNext = clamp(currentValue + integerDelta, 0, 99);
  const nextValue = Math.min(uncappedNext, cap);
  const appliedDelta = nextValue - currentValue;

  if (nextValue >= cap) {
    nextResidue = 0;
  }

  return {
    nextValue,
    appliedDelta,
    nextResidue,
    rawDelta: dampenedRawDelta,
  };
};
