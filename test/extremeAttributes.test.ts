import {
  createSeededRng,
  initializePossession,
  simulatePossession,
  type MatchContext,
  type PossessionResult,
  type PossessionState,
  type ShotZone,
} from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { PlayerAttributes, Player } from "../src/types/player";
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

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 60,
  dunking: 60,
  midrange: 60,
  threePoint: 60,
  handle: 60,
  passing: 60,
  vision: 60,
  perimeterDefense: 60,
  interiorDefense: 60,
  stealing: 60,
  blocking: 60,
  offRebounding: 60,
  defRebounding: 60,
  speed: 60,
  strength: 60,
  stamina: 60,
  ...overrides,
});

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
  attributes: makeAttributes(attrOverrides),
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
    if (result.rimAttemptType !== undefined) {
      expect(result.shotZone).toBe("rim");
      expect(["layup", "dunk"]).toContain(result.rimAttemptType);
    }
  }

  expect(isFiniteNumber(result.nextState.secondsRemaining)).toBe(true);
  expect(isFiniteNumber(result.nextState.score.home)).toBe(true);
  expect(isFiniteNumber(result.nextState.score.away)).toBe(true);
  expect(isFiniteNumber(result.nextState.possessionIndex)).toBe(true);

  expect(result.nextState.secondsRemaining).toBeGreaterThanOrEqual(0);
  expect(result.nextState.score.home).toBeGreaterThanOrEqual(0);
  expect(result.nextState.score.away).toBeGreaterThanOrEqual(0);
  expect(result.nextState.possessionIndex).toBeGreaterThanOrEqual(1);

  expect(result.nextState.secondsRemaining).toBeLessThanOrEqual(prevState.secondsRemaining);
  expect(result.nextState.possessionIndex).toBe(prevState.possessionIndex + 1);
};

const getNonTurnoverResults = (steps: Array<{ result: PossessionResult; prevState: PossessionState }>): PossessionResult[] =>
  steps.map(({ result }) => result).filter((result) => !result.turnoverLikeFailure);

const getZoneRate = (results: PossessionResult[], zone: ShotZone): number => {
  if (results.length === 0) {
    return 0;
  }
  return results.filter((result) => result.shotZone === zone).length / results.length;
};

const getMakeRate = (results: PossessionResult[]): number => {
  if (results.length === 0) {
    return 0;
  }
  return results.filter((result) => result.madeShot).length / results.length;
};

const getBlockRate = (results: PossessionResult[]): number => {
  if (results.length === 0) {
    return 0;
  }
  return results.filter((result) => result.eventType === "block").length / results.length;
};

