jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useCareerStore } from "../src/store/useCareerStore";
import { getDefaultBuildPreset } from "../src/builder/presets";
import { generateBackstoryFromBuildInput } from "../src/features/backstory/generator";
import { BASE_PUBLIC_ATTRIBUTES, deriveEngineRatings } from "../src/builder/publicAttributes";
import type { BuildBackstoryInput } from "../src/types/backstory";
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

describe("Career store builder integration", () => {
  const buildInput: BuildBackstoryInput = {
    firstName: "Builder",
    lastName: "Path",
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
    generationSeed: 20260407,
  };

  it("initializes a career from build-driven input and persists builder profile metadata", () => {
    useCareerStore.getState().initializeCareer(buildInput);

    const player = useCareerStore.getState().player;
    expect(player.name).toBe("Builder Path");
    expect(player.dna?.builderProfile).toBeTruthy();
    expect(player.dna?.builderProfile?.classification.legacyArchetype).toBe(player.archetype);
    expect(Array.isArray(player.dna?.builderProfile?.badges)).toBe(true);
  });

  it("initializes public builder input while preserving hidden engine compatibility", () => {
    const input: BuildBackstoryInput = {
      ...buildInput,
      buildAttributes: undefined,
      publicAttributes: { ...BASE_PUBLIC_ATTRIBUTES, shooting: 62, playmaking: 58 },
      startingArchetypeId: "sharpshooter",
      archetypeId: "sharpshooter",
      archetypeLabel: "Sharpshooter",
      roleLabel: "Perimeter scorer",
    };

    useCareerStore.getState().initializeCareer(input);
    const player = useCareerStore.getState().player;
    const expectedKeys = Object.keys(deriveEngineRatings({
      publicAttributes: input.publicAttributes!,
      startingArchetypeId: "sharpshooter",
      position: input.primaryPosition,
      height: input.height,
      weightLbs: input.weightLbs,
      bodyFrame: input.bodyFrame,
    })).sort();

    expect(Object.keys(player.attributes).sort()).toEqual(expectedKeys);
    expect(player.identity?.startingArchetypeId).toBe("sharpshooter");
    expect(player.identity?.publicAttributes).toEqual(input.publicAttributes);
    expect(player.dna?.startingArchetypeId).toBe("sharpshooter");
    expect(player.dna?.publicAttributes).toEqual(input.publicAttributes);
    expect(player.dna?.hiddenEngineAttributes).toEqual(player.attributes);
    expect(player.dna?.fuzzyScoutingSummary).toBeTruthy();
    expect(player.dna?.publicTraits.some((trait) => trait.startsWith("Potential Tier:"))).toBe(false);
  });

  it("uses generated build starting attributes as the initialized player attributes", () => {
    const preset = getDefaultBuildPreset("C");
    const input: BuildBackstoryInput = {
      ...buildInput,
      primaryPosition: "C",
      secondaryPosition: "PF",
      buildAttributes: preset.attributes,
    };
    const expected = generateBackstoryFromBuildInput(input, { seedOverride: input.generationSeed }).startingAttributes;
    useCareerStore.getState().initializeCareer(input);

    expect(useCareerStore.getState().player.attributes).toEqual(expected);
  });

  it("changes initialized build attributes when age started changes", () => {
    const earlyInput = { ...buildInput, ageStarted: 5 };
    const lateInput = { ...buildInput, ageStarted: 12 };

    useCareerStore.getState().initializeCareer(earlyInput);
    const earlyAttributes = useCareerStore.getState().player.attributes;

    useCareerStore.getState().initializeCareer(lateInput);
    const lateAttributes = useCareerStore.getState().player.attributes;

    expect(earlyAttributes.handle).toBeGreaterThan(lateAttributes.handle);
    expect(earlyAttributes).toEqual(
      generateBackstoryFromBuildInput(earlyInput, { seedOverride: earlyInput.generationSeed }).startingAttributes,
    );
    expect(lateAttributes).toEqual(
      generateBackstoryFromBuildInput(lateInput, { seedOverride: lateInput.generationSeed }).startingAttributes,
    );
  });

  it("initializes basketball background choices while preserving legacy age fields", () => {
    const input: BuildBackstoryInput = {
      ...buildInput,
      ageStarted: 11,
      basketballBackground: "LATE_BLOOMER",
    };

    useCareerStore.getState().initializeCareer(input);
    const player = useCareerStore.getState().player;

    expect(player.identity?.basketballBackground).toBe("LATE_BLOOMER");
    expect(player.identity?.ageStarted).toBe(11);
    expect(player.identity?.ageStartedBand).toBe("LATE");
    expect(player.dna?.growthCurve).toBe("LATE_BLOOMER");
  });

  it("lazy-backfills missing builder profile during migration", () => {
    useCareerStore.getState().initializeCareer(buildInput);
    const current = useCareerStore.getState();
    const migrate = (useCareerStore as unknown as { persist: { getOptions: () => { migrate?: (state: unknown) => unknown } } })
      .persist
      .getOptions().migrate;

    const dnaWithoutProfile = current.player.dna
      ? (({ builderProfile: _omit, ...rest }) => rest)(current.player.dna)
      : null;

    const migrated = migrate?.({
      ...current,
      player: {
        ...current.player,
        dna: dnaWithoutProfile,
      },
    }) as { player: { dna: { builderProfile?: unknown } | null } };

    expect(migrated.player.dna?.builderProfile).toBeTruthy();
  });

  it("keeps migration idempotent for saves that already have builder profile data", () => {
    useCareerStore.getState().initializeCareer(buildInput);
    const current = useCareerStore.getState();
    const migrate = (useCareerStore as unknown as { persist: { getOptions: () => { migrate?: (state: unknown) => unknown } } })
      .persist
      .getOptions().migrate;

    const first = migrate?.(current) as { player: { dna: { builderProfile?: unknown } | null } };
    const second = migrate?.(first) as { player: { dna: { builderProfile?: unknown } | null } };

    expect(second.player.dna?.builderProfile).toEqual(first.player.dna?.builderProfile);
  });
});
