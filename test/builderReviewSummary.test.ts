import { classifyBuilderBuild } from "../src/builder/classify";
import { buildBuilderReviewSummary } from "../src/components/builderReview";
import type { PlayerDNA } from "../src/types/backstory";
import { LeagueLevel } from "../src/types/career";
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

const makeDna = (attributes: PlayerAttributes, badges: NonNullable<PlayerDNA["builderProfile"]>["badges"]): PlayerDNA => ({
  potential: 88,
  potentialTier: "Gold",
  growthCurve: "LATE_BLOOMER",
  generationSeed: 12345,
  growthByLeague: {
    [LeagueLevel.MIDDLE_SCHOOL]: 1,
    [LeagueLevel.HIGH_SCHOOL]: 1,
    [LeagueLevel.COLLEGE]: 1,
    [LeagueLevel.PRO]: 1,
  },
  caps: attributes,
  growthResidue: {},
  publicTraits: [],
  builderProfile: {
    classification: classifyBuilderBuild(attributes, "PG"),
    badges,
  },
});

describe("buildBuilderReviewSummary", () => {
  it("passes through classification, archetype fit, and mapped strengths", () => {
    const attributes = makeAttributes({
      handle: 95,
      passing: 93,
      vision: 91,
      threePoint: 88,
      midrange: 84,
    });

    const summary = buildBuilderReviewSummary(
      makeDna(attributes, [{ id: "floor_general", label: "Floor General", tier: "GOLD", description: "Boosts playmaking." }]),
    );

    expect(summary).not.toBeNull();
    expect(summary?.classification).toBe("Primary Creator");
    expect(summary?.archetypeFit).toBe("Playmaker");
    expect(summary?.topStrengths).toEqual(["Playmaking", "Shooting"]);
    expect(summary?.growthOutlook).toBe("Slow start, big upside later");
  });

  it("provides the empty badge fallback text when no badges are unlocked", () => {
    const attributes = makeAttributes({
      handle: 76,
      passing: 75,
      vision: 75,
    });

    const summary = buildBuilderReviewSummary(makeDna(attributes, []));

    expect(summary?.badges).toHaveLength(0);
    expect(summary?.emptyBadgesLabel).toBe("No badges unlocked at the current build thresholds.");
  });
});
