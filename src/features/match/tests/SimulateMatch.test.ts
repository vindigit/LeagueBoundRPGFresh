import { act, renderHook } from "@testing-library/react-native";
import { useMatchEngineStore } from "../store/useMatchEngineStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMatchLoop } from "../hooks/useMatchLoop";

import { LeagueLevel, type CareerState } from "../../../types/career";
import type { CareerActions } from "../../../types/career";
import type { MatchEngineStoreStartOptions, MatchEngineStoreState } from "../../../matchEngineStore";
import type { PlayerAttributes } from "../../../types/player";

// TODO: Sprint 2 — update to new 16-attr shape when match engine is rewritten
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

let mockLeagueLevel: LeagueLevel = LeagueLevel.MIDDLE_SCHOOL;

jest.mock("../../../store/useCareerStore", () => ({
  useCareerStore: (selector: (state: CareerState & CareerActions) => unknown) =>
    selector({
      leagueLevel: mockLeagueLevel,
      schoolPath: "LOCAL_3A",
      injury: null,
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
    } as unknown as CareerState & CareerActions),
}));

describe("Terminal Match Simulation", () => {
  jest.setTimeout(30000);
  const originalInitializeRuntime = useMatchEngineStore.getState().initializeRuntime;

  beforeEach(() => {
    jest.useFakeTimers();
    mockLeagueLevel = LeagueLevel.MIDDLE_SCHOOL;
    act(() => {
      useMatchEngineStore.setState(() => ({ initializeRuntime: originalInitializeRuntime }));
    });
    useMatchEngineStore.getState().resetRuntime();
    useMatchStore.getState().initializeMatch("Terminal City", "Console United");
    useMatchStore.getState().setSimulationMode("full_game");
  });

  afterEach(() => {
    act(() => {
      useMatchEngineStore.getState().resetRuntime();
      useMatchEngineStore.setState(() => ({ initializeRuntime: originalInitializeRuntime }));
    });
    jest.useRealTimers();
  });

  it("initializes match runtime with the active career league level", () => {
    const capturedOptions: MatchEngineStoreStartOptions[] = [];
    const initializeRuntime = jest.fn((options: MatchEngineStoreStartOptions): MatchEngineStoreState => {
      capturedOptions.push(options);
      return {
        started: true,
        simulationMode: options.simulationMode ?? "interactive",
        pausedForKeyMoment: false,
        pausedForPendingPossession: false,
        totalSeconds: options.totalSeconds ?? 0,
        autosaveEvents: [],
      };
    });

    mockLeagueLevel = LeagueLevel.MIDDLE_SCHOOL;
    act(() => {
      useMatchEngineStore.setState(() => ({ initializeRuntime }));
    });

    renderHook(() => useMatchLoop());

    expect(initializeRuntime).toHaveBeenCalledTimes(1);
    expect(capturedOptions[0]?.leagueLevel).toBe(LeagueLevel.MIDDLE_SCHOOL);
  });

  it("runs a bounded simulation window and logs aggregate stats", () => {
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
    const TICK_LIMIT = 600;
    for (let tick = 0; tick < TICK_LIMIT; tick += 1) {
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

      if (stateAfterTick.gameFinished) {
        break;
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

    expect(totalEvents).toBeGreaterThan(0);
    expect(finalLogs.length).toBeGreaterThan(0);
    expect(finalState.homeScore).toBeGreaterThanOrEqual(0);
    expect(finalState.awayScore).toBeGreaterThanOrEqual(0);

    console.log("\nSimulation Complete");
  });

  it("does not schedule key moments in full_game mode", () => {
    renderHook(() => useMatchLoop());
    act(() => {
      useMatchStore.getState().setSimulationMode("full_game");
      useMatchStore.getState().startMatch();
    });

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    const state = useMatchStore.getState();
    expect(useMatchEngineStore.getState().snapshot.pendingKeyMoment).toBeUndefined();
    expect(state.logs.some((log) => log.text.includes("Key Moment"))).toBe(false);
  });
});

