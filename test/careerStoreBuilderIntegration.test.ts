jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useCareerStore } from "../src/store/useCareerStore";
import { getDefaultBuildPreset } from "../src/builder/presets";
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

  it("uses selected preset attributes as the initialized player attributes", () => {
    const preset = getDefaultBuildPreset("C");
    useCareerStore.getState().initializeCareer({
      ...buildInput,
      primaryPosition: "C",
      secondaryPosition: "PF",
      buildAttributes: preset.attributes,
    });

    expect(useCareerStore.getState().player.attributes).toEqual(preset.attributes);
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
