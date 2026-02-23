import { getAllAttributesSorted } from "../src/components/playerCardUtils";

describe("playerCardUtils", () => {
  it("returns all 9 attributes sorted by value descending", () => {
    const sorted = getAllAttributesSorted({
      shooting: 70,
      finishing: 64,
      vision: 61,
      handle: 66,
      athleticism: 72,
      defense: 58,
      rebounding: 54,
      bbiq: 63,
      stamina: 69,
    });

    expect(sorted).toHaveLength(9);
    expect(sorted[0].key).toBe("athleticism");
    expect(sorted[0].value).toBe(72);
    expect(sorted[sorted.length - 1].key).toBe("rebounding");
  });
});
