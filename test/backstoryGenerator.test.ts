import {
  createBuildBackstorySeed,
  generateBackstoryFromBuildInput,
  generateBackstoryFromInput,
  getRepresentativeAgeStarted,
} from "../src/features/backstory/generator";
import type { BuildBackstoryInput } from "../src/types/backstory";
import type { PlayerAttributes } from "../src/types/player";

const makeBuildAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
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

describe("Backstory generator", () => {
  const baseInput = {
    firstName: "Jordan",
    lastName: "Lewis",
    stateCode: "TX",
    citySlug: "houston-tx",
    archetype: "Playmaker" as const,
    ageStarted: 8,
    bodyFrame: "Athletic" as const,
    dominantHand: "Right" as const,
    primaryPosition: "PG" as const,
    secondaryPosition: "SG" as const,
    height: { feet: 6, inches: 2 } as const,
    weightLbs: 185,
  };

  it("is deterministic for a fixed seed", () => {
    const first = generateBackstoryFromInput(baseInput, { seedOverride: 20260221 });
    const second = generateBackstoryFromInput(baseInput, { seedOverride: 20260221 });

    expect(first.dna.potential).toBe(second.dna.potential);
    expect(first.dna.potentialTier).toBe(second.dna.potentialTier);
    expect(first.dna.growthCurve).toBe(second.dna.growthCurve);
    expect(first.dna.caps).toEqual(second.dna.caps);
    expect(first.dna.growthResidue).toEqual({});
    expect(second.dna.growthResidue).toEqual({});
    expect(first.dna.publicTraits).toEqual(second.dna.publicTraits);
    expect(first.startingAttributes).toEqual(second.startingAttributes);
  });

  it("maps age started bands to growth curves", () => {
    const early = generateBackstoryFromInput({ ...baseInput, ageStarted: 5 }, { seedOverride: 1 });
    const standard = generateBackstoryFromInput({ ...baseInput, ageStarted: 8 }, { seedOverride: 2 });
    const late = generateBackstoryFromInput({ ...baseInput, ageStarted: 12 }, { seedOverride: 3 });

    expect(early.identity.ageStartedBand).toBe("EARLY");
    expect(early.dna.growthCurve).toBe("EARLY_STARTER");
    expect(standard.identity.ageStartedBand).toBe("STANDARD");
    expect(standard.dna.growthCurve).toBe("STEADY");
    expect(late.identity.ageStartedBand).toBe("LATE");
    expect(late.dna.growthCurve).toBe("LATE_BLOOMER");
  });

  it("maps basketball backgrounds to representative age bands and growth curves", () => {
    const early = generateBackstoryFromInput(
      { ...baseInput, ageStarted: 8, basketballBackground: "EARLY_STARTER" },
      { seedOverride: 1 },
    );
    const balanced = generateBackstoryFromInput(
      { ...baseInput, ageStarted: 5, basketballBackground: "BALANCED_PATH" },
      { seedOverride: 2 },
    );
    const late = generateBackstoryFromInput(
      { ...baseInput, ageStarted: 8, basketballBackground: "LATE_BLOOMER" },
      { seedOverride: 3 },
    );

    expect(early.identity.basketballBackground).toBe("EARLY_STARTER");
    expect(early.identity.ageStarted).toBe(getRepresentativeAgeStarted("EARLY_STARTER"));
    expect(early.identity.ageStartedBand).toBe("EARLY");
    expect(early.dna.growthCurve).toBe("EARLY_STARTER");

    expect(balanced.identity.basketballBackground).toBe("BALANCED_PATH");
    expect(balanced.identity.ageStarted).toBe(getRepresentativeAgeStarted("BALANCED_PATH"));
    expect(balanced.identity.ageStartedBand).toBe("STANDARD");
    expect(balanced.dna.growthCurve).toBe("STEADY");

    expect(late.identity.basketballBackground).toBe("LATE_BLOOMER");
    expect(late.identity.ageStarted).toBe(getRepresentativeAgeStarted("LATE_BLOOMER"));
    expect(late.identity.ageStartedBand).toBe("LATE");
    expect(late.dna.growthCurve).toBe("LATE_BLOOMER");
  });

  it("clamps age started to max 12", () => {
    const generated = generateBackstoryFromInput({ ...baseInput, ageStarted: 14 }, { seedOverride: 101 });
    expect(generated.identity.ageStarted).toBe(12);
  });

  it("never generates starting attributes above caps", () => {
    const generated = generateBackstoryFromInput(
      {
        ...baseInput,
        archetype: "Slasher",
        ageStarted: 4,
      },
      { seedOverride: 11 },
    );

    const keys = Object.keys(generated.startingAttributes) as Array<keyof typeof generated.startingAttributes>;
    for (const key of keys) {
      expect(generated.startingAttributes[key] ?? 0).toBeLessThanOrEqual(generated.dna.caps[key] ?? 99);
    }
  });

  it("caps respect a minimum floor of 40 and maximum of 99", () => {
    const generated = generateBackstoryFromInput(
      {
        ...baseInput,
        archetype: "Playmaker",
        ageStarted: 12,
        bodyFrame: "Lean",
      },
      { seedOverride: 20260312 },
    );

    const capKeys = Object.keys(generated.dna.caps) as Array<keyof typeof generated.dna.caps>;
    for (const key of capKeys) {
      expect(generated.dna.caps[key]).toBeGreaterThanOrEqual(40);
      expect(generated.dna.caps[key]).toBeLessThanOrEqual(99);
    }
  });

  it("does not change caps when only city changes within a state", () => {
    const houston = generateBackstoryFromInput({ ...baseInput, citySlug: "houston-tx" }, { seedOverride: 44 });
    const dallas = generateBackstoryFromInput({ ...baseInput, citySlug: "dallas-tx" }, { seedOverride: 44 });
    expect(houston.dna.caps).toEqual(dallas.dna.caps);
  });

  it("maps potential to public tier label", () => {
    const generated = generateBackstoryFromInput(baseInput, { seedOverride: 9 });
    expect(["Bronze", "Silver", "Gold", "Platinum"]).toContain(generated.dna.potentialTier);
    expect(generated.dna.publicTraits.some((trait) => trait.startsWith("Potential Tier:"))).toBe(true);
  });

  it("reroll can change visible tier with different seeds", () => {
    let firstTier = "";
    let secondTier = "";
    for (let seed = 1; seed < 500; seed += 1) {
      const first = generateBackstoryFromInput(baseInput, { seedOverride: seed });
      const second = generateBackstoryFromInput(baseInput, { seedOverride: seed + 5000 });
      if (first.dna.potentialTier !== second.dna.potentialTier) {
        firstTier = first.dna.potentialTier;
        secondTier = second.dna.potentialTier;
        break;
      }
    }
    expect(firstTier.length).toBeGreaterThan(0);
    expect(secondTier.length).toBeGreaterThan(0);
    expect(firstTier).not.toBe(secondTier);
  });

  it("applies age started offsets to build-input starting attributes without mutating the base build", () => {
    const buildAttributes = makeBuildAttributes();
    const originalBuildAttributes = { ...buildAttributes };
    const baseBuildInput: BuildBackstoryInput = {
      firstName: "Builder",
      lastName: "Age",
      stateCode: "TX",
      citySlug: "houston-tx",
      ageStarted: 8,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "PG",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 2 },
      weightLbs: 185,
      buildAttributes,
      archetypeId: "test-profile",
      archetypeLabel: "Test Profile",
      roleLabel: "Test Role",
    };

    const early = generateBackstoryFromBuildInput({ ...baseBuildInput, ageStarted: 5 }, { seedOverride: 20260503 });
    const standard = generateBackstoryFromBuildInput(baseBuildInput, { seedOverride: 20260503 });
    const late = generateBackstoryFromBuildInput({ ...baseBuildInput, ageStarted: 12 }, { seedOverride: 20260503 });

    expect(early.startingAttributes.handle).toBeGreaterThan(standard.startingAttributes.handle);
    expect(late.startingAttributes.handle).toBeLessThan(standard.startingAttributes.handle);
    expect(buildAttributes).toEqual(originalBuildAttributes);

    const keys = Object.keys(early.startingAttributes) as Array<keyof PlayerAttributes>;
    for (const generated of [early, standard, late]) {
      for (const key of keys) {
        expect(generated.startingAttributes[key]).toBeLessThanOrEqual(generated.dna.caps[key]);
      }
    }
  });

  it("keeps build potential seed stable when only background or legacy age changes", () => {
    const buildAttributes = makeBuildAttributes();
    const baseBuildInput: BuildBackstoryInput = {
      firstName: "Builder",
      lastName: "Background",
      stateCode: "TX",
      citySlug: "houston-tx",
      ageStarted: 8,
      basketballBackground: "BALANCED_PATH",
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "SG",
      secondaryPosition: "PG",
      height: { feet: 6, inches: 4 },
      weightLbs: 200,
      buildAttributes,
      archetypeId: "sg_slashing_scorer",
      archetypeLabel: "Slasher",
      roleLabel: "Rim-pressure scorer",
    };

    const earlyInput: BuildBackstoryInput = {
      ...baseBuildInput,
      ageStarted: 6,
      basketballBackground: "EARLY_STARTER",
    };
    const lateInput: BuildBackstoryInput = {
      ...baseBuildInput,
      ageStarted: 11,
      basketballBackground: "LATE_BLOOMER",
    };
    const legacyBaseBuildInput = { ...baseBuildInput };
    delete legacyBaseBuildInput.basketballBackground;
    const legacyLateInput: BuildBackstoryInput = {
      ...legacyBaseBuildInput,
      ageStarted: 12,
    };

    expect(createBuildBackstorySeed(earlyInput)).toBe(createBuildBackstorySeed(baseBuildInput));
    expect(createBuildBackstorySeed(lateInput)).toBe(createBuildBackstorySeed(baseBuildInput));
    expect(createBuildBackstorySeed(legacyLateInput)).toBe(createBuildBackstorySeed(baseBuildInput));

    const seed = createBuildBackstorySeed(baseBuildInput);
    const early = generateBackstoryFromBuildInput(earlyInput, { seedOverride: seed });
    const balanced = generateBackstoryFromBuildInput(baseBuildInput, { seedOverride: seed });
    const late = generateBackstoryFromBuildInput(lateInput, { seedOverride: seed });

    expect(early.dna.potential).toBe(balanced.dna.potential);
    expect(late.dna.potential).toBe(balanced.dna.potential);
    expect(early.startingAttributes.handle).toBeGreaterThan(balanced.startingAttributes.handle);
    expect(late.startingAttributes.handle).toBeLessThan(balanced.startingAttributes.handle);
  });
});
