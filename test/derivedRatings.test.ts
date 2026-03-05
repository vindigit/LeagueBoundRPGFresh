import { computeDerivedRatings, computeOverall } from "../src/builder/derivedRatings";
import type { PlayerAttributes } from "../src/types/player";

const makeAttributes = (value: number): PlayerAttributes => ({
  shortRange: value,
  dunking: value,
  midrange: value,
  threePoint: value,
  handle: value,
  passing: value,
  vision: value,
  perimeterDefense: value,
  interiorDefense: value,
  stealing: value,
  blocking: value,
  offRebounding: value,
  defRebounding: value,
  speed: value,
  strength: value,
  stamina: value,
});

describe("computeDerivedRatings", () => {
  it("returns all category ratings + ovr, each in 0-99", () => {
    const attrs = makeAttributes(73);
    const ratings = computeDerivedRatings(attrs, "SF");

    expect(Object.keys(ratings)).toEqual([
      "finishingRating",
      "shootingRating",
      "playmakingRating",
      "defenseRating",
      "reboundingRating",
      "physicalRating",
      "ovr",
    ]);

    for (const value of Object.values(ratings)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(99);
    }
  });

  it("uses position weighting for overall", () => {
    const attrs: PlayerAttributes = {
      shortRange: 62,
      dunking: 58,
      midrange: 71,
      threePoint: 76,
      handle: 92,
      passing: 94,
      vision: 90,
      perimeterDefense: 84,
      interiorDefense: 38,
      stealing: 82,
      blocking: 35,
      offRebounding: 32,
      defRebounding: 36,
      speed: 88,
      strength: 50,
      stamina: 84,
    };

    const pg = computeDerivedRatings(attrs, "PG");
    const c = computeDerivedRatings(attrs, "C");
    expect(pg.ovr).toBeGreaterThan(c.ovr);
  });

  it("returns all zeros when attributes are all zero", () => {
    const ratings = computeDerivedRatings(makeAttributes(0), "PF");
    for (const value of Object.values(ratings)) {
      expect(value).toBe(0);
    }
  });

  it("returns all 99s when attributes are all 99", () => {
    const ratings = computeDerivedRatings(makeAttributes(99), "PG");
    for (const value of Object.values(ratings)) {
      expect(value).toBe(99);
    }
  });

  it("computeOverall matches computeDerivedRatings().ovr", () => {
    const attrs = makeAttributes(81);
    expect(computeOverall(attrs, "SG")).toBe(computeDerivedRatings(attrs, "SG").ovr);
  });
});
