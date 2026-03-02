jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { LeagueLevel } from "../src/types/career";
import { useCareerStore } from "../src/store/useCareerStore";

describe("Career growth and cap enforcement", () => {
  beforeEach(() => {
    useCareerStore.getState().initializeCareer({
      firstName: "Cap",
      lastName: "Tester",
      stateCode: "TX",
      citySlug: "houston-tx",
      archetype: "Playmaker",
      ageStarted: 8,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "PG",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 0 },
      weightLbs: 175,
      generationSeed: 20260221,
    });
  });

  it("enforces hard caps on positive growth", () => {
    const state = useCareerStore.getState();
    const cap = state.player.dna?.caps.handle ?? 99;
    useCareerStore.setState((current) => ({
      player: {
        ...current.player,
        attributes: {
          ...current.player.attributes,
          handle: (cap - 1) as (typeof current.player.attributes)["handle"],
        },
      },
    }));

    useCareerStore.getState().applyAttributeGain("handle", 10, "TRAINING");
    expect(useCareerStore.getState().player.attributes.handle).toBe(cap);
  });

  it("applies growth multipliers by league and source", () => {
    useCareerStore.setState((current) => ({
      leagueLevel: LeagueLevel.MIDDLE_SCHOOL,
      player: {
        ...current.player,
        attributes: {
          ...current.player.attributes,
          shooting: 10,
        },
        dna: current.player.dna
          ? {
              ...current.player.dna,
              growthByLeague: {
                [LeagueLevel.MIDDLE_SCHOOL]: 1.2,
                [LeagueLevel.HIGH_SCHOOL]: 1.0,
                [LeagueLevel.COLLEGE]: 0.9,
                [LeagueLevel.PRO]: 0.8,
              },
              caps: {
                ...current.player.dna.caps,
                shooting: 99,
              },
            }
          : null,
      },
    }));

    useCareerStore.getState().applyAttributeGain("shooting", 10, "TRAINING");
    expect(useCareerStore.getState().player.attributes.shooting).toBe(23);
    expect(useCareerStore.getState().player.dna?.growthResidue.shooting).toBeCloseTo(0.248);

    useCareerStore.setState((current) => ({
      leagueLevel: LeagueLevel.PRO,
      player: {
        ...current.player,
        attributes: {
          ...current.player.attributes,
          shooting: 10,
        },
      },
    }));

    useCareerStore.getState().applyAttributeGain("shooting", 10, "TRAINING");
    expect(useCareerStore.getState().player.attributes.shooting).toBe(19);
  });

  it("accumulates fractional residue across positive gains deterministically", () => {
    useCareerStore.setState((current) => ({
      leagueLevel: LeagueLevel.MIDDLE_SCHOOL,
      player: {
        ...current.player,
        attributes: {
          ...current.player.attributes,
          vision: 10,
        },
        dna: current.player.dna
          ? {
              ...current.player.dna,
              growthByLeague: {
                [LeagueLevel.MIDDLE_SCHOOL]: 1.0,
                [LeagueLevel.HIGH_SCHOOL]: 1.0,
                [LeagueLevel.COLLEGE]: 1.0,
                [LeagueLevel.PRO]: 1.0,
              },
              caps: {
                ...current.player.dna.caps,
                vision: 99,
              },
              growthResidue: {
                ...current.player.dna.growthResidue,
                vision: 0,
              },
            }
          : null,
      },
    }));

    useCareerStore.getState().applyAttributeGain("vision", 1, "TRAINING");
    expect(useCareerStore.getState().player.attributes.vision).toBe(11);
    expect(useCareerStore.getState().player.dna?.growthResidue.vision).toBeCloseTo(0.612);

    useCareerStore.getState().applyAttributeGain("vision", 1, "TRAINING");
    expect(useCareerStore.getState().player.attributes.vision).toBe(13);
    expect(useCareerStore.getState().player.dna?.growthResidue.vision).toBeCloseTo(0.224);

    useCareerStore.getState().applyAttributeGain("vision", 1, "TRAINING");
    expect(useCareerStore.getState().player.attributes.vision).toBe(14);
    expect(useCareerStore.getState().player.dna?.growthResidue.vision).toBeCloseTo(0.836);
  });

  it("does not scale negative deltas", () => {
    useCareerStore.setState((current) => ({
      leagueLevel: LeagueLevel.COLLEGE,
      player: {
        ...current.player,
        attributes: {
          ...current.player.attributes,
          athleticism: 40,
        },
        dna: current.player.dna
          ? {
              ...current.player.dna,
              growthByLeague: {
                [LeagueLevel.MIDDLE_SCHOOL]: 1.5,
                [LeagueLevel.HIGH_SCHOOL]: 1.4,
                [LeagueLevel.COLLEGE]: 1.3,
                [LeagueLevel.PRO]: 1.2,
              },
            }
          : null,
      },
    }));

    useCareerStore.getState().applyAttributeGain("athleticism", -5, "TRAINING");
    expect(useCareerStore.getState().player.attributes.athleticism).toBe(35);
  });
});
