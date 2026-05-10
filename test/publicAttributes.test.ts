import {
  BASE_PUBLIC_ATTRIBUTES,
  PUBLIC_ATTRIBUTE_KEYS,
  applyPublicAllocation,
  applyStartingArchetypeBonuses,
  deriveEngineRatings,
  type PublicAttributes,
} from "../src/builder/publicAttributes";

const build = (overrides: Partial<PublicAttributes> = {}) => ({
  publicAttributes: { ...BASE_PUBLIC_ATTRIBUTES, ...overrides },
  position: "SF" as const,
  height: { feet: 6, inches: 6 },
  weightLbs: 205,
  bodyFrame: "Athletic" as const,
});

describe("public attributes", () => {
  it("exposes exactly seven player-facing attributes", () => {
    expect(PUBLIC_ATTRIBUTE_KEYS).toEqual([
      "shooting",
      "finishing",
      "playmaking",
      "defending",
      "rebounding",
      "athleticism",
      "stamina",
    ]);
  });

  it("maps public ratings into compatible hidden engine ratings", () => {
    const shooting = deriveEngineRatings(build({ shooting: 72 }).publicAttributes ? build({ shooting: 72 }) : build());
    const finishing = deriveEngineRatings(build({ finishing: 72 }));
    const playmaking = deriveEngineRatings(build({ playmaking: 72 }));
    const defending = deriveEngineRatings(build({ defending: 72 }));
    const rebounding = deriveEngineRatings(build({ rebounding: 72 }));
    const athleticism = deriveEngineRatings(build({ athleticism: 72 }));
    const stamina = deriveEngineRatings(build({ stamina: 72 }));

    expect(shooting.threePoint).toBeGreaterThan(deriveEngineRatings(build()).threePoint);
    expect(shooting.midrange).toBeGreaterThan(deriveEngineRatings(build()).midrange);
    expect(finishing.shortRange).toBeGreaterThan(deriveEngineRatings(build()).shortRange);
    expect(finishing.dunking).toBeGreaterThan(deriveEngineRatings(build()).dunking);
    expect(playmaking.handle).toBeGreaterThan(deriveEngineRatings(build()).handle);
    expect(playmaking.passing).toBeGreaterThan(deriveEngineRatings(build()).passing);
    expect(playmaking.vision).toBeGreaterThan(deriveEngineRatings(build()).vision);
    expect(defending.perimeterDefense).toBeGreaterThan(deriveEngineRatings(build()).perimeterDefense);
    expect(defending.interiorDefense).toBeGreaterThan(deriveEngineRatings(build()).interiorDefense);
    expect(defending.stealing).toBeGreaterThan(deriveEngineRatings(build()).stealing);
    expect(defending.blocking).toBeGreaterThan(deriveEngineRatings(build()).blocking);
    expect(rebounding.defRebounding).toBeGreaterThan(deriveEngineRatings(build()).defRebounding);
    expect(athleticism.speed).toBeGreaterThan(deriveEngineRatings(build()).speed);
    expect(stamina.stamina).toBeGreaterThan(deriveEngineRatings(build()).stamina);
  });

  it("applies body modifiers directionally", () => {
    const tall = deriveEngineRatings({ ...build(), height: { feet: 6, inches: 11 } });
    const short = deriveEngineRatings({ ...build(), height: { feet: 5, inches: 11 } });
    const heavy = deriveEngineRatings({ ...build(), weightLbs: 245 });
    const light = deriveEngineRatings({ ...build(), weightLbs: 165 });
    const lean = deriveEngineRatings({ ...build(), bodyFrame: "Lean" });
    const stocky = deriveEngineRatings({ ...build(), bodyFrame: "Stocky" });

    expect(tall.defRebounding).toBeGreaterThan(short.defRebounding);
    expect(tall.speed).toBeLessThan(short.speed);
    expect(heavy.strength).toBeGreaterThan(light.strength);
    expect(heavy.stamina).toBeLessThan(light.stamina);
    expect(lean.stamina).toBeGreaterThan(stocky.stamina);
    expect(stocky.defRebounding).toBeGreaterThan(lean.defRebounding);
  });

  it("rejects overspending without mutating allocation", () => {
    const result = applyPublicAllocation(BASE_PUBLIC_ATTRIBUTES, { shooting: 30 }, 3);
    expect(result.success).toBe(false);
    expect(result.attributes).toEqual(BASE_PUBLIC_ATTRIBUTES);
    expect(result.rejectedReasons[0]).toContain("overspends");
  });

  it("archetype bonuses affect public attributes", () => {
    const sharpshooter = applyStartingArchetypeBonuses(BASE_PUBLIC_ATTRIBUTES, "sharpshooter");
    expect(sharpshooter.shooting).toBeGreaterThan(BASE_PUBLIC_ATTRIBUTES.shooting);
  });
});
