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

const makePlayer = (id: string): Player => ({
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
  attributes: makeAttributes(),
  gameStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 },
});

const makeTeam = (prefix: string) => ({
  name: `${prefix}-team`,
  teamOvr: 0,
  roster: [makePlayer(`${prefix}1`), makePlayer(`${prefix}2`), makePlayer(`${prefix}3`), makePlayer(`${prefix}4`), makePlayer(`${prefix}5`)] as const,
});

describe("matchEngineAdapter determinism", () => {
  it("preserves engine-selected ball handler from possession result", () => {
    const adapter = createMatchEngineAdapter({
      home: makeTeam("h"),
      away: makeTeam("a"),
      userPlayerId: "h1",
      seed: 112233,
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
});
