import {
  ATTRIBUTE_PROGRESSION_CURVES,
  getAttributePointCost,
  getAttributeRefundValue,
  getAttributeUpgradeCost,
  solveAffordableTarget,
} from "../src/builder/progression";

describe("Builder progression", () => {
  it("uses deterministic monotonic cost curves", () => {
    for (const curve of Object.values(ATTRIBUTE_PROGRESSION_CURVES)) {
      let previous = 0;
      for (let rating = 0; rating < 99; rating += 1) {
        const cost = getAttributePointCost(curve.attribute, rating);
        expect(cost).toBeGreaterThanOrEqual(previous);
        expect(cost).toBeGreaterThan(0);
        previous = cost;
      }
    }
  });

  it("calculates upgrade and refund costs symmetrically", () => {
    const upgradeCost = getAttributeUpgradeCost("threePoint", 74, 80);
    const refundValue = getAttributeRefundValue("threePoint", 80, 74);

    expect(upgradeCost).toBe(refundValue);
    expect(upgradeCost).toBeGreaterThan(0);
  });

  it("solves the highest affordable target without crossing the cap", () => {
    const target = solveAffordableTarget("handle", 70, 10, 80);
    expect(target).toBeGreaterThan(70);
    expect(target).toBeLessThanOrEqual(80);
    expect(getAttributeUpgradeCost("handle", 70, target)).toBeLessThanOrEqual(10);
    expect(getAttributeUpgradeCost("handle", 70, target + 1)).toBeGreaterThan(10);
  });
});
