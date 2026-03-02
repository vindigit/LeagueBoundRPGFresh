jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useCareerStore } from "../src/store/useCareerStore";

describe("growthResidue migration defaults", () => {
  beforeEach(() => {
    useCareerStore.getState().initializeCareer({
      firstName: "Residue",
      lastName: "Legacy",
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
      generationSeed: 20260322,
    });
  });

  it("backfills missing residue for saves with existing dna", () => {
    const migrate = (useCareerStore as unknown as { persist: { getOptions: () => { migrate?: (state: unknown) => unknown } } })
      .persist
      .getOptions().migrate;
    expect(migrate).toBeDefined();

    const current = useCareerStore.getState();
    const dnaWithoutResidue = current.player.dna
      ? (({ growthResidue: _omit, ...rest }) => rest)(current.player.dna)
      : null;
    const migrated = migrate?.({
      ...current,
      player: {
        ...current.player,
        dna: dnaWithoutResidue,
      },
    }) as { player: { dna: { growthResidue?: Record<string, number> } | null } };

    expect(migrated.player.dna).toBeTruthy();
    expect(migrated.player.dna?.growthResidue).toEqual({});
  });

  it("creates residue defaults when migrating legacy players without dna", () => {
    const migrate = (useCareerStore as unknown as { persist: { getOptions: () => { migrate?: (state: unknown) => unknown } } })
      .persist
      .getOptions().migrate;
    expect(migrate).toBeDefined();

    const current = useCareerStore.getState();
    const migrated = migrate?.({
      ...current,
      player: {
        ...current.player,
        identity: null,
        dna: null,
      },
    }) as { player: { dna: { growthResidue?: Record<string, number> } | null } };

    expect(migrated.player.dna).toBeTruthy();
    expect(migrated.player.dna?.growthResidue).toEqual({});
  });
});
