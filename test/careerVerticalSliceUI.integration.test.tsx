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

const playMiddleSchoolTournamentToSelection = () => {
  for (let week = 0; week < 4; week += 1) {
    useCareerStore.getState().takeWeeklyAction("FILM_COACH_TRUST");
    useCareerStore.getState().completeNarrativeEvent();
    useCareerStore.getState().takeWeeklyAction("STUDY");
    useCareerStore.getState().completeMatch({
      homeScore: 64 + week,
      awayScore: 52,
      overtimePeriods: 0,
      boxScore: mockBoxScore,
    });
    useCareerStore.getState().resolvePostgameAndAdvanceWeek();
  }
};

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
      storiesById: {},
      selectedStoryId: null,
      lastMatchResult: null,
      lastWeeklyActionResult: null,
      weeklyActionState: {
        ...state.weeklyActionState,
        slotsTotal: 2,
        slotsRemaining: 2,
        actionsTaken: [],
        matchUnlocked: false,
        postgamePending: false,
        pendingNarrativeActionId: null,
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
    expect(screen.getByText("2 of 2 weekly actions remaining.")).toBeTruthy();

    const startingVision = useCareerStore.getState().player.attributes.vision;
    fireEvent.press(screen.getByText("Film / Coach Trust"));
    expect(useCareerStore.getState().view).toBe("NARRATIVE");
    fireEvent.press(screen.getByText(/Study Film/));
    expect(screen.getByText("Coach Trust +6")).toBeTruthy();
    fireEvent.press(screen.getByText("Study"));
    expect(screen.getByText("GPA +0.1")).toBeTruthy();

    expect(useCareerStore.getState().view).toBe("HUB");
    expect(useCareerStore.getState().weeklyActionState.matchUnlocked).toBe(true);
    expect(useCareerStore.getState().player.attributes.vision).toBeGreaterThanOrEqual(startingVision + 1);
    expect(useCareerStore.getState().financeLedger.at(-1)).toMatchObject({
      type: "income",
      category: "film_stipend",
      description: "Film room stipend",
      source: "narrative",
    });
    expect(screen.getByText("Action plan complete. Match unlocked.")).toBeTruthy();
    expect(screen.getByText("Recent Financial Activity")).toBeTruthy();
    expect(screen.getAllByText("Film room stipend").length).toBeGreaterThan(0);

    fireEvent.press(screen.getByText("Play Match"));
    expect(useCareerStore.getState().view).toBe("MATCH");
    fireEvent.press(screen.getByText("Finish Mock Match"));

    expect(useCareerStore.getState().view).toBe("POSTGAME");
    expect(screen.getByText("Postgame Report")).toBeTruthy();
    expect(screen.getByText("Match Rating")).toBeTruthy();
    expect(screen.getByText("Career Meters")).toBeTruthy();
    expect(screen.getByText("Team Result")).toBeTruthy();
    expect(screen.getByText("Advance Week")).toBeTruthy();

    for (let week = 0; week < 4; week += 1) {
      fireEvent.press(screen.getByText("Advance Week"));
      if (week < 3) {
        fireEvent.press(screen.getByText("Film / Coach Trust"));
        fireEvent.press(screen.getByText(/Study Film/));
        fireEvent.press(screen.getByText("Study"));
        fireEvent.press(screen.getByText("Play Match"));
        fireEvent.press(screen.getByText("Finish Mock Match"));
      }
    }

    expect(useCareerStore.getState().view).toBe("SCHOOL_PATH_SELECT");
    expect(screen.getByText("Choose Your Next Stage")).toBeTruthy();
    fireEvent.press(screen.getByText("Choose 5A"));

    expect(useCareerStore.getState().view).toBe("HUB");
    expect(useCareerStore.getState().currentWeek).toBe(1);
    expect(useCareerStore.getState().lastMatchResult).toBeNull();
    expect(useCareerStore.getState().weeklyActionState).toMatchObject({
      slotsTotal: 3,
      slotsRemaining: 3,
      matchUnlocked: false,
      postgamePending: false,
    });
    expect(useCareerStore.getState().leagueLevel).toBe("HIGH_SCHOOL");
    expect(useCareerStore.getState().schoolPath).toBe("STATE_5A");
    expect(
      useCareerStore.getState().newsFeed.some((item) => item.category === "POSTGAME_RECAP" || item.category === "TOURNAMENT_RECAP"),
    ).toBe(true);
    const postgameStoryItem = useCareerStore
      .getState()
      .newsFeed.find((item) => item.category === "POSTGAME_RECAP" || item.category === "TOURNAMENT_RECAP");
    expect(postgameStoryItem?.isTappable).toBe(true);
    expect(postgameStoryItem?.storyId).toBeTruthy();
    expect(postgameStoryItem?.storyId ? useCareerStore.getState().storiesById[postgameStoryItem.storyId] : null).toBeTruthy();
    expect(useCareerStore.getState().financeLedger.length).toBeGreaterThanOrEqual(5);
    expect(screen.getByText("School Path")).toBeTruthy();
    expect(screen.getByText("State 5A")).toBeTruthy();
    expect(screen.getByText("Recent Financial Activity")).toBeTruthy();
    expect(screen.getAllByText("Win bonus").length).toBeGreaterThan(0);
    expect(screen.getByText("Recruiting Interest")).toBeTruthy();
    expect(screen.getByText("Offer Inbox")).toBeTruthy();
    expect(screen.queryAllByText("Accept").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Decline").length).toBeGreaterThan(0);
    expect(screen.getByText("3 of 3 weekly actions remaining.")).toBeTruthy();

    fireEvent.press(screen.getAllByText("Open Story")[0]);
    expect(useCareerStore.getState().view).toBe("STORY_DETAIL");
    expect(screen.getByText("Recap")).toBeTruthy();
    expect(screen.getByText("Box Score")).toBeTruthy();
    expect(screen.getByText("Buzz")).toBeTruthy();
    expect(screen.getByText("Key Performance")).toBeTruthy();
    fireEvent.press(screen.getByText("Box Score"));
    expect(screen.getByText("Final Score")).toBeTruthy();
    fireEvent.press(screen.getByText("Buzz"));
    expect(screen.getByText(/Local reaction from around/)).toBeTruthy();
  });

  it("shows CourtFuel, blocks it without cash, and applies it inline when affordable", () => {
    const screen = render(<HomeScreen />);

    act(() => {
      useCareerStore.getState().initializeCareer({
        firstName: "Fuel",
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
        generationSeed: 20260429,
      });
    });

    expect(screen.getByText("CourtFuel")).toBeTruthy();
    expect(screen.getByText("Need $6")).toBeTruthy();
    fireEvent.press(screen.getByText("CourtFuel"));
    expect(useCareerStore.getState().weeklyActionState.actionsTaken).toHaveLength(0);

    act(() => {
      useCareerStore.setState((state) => ({
        player: {
          ...state.player,
          bankBalance: 40,
        },
      }));
    });

    fireEvent.press(screen.getByText("CourtFuel"));

    expect(screen.getByText("Fuel the run.")).toBeTruthy();
    expect(screen.getByText("Cost $6")).toBeTruthy();
    expect(useCareerStore.getState().player.bankBalance).toBe(34);
    expect(useCareerStore.getState().energy).toBe(100);
    expect(useCareerStore.getState().condition).toBe(100);
    expect(useCareerStore.getState().financeLedger.at(-1)).toMatchObject({
      type: "expense",
      category: "misc",
      description: "CourtFuel purchase",
      source: "weekly_action",
      amount: 6,
    });
    expect(screen.getByText("Energy +18 | Condition +3 | $8")).toBeTruthy();
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
      useCareerStore.setState((state) => ({
        ...state,
        currentWeek: 5,
        pendingSchoolPathSelection: true,
      }));
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
      useCareerStore.setState((state) => ({
        ...state,
        currentWeek: 5,
        pendingSchoolPathSelection: true,
      }));
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
      useCareerStore.getState().takeWeeklyAction("TRAIN_SHOOTING");
      useCareerStore.getState().adjustGpa(-0.7, "SYSTEM");
    });

    expect(screen.getByText("Action plan complete. Raise GPA to 2.0 to unlock the match.")).toBeTruthy();

    fireEvent.press(screen.getByText("Play Match"));
    expect(useCareerStore.getState().view).toBe("HUB");

    act(() => {
      useCareerStore.getState().adjustGpa(0.1, "SYSTEM");
    });

    fireEvent.press(screen.getByText("Play Match"));
    expect(useCareerStore.getState().view).toBe("MATCH");
  });
});
