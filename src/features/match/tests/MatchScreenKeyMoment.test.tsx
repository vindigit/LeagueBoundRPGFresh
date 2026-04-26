import { act, fireEvent, render } from "@testing-library/react-native";
import { buildMakeTheReadPending } from "../../../match/keyMoments/makeTheRead";
import { MatchScreen } from "../screens/MatchScreen";
import { useMatchEngineStore } from "../store/useMatchEngineStore";
import { useMatchStore } from "../store/useMatchStore";
import type { CareerActions, CareerState } from "../../../types/career";
import type { MatchContext } from "../../../matchEngine";
import type { KeyMomentPending } from "../../../match/keyMoments/types";
import type { Player } from "../../../types/player";
import type { PlayerAttributes } from "../../../types/player";

const baseAttributes: PlayerAttributes = {
  shortRange: 70,
  dunking: 75,
  midrange: 76,
  threePoint: 80,
  handle: 72,
  passing: 65,
  vision: 74,
  perimeterDefense: 68,
  interiorDefense: 58,
  stealing: 66,
  blocking: 48,
  offRebounding: 48,
  defRebounding: 50,
  speed: 75,
  strength: 68,
  stamina: 80,
};

jest.mock("../hooks/useMatchLoop", () => ({
  useMatchLoop: () => undefined,
}));

jest.mock("../../../store/useCareerStore", () => ({
  useCareerStore: (selector: (state: CareerState & CareerActions) => unknown) =>
    selector({
      player: {
        id: "test-player",
        name: "Test Player",
        age: 18,
        bankBalance: 0,
        morale: 50,
        position: "PG" as const,
        secondaryPosition: "SG" as const,
        archetype: "Playmaker" as const,
        identity: null,
        dna: null,
        attributes: { ...baseAttributes },
        gameStats: {
          points: 0,
          assists: 0,
          rebounds: 0,
          steals: 0,
          blocks: 0,
          fga: 0,
          fgm: 0,
        },
      },
      completeMatch: jest.fn(),
    } as unknown as CareerState & CareerActions),
}));

const pendingChoice: KeyMomentPending = {
  id: "screen-pending-1",
  type: "make_the_read",
  context: {
    id: "screen-ctx-1",
    periodKey: "Q2",
    quarter: 2,
    timeRemaining: 185,
    offense: "home",
    defense: "away",
    userTeam: "home",
    userPlayerIndex: 0,
    possessionIndex: 8,
    score: { home: 34, away: 30 },
    workRate: 62,
    focus: 44,
  },
  promptText: "Key Moment: Make the read before the help defense closes.",
  mode: "choice",
  options: [
    { id: "kick_out", label: "Kick Out", description: "Trust the pass.", qualityDelta: 0.1 },
    { id: "attack_gap", label: "Attack Gap", description: "Turn the corner.", qualityDelta: 0.02 },
  ],
  simBaselineQuality: 0.55,
};

const makePlayer = (id: string, name: string): Player => ({
  id,
  name,
  age: 18,
  bankBalance: 0,
  morale: 50,
  position: "PG",
  secondaryPosition: "SG",
  archetype: "Playmaker",
  identity: null,
  dna: null,
  attributes: { ...baseAttributes },
  gameStats: {
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0,
    fga: 0,
    fgm: 0,
  },
});

const matchContext: MatchContext = {
  home: {
    name: "Home",
    teamOvr: 0,
    roster: [
      makePlayer("h1", "Test Player"),
      makePlayer("h2", "Home SG"),
      makePlayer("h3", "Home SF"),
      makePlayer("h4", "Home PF"),
      makePlayer("h5", "Home C"),
    ] as MatchContext["home"]["roster"],
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [
      makePlayer("a1", "Away PG"),
      makePlayer("a2", "Away SG"),
      makePlayer("a3", "Away SF"),
      makePlayer("a4", "Away PF"),
      makePlayer("a5", "Away C"),
    ] as MatchContext["away"]["roster"],
  },
};

const pendingMinigame: KeyMomentPending = {
  ...pendingChoice,
  id: "screen-pending-minigame-1",
  type: "create_shot",
  mode: "minigame",
  options: [
    { id: "timing_release_jump_shot", label: "Timing Release Jumper", description: "Create space and shoot.", qualityDelta: 0 },
  ],
  minigame: {
    type: "timing_release",
    durationMs: 1000,
    targetCenter: 0.72,
    targetRadius: 0.1,
  },
};

const originalResolveKeyMoment = useMatchEngineStore.getState().resolveKeyMoment;

