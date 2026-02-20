import { act, renderHook } from "@testing-library/react-native";
import { useMatchStore } from "../store/useMatchStore";
import { useMatchLoop } from "../hooks/useMatchLoop";

import type { CareerState } from "../../../types/career";
import type { CareerActions } from "../../../types/career";

jest.mock("../../../store/useCareerStore", () => ({
  useCareerStore: (selector: (state: CareerState & CareerActions) => unknown) =>
    selector({
      player: {
        id: "test-player",
        name: "Test Player",
        age: 18,
        BankBalance: 0,
        Morale: 50,
        Position: "PG" as const,
        archetype: "Playmaker" as const,
        attributes: {
          shooting: 80,
          finishing: 70,
          vision: 65,
          handle: 72,
          athleticism: 75,
          defense: 68,
          rebounding: 50,
          bbiq: 74,
          stamina: 80,
        },
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
    } as CareerState & CareerActions),
}));

describe("Terminal Match Simulation", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useMatchStore.getState().initializeMatch("Terminal City", "Console United");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("plays a full quarter and logs output", () => {
    renderHook(() => useMatchLoop());

    console.log("\n=== TIP OFF ===\n");
    act(() => {
      useMatchStore.getState().startMatch();
    });

    for (let i = 0; i < 12; i += 1) {
      act(() => {
        jest.advanceTimersByTime(60 * 1000);
      });

      const state = useMatchStore.getState();
      console.log(
        `[${state.quarter}Q - ${state.timeRemaining}s left] Score: ${state.homeScore} - ${state.awayScore}`,
      );
    }

    const finalLogs = useMatchStore.getState().logs;
    console.log("\n=== PLAY-BY-PLAY HIGHLIGHTS ===");
    finalLogs.slice(0, 10).forEach((log) => {
      console.log(`[${log.timeRemaining}] ${log.text}`);
    });

    console.log("\nSimulation Complete");
  });
});
