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
const VALID_ZONES = new Set(["three", "midrange", "rim"]);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const makePlayer = (id: string, attrs: PlayerAttributes): Player => ({
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
  attributes: attrs,
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

const makeTeam = (prefix: string, attrs: PlayerAttributes): Team => ({
  name: `${prefix}-team`,
  teamOvr: 0,
  roster: [
    makePlayer(`${prefix}1`, attrs),
    makePlayer(`${prefix}2`, attrs),
    makePlayer(`${prefix}3`, attrs),
    makePlayer(`${prefix}4`, attrs),
    makePlayer(`${prefix}5`, attrs),
  ],
});

const runPossessions = (
  context: MatchContext,
  seed: number,
  possessionCount: number,
  secondsRemaining = 20 * 60,
): Array<{ result: PossessionResult; previousState: PossessionState }> => {
  const rng = createSeededRng(seed);
  let state = initializePossession(context, LeagueLevel.PRO, rng, secondsRemaining);
  const output: Array<{ result: PossessionResult; previousState: PossessionState }> = [];

  for (let i = 0; i < possessionCount && state.secondsRemaining > 0; i += 1) {
    const previousState = state;
    const result = simulatePossession(context, state, LeagueLevel.PRO, rng);
    output.push({ result, previousState });
    state = result.nextState;
  }

  return output;
};

const assertCoreInvariants = (result: PossessionResult, previousState: PossessionState): void => {
  expect(VALID_ACTIONS.has(result.action)).toBe(true);
  expect(VALID_EVENT_TYPES.has(result.eventType)).toBe(true);
  expect(typeof result.turnoverLikeFailure).toBe("boolean");
  expect(isFiniteNumber(result.nextState.secondsRemaining)).toBe(true);
  expect(isFiniteNumber(result.nextState.score.home)).toBe(true);
  expect(isFiniteNumber(result.nextState.score.away)).toBe(true);
  expect(result.nextState.secondsRemaining).toBeGreaterThanOrEqual(0);
  expect(result.nextState.score.home).toBeGreaterThanOrEqual(0);
  expect(result.nextState.score.away).toBeGreaterThanOrEqual(0);
  expect(result.nextState.secondsRemaining).toBeLessThanOrEqual(previousState.secondsRemaining);
  expect(result.nextState.possessionIndex).toBe(previousState.possessionIndex + 1);

  if (!result.turnoverLikeFailure) {
    expect(result.shotZone).toBeDefined();
    expect(VALID_ZONES.has(result.shotZone ?? "")).toBe(true);
  }
};

describe("low shooting three-point suppression", () => {
  it("suppresses three-zone outcomes when impacted threePoint is below threshold", () => {
    const lowShootingAttrs: PlayerAttributes = {
      shortRange: 60,
      dunking: 56,
      midrange: 55,
      threePoint: 30,
      handle: 80,
      passing: 60,
      vision: 60,
      perimeterDefense: 60,
      interiorDefense: 55,
      stealing: 55,
      blocking: 40,
      offRebounding: 48,
      defRebounding: 60,
      speed: 60,
      strength: 55,
      stamina: 0,
    };
    const context: MatchContext = {
      home: makeTeam("h", lowShootingAttrs),
      away: makeTeam("a", lowShootingAttrs),
    };

    const steps = runPossessions(context, 20260310, 220, 20 * 60);
    expect(steps.length).toBeGreaterThan(0);

    let nonTurnoverEvents = 0;
    for (const { result, previousState } of steps) {
      assertCoreInvariants(result, previousState);
      if (!result.turnoverLikeFailure) {
        nonTurnoverEvents += 1;
        expect(result.shotZone).not.toBe("three");
      }
    }
    expect(nonTurnoverEvents).toBeGreaterThan(0);
  });

  it("still allows three-zone outcomes when impacted threePoint is at/above threshold", () => {
    const highShootingAttrs: PlayerAttributes = {
      shortRange: 60,
      dunking: 58,
      midrange: 65,
      threePoint: 70,
      handle: 80,
      passing: 60,
      vision: 60,
      perimeterDefense: 60,
      interiorDefense: 55,
      stealing: 55,
      blocking: 40,
      offRebounding: 48,
      defRebounding: 60,
      speed: 60,
      strength: 55,
      stamina: 99,
    };
    const context: MatchContext = {
      home: makeTeam("h", highShootingAttrs),
      away: makeTeam("a", highShootingAttrs),
    };

    const steps = runPossessions(context, 20260311, 220, 20 * 60);
    expect(steps.length).toBeGreaterThan(0);

    let hasThree = false;
    for (const { result, previousState } of steps) {
      assertCoreInvariants(result, previousState);
      if (!result.turnoverLikeFailure && result.shotZone === "three") {
        hasThree = true;
      }
    }
    expect(hasThree).toBe(true);
  });
});
