import { act, fireEvent, render } from "@testing-library/react-native";
import { KeyMomentOverlay } from "../components/KeyMomentOverlay";
import type { KeyMomentPending } from "../../../match/keyMoments/types";

const pendingMinigame: KeyMomentPending = {
  id: "pending-1",
  scenario: "offense_shot",
  context: {
    id: "ctx-1",
    periodKey: "Q1",
    quarter: 1,
    timeRemaining: 600,
    offense: "home",
    defense: "away",
    userTeam: "home",
    userPlayerIndex: 0,
    possessionIndex: 4,
    score: { home: 0, away: 0 },
  },
  promptText: "Key Moment: Find your shooting window and place the shot.",
  mode: "minigame",
  minigame: {
    type: "aim_shot_placement",
    durationMs: 2800,
    targetCenter: 0.5,
    targetRadius: 0.14,
  },
  simBaselineQuality: 0.55,
};

describe("KeyMomentOverlay", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("resolves only once when timeout and tap happen close together", () => {
    const onResolve = jest.fn();
    const screen = render(<KeyMomentOverlay pending={pendingMinigame} onResolve={onResolve} />);

    act(() => {
      jest.advanceTimersByTime(2810);
    });

    const shootButton = screen.getByText("Locked");
    fireEvent.press(shootButton);

    expect(onResolve).toHaveBeenCalledTimes(1);
    expect(onResolve).toHaveBeenCalledWith(expect.objectContaining({ pendingId: "pending-1", minigameQuality: 0 }));
  });
});
