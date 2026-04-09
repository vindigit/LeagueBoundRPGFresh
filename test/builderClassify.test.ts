import type { PlayerAttributes, Position } from "../src/types/player";
import { classifyBuilderBuild } from "../src/builder/classify";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 60,
  dunking: 60,
  midrange: 60,
  threePoint: 60,
  handle: 60,
  passing: 60,
  vision: 60,
  perimeterDefense: 60,
  interiorDefense: 60,
  stealing: 60,
  blocking: 60,
  offRebounding: 60,
  defRebounding: 60,
  speed: 60,
  strength: 60,
  stamina: 60,
  ...overrides,
});

const classify = (position: Position, overrides: Partial<PlayerAttributes>) =>
  classifyBuilderBuild(makeAttributes(overrides), position);

describe("Builder classification", () => {
  it("emits dual output for a creator guard", () => {
    const classification = classify("PG", {
      handle: 95,
      passing: 94,
      vision: 90,
      threePoint: 84,
      perimeterDefense: 72,
    });

    expect(classification.taxonomy.family).toBe("Creation");
    expect(classification.taxonomy.label).toBe("Primary Creator");
    expect(classification.legacyArchetype).toBe("Playmaker");
  });

  it("maps a scoring wing back to the legacy sharpshooter archetype", () => {
    const classification = classify("SF", {
      threePoint: 95,
      midrange: 90,
      shortRange: 82,
      handle: 78,
    });

    expect(classification.taxonomy.family).toBe("Shooting");
    expect(classification.taxonomy.positionFamily).toBe("Wing");
    expect(classification.legacyArchetype).toBe("Sharpshooter");
  });

  it("maps interior-first big builds to paint beast compatibility", () => {
    const classification = classify("C", {
      shortRange: 92,
      dunking: 90,
      interiorDefense: 94,
      blocking: 95,
      offRebounding: 88,
      defRebounding: 94,
      threePoint: 55,
      handle: 45,
    });

    expect(["Defense", "Rebounding", "Finishing"]).toContain(classification.taxonomy.family);
    expect(classification.legacyArchetype).toBe("Paint Beast");
  });
});
