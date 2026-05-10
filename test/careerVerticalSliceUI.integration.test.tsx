jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const mockBoxScore = {
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

jest.mock("../src/features/match/screens/MatchScreen", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");
  const { useCareerStore } = require("../src/store/useCareerStore");

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
              boxScore: mockBoxScore,
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
        studyCompleted: false,
      },
      currentNarrativeFile: "",
      currentWeek: 1,
      seasonNumber: 1,
    }));
  });

  it("runs builder to event to match to postgame to week-advance through the hub", () => {
    const screen = render(<HomeScreen />);
    expect(screen.getByText("Player Builder")).toBeTruthy();

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
    expect(useCareerStore.getState().financeLedger.at(-1)).toMatchObject({
      type: "income",
      category: "film_stipend",
      description: "Film room stipend",
      source: "narrative",
    });
    expect(screen.getByText("Event complete. Match is unlocked.")).toBeTruthy();
    expect(screen.getByText("Recent Financial Activity")).toBeTruthy();
    expect(screen.getByText("Film room stipend")).toBeTruthy();

    fireEvent.press(screen.getByText("Play Match"));
    expect(useCareerStore.getState().view).toBe("MATCH");
    fireEvent.press(screen.getByText("Finish Mock Match"));

    expect(useCareerStore.getState().view).toBe("POSTGAME");
    expect(screen.getByText("Postgame Report")).toBeTruthy();
    expect(screen.getByText("Match Rating")).toBeTruthy();
    expect(screen.getByText("Career Meters")).toBeTruthy();
    expect(screen.getByText("Team Result")).toBeTruthy();
    expect(screen.getByText("Advance Week")).toBeTruthy();

    fireEvent.press(screen.getByText("Advance Week"));

    expect(useCareerStore.getState().view).toBe("SCHOOL_PATH_SELECT");
    expect(screen.getByText("Choose Your Next Stage")).toBeTruthy();
    fireEvent.press(screen.getByText("Choose 5A"));

    expect(useCareerStore.getState().view).toBe("HUB");
    expect(useCareerStore.getState().currentWeek).toBe(2);
    expect(useCareerStore.getState().lastMatchResult).toBeNull();
    expect(useCareerStore.getState().weeklyLoop).toEqual({
      eventCompleted: false,
      matchCompleted: false,
      postgamePending: false,
      studyCompleted: false,
    });
    expect(useCareerStore.getState().leagueLevel).toBe("HIGH_SCHOOL");
    expect(useCareerStore.getState().schoolPath).toBe("STATE_5A");
    expect(useCareerStore.getState().newsFeed.some((item) => item.category === "POSTGAME_RECAP")).toBe(true);
    expect(useCareerStore.getState().financeLedger).toHaveLength(2);
    expect(screen.getByText("School Path")).toBeTruthy();
    expect(screen.getByText("State 5A")).toBeTruthy();
    expect(screen.getByText("Recent Financial Activity")).toBeTruthy();
    expect(screen.getByText("Win bonus")).toBeTruthy();
    expect(screen.getByText("Recruiting Interest")).toBeTruthy();
    expect(screen.getByText("Offer Inbox")).toBeTruthy();
    expect(screen.queryAllByText("Accept").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Decline").length).toBeGreaterThan(0);
    expect(screen.getByText("Start your weekly event to unlock the match.")).toBeTruthy();
  });

  it("lets the player accept an offer from the hub inbox", () => {
    const screen = render(<HomeScreen />);

    act(() => {
      useCareerStore.getState().initializeCareer({
        firstName: "Inbox",
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
      useCareerStore.getState().applyAttributeGain("vision", 1, "NARRATIVE");
      useCareerStore.getState().completeNarrativeEvent();
      useCareerStore.getState().completeMatch({
        homeScore: 64,
        awayScore: 52,
        overtimePeriods: 0,
        boxScore: mockBoxScore,
      });
      useCareerStore.getState().resolvePostgameAndAdvanceWeek();
      useCareerStore.getState().selectSchoolPath("STATE_5A");
    });

    fireEvent.press(screen.getAllByText("Accept")[0]);

    expect(screen.getByText("Committed offer")).toBeTruthy();
    expect(useCareerStore.getState().offers.filter((offer) => offer.status === "ACCEPTED")).toHaveLength(1);
    expect(useCareerStore.getState().offers.filter((offer) => offer.status === "AVAILABLE")).toHaveLength(0);
  });

  it("removes a declined offer from the inbox view", () => {
    const screen = render(<HomeScreen />);

    act(() => {
      useCareerStore.getState().initializeCareer({
        firstName: "Decline",
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
        generationSeed: 20260428,
      });
      useCareerStore.getState().applyAttributeGain("vision", 1, "NARRATIVE");
      useCareerStore.getState().completeNarrativeEvent();
      useCareerStore.getState().completeMatch({
        homeScore: 64,
        awayScore: 52,
        overtimePeriods: 0,
        boxScore: mockBoxScore,
      });
      useCareerStore.getState().resolvePostgameAndAdvanceWeek();
      useCareerStore.getState().selectSchoolPath("STATE_5A");
    });

    const initialAvailableCount = useCareerStore.getState().offers.filter((offer) => offer.status === "AVAILABLE").length;
    expect(initialAvailableCount).toBeGreaterThan(0);

    fireEvent.press(screen.getAllByText("Decline")[0]);

    expect(useCareerStore.getState().offers.filter((offer) => offer.status === "AVAILABLE")).toHaveLength(initialAvailableCount - 1);
    expect(screen.queryAllByText("Decline")).toHaveLength(initialAvailableCount - 1);
  });

  it("shows GPA status, supports study, and blocks match access when academically ineligible", () => {
    const screen = render(<HomeScreen />);

    act(() => {
      useCareerStore.getState().initializeCareer({
        firstName: "GPA",
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
        generationSeed: 20260430,
      });
    });

    expect(screen.getByText("GPA")).toBeTruthy();
    expect(screen.getByText("2.5")).toBeTruthy();

    fireEvent.press(screen.getByText("Study"));
    expect(useCareerStore.getState().gpa).toBe(2.6);

    act(() => {
      useCareerStore.getState().completeNarrativeEvent();
      useCareerStore.getState().adjustGpa(-0.7, "SYSTEM");
    });

    expect(screen.getByText("Academically ineligible: raise GPA to 2.0 to play.")).toBeTruthy();

    fireEvent.press(screen.getByText("Play Match"));
    expect(useCareerStore.getState().view).toBe("HUB");

    act(() => {
      useCareerStore.getState().adjustGpa(0.1, "SYSTEM");
    });

    fireEvent.press(screen.getByText("Play Match"));
    expect(useCareerStore.getState().view).toBe("MATCH");
  });
});
