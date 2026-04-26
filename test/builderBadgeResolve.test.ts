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
      vision: 90,
      shortRange: 88,
      speed: 90,
    });
    const classification = classifyBuilderBuild(attributes, "PG");
    const badges = resolveBuilderBadges({ attributes, classification });

    expect(badges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "floor_general", tier: "GOLD" }),
        expect.objectContaining({ id: "needle_threader", tier: "GOLD" }),
        expect.objectContaining({ id: "quick_first_step", tier: "GOLD" }),
      ]),
    );
  });

  it("resolves shooting wing badges without archetype input", () => {
    const attributes = makeAttributes({
      threePoint: 92,
      midrange: 94,
      shortRange: 88,
      vision: 82,
    });
    const badges = resolveBuilderBadges({
      attributes,
      classification: classifyBuilderBuild(attributes, "SF"),
    });

    expect(badges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "deep_range", tier: "GOLD" }),
        expect.objectContaining({ id: "mid_range_magician", tier: "GOLD" }),
        expect.objectContaining({ id: "catch_and_shoot", tier: "GOLD" }),
      ]),
    );
  });

  it("resolves finishing badges for athletic slashers", () => {
    const attributes = makeAttributes({
      shortRange: 91,
      handle: 89,
      speed: 89,
      dunking: 95,
      strength: 91,
    });
    const badges = resolveBuilderBadges({
      attributes,
      classification: classifyBuilderBuild(attributes, "SG"),
    });

    expect(badges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "rim_pressure", tier: "GOLD" }),
        expect.objectContaining({ id: "slithery", tier: "GOLD" }),
        expect.objectContaining({ id: "posterizer", tier: "GOLD" }),
      ]),
    );
  });

  it("resolves perimeter and team-defense badges for wings", () => {
    const attributes = makeAttributes({
      perimeterDefense: 92,
      interiorDefense: 90,
      stealing: 93,
      blocking: 92,
      speed: 86,
      vision: 85,
    });
    const badges = resolveBuilderBadges({
      attributes,
      classification: classifyBuilderBuild(attributes, "SF"),
    });

    expect(badges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "point_of_attack", tier: "GOLD" }),
        expect.objectContaining({ id: "pickpocket", tier: "GOLD" }),
        expect.objectContaining({ id: "help_defender", tier: "GOLD" }),
        expect.objectContaining({ id: "chase_down", tier: "GOLD" }),
      ]),
    );
  });

  it("resolves rebounding and interior badges for bigs", () => {
    const rebounderAttributes = makeAttributes({
      offRebounding: 89,
      defRebounding: 93,
      strength: 90,
      shortRange: 90,
      interiorDefense: 88,
      speed: 60,
    });
    const anchorAttributes = makeAttributes({
      offRebounding: 60,
      defRebounding: 60,
      strength: 90,
      interiorDefense: 94,
      blocking: 93,
      perimeterDefense: 68,
      speed: 72,
    });
    const rebounderBadges = resolveBuilderBadges({
      attributes: rebounderAttributes,
      classification: classifyBuilderBuild(rebounderAttributes, "C"),
    });
    const anchorBadges = resolveBuilderBadges({
      attributes: anchorAttributes,
      classification: classifyBuilderBuild(anchorAttributes, "C"),
    });

    expect(anchorBadges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "anchor", tier: "GOLD" }),
      ]),
    );
    expect(rebounderBadges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "glass_cleaner", tier: "GOLD" }),
        expect.objectContaining({ id: "box_out_beast", tier: "GOLD" }),
        expect.objectContaining({ id: "putback_boss", tier: "GOLD" }),
      ]),
    );
  });

  it("uses explicit thresholds at the boundary", () => {
    const almost = makeAttributes({
      passing: 85,
      vision: 84,
      handle: 79,
    });
    const threshold = makeAttributes({
      passing: 86,
      vision: 84,
      handle: 80,
    });

    const almostBadges = resolveBuilderBadges({
      attributes: almost,
      classification: classifyBuilderBuild(almost, "PG"),
    });
    const thresholdBadges = resolveBuilderBadges({
      attributes: threshold,
      classification: classifyBuilderBuild(threshold, "PG"),
    });

    expect(almostBadges.find((badge) => badge.id === "needle_threader")?.tier).toBe("BRONZE");
    expect(thresholdBadges.find((badge) => badge.id === "needle_threader")?.tier).toBe("SILVER");
  });
});
