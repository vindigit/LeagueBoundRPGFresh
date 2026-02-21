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
        bankBalance: 0,
        morale: 50,
        position: "PG" as const,
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
  jest.setTimeout(30000);

  beforeEach(() => {
    jest.useFakeTimers();
    useMatchStore.getState().initializeMatch("Terminal City", "Console United");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("plays a full 48-minute game and logs aggregate stats", () => {
    renderHook(() => useMatchLoop());

    console.log("\n=== TIP OFF ===\n");
    act(() => {
      useMatchStore.getState().startMatch();
    });

    const seenLogIds = new Set<string>();
    let totalEvents = 0;
    let scoreEvents = 0;
    let missEvents = 0;
    let turnoverEvents = 0;
    let infoEvents = 0;
    let lastPrintedQuarter = 1;

    while (!useMatchStore.getState().gameFinished) {
      const beforeTick = useMatchStore.getState();
      if (!beforeTick.isPlaying && beforeTick.isPaused) {
        act(() => {
          useMatchStore.getState().startMatch();
        });
      }

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      const stateAfterTick = useMatchStore.getState();
      const logs = stateAfterTick.logs;
      for (const log of logs) {
        if (seenLogIds.has(log.id)) {
          continue;
        }
        seenLogIds.add(log.id);
        totalEvents += 1;

        if (log.type === "score") scoreEvents += 1;
        if (log.type === "miss") missEvents += 1;
        if (log.type === "turnover") turnoverEvents += 1;
        if (log.type === "info") infoEvents += 1;
      }

      if (stateAfterTick.quarter !== lastPrintedQuarter) {
        console.log(`\n=== START Q${stateAfterTick.quarter} ===`);
        lastPrintedQuarter = stateAfterTick.quarter;
      }

      if (stateAfterTick.timeRemaining % 60 === 0) {
        console.log(
          `[${stateAfterTick.quarter}Q - ${stateAfterTick.timeRemaining}s left] Score: ${stateAfterTick.homeScore} - ${stateAfterTick.awayScore}`,
        );
      }
    }

    const finalState = useMatchStore.getState();
    const finalLogs = finalState.logs;

    console.log("\n=== FINAL SCORE ===");
    console.log(`Terminal City ${finalState.homeScore} - ${finalState.awayScore} Console United`);

    console.log("\n=== AGGREGATE STATS ===");
    console.log(`Total logged events: ${totalEvents}`);
    console.log(`Score events: ${scoreEvents}`);
    console.log(`Miss events: ${missEvents}`);
    console.log(`Turnover events: ${turnoverEvents}`);
    console.log(`Info events: ${infoEvents}`);
    console.log(`Stored play-by-play entries (capped): ${finalLogs.length}`);

    console.log("\n=== PLAY-BY-PLAY HIGHLIGHTS ===");
    finalLogs.slice(0, 10).forEach((log) => {
      console.log(`[${log.timeRemaining}] ${log.text}`);
    });

    console.log("\nSimulation Complete");
  });
});
