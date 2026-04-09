import type { PlayerAttributes } from "../src/types/player";
import { classifyBuilderBuild } from "../src/builder/classify";
import { resolveBuilderBadges } from "../src/builder/badges/resolve";

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

describe("Builder badge resolution", () => {
  it("resolves creator guard badges deterministically", () => {
    const attributes = makeAttributes({
      handle: 94,
      passing: 92,
      vision: 88,
      threePoint: 86,
    });
    const classification = classifyBuilderBuild(attributes, "PG");
    const badges = resolveBuilderBadges({ attributes, classification });

    expect(badges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "floor_general", tier: "GOLD" }),
      ]),
    );
  });

  it("resolves shooting wing and interior big badges without archetype input", () => {
    const wing = makeAttributes({
      threePoint: 94,
      midrange: 86,
      handle: 74,
    });
    const big = makeAttributes({
      interiorDefense: 94,
      blocking: 93,
      perimeterDefense: 72,
      stealing: 74,
      offRebounding: 70,
      defRebounding: 78,
      shortRange: 85,
      dunking: 84,
    });

    const wingBadges = resolveBuilderBadges({
      attributes: wing,
      classification: classifyBuilderBuild(wing, "SF"),
    });
    const bigBadges = resolveBuilderBadges({
      attributes: big,
      classification: classifyBuilderBuild(big, "C"),
    });

    expect(wingBadges).toEqual(expect.arrayContaining([expect.objectContaining({ id: "deep_range" })]));
    expect(bigBadges).toEqual(expect.arrayContaining([expect.objectContaining({ id: "anchor" })]));
  });

  it("uses explicit thresholds at the boundary", () => {
    const almost = makeAttributes({
      handle: 83,
      passing: 82,
      vision: 78,
    });
    const threshold = makeAttributes({
      handle: 84,
      passing: 82,
      vision: 78,
    });

    const almostBadges = resolveBuilderBadges({
      attributes: almost,
      classification: classifyBuilderBuild(almost, "PG"),
    });
    const thresholdBadges = resolveBuilderBadges({
      attributes: threshold,
      classification: classifyBuilderBuild(threshold, "PG"),
    });

    expect(almostBadges.find((badge) => badge.id === "floor_general")?.tier).toBe("BRONZE");
    expect(thresholdBadges.find((badge) => badge.id === "floor_general")?.tier).toBe("SILVER");
  });
});
