import {
  createSeededRng,
  initializePossession,
  simulatePossession,
  type MatchContext,
  type PossessionState,
} from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { Player, PlayerArchetype, PlayerAttributes } from "../src/types/player";
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

const highHandlerAttrs: PlayerAttributes = {
  shortRange: 64,
  dunking: 61,
  midrange: 58,
  threePoint: 65,
  handle: 85,
  passing: 73,
  vision: 82,
  perimeterDefense: 72,
  interiorDefense: 55,
  stealing: 60,
  blocking: 40,
  offRebounding: 46,
  defRebounding: 58,
  speed: 70,
  strength: 60,
  stamina: 80,
};

const lowHandlerAttrs: PlayerAttributes = {
  shortRange: 60,
  dunking: 58,
  midrange: 55,
  threePoint: 62,
  handle: 28,
  passing: 28,
  vision: 28,
  perimeterDefense: 66,
  interiorDefense: 60,
  stealing: 55,
  blocking: 45,
  offRebounding: 50,
  defRebounding: 63,
  speed: 67,
  strength: 65,
  stamina: 80,
};

const makeTeam = (prefix: string): Team => ({
  name: `${prefix}-team`,
  teamOvr: 0,
  roster: [
    makePlayer(`${prefix}1`, "Lockdown Defender", highHandlerAttrs, "PG"),
    makePlayer(`${prefix}2`, "Playmaker", highHandlerAttrs, "SG"),
    makePlayer(`${prefix}3`, "Slasher", lowHandlerAttrs, "SF"),
    makePlayer(`${prefix}4`, "Paint Beast", lowHandlerAttrs, "PF"),
    makePlayer(`${prefix}5`, "Stretch Big", lowHandlerAttrs, "C"),
  ],
});

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

describe("ball handler attribute-weighted selection", () => {
  it("selects high handle+vision+passing players more often than low handle+vision+passing players", () => {
    const context: MatchContext = {
      home: makeTeam("h"),
      away: makeTeam("a"),
    };

    const counts = runSelections(context, 20260303, 900);
    const highHandlerSelections = counts[0] + counts[1];
    const lowHandlerSelections = counts[2] + counts[3] + counts[4];

    expect(highHandlerSelections).toBeGreaterThan(lowHandlerSelections);
  });

  it("does not suppress Lockdown Defender relative to Playmaker when both have equal handle+vision+passing", () => {
    const context: MatchContext = {
      home: makeTeam("h"),
      away: makeTeam("a"),
    };

    const counts = runSelections(context, 20260303, 900);
    const lockdownSelections = counts[0];
    const playmakerSelections = counts[1];

    // With equal attributes and no archetype suppression, selection rates should be comparable.
    // Neither should be more than 3x the other.
    expect(lockdownSelections).toBeGreaterThan(0);
    expect(playmakerSelections).toBeGreaterThan(0);
    const ratio = Math.max(lockdownSelections, playmakerSelections) / Math.min(lockdownSelections, playmakerSelections);
    expect(ratio).toBeLessThan(3);
  });
});
