jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useCareerStore } from "../src/store/useCareerStore";

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
    const before = useCareerStore.getState().player.attributes.athleticism;
    useCareerStore.getState().updateAttribute("athleticism", 5);
    const after = useCareerStore.getState().player.attributes.athleticism;
    expect(after).toBe(Math.min(99, before + 5));
  });

  it("does not exceed 99 when clamping attribute", () => {
    useCareerStore.getState().updateAttribute("athleticism", 1000);
    expect(useCareerStore.getState().player.attributes.athleticism).toBe(99);
  });

  it("updates bank balance correctly", () => {
    useCareerStore.getState().updateBankBalance(500);
    expect(useCareerStore.getState().player.bankBalance).toBe(500);
  });
});
