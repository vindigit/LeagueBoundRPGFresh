import { generateBackstoryFromInput } from "../src/features/backstory/generator";

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
      expect(generated.startingAttributes[key]).toBeLessThanOrEqual(generated.dna.caps[key]);
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
});
