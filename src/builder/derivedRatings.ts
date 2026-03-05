import type { PlayerAttributes, Position } from "../types/player";

export interface DerivedRatings {
  finishingRating: number;
  shootingRating: number;
  playmakingRating: number;
  defenseRating: number;
  reboundingRating: number;
  physicalRating: number;
  ovr: number;
}

const clamp0To99 = (n: number): number => Math.max(0, Math.min(99, Math.round(n)));

const weightedAverage = (parts: Array<[value: number, weight: number]>): number => {
  const totalWeight = parts.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight <= 0) {
    return 0;
  }
  const total = parts.reduce((sum, [value, weight]) => sum + value * weight, 0);
  return total / totalWeight;
};

const OVR_WEIGHTS: Record<
  Position,
  {
    finishing: number;
    shooting: number;
    playmaking: number;
    defense: number;
    rebounding: number;
    physical: number;
  }
> = {
  // Lead guards lean on creation and perimeter defense.
  PG: { finishing: 0.12, shooting: 0.18, playmaking: 0.32, defense: 0.2, rebounding: 0.05, physical: 0.13 },
  // Two guards emphasize perimeter scoring.
  SG: { finishing: 0.15, shooting: 0.29, playmaking: 0.22, defense: 0.16, rebounding: 0.05, physical: 0.13 },
  // Wings are intentionally balanced.
  SF: { finishing: 0.18, shooting: 0.21, playmaking: 0.18, defense: 0.18, rebounding: 0.1, physical: 0.15 },
  // Forwards prioritize paint play and rebounding.
  PF: { finishing: 0.21, shooting: 0.13, playmaking: 0.11, defense: 0.21, rebounding: 0.2, physical: 0.14 },
  // Centers are weighted toward interior impact.
  C: { finishing: 0.26, shooting: 0.08, playmaking: 0.08, defense: 0.24, rebounding: 0.24, physical: 0.1 },
};

export const computeDerivedRatings = (attrs: PlayerAttributes, position: Position): DerivedRatings => {
  const finishingRating = clamp0To99(
    weightedAverage([
      [attrs.shortRange, 0.55],
      [attrs.dunking, 0.35],
      [attrs.strength, 0.1],
    ]),
  );

  const shootingRating = clamp0To99(
    weightedAverage([
      [attrs.midrange, 0.4],
      [attrs.threePoint, 0.55],
      [attrs.shortRange, 0.05],
    ]),
  );

  const playmakingRating = clamp0To99(
    weightedAverage([
      [attrs.handle, 0.4],
      [attrs.passing, 0.35],
      [attrs.vision, 0.25],
    ]),
  );

  const defenseRating = clamp0To99(
    weightedAverage([
      [attrs.perimeterDefense, 0.3],
      [attrs.interiorDefense, 0.3],
      [attrs.stealing, 0.2],
      [attrs.blocking, 0.2],
    ]),
  );

  const reboundingRating = clamp0To99(
    weightedAverage([
      [attrs.offRebounding, 0.35],
      [attrs.defRebounding, 0.65],
    ]),
  );

  const physicalRating = clamp0To99(
    weightedAverage([
      [attrs.speed, 0.4],
      [attrs.strength, 0.25],
      [attrs.stamina, 0.35],
    ]),
  );

  const weights = OVR_WEIGHTS[position];
  const ovr = clamp0To99(
    weightedAverage([
      [finishingRating, weights.finishing],
      [shootingRating, weights.shooting],
      [playmakingRating, weights.playmaking],
      [defenseRating, weights.defense],
      [reboundingRating, weights.rebounding],
      [physicalRating, weights.physical],
    ]),
  );

  return {
    finishingRating,
    shootingRating,
    playmakingRating,
    defenseRating,
    reboundingRating,
    physicalRating,
    ovr,
  };
};

export const computeOverall = (attrs: PlayerAttributes, position: Position): number => computeDerivedRatings(attrs, position).ovr;
