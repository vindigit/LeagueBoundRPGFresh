import { getAllAttributesSorted } from "../src/components/playerCardUtils";

describe("playerCardUtils", () => {
  it("returns all 16 attributes sorted by value descending", () => {
    const sorted = getAllAttributesSorted({
      shortRange: 70,
      dunking: 64,
      midrange: 62,
      threePoint: 68,
      handle: 66,
      passing: 59,
      vision: 61,
      perimeterDefense: 58,
      interiorDefense: 54,
      stealing: 63,
      blocking: 52,
      offRebounding: 56,
      defRebounding: 57,
      speed: 72,
      strength: 60,
      stamina: 69,
    } as any);

    expect(sorted).toHaveLength(16);
    expect(sorted[0].key).toBe("speed");
    expect(sorted[0].value).toBe(72);
    expect(sorted[sorted.length - 1].key).toBe("blocking");
  });
});