const getStealRate = (results: PossessionResult[]): number => {
  if (results.length === 0) {
    return 0;
  }
  return results.filter((result) => result.eventType === "steal").length / results.length;
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

  it("vision=99 with threePoint=0 yields valid deterministic outputs without NaN drift", () => {
    const context = makeContext({ vision: 99, threePoint: 0, midrange: 0, shortRange: 0 }, {});
    const steps = runPossessions(context, 20260302, 40);

    expect(steps.length).toBeGreaterThan(0);
    for (const { result, prevState } of steps) {
      assertFiniteNonNegativeResult(result, prevState);
    }
  });

  it("defense-heavy team with weak offense remains robust", () => {
    const defenseExtreme: Partial<PlayerAttributes> = {
      shortRange: 0,
      dunking: 0,
      midrange: 0,
      threePoint: 0,
      passing: 0,
      handle: 0,
      speed: 0,
      perimeterDefense: 99,
      interiorDefense: 99,
      defRebounding: 0,
      offRebounding: 0,
      vision: 0,
      stamina: 0,
    };
    const context = makeContext({}, defenseExtreme);
    const steps = runPossessions(context, 20260303, 40);

    expect(steps.length).toBeGreaterThan(0);
    for (const { result, prevState } of steps) {
      assertFiniteNonNegativeResult(result, prevState);
    }
  });

  it("zone selection responds to threePoint, midrange, and shortRange/dunking", () => {
    const highThree = getNonTurnoverResults(
      runPossessions(makeContext({ threePoint: 99, midrange: 30, shortRange: 30, dunking: 20 }, {}), 20260304, 320, 6000),
    );
    const highMid = getNonTurnoverResults(
      runPossessions(makeContext({ threePoint: 30, midrange: 99, shortRange: 30, dunking: 20 }, {}), 20260305, 320, 6000),
    );
    const highRim = getNonTurnoverResults(
      runPossessions(makeContext({ threePoint: 30, midrange: 30, shortRange: 99, dunking: 99 }, {}), 20260306, 320, 6000),
    );

    expect(getZoneRate(highThree, "three")).toBeGreaterThan(getZoneRate(highMid, "three"));
    expect(getZoneRate(highThree, "three")).toBeGreaterThan(getZoneRate(highRim, "three"));
    expect(getZoneRate(highMid, "midrange")).toBeGreaterThan(getZoneRate(highThree, "midrange"));
    expect(getZoneRate(highMid, "midrange")).toBeGreaterThan(getZoneRate(highRim, "midrange"));
    expect(getZoneRate(highRim, "rim")).toBeGreaterThan(getZoneRate(highThree, "rim"));
    expect(getZoneRate(highRim, "rim")).toBeGreaterThan(getZoneRate(highMid, "rim"));
  });

  it("high dunking slashers produce more dunk attempts than low dunking finishers", () => {
    const highDunkResults = getNonTurnoverResults(
      runPossessions(
        makeContext({ shortRange: 95, dunking: 99, speed: 90, strength: 88, threePoint: 20, midrange: 20 }, {}),
        20260307,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "rim");
    const lowDunkResults = getNonTurnoverResults(
      runPossessions(
        makeContext({ shortRange: 95, dunking: 20, speed: 90, strength: 88, threePoint: 20, midrange: 20 }, {}),
        20260308,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "rim");

    const highDunks = highDunkResults.filter((result) => result.rimAttemptType === "dunk").length;
    const lowDunks = lowDunkResults.filter((result) => result.rimAttemptType === "dunk").length;

    expect(highDunkResults.length).toBeGreaterThan(0);
    expect(lowDunkResults.length).toBeGreaterThan(0);
    expect(highDunks).toBeGreaterThan(0);
    expect(lowDunks).toBe(0);
    expect(highDunks / highDunkResults.length).toBeGreaterThan(0.2);
  });

  it("perimeter and rim contests use the matching defender attribute", () => {
    const perimeterShooter = { threePoint: 92, midrange: 88, shortRange: 20, dunking: 20 };
    const rimShooter = { threePoint: 20, midrange: 20, shortRange: 92, dunking: 85, speed: 84, strength: 84 };

    const perimeterDefenseResults = getNonTurnoverResults(
      runPossessions(
        makeContext(perimeterShooter, { perimeterDefense: 95, interiorDefense: 20, blocking: 20 }),
        20260309,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "three" || result.shotZone === "midrange");
    const interiorOnlyAgainstPerimeterResults = getNonTurnoverResults(
      runPossessions(
        makeContext(perimeterShooter, { perimeterDefense: 20, interiorDefense: 95, blocking: 20 }),
        20260310,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "three" || result.shotZone === "midrange");

    const interiorDefenseResults = getNonTurnoverResults(
      runPossessions(
        makeContext(rimShooter, { perimeterDefense: 20, interiorDefense: 95, blocking: 20 }),
        20260311,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "rim");
    const perimeterOnlyAgainstRimResults = getNonTurnoverResults(
      runPossessions(
        makeContext(rimShooter, { perimeterDefense: 95, interiorDefense: 20, blocking: 20 }),
        20260312,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "rim");

    expect(getMakeRate(perimeterDefenseResults)).toBeLessThan(getMakeRate(interiorOnlyAgainstPerimeterResults));
    expect(getMakeRate(interiorDefenseResults)).toBeLessThan(getMakeRate(perimeterOnlyAgainstRimResults));
  });

  it("blocking plus interiorDefense mostly matters at the rim", () => {
    const rimHighBlockResults = getNonTurnoverResults(
      runPossessions(
        makeContext({ threePoint: 20, midrange: 20, shortRange: 96, dunking: 88, speed: 82, strength: 86 }, { blocking: 99, interiorDefense: 99 }),
        20260313,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "rim");
    const rimLowBlockResults = getNonTurnoverResults(
      runPossessions(
        makeContext({ threePoint: 20, midrange: 20, shortRange: 96, dunking: 88, speed: 82, strength: 86 }, { blocking: 10, interiorDefense: 10 }),
        20260314,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "rim");
    const perimeterHighBlockResults = getNonTurnoverResults(
      runPossessions(
        makeContext({ threePoint: 96, midrange: 88, shortRange: 20, dunking: 20 }, { blocking: 99, interiorDefense: 99 }),
        20260315,
        320,
        6000,
      ),
    ).filter((result) => result.shotZone === "three" || result.shotZone === "midrange");

    expect(getBlockRate(rimHighBlockResults)).toBeGreaterThan(getBlockRate(rimLowBlockResults));
    expect(getBlockRate(rimHighBlockResults)).toBeGreaterThan(getBlockRate(perimeterHighBlockResults));
  });

  it("steal rate responds to defender stealing and speed", () => {
    const highStealResults = runPossessions(
      makeContext(
        { handle: 55, passing: 50, vision: 50 },
        { stealing: 99, speed: 99, perimeterDefense: 40, interiorDefense: 40, blocking: 40 },
      ),
      20260316,
      360,
      7000,
    ).map(({ result }) => result);
    const lowStealResults = runPossessions(
      makeContext(
        { handle: 55, passing: 50, vision: 50 },
        { stealing: 10, speed: 10, perimeterDefense: 40, interiorDefense: 40, blocking: 40 },
      ),
      20260317,
      360,
      7000,
    ).map(({ result }) => result);

    expect(getStealRate(highStealResults)).toBeGreaterThan(getStealRate(lowStealResults));
  });
});
