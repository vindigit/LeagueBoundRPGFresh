jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useCareerStore } from "../src/store/useCareerStore";

describe("Backstory flow", () => {
  beforeEach(() => {
    useCareerStore.setState((state) => ({
      ...state,
      player: {
        ...state.player,
        id: "",
        name: "",
        identity: null,
        dna: null,
      },
      view: "BACKSTORY",
      newsFeed: [],
      lastMatchResult: null,
    }));
  });

  it("starts on backstory view when no initialized player is present", () => {
    expect(useCareerStore.getState().view).toBe("BACKSTORY");
  });

  it("completing backstory enters hub and creates a hometown headline", () => {
    useCareerStore.getState().initializeCareer({
      firstName: "Jordan",
      lastName: "Lewis",
      hometownSlug: "lewisville-tx",
      archetype: "Slasher",
      ageStarted: 11,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      generationSeed: 20260221,
    });

    const state = useCareerStore.getState();
    expect(state.view).toBe("HUB");
    expect(state.newsFeed.length).toBeGreaterThan(0);
    expect(state.newsFeed[0].headline).toContain("Lewisville");
    expect(state.newsFeed[0].headline).toContain("Lewis");
    expect(state.player.identity).toBeTruthy();
    expect(state.player.dna).toBeTruthy();
  });
});
