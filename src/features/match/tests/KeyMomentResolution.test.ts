import { resolveKeyMoment, tryResolveKeyMoment } from "../../../match/keyMoments/resolveKeyMoment";
import { buildCreateShotPending } from "../../../match/keyMoments/createShot";
import { buildFoulPressurePending } from "../../../match/keyMoments/foulPressure";
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
    workRate: 80,
    focus: 50,
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

  it("keeps key moment lifecycle out of useMatchStore", () => {
    const state = useMatchStore.getState() as unknown as Record<string, unknown>;

    expect("keyMomentPending" in state).toBe(false);
    expect("keyMomentResolutionInput" in state).toBe(false);
    expect("setKeyMomentPending" in state).toBe(false);
    expect("resolveKeyMoment" in state).toBe(false);
    expect("clearKeyMomentResolution" in state).toBe(false);
  });

  it("resolves create_shot choices into different shot outcomes", () => {
    const pending = buildPending("create_shot", ["timing_release_jump_shot"], {
      mode: "minigame",
      minigame: {
        type: "timing_release",
        durationMs: 1000,
        targetCenter: 0.72,
        targetRadius: 0.1,
      },
    });

    const aggressive = resolveKeyMoment({
      pending,
      input: {
        pendingId: pending.id,
        executionQuality: { normalizedScore: 0.88, source: "minigame" },
      },
      context,
      possessionState,
    });
    const contested = resolveKeyMoment({
      pending,
      input: {
        pendingId: pending.id,
        executionQuality: { normalizedScore: 0.22, source: "minigame" },
      },
      context,
      possessionState,
    });

    expect(aggressive.result.eventType).toBe("made_3");
    expect(contested.result.eventType).toBe("block");
  });

  it("lets explicit execution quality drive minigame-mode resolution", () => {
    const pending = buildPending("create_shot", ["timing_release_jump_shot"], {
      mode: "minigame",
      minigame: {
        type: "timing_release",
        durationMs: 1000,
        targetCenter: 0.72,
        targetRadius: 0.1,
      },
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

    expect(resolved.quality).toBeCloseTo(0.49, 5);
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

  it("resolves offensive foul pressure into a two-shot free-throw trip", () => {
    const pending = buildPending("foul_pressure", ["rip_through", "go_strong", "fade_away"], {
      foulType: "shooting",
      freeThrowMode: "two_shots",
      defenderTeamFoulsInSegment: 3,
    });

    const resolved = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "rip_through" },
      context,
      possessionState,
    });

    expect(resolved.result.eventType).toBe("free_throws");
    expect(resolved.result.freeThrows).toMatchObject({
      mode: "two_shots",
      attempted: 2,
      shooterIndex: pending.context.userPlayerIndex,
      foulOnTeam: "away",
    });
  });

  it("emits a minor ankle sprain consequence on a low-quality go-strong finish", () => {
    const pending = buildPending("foul_pressure", ["rip_through", "go_strong", "fade_away"], {
      foulType: "shooting",
      freeThrowMode: "two_shots",
      defenderTeamFoulsInSegment: 3,
    });

    const resolved = resolveKeyMoment({
      pending,
      input: {
        pendingId: pending.id,
        choiceId: "go_strong",
        executionQuality: { normalizedScore: 0.18, source: "choice" },
      },
      context,
      possessionState,
    });

    expect(resolved.consequences).toEqual([
      {
        kind: "injury",
        injuryType: "ankle_sprain",
        severity: "minor",
        weeksRemaining: 2,
        performanceMultiplier: 0.88,
        canPlayThrough: true,
        wearTearDelta: 10,
      },
    ]);
  });

  it("resolves defensive bonus foul pressure into a one-and-one", () => {
    const pending = buildPending("foul_pressure", ["wall_up", "swipe_down", "body_check"], {
      context: {
        id: "ctx-foul-defense-1",
        periodKey: "Q2",
        quarter: 2,
        timeRemaining: 250,
        offense: "away",
        defense: "home",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 18,
        score: { home: 22, away: 21 },
        workRate: 75,
        focus: 48,
      },
      foulType: "bonus",
      freeThrowMode: "one_and_one",
      defenderTeamFoulsInSegment: 6,
    });

    const resolved = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "swipe_down" },
      context,
      possessionState: {
        ...possessionState,
        offenseKey: "away",
        defenseKey: "home",
      },
    });

    expect(resolved.result.eventType).toBe("free_throws");
    expect(resolved.result.freeThrows?.mode).toBe("one_and_one");
    expect(resolved.result.freeThrows?.attempted).toBeLessThanOrEqual(2);
  });

  it("resolves defensive deep-bonus foul pressure into two shots", () => {
    const pending = buildPending("foul_pressure", ["wall_up", "swipe_down", "body_check"], {
      context: {
        id: "ctx-foul-defense-2",
        periodKey: "Q4",
        quarter: 4,
        timeRemaining: 80,
        offense: "away",
        defense: "home",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 40,
        score: { home: 51, away: 52 },
        workRate: 82,
        focus: 42,
      },
      foulType: "bonus",
      freeThrowMode: "two_shots",
      defenderTeamFoulsInSegment: 9,
    });

    const resolved = resolveKeyMoment({
      pending,
      input: { pendingId: pending.id, choiceId: "body_check" },
      context,
      possessionState: {
        ...possessionState,
        offenseKey: "away",
        defenseKey: "home",
      },
    });

    expect(resolved.result.eventType).toBe("free_throws");
    expect(resolved.result.freeThrows).toMatchObject({
      mode: "two_shots",
      attempted: 2,
      foulOnTeam: "home",
      foulOnPlayerIndex: 0,
    });
  });

  it("builds create_shot pending as a timing-release minigame", () => {
    const pending = buildCreateShotPending({
      id: "pending-create-shot",
      context: {
        id: "ctx-create-shot",
        periodKey: "Q1",
        quarter: 1,
        timeRemaining: 620,
        offense: "home",
        defense: "away",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 10,
        score: { home: 10, away: 9 },
        workRate: 80,
        focus: 50,
      },
      matchContext: context,
      possessionState,
      seedValue: 123,
    });

    expect(pending).toBeDefined();
    expect(pending?.mode).toBe("minigame");
    expect(pending?.minigame?.type).toBe("timing_release");
    expect(pending?.options).toHaveLength(1);
    expect(pending?.options[0]?.id).toBe("timing_release_jump_shot");
  });

  it("builds foul_pressure pending with bonus metadata", () => {
    const pending = buildFoulPressurePending({
      id: "pending-foul-pressure",
      context: {
        id: "ctx-foul-pressure",
        periodKey: "Q2",
        quarter: 2,
        timeRemaining: 330,
        offense: "away",
        defense: "home",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 14,
        score: { home: 18, away: 16 },
        workRate: 70,
        focus: 52,
      },
      matchContext: context,
      possessionState: {
        ...possessionState,
        offenseKey: "away",
        defenseKey: "home",
      },
      seedValue: 123,
      defenderTeamFoulsInSegment: 6,
    });

    expect(pending).toBeDefined();
    expect(pending?.type).toBe("foul_pressure");
    expect(pending?.foulType).toBe("bonus");
    expect(pending?.freeThrowMode).toBe("one_and_one");
    expect(pending?.defenderTeamFoulsInSegment).toBe(6);
  });
});
