import { fireEvent, render } from "@testing-library/react-native";
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
  options: [],
};

describe("KeyMomentOverlay", () => {
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

  it("renders a placeholder minigame shell and sim-it action", () => {
    const onResolve = jest.fn();
    const screen = render(
      <KeyMomentOverlay pending={pendingPlaceholder} contextSummary={contextSummary} onResolve={onResolve} />,
    );

    expect(screen.getByText("Minigame Shell Placeholder")).toBeTruthy();
    expect(screen.getByText("Rough Attempt")).toBeTruthy();
    fireEvent.press(screen.getByText("Solid Attempt"));
    expect(onResolve).toHaveBeenCalledWith({
      pendingId: "pending-placeholder-1",
      executionQuality: {
        normalizedScore: 0.62,
        source: "minigame",
      },
    });
  });

  it("still supports sim-it from the minigame placeholder", () => {
    const onResolve = jest.fn();
    const screen = render(
      <KeyMomentOverlay pending={pendingPlaceholder} contextSummary={contextSummary} onResolve={onResolve} />,
    );

    fireEvent.press(screen.getByText("Sim It"));
    expect(onResolve).toHaveBeenCalledWith({ pendingId: "pending-placeholder-1", usedFallbackBaseline: true });
  });
});
