jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("../src/features/match/screens/MatchScreen", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");
  const { useCareerStore } = require("../src/store/useCareerStore");

  const boxScore = {
    homePlayers: [
      {
        id: "home-0",
        name: "UI Tester",
        pts: 21,
        reb: 4,
        ast: 6,
        stl: 1,
        blk: 0,
        to: 2,
        fgm: 8,
        fga: 15,
      },
    ],
    awayPlayers: [
      {
        id: "away-0",
        name: "Rivals High",
        pts: 14,
        reb: 3,
        ast: 2,
        stl: 1,
        blk: 0,
        to: 3,
        fgm: 5,
        fga: 13,
      },
    ],
    homeTotals: { pts: 64, reb: 21, ast: 15, stl: 5, blk: 2, to: 10, fgm: 25, fga: 49 },
    awayTotals: { pts: 52, reb: 18, ast: 9, stl: 4, blk: 1, to: 12, fgm: 20, fga: 47 },
  };

  return {
    MatchScreen: () => {
      const completeMatch = useCareerStore((state: any) => state.completeMatch);
      return React.createElement(
        Pressable,
        {
          onPress: () =>
            completeMatch({
              homeScore: 64,
              awayScore: 52,
              overtimePeriods: 0,
              boxScore,
            }),
        },
        React.createElement(Text, null, "Finish Mock Match"),
      );
    },
  };
});

import { act, fireEvent, render } from "@testing-library/react-native";
import { HomeScreen } from "../src/screens/HomeScreen";
import { useCareerStore } from "../src/store/useCareerStore";

describe("Career vertical slice UI", () => {
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
      weeklyLoop: {
        eventCompleted: false,
        matchCompleted: false,
        postgamePending: false,
      },
      currentNarrativeFile: "",
      currentWeek: 1,
      seasonNumber: 1,
    }));
  });

  it("runs builder to event to match to postgame to week-advance through the hub", () => {
    const screen = render(<HomeScreen />);
    expect(screen.getByText("Backstory Generator")).toBeTruthy();

    act(() => {
      useCareerStore.getState().initializeCareer({
        firstName: "UI",
        lastName: "Tester",
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
        generationSeed: 20260427,
      });
    });

    expect(screen.getByText("Career Hub")).toBeTruthy();
    expect(screen.getByText("Start your weekly event to unlock the match.")).toBeTruthy();

    const startingVision = useCareerStore.getState().player.attributes.vision;
    fireEvent.press(screen.getByText("Next Event"));
    expect(useCareerStore.getState().view).toBe("NARRATIVE");
    fireEvent.press(screen.getByText(/Study Film/));

    expect(useCareerStore.getState().view).toBe("HUB");
    expect(useCareerStore.getState().weeklyLoop.eventCompleted).toBe(true);
    expect(useCareerStore.getState().player.attributes.vision).toBeGreaterThanOrEqual(startingVision + 1);
    expect(screen.getByText("Event complete. Match is unlocked.")).toBeTruthy();

    fireEvent.press(screen.getByText("Play Match"));
    expect(useCareerStore.getState().view).toBe("MATCH");
    fireEvent.press(screen.getByText("Finish Mock Match"));

    expect(useCareerStore.getState().view).toBe("POSTGAME");
    expect(screen.getByText("Postgame Report")).toBeTruthy();
    expect(screen.getByText("Advance Week")).toBeTruthy();

    fireEvent.press(screen.getByText("Advance Week"));

    expect(useCareerStore.getState().view).toBe("HUB");
    expect(useCareerStore.getState().currentWeek).toBe(2);
    expect(useCareerStore.getState().lastMatchResult).toBeNull();
    expect(useCareerStore.getState().weeklyLoop).toEqual({
      eventCompleted: false,
      matchCompleted: false,
      postgamePending: false,
    });
    expect(useCareerStore.getState().newsFeed.some((item) => item.category === "POSTGAME_RECAP")).toBe(true);
    expect(screen.getByText("Start your weekly event to unlock the match.")).toBeTruthy();
  });
});
