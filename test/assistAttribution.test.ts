import { createSeededRng, initializePossession, simulatePossession, type MatchContext } from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { Player, PlayerAttributes } from "../src/types/player";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 78,
  dunking: 78,
  midrange: 75,
  threePoint: 75,
  handle: 80,
  passing: 90,
  vision: 90,
  perimeterDefense: 70,
  interiorDefense: 70,
  stealing: 70,
  blocking: 70,
  offRebounding: 70,
  defRebounding: 70,
  speed: 78,
  strength: 74,
  stamina: 85,
  ...overrides,
});

const makePlayer = (id: string, attributes = makeAttributes()): Player => ({
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
  attributes,
  gameStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 },
});

const makeTeam = (prefix: string) => ({
  name: `${prefix}-team`,
  teamOvr: 0,
  roster: [makePlayer(`${prefix}1`), makePlayer(`${prefix}2`), makePlayer(`${prefix}3`), makePlayer(`${prefix}4`), makePlayer(`${prefix}5`)] as const,
});

describe("assist attribution", () => {
  it("only awards assists on made immediate pass->shot outcomes", () => {
    const context: MatchContext = { home: makeTeam("h"), away: makeTeam("a") };
    const rng = createSeededRng(9001);
    let state = initializePossession(context, LeagueLevel.PRO, rng, 3000);

    let assistedMakes = 0;
    for (let i = 0; i < 180 && state.secondsRemaining > 0; i += 1) {
      const result = simulatePossession(context, state, LeagueLevel.PRO, rng);
      if (result.assisted) {
        assistedMakes += 1;
        expect(result.action).toBe("pass");
        expect(result.madeShot).toBe(true);
        expect(result.assisterIndex).toBeDefined();
      }
      if (result.eventType === "putback_make" || result.eventType === "putback_miss") {
        expect(result.assisted).toBe(false);
        expect(result.assisterIndex).toBeUndefined();
      }
      state = result.nextState;
    }

    expect(assistedMakes).toBeGreaterThan(0);
  });
});
