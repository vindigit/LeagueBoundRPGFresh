import { resolveKeyMoment } from "../../../match/keyMoments/resolveKeyMoment";
import type { KeyMomentPending } from "../../../match/keyMoments/types";
import type { MatchContext } from "../../../matchEngine";
import { useMatchStore } from "../store/useMatchStore";

const context = {
  home: { name: "Home", teamOvr: 0, roster: [] },
  away: { name: "Away", teamOvr: 0, roster: [] },
} as unknown as MatchContext;

const pendingChoice: KeyMomentPending = {
  id: "km-choice-1",
  scenario: "offense_choice",
  context: {
    id: "ctx-1",
    periodKey: "Q1",
    quarter: 1,
    timeRemaining: 620,
    offense: "home",
    defense: "away",
    userTeam: "home",
    userPlayerIndex: 0,
    possessionIndex: 10,
    score: { home: 0, away: 0 },
  },
  promptText: "Choose",
  mode: "choice",
  options: [
    { id: "a", label: "A", description: "A", qualityDelta: 0.2 },
    { id: "b", label: "B", description: "B", qualityDelta: -0.1 },
  ],
  simBaselineQuality: 0.55,
};

const pendingShot: KeyMomentPending = {
  id: "km-shot-1",
  scenario: "offense_shot",
  context: {
    id: "ctx-shot-1",
    periodKey: "Q1",
    quarter: 1,
    timeRemaining: 620,
    offense: "home",
    defense: "away",
    userTeam: "home",
    userPlayerIndex: 0,
    possessionIndex: 10,
    score: { home: 0, away: 0 },
  },
  promptText: "Shoot",
  mode: "minigame",
  minigame: {
    type: "aim_shot_placement",
    durationMs: 2800,
    targetCenter: 0.5,
    targetRadius: 0.14,
  },
  simBaselineQuality: 0.55,
};

const pendingDefenseChoice: KeyMomentPending = {
  ...pendingChoice,
  id: "km-defense-choice-1",
  scenario: "defense_choice",
  context: {
    ...pendingChoice.context,
    id: "ctx-defense-1",
    offense: "away",
    defense: "home",
  },
};

describe("Key Moment resolution", () => {
  beforeEach(() => {
    useMatchStore.getState().initializeMatch("User", "Away");
  });

  it("maps quality bucket to made shot when choice improves quality", () => {
    const resolved = resolveKeyMoment({
      pending: pendingChoice,
      input: { pendingId: "km-choice-1", choiceId: "a" },
      context,
      possessionState: {
        offenseKey: "home",
        defenseKey: "away",
        secondsRemaining: 620,
        possessionIndex: 10,
        score: { home: 10, away: 9 },
      },
    });
    expect(resolved.quality).toBeGreaterThanOrEqual(0.75);
    expect(["made_2", "made_3"]).toContain(resolved.result.eventType);
    expect(typeof resolved.resultSummaryText).toBe("string");
    expect(resolved.resultSummaryText.length).toBeGreaterThan(0);
    expect(resolved.success).toBe(true);
  });

  it("rejects second resolve attempt in store (one-and-done)", () => {
    useMatchStore.getState().setKeyMomentPending(pendingChoice);
    useMatchStore.getState().resolveKeyMoment({ pendingId: pendingChoice.id, choiceId: "a" });
    const first = useMatchStore.getState().keyMomentResolutionInput;
    expect(first?.choiceId).toBe("a");

    useMatchStore.getState().resolveKeyMoment({ pendingId: pendingChoice.id, choiceId: "b" });
    const second = useMatchStore.getState().keyMomentResolutionInput;
    expect(second?.choiceId).toBe("a");
  });

  it("keeps the user involved on away offense via defender index", () => {
    const resolved = resolveKeyMoment({
      pending: pendingDefenseChoice,
      input: { pendingId: "km-defense-choice-1", choiceId: "a" },
      context,
      possessionState: {
        offenseKey: "away",
        defenseKey: "home",
        secondsRemaining: 500,
        possessionIndex: 11,
        score: { home: 12, away: 12 },
      },
    });

    expect(resolved.result.shooterIndex).not.toBe(pendingDefenseChoice.context.userPlayerIndex);
    expect(resolved.result.defensivePlay.defenderIndex).toBe(pendingDefenseChoice.context.userPlayerIndex);
    expect(typeof resolved.success).toBe("boolean");
    expect(typeof resolved.resultSummaryText).toBe("string");
  });

  it("maps shot minigame quality deterministically to shot-only outcomes", () => {
    const high = resolveKeyMoment({
      pending: pendingShot,
      input: { pendingId: "km-shot-1", minigameQuality: 0.9 },
      context,
      possessionState: {
        offenseKey: "home",
        defenseKey: "away",
        secondsRemaining: 620,
        possessionIndex: 10,
        score: { home: 0, away: 0 },
      },
    });
    const mid = resolveKeyMoment({
      pending: pendingShot,
      input: { pendingId: "km-shot-1", minigameQuality: 0.65 },
      context,
      possessionState: {
        offenseKey: "home",
        defenseKey: "away",
        secondsRemaining: 620,
        possessionIndex: 10,
        score: { home: 0, away: 0 },
      },
    });
    const low = resolveKeyMoment({
      pending: pendingShot,
      input: { pendingId: "km-shot-1", minigameQuality: 0.45 },
      context,
      possessionState: {
        offenseKey: "home",
        defenseKey: "away",
        secondsRemaining: 620,
        possessionIndex: 10,
        score: { home: 0, away: 0 },
      },
    });
    const veryLow = resolveKeyMoment({
      pending: pendingShot,
      input: { pendingId: "km-shot-1", minigameQuality: 0.1 },
      context,
      possessionState: {
        offenseKey: "home",
        defenseKey: "away",
        secondsRemaining: 620,
        possessionIndex: 10,
        score: { home: 0, away: 0 },
      },
    });

    expect(high.result.eventType).toBe("made_3");
    expect(high.success).toBe(true);
    expect(mid.result.eventType).toBe("made_2");
    expect(mid.success).toBe(true);
    expect(low.result.eventType).toBe("miss");
    expect(low.success).toBe(false);
    expect(veryLow.result.eventType).toBe("block");
    expect(veryLow.success).toBe(false);
    expect(["steal", "turnover"]).not.toContain(high.result.eventType);
    expect(["steal", "turnover"]).not.toContain(mid.result.eventType);
    expect(["steal", "turnover"]).not.toContain(low.result.eventType);
    expect(["steal", "turnover"]).not.toContain(veryLow.result.eventType);
  });
});
