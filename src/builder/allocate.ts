import type { PlayerAttributes } from "../types/player";
import { ATTRIBUTE_KEYS } from "./caps";
import { getAttributeRefundValue, getAttributeUpgradeCost } from "./progression";

type AttributeKey = keyof PlayerAttributes;

export interface AllocationRequest {
  attributes: PlayerAttributes;
  caps: PlayerAttributes;
  availablePoints: number;
  changes: Partial<Record<AttributeKey, number>>;
  minAttribute?: number;
}

export interface AllocationResult {
  success: boolean;
  attributes: PlayerAttributes;
  spentPoints: number;
  refundedPoints: number;
  netCost: number;
  remainingPoints: number;
  appliedChanges: Partial<Record<AttributeKey, number>>;
  rejectedReasons: string[];
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const toRating = (value: number): PlayerAttributes["shortRange"] =>
  clamp(Math.round(value), 0, 99) as PlayerAttributes["shortRange"];

export const applyAllocation = (request: AllocationRequest): AllocationResult => {
  const minAttribute = clamp(request.minAttribute ?? 25, 0, 99);
  const nextAttributes = { ...request.attributes };
  const appliedChanges: Partial<Record<AttributeKey, number>> = {};
  const rejectedReasons: string[] = [];
  let spentPoints = 0;
  let refundedPoints = 0;

  for (const key of ATTRIBUTE_KEYS) {
    const requestedDelta = Math.trunc(request.changes[key] ?? 0);
    if (requestedDelta === 0) {
      continue;
    }

    const currentValue = request.attributes[key];
    const effectiveCap = Math.max(request.caps[key], currentValue);
    const requestedTarget = currentValue + requestedDelta;
    const normalizedTarget = clamp(requestedTarget, minAttribute, effectiveCap);

    if (normalizedTarget > currentValue) {
      spentPoints += getAttributeUpgradeCost(key, currentValue, normalizedTarget);
    } else if (normalizedTarget < currentValue) {
      refundedPoints += getAttributeRefundValue(key, currentValue, normalizedTarget);
    }

    nextAttributes[key] = toRating(normalizedTarget) as PlayerAttributes[typeof key];
    appliedChanges[key] = normalizedTarget - currentValue;
  }

  const netCost = spentPoints - refundedPoints;
  const remainingPoints = request.availablePoints - netCost;

  if (remainingPoints < 0) {
    rejectedReasons.push(`Allocation overspends available points by ${Math.abs(remainingPoints)}.`);
    return {
      success: false,
      attributes: { ...request.attributes },
      spentPoints: 0,
      refundedPoints: 0,
      netCost: 0,
      remainingPoints: request.availablePoints,
      appliedChanges: {},
      rejectedReasons,
    };
  }

  return {
    success: true,
    attributes: nextAttributes,
    spentPoints,
    refundedPoints,
    netCost,
    remainingPoints,
    appliedChanges,
    rejectedReasons,
  };
};
