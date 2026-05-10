import type { PublicAttributes } from "../src/builder/publicAttributes";
import { getAllPublicAttributesSorted } from "../src/components/playerCardUtils";

describe("playerCardUtils", () => {
  it("returns all 7 public attributes sorted by value descending with player-facing labels", () => {
    const sorted = getAllPublicAttributesSorted({
      shooting: 70,
      finishing: 64,
      playmaking: 72,
      defending: 58,
      rebounding: 56,
      athleticism: 69,
      stamina: 72,
    } satisfies PublicAttributes);

    expect(sorted).toHaveLength(7);
    expect(sorted[0].key).toBe("playmaking");
    expect(sorted[0].value).toBe(72);
    expect(sorted[0].label).toBe("Playmaking");
    expect(sorted[1].key).toBe("stamina");
    expect(sorted[sorted.length - 1].key).toBe("rebounding");
    expect(sorted[sorted.length - 1].label).toBe("Rebounding");
  });
});
