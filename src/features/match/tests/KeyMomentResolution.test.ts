import { resolveKeyMoment, tryResolveKeyMoment } from "../../../match/keyMoments/resolveKeyMoment";
import type { KeyMomentPending } from "../../../match/keyMoments/types";
import type { MatchContext, PossessionState } from "../../../matchEngine";
import { useMatchStore } from "../store/useMatchStore";

const context = {
  home: { name: "Home", teamOvr: 0, roster: [] },
  away: { name: "Away", teamOvr: 0, roster: [] },
} as unknown as MatchContext;

const possessionState: PossessionState = {
  offenseKey: "home",
  defenseKey: "away",
  secondsRemaining: 620,
  possessionIndex: 10,
  ballHandlerIndex: 0,
  homeTouches: [0, 1, 0, 0, 0],
  awayTouches: [0, 0, 0, 0, 0],
  score: { home: 10, away: 9 },
  homeStreak: 0,
  awayStreak: 0,
};

const buildPending = (
  type: KeyMomentPending["type"],
  optionIds: string[],
  overrides: Partial<KeyMomentPending> = {},
): KeyMomentPending => ({
  id: `pending-${type}`,
  type,
  context: {
    id: `ctx-${type}`,
    periodKey: "Q1",
    quarter: 1,
    timeRemaining: 620,
    offense: type === "on_ball_stop" || type === "jump_lane" ? "away" : "home",
    defense: type === "on_ball_stop" || type === "jump_lane" ? "home" : "away",
    userTeam: "home",
    userPlayerIndex: 0,
    possessionIndex: 10,
    score: { home: 0, away: 0 },
  },
  promptText: `Prompt ${type}`,
  mode: "choice",
  options: optionIds.map((id, index) => ({
    id,
    label: id,
    description: id,
    qualityDelta: index === 0 ? 0.12 : index === 1 ? 0.02 : -0.08,
  })),
  simBaselineQuality: 0.55,
  seedValue: 123,
  ...overrides,
});

describe("Key Moment resolution", () => {
  beforeEach(() => {
    useMatchStore.getState().initializeMatch("User", "Away");
  });

  it("resolves create_shot choices into different shot outcomes", () => {
    const pending = buildPending("create_shot", ["step_back_three", "turn_the_corner", "protect_ball"]);

    const aggressive = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "step_back_three" },
      context,
      possessionState,
    });
    const conservative = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "protect_ball" },
      context,
      possessionState,
    });

    expect(aggressive.result.eventType).toBe("made_3");
    expect(conservative.result.eventType).toBe("miss");
  });

  it("lets explicit execution quality drive minigame-mode resolution", () => {
    const pending = buildPending("create_shot", ["step_back_three", "turn_the_corner", "protect_ball"], {
      mode: "minigame",
    });

    const lowQuality = resolveKeyMoment({
      pending,
      input: {
        pendingId: pending.id,
        executionQuality: { normalizedScore: 0.22, source: "minigame" },
      },
      context,
      possessionState,
    });
    const highQuality = resolveKeyMoment({
      pending,
      input: {
        pendingId: pending.id,
        executionQuality: { normalizedScore: 0.88, source: "minigame" },
      },
      context,
      possessionState,
    });

    expect(lowQuality.result.eventType).toBe("block");
    expect(highQuality.result.eventType).toBe("made_3");
  });

  it("resolves make_the_read choices into different offensive results", () => {
    const pending = buildPending("make_the_read", ["kick_out", "attack_gap", "reset_space"]);

    const kickOut = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "kick_out" },
      context,
      possessionState,
    });
    const attackGap = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "attack_gap" },
      context,
      possessionState,
    });

    expect(kickOut.result.eventType).toBe("made_3");
    expect(attackGap.result.eventType).toBe("made_2");
  });

  it("uses sim baseline quality when fallback baseline is requested", () => {
    const pending = buildPending("make_the_read", ["kick_out", "attack_gap", "reset_space"], {
      mode: "minigame",
      simBaselineQuality: 0.55,
    });

    const resolved = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, usedFallbackBaseline: true },
      context,
      possessionState,
    });

    expect(resolved.quality).toBeCloseTo(0.55, 5);
    expect(resolved.result.eventType).toBe("miss");
  });

  it("prefers executionQuality over legacy minigameQuality", () => {
    const pending = buildPending("make_the_read", ["kick_out", "attack_gap", "reset_space"], {
      mode: "minigame",
    });

    const resolved = resolveKeyMoment({
      pending,
      input: {
        pendingId: pending.id,
        choiceId: "kick_out",
        executionQuality: { normalizedScore: 0.2, source: "minigame" },
        minigameQuality: 0.95,
      },
      context,
      possessionState,
    });

    expect(resolved.quality).toBeCloseTo(0.2, 5);
    expect(resolved.result.eventType).toBe("miss");
  });

  it("keeps the user involved on defensive moments", () => {
    const pending = buildPending("jump_lane", ["shoot_gap", "stunt_recover", "stay_home"]);

    const resolved = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "shoot_gap" },
      context,
      possessionState: {
        ...possessionState,
        offenseKey: "away",
        defenseKey: "home",
      },
    });

    expect(resolved.result.shooterIndex).not.toBe(pending.context.userPlayerIndex);
    expect(resolved.result.defensivePlay.defenderIndex).toBe(pending.context.userPlayerIndex);
  });

  it("rejects second resolve attempt in store (one-and-done)", () => {
    const pending = buildPending("make_the_read", ["kick_out", "attack_gap", "reset_space"]);

    useMatchStore.getState().setKeyMomentPending(pending);
    useMatchStore.getState().resolveKeyMoment({ pendingId: pending.id, choiceId: "kick_out" });
    const first = useMatchStore.getState().keyMomentResolutionInput;
    expect(first?.choiceId).toBe("kick_out");

    useMatchStore.getState().resolveKeyMoment({ pendingId: pending.id, choiceId: "reset_space" });
    const second = useMatchStore.getState().keyMomentResolutionInput;
    expect(second?.choiceId).toBe("kick_out");
  });

  it("returns undefined from dispatcher when the type is unknown", () => {
    const pending = buildPending("create_shot", ["step_back_three", "turn_the_corner", "protect_ball"], {
      type: "unknown" as KeyMomentPending["type"],
    });

    const resolved = tryResolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "step_back_three" },
      context,
      possessionState,
    });

    expect(resolved).toBeUndefined();
  });
});
