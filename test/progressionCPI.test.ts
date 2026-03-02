import {
  CPI_TARGET_BAND,
  calculateCpi,
  getCpiRatio,
  isCpiRatioWithinTargetBand,
  violatesCpiDominanceGuard,
} from "../src/features/backstory/constants/growthModel";

describe("Progression CPI utilities", () => {
  it("calculates CPI with configured weights", () => {
    const cpi = calculateCpi({
      throughputIndex: 1.3,
      survivabilityIndex: 1.2,
      economyIndex: 1.1,
    });

    expect(cpi).toBeCloseTo(1.23, 5);
  });

  it("evaluates target band and dominance guard deterministically", () => {
    const ratioInBand = getCpiRatio(1.28, 1);
    expect(isCpiRatioWithinTargetBand(ratioInBand)).toBe(true);
    expect(violatesCpiDominanceGuard(ratioInBand)).toBe(false);

    const ratioAboveDominance = getCpiRatio(1.45, 1);
    expect(isCpiRatioWithinTargetBand(ratioAboveDominance)).toBe(false);
    expect(violatesCpiDominanceGuard(ratioAboveDominance)).toBe(true);

    expect(CPI_TARGET_BAND.min).toBe(1.25);
    expect(CPI_TARGET_BAND.max).toBe(1.35);
    expect(CPI_TARGET_BAND.dominanceMax).toBe(1.4);
  });
});
