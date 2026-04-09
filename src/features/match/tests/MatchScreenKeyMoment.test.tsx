import { act, fireEvent, render } from "@testing-library/react-native";
import { MatchScreen } from "../screens/MatchScreen";
import { useMatchStore } from "../store/useMatchStore";
import type { CareerActions, CareerState } from "../../../types/career";
import type { KeyMomentPending } from "../../../match/keyMoments/types";
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
  },
  promptText: "Key Moment: Make the read before the help defense closes.",
  mode: "choice",
  options: [
    { id: "kick_out", label: "Kick Out", description: "Trust the pass.", qualityDelta: 0.1 },
    { id: "attack_gap", label: "Attack Gap", description: "Turn the corner.", qualityDelta: 0.02 },
  ],
  simBaselineQuality: 0.55,
};

describe("MatchScreen key moment UI", () => {
  beforeEach(() => {
    useMatchStore.getState().initializeMatch("Test Player", "Rivals High");
  });

  it("renders pending key moments and wires sim-it through the store", () => {
    const screen = render(<MatchScreen />);

    act(() => {
      useMatchStore.getState().updateGame({
        homeScore: 34,
        awayScore: 30,
        quarter: 2,
        timeRemaining: 185,
      });
      useMatchStore.getState().setKeyMomentPending(pendingChoice);
    });

    expect(screen.getByText(pendingChoice.promptText)).toBeTruthy();
    expect(screen.getByText("34 - 30")).toBeTruthy();
    expect(screen.getByText("PG Playmaker • On offense vs AWAY")).toBeTruthy();

    fireEvent.press(screen.getByText("Sim It"));

    expect(useMatchStore.getState().keyMomentResolutionInput).toEqual({
      pendingId: "screen-pending-1",
      usedFallbackBaseline: true,
    });
  });
});
