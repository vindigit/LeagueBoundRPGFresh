import type { PlayerAttributes } from "../types/player";
import { ATTRIBUTE_KEYS } from "./caps";

type AttributeKey = keyof PlayerAttributes;

export interface CostTier {
  max: number;
  cost: number;
}

export interface AttributeProgressionCurve {
  attribute: AttributeKey;
  tiers: readonly CostTier[];
}

const makeCurve = (attribute: AttributeKey, costs: readonly [number, number, number, number, number]): AttributeProgressionCurve => ({
  attribute,
  tiers: [
    { max: 60, cost: costs[0] },
    { max: 75, cost: costs[1] },
    { max: 85, cost: costs[2] },
    { max: 94, cost: costs[3] },
    { max: 99, cost: costs[4] },
  ],
});

export const ATTRIBUTE_PROGRESSION_CURVES: Record<AttributeKey, AttributeProgressionCurve> = {
  shortRange: makeCurve("shortRange", [1, 2, 3, 4, 5]),
  dunking: makeCurve("dunking", [1, 2, 3, 4, 5]),
  midrange: makeCurve("midrange", [1, 2, 3, 4, 5]),
  threePoint: makeCurve("threePoint", [1, 2, 3, 5, 6]),
  handle: makeCurve("handle", [1, 2, 3, 5, 6]),
  passing: makeCurve("passing", [1, 2, 3, 4, 5]),
  vision: makeCurve("vision", [1, 2, 3, 4, 5]),
  perimeterDefense: makeCurve("perimeterDefense", [1, 2, 3, 4, 5]),
  interiorDefense: makeCurve("interiorDefense", [1, 2, 3, 5, 6]),
  stealing: makeCurve("stealing", [1, 2, 3, 4, 5]),
  blocking: makeCurve("blocking", [1, 2, 3, 5, 6]),
  offRebounding: makeCurve("offRebounding", [1, 2, 3, 4, 5]),
  defRebounding: makeCurve("defRebounding", [1, 2, 3, 4, 5]),
  speed: makeCurve("speed", [1, 2, 3, 5, 6]),
  strength: makeCurve("strength", [1, 2, 3, 4, 5]),
  stamina: makeCurve("stamina", [1, 2, 3, 4, 5]),
};

const clampRating = (rating: number): number => Math.max(0, Math.min(99, Math.round(rating)));

export const getAttributePointCost = (attribute: AttributeKey, fromRating: number): number => {
  const normalizedRating = clampRating(fromRating);
  if (normalizedRating >= 99) {
    return 0;
  }

  const nextRating = normalizedRating + 1;
  const curve = ATTRIBUTE_PROGRESSION_CURVES[attribute];
  return curve.tiers.find((tier) => nextRating <= tier.max)?.cost ?? curve.tiers[curve.tiers.length - 1].cost;
};

export const getAttributeUpgradeCost = (attribute: AttributeKey, fromRating: number, toRating: number): number => {
  const start = clampRating(fromRating);
  const end = clampRating(toRating);
  if (end <= start) {
    return 0;
  }

  let total = 0;
  for (let current = start; current < end; current += 1) {
    total += getAttributePointCost(attribute, current);
  }
  return total;
};

export const getAttributeRefundValue = (attribute: AttributeKey, fromRating: number, toRating: number): number => {
  const start = clampRating(fromRating);
  const end = clampRating(toRating);
  if (end >= start) {
    return 0;
  }

  return getAttributeUpgradeCost(attribute, end, start);
};

export const solveAffordableTarget = (
  attribute: AttributeKey,
  currentRating: number,
  availablePoints: number,
  cap = 99,
): number => {
  const normalizedCurrent = clampRating(currentRating);
  const maxTarget = clampRating(cap);
  let target = normalizedCurrent;
  let remaining = Math.max(0, Math.floor(availablePoints));

  while (target < maxTarget) {
    const pointCost = getAttributePointCost(attribute, target);
    if (pointCost > remaining || pointCost <= 0) {
      break;
    }
    remaining -= pointCost;
    target += 1;
  }

  return target;
};

export const getTotalBuildCost = (attributes: PlayerAttributes, baseline: PlayerAttributes): number =>
  ATTRIBUTE_KEYS.reduce((sum, key) => sum + getAttributeUpgradeCost(key, baseline[key], attributes[key]), 0);
