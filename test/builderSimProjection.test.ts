import { buildSimProjection } from "../src/builder/simProjection";
import type { PlayerAttributes } from "../src/types/player";

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

const project = (overrides: Partial<PlayerAttributes> = {}) =>
  buildSimProjection({
    attributes: makeAttributes(overrides),
    position: "PG",
    caps: makeAttributes({ threePoint: 99, midrange: 99, vision: 99 }),
    height: { feet: 6, inches: 2 },
    weightLbs: 185,
  });

describe("builder sim projection", () => {
  it("raises projected three share when three point increases", () => {
    const baseline = project({ threePoint: 60 });
    const upgraded = project({ threePoint: 82 });

    expect(upgraded.shotProfile.three).toBeGreaterThan(baseline.shotProfile.three);
  });

  it("lowers turnover risk when handle improves", () => {
    const shaky = project({ handle: 45, passing: 55, vision: 55 });
    const secure = project({ handle: 88, passing: 55, vision: 55 });

    expect(shaky.tendencies.turnoverRisk).not.toBe("Low");
    expect(secure.tendencies.turnoverRisk).toBe("Low");
  });

  it("raises rim share from speed and finishing", () => {
    const baseline = project();
    const slasher = project({ speed: 86, shortRange: 86, dunking: 84 });

    expect(slasher.shotProfile.rim).toBeGreaterThan(baseline.shotProfile.rim);
    expect(slasher.tendencies.rimAttempts).toBe("High");
  });

  it("lowers fatigue risk when stamina improves", () => {
    const tired = project({ stamina: 42 });
    const durable = project({ stamina: 90 });

    expect(tired.tendencies.fatigueRisk).toBe("High");
    expect(durable.tendencies.fatigueRisk).toBe("Low");
  });

  it("changes rebound and defensive event labels from ratings", () => {
    const baseline = project();
    const stopper = buildSimProjection({
      attributes: makeAttributes({
      perimeterDefense: 88,
      interiorDefense: 82,
      stealing: 86,
      blocking: 80,
      offRebounding: 84,
      defRebounding: 88,
      strength: 82,
      }),
      position: "C",
      caps: makeAttributes(),
      height: { feet: 6, inches: 11 },
      weightLbs: 245,
    });

    expect(stopper.tendencies.defensiveEvents).toBe("High");
    expect(stopper.tendencies.reboundInvolvement).toBe("High");
    expect(stopper.tendencies.defensiveEvents).not.toBe(baseline.tendencies.defensiveEvents);
  });

  it("keeps all-60 PG balanced with no standout strengths", () => {
    const projection = project();

    expect(projection.projectedRole).toBe("Balanced Guard");
    expect(projection.classification.taxonomy.hasStandoutStrength).toBe(false);
    expect(projection.identityNote).toContain("No standout strengths yet");
  });

  it("reports nearby badge thresholds from the catalog", () => {
    const projection = project({ threePoint: 75, midrange: 72, vision: 68 });

    expect(projection.badgeWatch.some((badge) => badge.label === "Catch and Shoot" && badge.status === "nearby")).toBe(true);
    expect(projection.badgeWatch.some((badge) => badge.label === "Deep Range" && badge.status === "nearby")).toBe(true);
  });
});
