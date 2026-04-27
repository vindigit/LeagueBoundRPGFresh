jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useCareerStore } from "../src/store/useCareerStore";
import { generateBackstoryFromInput } from "../src/features/backstory/generator";

describe("Career Store Persistence", () => {
  beforeEach(() => {
    useCareerStore.getState().initializeCareer({
      firstName: "Test",
      lastName: "Pro",
      stateCode: "TX",
      citySlug: "houston-tx",
      archetype: "Slasher",
      ageStarted: 8,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "SF",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 6 },
      weightLbs: 210,
      generationSeed: 20260221,
    });
  });

  it("initializes career with correct player name and archetype", () => {
    const { player } = useCareerStore.getState();
    expect(player.name).toBe("Test Pro");
    expect(player.archetype).toBe("Slasher");
  });

  it("updates an attribute and clamps it to valid range", () => {
    const before = useCareerStore.getState().player.attributes.speed;
    useCareerStore.getState().updateAttribute("speed", 5);
    const after = useCareerStore.getState().player.attributes.speed;
    expect(after).toBe(Math.min(99, before + 5));
  });

  it("does not exceed 99 when clamping attribute", () => {
    useCareerStore.getState().updateAttribute("speed", 1000);
    expect(useCareerStore.getState().player.attributes.speed).toBe(99);
  });

  it("updates bank balance and finance ledger correctly", () => {
    useCareerStore.getState().updateBankBalance(500);
    const state = useCareerStore.getState();

    expect(state.player.bankBalance).toBe(500);
    expect(state.financeLedger).toHaveLength(1);
    expect(state.financeLedger[0]).toMatchObject({
      week: 1,
      type: "income",
      category: "misc",
      amount: 500,
      description: "Balance update",
      source: "system",
    });
  });

  it("keeps potential tier deterministic for the same seed", () => {
    const expected = generateBackstoryFromInput(
      {
        firstName: "Test",
        lastName: "Pro",
        stateCode: "TX",
        citySlug: "houston-tx",
        archetype: "Slasher",
        ageStarted: 8,
        bodyFrame: "Athletic",
        dominantHand: "Right",
        primaryPosition: "SF",
        secondaryPosition: "SG",
        height: { feet: 6, inches: 6 },
        weightLbs: 210,
      },
      { seedOverride: 20260221 },
    );

    expect(useCareerStore.getState().player.dna?.potentialTier).toBe(expected.dna.potentialTier);
  });
});
