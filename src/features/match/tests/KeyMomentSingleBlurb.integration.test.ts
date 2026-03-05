import { act, renderHook } from "@testing-library/react-native";
import { useMatchLoop } from "../hooks/useMatchLoop";
import { useMatchStore } from "../store/useMatchStore";
import type { CareerActions, CareerState } from "../../../types/career";
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
    } as unknown as CareerState & CareerActions),
}));

describe("Key Moment single-blurb behavior", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useMatchStore.getState().initializeMatch("Test Player", "Rivals High");
    useMatchStore.getState().setSimulationMode("interactive");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not log setup separately and logs one combined key moment line on resolve", () => {
    renderHook(() => useMatchLoop());
    act(() => {
      useMatchStore.getState().startMatch();
    });

    let safety = 0;
    while (!useMatchStore.getState().keyMomentPending && safety < 180) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      safety += 1;
    }

    const pending = useMatchStore.getState().keyMomentPending;
    expect(pending).toBeDefined();
    const beforeResolveCount = useMatchStore.getState().logs.filter((log) => log.text.includes("Key Moment (")).length;

    act(() => {
      useMatchStore.getState().resolveKeyMoment({
        pendingId: pending!.id,
        choiceId: pending!.mode === "choice" ? pending!.options?.[0]?.id : undefined,
        minigameQuality: pending!.mode === "minigame" ? 0.9 : undefined,
      });
    });

    let resolveSafety = 0;
    while (useMatchStore.getState().keyMomentPending && resolveSafety < 30) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      resolveSafety += 1;
    }

    const stateAfterResolve = useMatchStore.getState();
    const keyMomentLogs = stateAfterResolve.logs.filter((log) => log.text.includes("Key Moment"));
    expect(keyMomentLogs.length).toBe(beforeResolveCount + 1);
    expect(keyMomentLogs[0].text).toMatch(/Key Moment \((Success|Failed)\):/);
    expect(stateAfterResolve.keyMomentFeedback).toBeDefined();
  });
});
