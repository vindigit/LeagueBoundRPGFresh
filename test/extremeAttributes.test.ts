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

const getOffensiveReboundRate = (results: PossessionResult[]): number => {
  if (results.length === 0) {
    return 0;
  }
  return results.filter((result) => result.eventType === "off_reb").length / results.length;
};

const averageAcrossSeeds = (seeds: number[], metric: (seed: number) => number): number =>
  seeds.reduce((sum, seed) => sum + metric(seed), 0) / seeds.length;

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
    expect(highDunks / highDunkResults.length).toBeGreaterThan(0.15);
  });

  it("perimeter and rim contests use the matching defender attribute", () => {
    const perimeterShooter = { threePoint: 92, midrange: 88, shortRange: 20, dunking: 20 };
    const rimShooter = { threePoint: 20, midrange: 20, shortRange: 92, dunking: 85, speed: 84, strength: 84 };
    const perimeterSeeds = [20260309, 20260310, 20260311, 20260312];
    const rimSeeds = [20260313, 20260314, 20260315, 20260316];
    const getPerimeterMakeRate = (awayOverrides: Partial<PlayerAttributes>, seed: number): number =>
      getMakeRate(
        getNonTurnoverResults(runPossessions(makeContext(perimeterShooter, awayOverrides), seed, 320, 6000)).filter(
          (result) => result.shotZone === "three" || result.shotZone === "midrange",
        ),
      );
    const getRimMakeRate = (awayOverrides: Partial<PlayerAttributes>, seed: number): number =>
      getMakeRate(
        getNonTurnoverResults(runPossessions(makeContext(rimShooter, awayOverrides), seed, 220, 3600)).filter(
          (result) => result.shotZone === "rim",
        ),
      );

    const perimeterDefenseRate = averageAcrossSeeds(perimeterSeeds, (seed) =>
      getPerimeterMakeRate({ perimeterDefense: 95, interiorDefense: 20, blocking: 20 }, seed),
    );
    const interiorOnlyPerimeterRate = averageAcrossSeeds(perimeterSeeds, (seed) =>
      getPerimeterMakeRate({ perimeterDefense: 20, interiorDefense: 95, blocking: 20 }, seed),
    );
    const interiorDefenseRate = averageAcrossSeeds(rimSeeds, (seed) =>
      getRimMakeRate({ perimeterDefense: 0, interiorDefense: 99, blocking: 20 }, seed),
    );
    const perimeterOnlyRimRate = averageAcrossSeeds(rimSeeds, (seed) =>
      getRimMakeRate({ perimeterDefense: 99, interiorDefense: 0, blocking: 20 }, seed),
    );

    expect(perimeterDefenseRate).toBeLessThan(interiorOnlyPerimeterRate);
    expect(interiorDefenseRate).toBeLessThan(perimeterOnlyRimRate);
  });

  it("blocking plus interiorDefense mostly matters at the rim", () => {
    const rimSeeds = [20260321, 20260322, 20260323, 20260324];
    const perimeterSeeds = [20260325, 20260326, 20260327, 20260328];
    const rimShooter = { threePoint: 20, midrange: 20, shortRange: 70, dunking: 52, speed: 54, strength: 56 };
    const perimeterShooter = { threePoint: 96, midrange: 88, shortRange: 20, dunking: 20 };
    const getRimRates = (awayOverrides: Partial<PlayerAttributes>, seed: number): { make: number; block: number } => {
      const results = getNonTurnoverResults(runPossessions(makeContext(rimShooter, awayOverrides), seed, 480, 9000)).filter(
        (result) => result.shotZone === "rim",
      );
      return { make: getMakeRate(results), block: getBlockRate(results) };
    };
    const getPerimeterBlockRate = (seed: number): number =>
      getBlockRate(
        getNonTurnoverResults(
          runPossessions(makeContext(perimeterShooter, { blocking: 99, interiorDefense: 99 }), seed, 320, 6000),
        ).filter((result) => result.shotZone === "three" || result.shotZone === "midrange"),
      );

    const rimHighBlockMakeRate = averageAcrossSeeds(rimSeeds, (seed) =>
      getRimRates({ blocking: 99, interiorDefense: 99 }, seed).make,
    );
    const rimLowBlockMakeRate = averageAcrossSeeds(rimSeeds, (seed) =>
      getRimRates({ blocking: 0, interiorDefense: 0 }, seed).make,
    );
    const rimHighBlockRate = averageAcrossSeeds(rimSeeds, (seed) =>
      getRimRates({ blocking: 99, interiorDefense: 99 }, seed).block,
    );
    const perimeterHighBlockRate = averageAcrossSeeds(perimeterSeeds, (seed) => getPerimeterBlockRate(seed));

    expect(rimHighBlockMakeRate).toBeLessThan(rimLowBlockMakeRate);
    expect(rimHighBlockRate).toBeGreaterThanOrEqual(perimeterHighBlockRate);
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

  it("offensive rebound rate responds to offRebounding versus defRebounding", () => {
    const seeds = [20260318, 20260319, 20260320, 20260321];
    const averageRate = (context: MatchContext): number =>
      seeds.reduce(
        (sum, seed) => sum + getOffensiveReboundRate(getNonTurnoverResults(runPossessions(context, seed, 180, 3200))),
        0,
      ) / seeds.length;

    const strongRate = averageRate(
      makeContext(
        { shortRange: 20, dunking: 20, midrange: 20, threePoint: 20, offRebounding: 99, stamina: 90 },
        { defRebounding: 0, interiorDefense: 40, blocking: 40, stamina: 90 },
      ),
    );
    const weakRate = averageRate(
      makeContext(
        { shortRange: 20, dunking: 20, midrange: 20, threePoint: 20, offRebounding: 0, stamina: 90 },
        { defRebounding: 99, interiorDefense: 40, blocking: 40, stamina: 90 },
      ),
    );

    expect(strongRate).toBeGreaterThan(weakRate);
  });

  it("missed putbacks can resolve into one capped second offensive rebound", () => {
    const results = getNonTurnoverResults(
      runPossessions(
        makeContext(
          { shortRange: 15, dunking: 15, midrange: 15, threePoint: 15, offRebounding: 99 },
          { defRebounding: 10, interiorDefense: 95, blocking: 95, perimeterDefense: 95 },
        ),
        20260320,
        500,
        9000,
      ),
    );

    const secondChanceOffReb = results.find(
      (result) => result.putbackAttempted && result.eventType === "off_reb" && result.madeShot === false,
    );

    expect(secondChanceOffReb).toBeDefined();
    expect(secondChanceOffReb?.offensiveRebound).toBe(true);
    expect(secondChanceOffReb?.assisted).toBe(false);
    expect(secondChanceOffReb?.assisterIndex).toBeUndefined();
  });
});
