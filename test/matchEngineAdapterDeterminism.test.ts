import { createMatchEngineAdapter } from "../src/matchEngineAdapter";
import type { Player, PlayerAttributes } from "../src/types/player";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 70,
  dunking: 70,
  midrange: 70,
  threePoint: 70,
  handle: 70,
  passing: 70,
  vision: 70,
  perimeterDefense: 70,
  interiorDefense: 70,
  stealing: 70,
  blocking: 70,
  offRebounding: 70,
  defRebounding: 70,
  speed: 70,
  strength: 70,
  stamina: 70,
  ...overrides,
});

const makePlayer = (id: string, attributeOverrides: Partial<PlayerAttributes> = {}): Player => ({
  id,
  name: id,
  age: 19,
  bankBalance: 0,
  morale: 50,
  position: "PG",
  secondaryPosition: "SG",
  archetype: "Playmaker",
  identity: null,
  dna: null,
  attributes: makeAttributes(attributeOverrides),
  gameStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 },
});

const makeTeam = (prefix: string, rosterOverrides: Array<Partial<PlayerAttributes>> = []) => ({
  name: `${prefix}-team`,
  teamOvr: 0,
  roster: [
    makePlayer(`${prefix}1`, rosterOverrides[0]),
    makePlayer(`${prefix}2`, rosterOverrides[1]),
    makePlayer(`${prefix}3`, rosterOverrides[2]),
    makePlayer(`${prefix}4`, rosterOverrides[3]),
    makePlayer(`${prefix}5`, rosterOverrides[4]),
  ] as [Player, Player, Player, Player, Player],
});

const buildUserControlOptions = () => ({
  home: makeTeam("h", [
    { handle: 98, vision: 98, passing: 98, stamina: 88 },
    { handle: 20, vision: 20, passing: 20, stamina: 60 },
    { handle: 20, vision: 20, passing: 20, stamina: 60 },
    { handle: 20, vision: 20, passing: 20, stamina: 60 },
    { handle: 20, vision: 20, passing: 20, stamina: 60 },
  ]),
  away: makeTeam("a", [
    { handle: 30, vision: 30, passing: 30, stamina: 60 },
    { handle: 30, vision: 30, passing: 30, stamina: 60 },
    { handle: 30, vision: 30, passing: 30, stamina: 60 },
    { handle: 30, vision: 30, passing: 30, stamina: 60 },
    { handle: 30, vision: 30, passing: 30, stamina: 60 },
  ]),
});

const stepUntilKeyMoment = (adapter: ReturnType<typeof createMatchEngineAdapter>, maxSteps = 12) => {
  for (let i = 0; i < maxSteps; i += 1) {
    const step = adapter.stepPossession();
    if (step.keyMoment) {
      return step;
    }
  }
  return undefined;
};

describe("matchEngineAdapter determinism", () => {
  it("preserves engine-selected ball handler from possession result", () => {
    const adapter = createMatchEngineAdapter({
      home: makeTeam("h"),
      away: makeTeam("a"),
      userPlayerId: "h1",
      seed: 112233,
      enableKeyMoments: false,
    });

    adapter.startGame();

    for (let i = 0; i < 20; i += 1) {
      const step = adapter.stepPossession();
      expect(step.result).toBeDefined();
      expect(step.state.ballHandlerIndex).toBe(step.result!.nextState.ballHandlerIndex);
    }
  });

  it("is deterministic by seed for aggregate outputs", () => {
    const run = (seed: number) => {
      const adapter = createMatchEngineAdapter({
        home: makeTeam("h"),
        away: makeTeam("a"),
        userPlayerId: "h1",
        seed,
        enableKeyMoments: false,
      });
      adapter.startGame();
      return adapter.runPossessions(80);
    };

    const a = run(2026);
    const b = run(2026);
    const c = run(2027);

    expect(b).toEqual(a);
    expect(c).not.toEqual(a);
  });

  it("seeds user match state from stamina and updates it after possessions", () => {
    const adapter = createMatchEngineAdapter({
      ...buildUserControlOptions(),
      userPlayerId: "h1",
      seed: 77,
      enableKeyMoments: false,
    });

    const started = adapter.startGame();
    expect(started.userMatchState).toEqual({
      baseWorkRate: 88,
      baseFocus: 50,
      workRate: 88,
      focus: 50,
    });

    const stepped = adapter.stepPossession();
    expect(stepped.result).toBeDefined();
    expect(stepped.userMatchState).toBeDefined();
    expect(stepped.userMatchState!.workRate).toBeLessThan(stepped.userMatchState!.baseWorkRate);
    expect(stepped.userMatchState!.focus).toBeLessThanOrEqual(stepped.userMatchState!.baseFocus);
  });

  it("changes workRate and focus based on key moment success versus failure", () => {
    const createAdapter = () =>
      createMatchEngineAdapter({
        home: makeTeam("h", [
          { handle: 98, vision: 98, passing: 98, stamina: 90 },
          { handle: 95, vision: 95, passing: 95, stamina: 90 },
          { handle: 95, vision: 95, passing: 95, stamina: 90 },
          { handle: 95, vision: 95, passing: 95, stamina: 90 },
          { handle: 95, vision: 95, passing: 95, stamina: 90 },
        ]),
        away: makeTeam("a", [
          { handle: 25, vision: 25, passing: 25, stamina: 60 },
          { handle: 25, vision: 25, passing: 25, stamina: 60 },
          { handle: 25, vision: 25, passing: 25, stamina: 60 },
          { handle: 25, vision: 25, passing: 25, stamina: 60 },
          { handle: 25, vision: 25, passing: 25, stamina: 60 },
        ]),
        userPlayerId: "a1",
        seed: 2026,
        secondsRemaining: 90,
      });

    const resolveWithQuality = (normalizedScore: number) => {
      const adapter = createAdapter();
      adapter.startGame();
      const step = stepUntilKeyMoment(adapter);
      expect(step?.keyMoment).toBeDefined();

      return adapter.resolvePendingKeyMoment({
        pendingId: step!.keyMoment!.id,
        choiceId: step!.keyMoment!.options[0]?.id,
        executionQuality: {
          normalizedScore,
          source: "minigame",
        },
      });
    };

    const success = resolveWithQuality(0.9);
    const failure = resolveWithQuality(0.1);

    expect(success.resolvedKeyMoment?.success).toBe(true);
    expect(failure.resolvedKeyMoment?.success).toBe(false);
    expect(success.userMatchState!.focus).toBeGreaterThan(failure.userMatchState!.focus);
    expect(success.userMatchState!.workRate).toBeGreaterThan(failure.userMatchState!.workRate);
  });
});
