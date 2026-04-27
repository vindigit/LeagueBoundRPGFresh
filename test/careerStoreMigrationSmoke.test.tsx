jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("../src/components/PlayerCard", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    PlayerCard: () => React.createElement(Text, null, "Player Card Stub"),
  };
});

jest.mock("../src/components/NarrativeOverlay", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    NarrativeOverlay: () => React.createElement(Text, null, "Narrative Stub"),
  };
});

jest.mock("../src/features/match/screens/MatchScreen", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    MatchScreen: () => React.createElement(Text, null, "Match Stub"),
  };
});

jest.mock("../src/features/match/screens/PostgameScreen", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    PostgameScreen: () => React.createElement(Text, null, "Postgame Stub"),
  };
});

jest.mock("../src/features/backstory/screens/BackstoryScreen", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    BackstoryScreen: () => React.createElement(Text, null, "Backstory Stub"),
  };
});

import { render } from "@testing-library/react-native";
import { HomeScreen } from "../src/screens/HomeScreen";
import { useCareerStore } from "../src/store/useCareerStore";
import { LeagueLevel, type CareerState } from "../src/types/career";

describe("Career store migration smoke", () => {
  beforeEach(() => {
    useCareerStore.getState().initializeCareer({
      firstName: "Legacy",
      lastName: "Smoke",
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
      generationSeed: 20260425,
    });
  });

  it("boots an older save through migration, hydration, and hub render without losing player state", () => {
    const migrate = (useCareerStore as unknown as {
      persist: { getOptions: () => { migrate?: (state: unknown) => unknown } };
    }).persist.getOptions().migrate;
    expect(migrate).toBeDefined();

    const seeded = useCareerStore.getState();
    const legacyPlayer = (({
      bankBalance: _bankBalance,
      morale: _morale,
      position: _position,
      secondaryPosition: _secondaryPosition,
      ...rest
    }) => ({
      ...rest,
      BankBalance: 1250,
      Morale: 72,
      Position: "SG",
    }))(seeded.player);

    const migrated = migrate?.({
      player: legacyPlayer,
      leagueLevel: LeagueLevel.HIGH_SCHOOL,
      status: seeded.status,
      currentYear: 2027,
      seasonNumber: 2,
      currentWeek: 3,
      teamId: "tx-hs-houston",
      isGoatPath: seeded.isGoatPath,
      view: "HUB",
      currentNarrativeFile: "",
      lastMatchResult: null,
      newsFeed: seeded.newsFeed,
      ovrBudget: 73,
    }) as CareerState;

    useCareerStore.getState().hydrateCareer(migrated);

    const state = useCareerStore.getState();
    expect(state.view).toBe("HUB");
    expect(state.player.name).toBe(seeded.player.name);
    expect(state.player.identity?.hometown.city).toBe("Houston");
    expect(state.player.bankBalance).toBe(1250);
    expect(state.player.morale).toBe(72);
    expect(state.player.position).toBe("SG");
    expect(state.careerPhase).toBe("HIGH_SCHOOL");
    expect(state.scoutVisibility).toBeGreaterThan(0);
    expect(state.gpa).toBe(2.5);
    expect(state.pendingSchoolPathSelection).toBe(false);
    expect(Object.keys(state.teamInterestById).length).toBeGreaterThan(0);
    expect(state.seasonSchedule.phase).toBe("HIGH_SCHOOL");
    expect(state.eligibility.status).toBe("ELIGIBLE");
    expect(state.financeState.ledger.nilEarnings).toBe(0);
    expect(state.financeLedger).toEqual([]);
    expect(state.weeklyLoop).toEqual({
      eventCompleted: true,
      matchCompleted: false,
      postgamePending: false,
      studyCompleted: false,
    });

    const screen = render(<HomeScreen />);
    expect(screen.getByText("Career Hub")).toBeTruthy();
    expect(screen.getByText("Between Games")).toBeTruthy();
    expect(screen.queryByText("Backstory Stub")).toBeNull();
    expect(screen.queryByText("Match Stub")).toBeNull();
    expect(screen.queryByText("Postgame Stub")).toBeNull();
  });
});
