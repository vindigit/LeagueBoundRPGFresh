import {
  createSeededRng,
  initializePossession,
  simulatePossession,
  type MatchContext,
  type PossessionState,
} from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { OldPlayerAttributes, Player, PlayerArchetype } from "../src/types/player";
import type { Team } from "../src/types/team";

// TODO: Sprint 2 — update to new 16-attr shape when match engine is rewritten
const makePlayer = (
  id: string,
  archetype: PlayerArchetype,
  attributes: OldPlayerAttributes,
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
  attributes: attributes as any, // TODO: Sprint 2 — match engine still reads old 9-attr keys
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
  const highHandler: OldPlayerAttributes = {
    shooting: 65,
    finishing: 64,
    vision: 78,
    handle: 85,
    athleticism: 70,
    defense: 72,
    rebounding: 58,
    bbiq: 82,
    stamina: 80,
  };
  const lowHandler: OldPlayerAttributes = {
    shooting: 62,
    finishing: 60,
    vision: 28,
    handle: 28,
    athleticism: 67,
    defense: 66,
    rebounding: 63,
    bbiq: 28,
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
});
