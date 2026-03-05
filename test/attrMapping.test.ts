import type { PlayerAttributes } from "../src/types/player";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 50,
  dunking: 50,
  midrange: 50,
  threePoint: 50,
  handle: 50,
  passing: 50,
  vision: 50,
  perimeterDefense: 50,
  interiorDefense: 50,
  stealing: 50,
  blocking: 50,
  offRebounding: 50,
  defRebounding: 50,
  speed: 50,
  strength: 50,
  stamina: 50,
  ...overrides,
});

describe("PlayerAttributes shape", () => {
  it("contains all canonical 16 attributes", () => {
    const attrs = makeAttributes();
    expect(Object.keys(attrs).sort()).toEqual([
      "blocking",
      "defRebounding",
      "dunking",
      "handle",
      "interiorDefense",
      "midrange",
      "offRebounding",
      "passing",
      "perimeterDefense",
      "shortRange",
      "speed",
      "stamina",
      "stealing",
      "strength",
      "threePoint",
      "vision",
    ].sort());
  });

  it("supports direct per-attribute overrides", () => {
    const attrs = makeAttributes({ threePoint: 99, stamina: 1 });
    expect(attrs.threePoint).toBe(99);
    expect(attrs.stamina).toBe(1);
  });
});