describe("MatchScreen key moment UI", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useMatchEngineStore.getState().resetRuntime();
    useMatchEngineStore.setState(() => ({ resolveKeyMoment: originalResolveKeyMoment }));
    useMatchStore.getState().initializeMatch("Test Player", "Rivals High");
  });

  afterEach(() => {
    act(() => {
      useMatchEngineStore.getState().resetRuntime();
      useMatchEngineStore.setState(() => ({ resolveKeyMoment: originalResolveKeyMoment }));
    });
    jest.useRealTimers();
  });

  it("renders pending key moments and wires sim-it through the store", () => {
    const resolveKeyMoment = jest.fn();
    const screen = render(<MatchScreen />);

    act(() => {
      useMatchStore.getState().updateGame({
        homeScore: 34,
        awayScore: 30,
        quarter: 2,
        timeRemaining: 185,
      });
      useMatchEngineStore.setState((state) => ({
        snapshot: {
          ...state.snapshot,
          pendingKeyMoment: pendingChoice,
          userMatchState: {
            baseWorkRate: 80,
            baseFocus: 50,
            workRate: 62,
            focus: 44,
          },
        },
        resolveKeyMoment,
      }));
    });

    expect(screen.getByText(pendingChoice.promptText)).toBeTruthy();
    expect(screen.getByText("34 - 30")).toBeTruthy();
    expect(screen.getByText("62 (Medium)")).toBeTruthy();
    expect(screen.getByText("44 (Low)")).toBeTruthy();
    expect(screen.getByText("PG Playmaker • On offense vs AWAY")).toBeTruthy();

    fireEvent.press(screen.getByText("Sim It"));

    expect(resolveKeyMoment).toHaveBeenCalledWith({
      pendingId: "screen-pending-1",
      usedFallbackBaseline: true,
    });
  });

  it("renders playable create_shot minigames and wires minigame quality through the store", () => {
    const resolveKeyMoment = jest.fn();
    const screen = render(<MatchScreen />);

    act(() => {
      useMatchStore.getState().updateGame({
        homeScore: 34,
        awayScore: 30,
        quarter: 2,
        timeRemaining: 185,
      });
      useMatchEngineStore.setState((state) => ({
        snapshot: {
          ...state.snapshot,
          pendingKeyMoment: pendingMinigame,
          userMatchState: {
            baseWorkRate: 80,
            baseFocus: 50,
            workRate: 62,
            focus: 44,
          },
        },
        resolveKeyMoment,
      }));
    });

    expect(screen.getByText(pendingMinigame.promptText)).toBeTruthy();
    expect(screen.getByText("Timing Release")).toBeTruthy();
    expect(screen.queryByText("Minigame Shell Placeholder")).toBeNull();

    act(() => {
      jest.advanceTimersByTime(720);
    });
    fireEvent.press(screen.getByTestId("timing-release-button"));

    expect(resolveKeyMoment).toHaveBeenCalledTimes(1);
    expect(resolveKeyMoment).toHaveBeenCalledWith({
      pendingId: "screen-pending-minigame-1",
      executionQuality: {
        normalizedScore: expect.any(Number),
        source: "minigame",
      },
    });
  });

  it("renders contextual choice copy that matches the generated situation", () => {
    const resolveKeyMoment = jest.fn();
    const pending = buildMakeTheReadPending({
      id: "screen-pending-contextual-1",
      context: {
        id: "screen-ctx-contextual-1",
        periodKey: "Q4",
        quarter: 4,
        timeRemaining: 185,
        offense: "home",
        defense: "away",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 8,
        score: { home: 34, away: 38 },
        workRate: 62,
        focus: 44,
      },
      matchContext,
      possessionState: {
        offenseKey: "home",
        defenseKey: "away",
        secondsRemaining: 185,
        possessionIndex: 8,
        ballHandlerIndex: 0,
        homeTouches: [4, 0, 0, 0, 0],
        awayTouches: [0, 0, 0, 0, 0],
        score: { home: 34, away: 38 },
        homeStreak: 0,
        awayStreak: 0,
      },
      userMatchState: {
        baseWorkRate: 80,
        baseFocus: 50,
        workRate: 62,
        focus: 44,
      },
      seedValue: 123,
    });
    const screen = render(<MatchScreen />);

    act(() => {
      useMatchStore.getState().updateGame({
        homeScore: 34,
        awayScore: 38,
        quarter: 4,
        timeRemaining: 185,
      });
      useMatchEngineStore.setState((state) => ({
        snapshot: {
          ...state.snapshot,
          pendingKeyMoment: pending,
          userMatchState: {
            baseWorkRate: 80,
            baseFocus: 50,
            workRate: 62,
            focus: 44,
          },
        },
        resolveKeyMoment,
      }));
    });

    expect(screen.getByText("34 - 38")).toBeTruthy();
    expect(screen.getByText("44 (Low)")).toBeTruthy();
    expect(screen.getByText(pending!.options[0]!.label)).toBeTruthy();
    expect(screen.getByText(pending!.options[0]!.description)).toBeTruthy();
    expect(screen.getByText(pending!.options[2]!.description)).toBeTruthy();
  });
});
