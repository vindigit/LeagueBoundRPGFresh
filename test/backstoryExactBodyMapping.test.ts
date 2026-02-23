import {
  clampHeight,
  clampWeight,
  heightFromPresetMidpoint,
  toHeightPreset,
  toWeightPreset,
  weightFromPresetMidpoint,
} from "../src/features/backstory/constants/bodyMapping";

describe("Backstory exact body mapping", () => {
  it("clamps out-of-range values", () => {
    expect(clampHeight({ feet: 8, inches: 99 })).toEqual({ feet: 7, inches: 11 });
    expect(clampHeight({ feet: 3, inches: -4 })).toEqual({ feet: 4, inches: 0 });
    expect(clampWeight(999)).toBe(320);
    expect(clampWeight(80)).toBe(110);
  });

  it("maps exact values to nearest presets", () => {
    expect(toHeightPreset({ feet: 6, inches: 2 })).toBe("6_2_6_4");
    expect(toHeightPreset({ feet: 7, inches: 0 })).toBe("6_11_7_1");
    expect(toWeightPreset(173)).toBe("166_180");
    expect(toWeightPreset(260)).toBe("246_270");
  });

  it("provides deterministic midpoint defaults for preset backfills", () => {
    expect(heightFromPresetMidpoint("6_2_6_4")).toEqual({ feet: 6, inches: 3 });
    expect(weightFromPresetMidpoint("181_200")).toBe(191);
  });
});
