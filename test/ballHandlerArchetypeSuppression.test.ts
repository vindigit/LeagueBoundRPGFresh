import {
  createSeededRng,
  initializePossession,
  simulatePossession,
  type MatchContext,
  type PossessionState,
} from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { PlayerAttributes, Player, PlayerArchetype } from "../src/types/player";
import type { Team } from "../src/types/team";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 65,
  dunking: 64,
  midrange: 65,
  threePoint: 65,
  handle: 65,
  passing: 65,
  vision: 65,
  perimeterDefense: 65,
  interiorDefense: 65,
  stealing: 65,
  blocking: 65,
  offRebounding: 65,
  defRebounding: 65,
  speed: 65,
  strength: 65,
  stamina: 80,
  ...overrides,
});

const makePlayer = (
  id: string,
  archetype: PlayerArchetype,
  attributes: PlayerAttributes,
  position: Player["position"] = "PG",
): Player => ({
  id,
  name: id,
  age: 19,
  bankBalance: 0,
  morale: 50,
  position,
  secondaryPosition: "SG",
  archetype,
  identity: null,
  dna: null,
  attributes,
  gameStats: {
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0,
    fga: 0,
    fgm: 0,
  },
});

const makeTeam = (prefix: string): Team => {
  const highHandler = makeAttributes({
    passing: 78,
    handle: 85,
    speed: 70,
    perimeterDefense: 72,
    defRebounding: 58,
    vision: 82,
  });
  const lowHandler = makeAttributes({
    passing: 28,
    handle: 28,
    speed: 67,
    perimeterDefense: 66,
    defRebounding: 63,
    vision: 28,
  });

  return {
    name: `${prefix}-team`,
    teamOvr: 0,
    roster: [
      makePlayer(`${prefix}1`, "Lockdown Defender", highHandler, "PG"),
      makePlayer(`${prefix}2`, "Playmaker", highHandler, "SG"),
      makePlayer(`${prefix}3`, "Slasher", lowHandler, "SF"),
      makePlayer(`${prefix}4`, "Paint Beast", lowHandler, "PF"),
      makePlayer(`${prefix}5`, "Stretch Big", lowHandler, "C"),
    ],
  };
};

const runSelections = (context: MatchContext, seed: number, possessions: number): number[] => {
  const rng = createSeededRng(seed);
  let state: PossessionState = initializePossession(context, LeagueLevel.PRO, rng, 100_000);
  const counts = [0, 0, 0, 0, 0];

  for (let i = 0; i < possessions && state.secondsRemaining > 0; i += 1) {
    const result = simulatePossession(context, state, LeagueLevel.PRO, rng);
    counts[result.nextState.ballHandlerIndex] += 1;
    state = result.nextState;
  }

  return counts;
};

describe("ball handler archetype suppression", () => {
  it("suppresses Lockdown Defender primary handler frequency versus equivalent Playmaker", () => {
    const context: MatchContext = {
      home: makeTeam("h"),
      away: makeTeam("a"),
    };

    const counts = runSelections(context, 20260303, 900);
    const lockdownSelections = counts[0];
    const playmakerSelections = counts[1];
    const lockdownRate = lockdownSelections / counts.reduce((sum, value) => sum + value, 0);

    expect(playmakerSelections).toBeGreaterThan(lockdownSelections);
    expect(lockdownRate).toBeLessThan(0.25);
  });

  it("is deterministic for identical seeds and diverges for different seeds", () => {
    const context: MatchContext = {
      home: makeTeam("h"),
      away: makeTeam("a"),
    };

    const first = runSelections(context, 42, 200);
    const second = runSelections(context, 42, 200);
    const third = runSelections(context, 43, 200);

    expect(second).toEqual(first);
    expect(third).not.toEqual(first);
  });
});
