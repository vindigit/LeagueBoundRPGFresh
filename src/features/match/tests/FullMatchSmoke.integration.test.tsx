import { act, fireEvent, render } from "@testing-library/react-native";
import { MatchScreen } from "../screens/MatchScreen";
import { useMatchEngineStore } from "../store/useMatchEngineStore";
import { useMatchStore } from "../store/useMatchStore";
import type { CareerActions, CareerState } from "../../../types/career";
import type { PlayerAttributes } from "../../../types/player";

const FIXED_TIMESTAMP = 1700000000000;

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

const mockCompleteMatch = jest.fn();

const mockCareerState = {
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
    attributes: baseAttributes,
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
  completeMatch: mockCompleteMatch,
} as unknown as CareerState & CareerActions;

jest.mock("../../../store/useCareerStore", () => ({
  useCareerStore: (selector: (state: CareerState & CareerActions) => unknown) => selector(mockCareerState),
}));

const advanceUntil = (predicate: () => boolean, safetyLimit: number, stepMs = 1000): number => {
  let safety = 0;

  while (!predicate() && safety < safetyLimit) {
    act(() => {
      jest.advanceTimersByTime(stepMs);
    });
    safety += 1;
  }

  return safety;
};

describe("Full match smoke flow", () => {
  let dateNowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockCompleteMatch.mockReset();
    dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(FIXED_TIMESTAMP);
    useMatchEngineStore.getState().resetRuntime();
    useMatchStore.getState().initializeMatch("Test Player", "Rivals High");
  });

  afterEach(() => {
    act(() => {
      useMatchEngineStore.getState().resetRuntime();
    });
    dateNowSpy.mockRestore();
    jest.useRealTimers();
  });

  it("plays a full interactive match from tipoff through key moment resolution and persists postgame results", () => {
    const screen = render(<MatchScreen />);

    act(() => {
      useMatchStore.getState().setSimSpeed(4);
    });

    fireEvent.press(screen.getByText("Start Game"));

    const pendingWaitTicks = advanceUntil(() => Boolean(useMatchEngineStore.getState().snapshot.pendingKeyMoment), 180);
    expect(pendingWaitTicks).toBeLessThan(180);

    const pendingSnapshot = useMatchEngineStore.getState().snapshot;
    const pendingKeyMoment = pendingSnapshot.pendingKeyMoment;
    expect(pendingKeyMoment).toBeDefined();
    expect(pendingSnapshot.pausedForPendingPossession).toBe(true);

    const pendingPossessionCount = pendingSnapshot.lastStep?.metrics.possessions;
    const pendingTraceId = pendingSnapshot.lastTrace?.id;
    expect(typeof pendingPossessionCount).toBe("number");
    expect(typeof pendingTraceId).toBe("number");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    const stillPendingSnapshot = useMatchEngineStore.getState().snapshot;
    expect(stillPendingSnapshot.pendingKeyMoment?.id).toBe(pendingKeyMoment?.id);
    expect(stillPendingSnapshot.lastStep?.metrics.possessions).toBe(pendingPossessionCount);
    expect(stillPendingSnapshot.lastTrace?.id).toBe(pendingTraceId);

    fireEvent.press(screen.getByText("Sim It"));

    const resolvedSnapshot = useMatchEngineStore.getState().snapshot;
    expect(resolvedSnapshot.pendingKeyMoment).toBeUndefined();
    expect(resolvedSnapshot.pausedForPendingPossession).toBe(false);
    expect(resolvedSnapshot.lastTrace?.kind).toBe("resolved_key_moment");
    expect(resolvedSnapshot.lastStep?.metrics.possessions).toBe((pendingPossessionCount ?? 0) + 1);

    const firstResolvedTraceId = resolvedSnapshot.lastTrace?.id;
    const firstResolvedPossessionCount = resolvedSnapshot.lastStep?.metrics.possessions;

    act(() => {
      useMatchEngineStore.getState().resolveKeyMoment({
        pendingId: pendingKeyMoment!.id,
        usedFallbackBaseline: true,
      });
    });

    const afterSecondResolve = useMatchEngineStore.getState().snapshot;
    expect(afterSecondResolve.pendingKeyMoment).toBeUndefined();
    expect(afterSecondResolve.lastTrace?.id).toBe(firstResolvedTraceId);
    expect(afterSecondResolve.lastStep?.metrics.possessions).toBe(firstResolvedPossessionCount);

    let finishSafety = 0;
    while (!useMatchStore.getState().gameFinished && finishSafety < 1200) {
      const matchState = useMatchStore.getState();
      const engineSnapshot = useMatchEngineStore.getState().snapshot;
      if (engineSnapshot.pendingKeyMoment) {
        fireEvent.press(screen.getByText("Sim It"));
      } else if (!matchState.isPlaying && matchState.isPaused) {
        act(() => {
          useMatchStore.getState().startMatch();
        });
      }

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      finishSafety += 1;
    }
    expect(finishSafety).toBeLessThan(1200);

    act(() => {
      jest.advanceTimersByTime(0);
    });

    const finalMatchState = useMatchStore.getState();
    expect(finalMatchState.gameFinished).toBe(true);
    expect(mockCompleteMatch).toHaveBeenCalledTimes(1);

    const persistedResult = mockCompleteMatch.mock.calls[0]?.[0];
    expect(persistedResult).toBeDefined();
    expect(persistedResult.homeScore).toBe(finalMatchState.homeScore);
    expect(persistedResult.awayScore).toBe(finalMatchState.awayScore);
    expect(persistedResult.overtimePeriods).toBe(finalMatchState.overtimePeriod);
    expect(persistedResult.boxScore.homeTotals.pts).toBe(finalMatchState.homeScore);
    expect(persistedResult.boxScore.awayTotals.pts).toBe(finalMatchState.awayScore);
    expect(finalMatchState.matchBoxScore.homeTotals.pts).toBe(finalMatchState.homeScore);
    expect(finalMatchState.matchBoxScore.awayTotals.pts).toBe(finalMatchState.awayScore);
  });
});
