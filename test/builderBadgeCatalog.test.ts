import { BUILDER_BADGE_CATALOG } from "../src/builder/badges/catalog";

describe("Builder badge catalog", () => {
  it("contains unique badge ids with deterministic ordering", () => {
    const ids = BUILDER_BADGE_CATALOG.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);

    const sortOrders = BUILDER_BADGE_CATALOG.map((entry) => entry.sortOrder);
    expect(sortOrders).toEqual([...sortOrders].sort((left, right) => left - right));
  });

  it("uses bounded deterministic tier thresholds", () => {
    for (const badge of BUILDER_BADGE_CATALOG) {
      expect(badge.tiers.length).toBeGreaterThan(0);
      for (const tier of badge.tiers) {
        for (const value of Object.values(tier.minAttributes ?? {})) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(99);
        }
        for (const value of Object.values(tier.minCaps ?? {})) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(99);
        }
      }
    }
  });
});
