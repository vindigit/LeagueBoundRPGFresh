import {
  createSeededRng,
  initializePossession,
  simulatePossession,
  type MatchContext,
  type PossessionState,
} from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { Player, PlayerAttributes, PlayerArchetype } from "../src/types/player";
import type { Team } from "../src/types/team";

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
  const highHandler: PlayerAttributes = {
    shortRange: 64,
    dunking: 60,
    midrange: 60,
    threePoint: 65,
    handle: 85,
    passing: 78,
    vision: 82,
    perimeterDefense: 72,
    interiorDefense: 60,
    stealing: 60,
    blocking: 60,
    offRebounding: 58,
    defRebounding: 58,
    speed: 70,
    strength: 60,
    stamina: 80,
  };
  const lowHandler: PlayerAttributes = {
    shortRange: 60,
    dunking: 60,
    midrange: 60,
    threePoint: 62,
    handle: 28,
    passing: 28,
    vision: 28,
    perimeterDefense: 66,
    interiorDefense: 60,
    stealing: 60,
    blocking: 60,
    offRebounding: 63,
    defRebounding: 63,
    speed: 67,
    strength: 60,
    stamina: 80,
  };

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

describe("ball handler attribute-driven selection", () => {
  it("selects players with high handle+vision+passing far more often than low-attribute players", () => {
    const context: MatchContext = {
      home: makeTeam("h"),
      away: makeTeam("a"),
    };

    const counts = runSelections(context, 20260303, 900);
    const highHandlerSelections = counts[0] + counts[1];
    const lowHandlerSelections = counts[2] + counts[3] + counts[4];

    // High handle+vision+passing players should dominate selection
    expect(highHandlerSelections).toBeGreaterThan(lowHandlerSelections * 2);
  });

  it("does not suppress Lockdown Defender versus Playmaker when attributes are equal", () => {
    const context: MatchContext = {
      home: makeTeam("h"),
      away: makeTeam("a"),
    };

    const counts = runSelections(context, 20260303, 900);
    const lockdownSelections = counts[0];
    const playmakerSelections = counts[1];
    const total = counts.reduce((sum, value) => sum + value, 0);

    // Both players have identical handle+vision+passing, so rates should be similar (within 10% of each other)
    const lockdownRate = lockdownSelections / total;
    const playmakerRate = playmakerSelections / total;
    expect(Math.abs(lockdownRate - playmakerRate)).toBeLessThan(0.1);
  });
});
