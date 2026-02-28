import {
  createSeededRng,
  initializePossession,
  simulatePossession,
  type MatchContext,
  type PossessionResult,
  type PossessionState,
} from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { Player, PlayerAttributes } from "../src/types/player";
import type { Team } from "../src/types/team";

const VALID_ACTIONS = new Set(["pass", "shoot", "dribble"]);
const VALID_SHOT_ZONES = new Set(["three", "midrange", "rim"]);
const VALID_EVENT_TYPES = new Set([
  "turnover",
  "steal",
  "block",
  "made_2",
  "made_3",
  "miss",
  "off_reb",
  "def_reb",
  "putback_make",
  "putback_miss",
]);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const baseAttributes: PlayerAttributes = {
  shooting: 60,
  finishing: 60,
  vision: 60,
  handle: 60,
  athleticism: 60,
  defense: 60,
  rebounding: 60,
  bbiq: 60,
  stamina: 60,
};

const makePlayer = (id: string, attrOverrides: Partial<PlayerAttributes> = {}): Player => ({
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
  attributes: {
    ...baseAttributes,
    ...attrOverrides,
  },
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

const makeTeam = (prefix: string, attrOverridesForAllPlayers: Partial<PlayerAttributes> = {}): Team => ({
  name: `${prefix}-team`,
  teamOvr: 0,
  roster: [
    makePlayer(`${prefix}1`, attrOverridesForAllPlayers),
    makePlayer(`${prefix}2`, attrOverridesForAllPlayers),
    makePlayer(`${prefix}3`, attrOverridesForAllPlayers),
    makePlayer(`${prefix}4`, attrOverridesForAllPlayers),
    makePlayer(`${prefix}5`, attrOverridesForAllPlayers),
  ],
});

const makeContext = (
  homeOverrides: Partial<PlayerAttributes> = {},
  awayOverrides: Partial<PlayerAttributes> = {},
): MatchContext => ({
  home: makeTeam("h", homeOverrides),
  away: makeTeam("a", awayOverrides),
});

const runPossessions = (
  context: MatchContext,
  seed: number,
  count: number,
  secondsRemaining = 20 * 60,
): Array<{ result: PossessionResult; prevState: PossessionState }> => {
  const rng = createSeededRng(seed);
  let state = initializePossession(context, LeagueLevel.PRO, rng, secondsRemaining);
  const steps: Array<{ result: PossessionResult; prevState: PossessionState }> = [];

  for (let i = 0; i < count && state.secondsRemaining > 0; i += 1) {
    const prevState = state;
    const result = simulatePossession(context, prevState, LeagueLevel.PRO, rng);
    steps.push({ result, prevState });
    state = result.nextState;
  }

  return steps;
};

const assertFiniteNonNegativeResult = (result: PossessionResult, prevState: PossessionState): void => {
  expect(VALID_ACTIONS.has(result.action)).toBe(true);
  expect(VALID_EVENT_TYPES.has(result.eventType)).toBe(true);
  expect(typeof result.turnoverLikeFailure).toBe("boolean");
  expect(typeof result.madeShot).toBe("boolean");
  expect(typeof result.assisted).toBe("boolean");
  expect(typeof result.offensiveRebound).toBe("boolean");
  expect(typeof result.putbackAttempted).toBe("boolean");
  expect(typeof result.defensivePlay.steal).toBe("boolean");
  expect(typeof result.defensivePlay.block).toBe("boolean");
  expect(Array.isArray(result.trace)).toBe(true);
  expect(result.trace.length).toBeGreaterThan(0);

  if (!result.turnoverLikeFailure) {
    expect(result.shotZone).toBeDefined();
    expect(VALID_SHOT_ZONES.has(result.shotZone ?? "")).toBe(true);
  }

  expect(isFiniteNumber(result.nextState.secondsRemaining)).toBe(true);
  expect(isFiniteNumber(result.nextState.score.home)).toBe(true);
  expect(isFiniteNumber(result.nextState.score.away)).toBe(true);
  expect(isFiniteNumber(result.nextState.possessionIndex)).toBe(true);

  expect(result.nextState.secondsRemaining).toBeGreaterThanOrEqual(0);
  expect(result.nextState.score.home).toBeGreaterThanOrEqual(0);
  expect(result.nextState.score.away).toBeGreaterThanOrEqual(0);
  expect(result.nextState.possessionIndex).toBeGreaterThanOrEqual(1);

  // Clock should always move forward or hit floor; never increase.
  expect(result.nextState.secondsRemaining).toBeLessThanOrEqual(prevState.secondsRemaining);
  // Possession progression should be exact +1 each step.
  expect(result.nextState.possessionIndex).toBe(prevState.possessionIndex + 1);
};

describe("matchEngine extreme attribute invariants", () => {
  it("stamina=0 remains stable and finite across deterministic possessions", () => {
    const context = makeContext({ stamina: 0 }, {});
    const steps = runPossessions(context, 20260301, 40);

    expect(steps.length).toBeGreaterThan(0);
    for (const { result, prevState } of steps) {
      assertFiniteNonNegativeResult(result, prevState);
    }
  });

  it("bbiq=99 with shooting=0 yields valid deterministic outputs without NaN drift", () => {
    const context = makeContext({ bbiq: 99, shooting: 0 }, {});
    const steps = runPossessions(context, 20260302, 40);

    expect(steps.length).toBeGreaterThan(0);
    for (const { result, prevState } of steps) {
      assertFiniteNonNegativeResult(result, prevState);
    }
  });

  it("defense=99 with all other attributes=0 on defense team remains robust", () => {
    const defenseExtreme: Partial<PlayerAttributes> = {
      shooting: 0,
      finishing: 0,
      vision: 0,
      handle: 0,
      athleticism: 0,
      defense: 99,
      rebounding: 0,
      bbiq: 0,
      stamina: 0,
    };
    const context = makeContext({}, defenseExtreme);
    const steps = runPossessions(context, 20260303, 40);

    expect(steps.length).toBeGreaterThan(0);
    for (const { result, prevState } of steps) {
      assertFiniteNonNegativeResult(result, prevState);
    }
  });
});
