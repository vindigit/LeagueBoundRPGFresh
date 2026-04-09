import fs from "node:fs";
import path from "node:path";

import { createBuildBackstorySeed, generateBackstoryFromBuildInput, generateBackstoryFromInput } from "../src/features/backstory/generator";
import type { BuildBackstoryInput, BackstoryInput } from "../src/types/backstory";
import type { PlayerAttributes } from "../src/types/player";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 62,
  dunking: 64,
  midrange: 68,
  threePoint: 84,
  handle: 90,
  passing: 88,
  vision: 82,
  perimeterDefense: 70,
  interiorDefense: 52,
  stealing: 68,
  blocking: 44,
  offRebounding: 38,
  defRebounding: 46,
  speed: 82,
  strength: 64,
  stamina: 80,
  ...overrides,
});

describe("Backstory generator migration", () => {
  it("keeps the legacy archetype-driven entrypoint stable", () => {
    const input: BackstoryInput = {
      firstName: "Legacy",
      lastName: "Path",
      stateCode: "TX",
      citySlug: "houston-tx",
      archetype: "Playmaker",
      ageStarted: 8,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "PG",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 2 },
      weightLbs: 185,
    };

    const generated = generateBackstoryFromInput(input, { seedOverride: 101 });
    expect(generated.identity.archetype).toBe("Playmaker");
    expect(generated.builderProfile.classification.legacyArchetype).toBeDefined();
    expect(Array.isArray(generated.builderProfile.badges)).toBe(true);
  });

  it("generates deterministic classification and badges without archetype input", () => {
    const input: BuildBackstoryInput = {
      firstName: "Build",
      lastName: "First",
      stateCode: "TX",
      citySlug: "houston-tx",
      ageStarted: 8,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "PG",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 2 },
      weightLbs: 185,
      buildAttributes: makeAttributes(),
    };
    const seed = createBuildBackstorySeed(input);

    const first = generateBackstoryFromBuildInput(input, { seedOverride: seed });
    const second = generateBackstoryFromBuildInput(input, { seedOverride: seed });

    expect(first.identity.archetype).toBe(first.builderProfile.classification.legacyArchetype);
    expect(first.builderProfile.classification).toEqual(second.builderProfile.classification);
    expect(first.builderProfile.badges).toEqual(second.builderProfile.badges);
    expect(first.startingAttributes).toEqual(second.startingAttributes);
  });

  it("guards against direct archetype constant imports from the new generator path", () => {
    const generatorSource = fs.readFileSync(
      path.join(process.cwd(), "src", "features", "backstory", "generator.ts"),
      "utf8",
    );

    expect(generatorSource).not.toContain('from "./constants/archetypeCaps"');
    expect(generatorSource).not.toContain('from "./constants/archetypePrimaries"');
    expect(generatorSource).toContain('from "./constants/archetypeCompatibility"');
  });
});
