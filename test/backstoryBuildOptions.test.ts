import { generateBackstoryFromInput, getDefaultSecondaryPosition } from "../src/features/backstory/generator";

describe("Backstory build options", () => {
  const baseInput = {
    firstName: "Build",
    lastName: "Tester",
    stateCode: "TX",
    citySlug: "houston-tx",
    archetype: "Playmaker" as const,
    ageStarted: 9,
    bodyFrame: "Athletic" as const,
    dominantHand: "Right" as const,
    primaryPosition: "PG" as const,
    secondaryPosition: "SG" as const,
    height: { feet: 6, inches: 2 } as const,
    weightLbs: 185,
  };

  it("applies deterministic build modifiers from position and body presets", () => {
    const baseline = generateBackstoryFromInput(baseInput, { seedOverride: 202 });
    const biggerBuild = generateBackstoryFromInput(
      {
        ...baseInput,
        primaryPosition: "C",
        secondaryPosition: "PF",
        height: { feet: 7, inches: 1 },
        weightLbs: 270,
      },
      { seedOverride: 202 },
    );

    expect(biggerBuild.dna.caps.defRebounding).toBeGreaterThanOrEqual(baseline.dna.caps.defRebounding);
    expect(biggerBuild.dna.caps.handle).toBeLessThanOrEqual(baseline.dna.caps.handle);
    expect(biggerBuild.startingAttributes.strength).toBeGreaterThanOrEqual(baseline.startingAttributes.strength);
  });

  it("ensures duplicate secondary position gets normalized", () => {
    const generated = generateBackstoryFromInput(
      {
        ...baseInput,
        primaryPosition: "SF",
        secondaryPosition: "SF",
      },
      { seedOverride: 10 },
    );

    expect(generated.identity.secondaryPosition).toBe("PF");
  });

  it("returns deterministic adjacent secondary defaults", () => {
    expect(getDefaultSecondaryPosition("PG")).toBe("SG");
    expect(getDefaultSecondaryPosition("C")).toBe("PF");
  });
});
