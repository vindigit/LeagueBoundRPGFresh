import {
  createSeededRng,
  initializePossession,
  pickBallHandlerIndex,
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
  it("prefers players with higher handle, vision, and passing independent of archetype", () => {
    const context: MatchContext = {
      home: makeTeam("h"),
      away: makeTeam("a"),
    };

    const counts = runSelections(context, 20260303, 900);
    const primarySelections = counts[0] + counts[1];
    const supportSelections = counts[2] + counts[3] + counts[4];

    expect(counts[0]).toBeGreaterThan(counts[2]);
    expect(counts[1]).toBeGreaterThan(counts[3]);
    expect(primarySelections).toBeGreaterThan(supportSelections);
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

  it("keeps handler picks in-bounds for both teams", () => {
    const context: MatchContext = {
      home: makeTeam("h"),
      away: makeTeam("a"),
    };
    const rng = createSeededRng(55);
    const emptyTouches = {
      home: [0, 0, 0, 0, 0] as [number, number, number, number, number],
      away: [0, 0, 0, 0, 0] as [number, number, number, number, number],
    };

    const homePick = pickBallHandlerIndex(context.home, "home", emptyTouches, LeagueLevel.PRO, rng);
    const awayPick = pickBallHandlerIndex(context.away, "away", emptyTouches, LeagueLevel.PRO, rng);

    expect(homePick).toBeGreaterThanOrEqual(0);
    expect(homePick).toBeLessThan(5);
    expect(awayPick).toBeGreaterThanOrEqual(0);
    expect(awayPick).toBeLessThan(5);
  });
});
