import { generateBackstoryFromInput } from "../src/features/backstory/generator";

describe("Backstory generator", () => {
  const baseInput = {
    firstName: "Jordan",
    lastName: "Lewis",
    hometownSlug: "lewisville-tx",
    archetype: "Playmaker" as const,
    ageStarted: 8,
    bodyFrame: "Athletic" as const,
    dominantHand: "Right" as const,
  };

  it("is deterministic for a fixed seed", () => {
    const first = generateBackstoryFromInput(baseInput, { seedOverride: 20260221 });
    const second = generateBackstoryFromInput(baseInput, { seedOverride: 20260221 });

    expect(first.dna.potential).toBe(second.dna.potential);
    expect(first.dna.growthCurve).toBe(second.dna.growthCurve);
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
});
