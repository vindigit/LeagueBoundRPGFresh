import type { ExactHeight, HeightPreset, WeightPreset } from "../../../types/backstory";

const HEIGHT_MIN_TOTAL_INCHES = 4 * 12;
const HEIGHT_MAX_TOTAL_INCHES = 7 * 12 + 11;
const WEIGHT_MIN = 110;
const WEIGHT_MAX = 320;

const heightPresetRanges: Record<HeightPreset, { min: number; max: number; midpoint: number }> = {
  "5_8_5_10": { min: 68, max: 70, midpoint: 69 },
  "5_11_6_1": { min: 71, max: 73, midpoint: 72 },
  "6_2_6_4": { min: 74, max: 76, midpoint: 75 },
  "6_5_6_7": { min: 77, max: 79, midpoint: 78 },
  "6_8_6_10": { min: 80, max: 82, midpoint: 81 },
  "6_11_7_1": { min: 83, max: 85, midpoint: 84 },
};

const weightPresetRanges: Record<WeightPreset, { min: number; max: number; midpoint: number }> = {
  "150_165": { min: 150, max: 165, midpoint: 158 },
  "166_180": { min: 166, max: 180, midpoint: 173 },
  "181_200": { min: 181, max: 200, midpoint: 191 },
  "201_220": { min: 201, max: 220, midpoint: 211 },
  "221_245": { min: 221, max: 245, midpoint: 233 },
  "246_270": { min: 246, max: 270, midpoint: 258 },
};

const toTotalInches = (height: ExactHeight): number => height.feet * 12 + height.inches;
const fromTotalInches = (totalInches: number): ExactHeight => ({
  feet: Math.floor(totalInches / 12),
  inches: totalInches % 12,
});

export const clampHeight = (height: ExactHeight): ExactHeight => {
  const normalizedInches = Math.max(0, Math.round(height.inches));
  const normalizedFeet = Math.max(0, Math.round(height.feet));
  const total = Math.min(
    HEIGHT_MAX_TOTAL_INCHES,
    Math.max(HEIGHT_MIN_TOTAL_INCHES, normalizedFeet * 12 + normalizedInches),
  );
  return fromTotalInches(total);
};

export const clampWeight = (weightLbs: number): number => Math.min(WEIGHT_MAX, Math.max(WEIGHT_MIN, Math.round(weightLbs)));

export const toHeightPreset = (height: ExactHeight): HeightPreset => {
  const total = toTotalInches(clampHeight(height));
  let best: HeightPreset = "6_2_6_4";
  let bestDistance = Number.POSITIVE_INFINITY;

  const presets = Object.keys(heightPresetRanges) as HeightPreset[];
  for (const preset of presets) {
    const distance = Math.abs(total - heightPresetRanges[preset].midpoint);
    if (distance < bestDistance) {
      best = preset;
      bestDistance = distance;
    }
  }

  return best;
};

export const toWeightPreset = (weightLbs: number): WeightPreset => {
  const clamped = clampWeight(weightLbs);
  let best: WeightPreset = "181_200";
  let bestDistance = Number.POSITIVE_INFINITY;

  const presets = Object.keys(weightPresetRanges) as WeightPreset[];
  for (const preset of presets) {
    const distance = Math.abs(clamped - weightPresetRanges[preset].midpoint);
    if (distance < bestDistance) {
      best = preset;
      bestDistance = distance;
    }
  }

  return best;
};

export const heightFromPresetMidpoint = (preset: HeightPreset): ExactHeight => fromTotalInches(heightPresetRanges[preset].midpoint);

export const weightFromPresetMidpoint = (preset: WeightPreset): number => weightPresetRanges[preset].midpoint;
