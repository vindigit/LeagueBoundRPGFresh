import { act, fireEvent, render } from "@testing-library/react-native";
import { scoreTimingChallenge } from "../../../match/keyMoments/actionChallenges";
import { KeyMomentOverlay, type KeyMomentContextSummary } from "../components/KeyMomentOverlay";
import type { KeyMomentPending } from "../../../match/keyMoments/types";

const contextSummary: KeyMomentContextSummary = {
  score: "42 - 39",
  period: "Q3",
  clock: "5:21",
  fatigue: "Medium",
  workRate: "80 (High)",
  focus: "50 (Medium)",
  matchup: "PG Playmaker • On offense vs AWAY",
};

const pendingChoice: KeyMomentPending = {
  id: "pending-choice-1",
  type: "make_the_read",
  context: {
    id: "ctx-1",
    periodKey: "Q3",
    quarter: 3,
    timeRemaining: 321,
    offense: "home",
    defense: "away",
    userTeam: "home",
    userPlayerIndex: 0,
    possessionIndex: 4,
    score: { home: 42, away: 39 },
    workRate: 80,
    focus: 50,
  },
  promptText: "Key Moment: Make the read before the help defense closes.",
  mode: "choice",
  options: [
    { id: "kick_out", label: "Kick Out", description: "Trust the weak-side pass.", qualityDelta: 0.1 },
    { id: "attack_gap", label: "Attack Gap", description: "Turn the lane opening into a finish.", qualityDelta: 0.02 },
  ],
  simBaselineQuality: 0.55,
};

const pendingPlaceholder: KeyMomentPending = {
  ...pendingChoice,
  id: "pending-placeholder-1",
  type: "create_shot",
  mode: "minigame",
  options: [{ id: "timing_release_jump_shot", label: "Timing Release Jumper", description: "Create space and fire.", qualityDelta: 0 }],
  challenge: {
    id: "challenge-pending-placeholder-1",
    kind: "timing",
    context: "pullup",
    title: "Timing Release",
    subtitle: "Tap when the marker hits the window.",
    buttonLabel: "Tap to Release",
    execution: {
      kind: "timing",
      timing: {
        durationMs: 1000,
        targetCenter: 0.72,
        targetRadius: 0.1,
      },
    },
    scoring: {
      successThreshold: 0.66,
      nearMissThreshold: 0.3,
      baselineFloor: 0.72,
      outsideWindowPenalty: 0.5,
      fallbackPenalty: 0.06,
    },
    forgiveness: {
      windowRadiusBonus: 0,
      nearMissSoftener: 0,
      recoveryBonus: 0,
      fatigueResistance: 0,
    },
  },
  minigame: {
    type: "timing_release",
    durationMs: 1000,
    targetCenter: 0.72,
    targetRadius: 0.1,
  },
};

describe("KeyMomentOverlay", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders prompt, context, options, and sim-it action", () => {
    const onResolve = jest.fn();
    const screen = render(
      <KeyMomentOverlay pending={pendingChoice} contextSummary={contextSummary} onResolve={onResolve} />,
    );

    expect(screen.getByText(pendingChoice.promptText)).toBeTruthy();
    expect(screen.getByText("42 - 39")).toBeTruthy();
    expect(screen.getByText("Q3")).toBeTruthy();
    expect(screen.getByText("5:21")).toBeTruthy();
    expect(screen.getByText("Medium")).toBeTruthy();
    expect(screen.getByText("80 (High)")).toBeTruthy();
    expect(screen.getByText("50 (Medium)")).toBeTruthy();
    expect(screen.getByText("PG Playmaker • On offense vs AWAY")).toBeTruthy();
    expect(screen.getByText("Kick Out")).toBeTruthy();
    expect(screen.getByText("Sim It")).toBeTruthy();
  });

  it("resolves a selected choice", () => {
    const onResolve = jest.fn();
    const screen = render(
      <KeyMomentOverlay pending={pendingChoice} contextSummary={contextSummary} onResolve={onResolve} />,
    );

    fireEvent.press(screen.getByText("Kick Out"));

    expect(onResolve).toHaveBeenCalledWith({ pendingId: "pending-choice-1", choiceId: "kick_out" });
  });

  it("supports sim-it baseline resolution", () => {
    const onResolve = jest.fn();
    const screen = render(
      <KeyMomentOverlay pending={pendingChoice} contextSummary={contextSummary} onResolve={onResolve} />,
    );

    fireEvent.press(screen.getByText("Sim It"));

    expect(onResolve).toHaveBeenCalledWith({ pendingId: "pending-choice-1", usedFallbackBaseline: true });
  });

  it("renders the timing-release minigame and submits real minigame quality", () => {
    const onResolve = jest.fn();
    const screen = render(
      <KeyMomentOverlay pending={pendingPlaceholder} contextSummary={contextSummary} onResolve={onResolve} />,
    );

    expect(screen.getByText("Timing Release")).toBeTruthy();
    expect(screen.queryByText("Minigame Shell Placeholder")).toBeNull();
    act(() => {
      jest.advanceTimersByTime(720);
    });
    fireEvent.press(screen.getByTestId("timing-release-button"));
    expect(onResolve).toHaveBeenCalledWith({
      pendingId: "pending-placeholder-1",
      executionQuality: expect.objectContaining({
        normalizedScore: expect.any(Number),
        source: "minigame",
      }),
    });
    const normalizedScore = onResolve.mock.calls[0][0].executionQuality.normalizedScore as number;
    expect(normalizedScore).toBeGreaterThan(0.95);
  });

  it("still supports sim-it from the minigame placeholder", () => {
    const onResolve = jest.fn();
    const screen = render(
      <KeyMomentOverlay pending={pendingPlaceholder} contextSummary={contextSummary} onResolve={onResolve} />,
    );

    fireEvent.press(screen.getByText("Sim It"));
    expect(onResolve).toHaveBeenCalledWith({ pendingId: "pending-placeholder-1", usedFallbackBaseline: true });
  });

  it("scores near-center timing releases higher than early ones", () => {
    const nearCenter = scoreTimingChallenge(0.72, pendingPlaceholder.challenge!).normalizedScore;
    const early = scoreTimingChallenge(0.18, pendingPlaceholder.challenge!).normalizedScore;

    expect(nearCenter).toBeGreaterThan(early);
    expect(nearCenter).toBeGreaterThan(0.95);
    expect(early).toBeLessThan(0.3);
  });

  it("ignores repeat taps after the first minigame submission", () => {
    const onResolve = jest.fn();
    const screen = render(
      <KeyMomentOverlay pending={pendingPlaceholder} contextSummary={contextSummary} onResolve={onResolve} />,
    );

    act(() => {
      jest.advanceTimersByTime(720);
    });
    fireEvent.press(screen.getByTestId("timing-release-button"));
    fireEvent.press(screen.getByTestId("timing-release-button"));

    expect(onResolve).toHaveBeenCalledTimes(1);
  });
});
