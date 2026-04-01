import tuning from "../src/matchEngineTuning.js";
import {
  applyMomentumToShotMakeProbability,
  createSeededRng,
  getNextMomentumStreaks,
  initializePossession,
  simulatePossession,
  type MatchContext,
  type PossessionState,
} from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { PlayerAttributes, Player } from "../src/types/player";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 70,
  dunking: 66,
  midrange: 72,
  threePoint: 74,
  handle: 84,
  passing: 82,
  vision: 78,
  perimeterDefense: 58,
  interiorDefense: 50,
  stealing: 60,
  blocking: 42,
  offRebounding: 44,
  defRebounding: 44,
  speed: 71,
  strength: 62,
  stamina: 80,
  ...overrides,
});

const createPlayer = (id: string, attributes: PlayerAttributes = makeAttributes()): Player => ({
  id,
  name: id,
  age: 19,
  bankBalance: 0,
  morale: 50,
  position: "PG" as const,
  secondaryPosition: "SG" as const,
  archetype: "Playmaker" as const,
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

const createContext = (homeAttrs = makeAttributes(), awayAttrs = makeAttributes()): MatchContext => ({
  home: {
    name: "Home",
    teamOvr: 0,
    roster: [
      createPlayer("h1", homeAttrs),
      createPlayer("h2", homeAttrs),
      createPlayer("h3", homeAttrs),
      createPlayer("h4", homeAttrs),
      createPlayer("h5", homeAttrs),
    ] as const,
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [
      createPlayer("a1", awayAttrs),
      createPlayer("a2", awayAttrs),
      createPlayer("a3", awayAttrs),
      createPlayer("a4", awayAttrs),
      createPlayer("a5", awayAttrs),
    ] as const,
  },
});

const makeState = (overrides: Partial<PossessionState> = {}): PossessionState => ({
  possessionIndex: 1,
  secondsRemaining: 720,
  offenseKey: "home",
  defenseKey: "away",
  ballHandlerIndex: 0,
  homeTouches: [0, 0, 0, 0, 0],
  awayTouches: [0, 0, 0, 0, 0],
  score: { home: 0, away: 0 },
  homeStreak: 0,
  awayStreak: 0,
  ...overrides,
});

describe("momentum tracking", () => {
  it("initializes streak counters at zero", () => {
    const state = initializePossession(createContext(), LeagueLevel.PRO, createSeededRng(20260303), 720);
    expect(state.homeStreak).toBe(0);
    expect(state.awayStreak).toBe(0);
  });

  it("increments streak for made shot and resets opponent streak", () => {
    const next = getNextMomentumStreaks(makeState({ homeStreak: 2, awayStreak: 1 }), "home", true, false);
    expect(next).toEqual({ homeStreak: 3, awayStreak: 0 });
  });

  it("resets only shooter streak on missed shot", () => {
    const homeMiss = getNextMomentumStreaks(makeState({ homeStreak: 3, awayStreak: 2 }), "home", false, false);
    expect(homeMiss).toEqual({ homeStreak: 0, awayStreak: 2 });

    const awayMiss = getNextMomentumStreaks(makeState({ homeStreak: 2, awayStreak: 4 }), "away", false, false);
    expect(awayMiss).toEqual({ homeStreak: 2, awayStreak: 0 });
  });

  it("leaves streaks unchanged on turnover-like failure", () => {
    const next = getNextMomentumStreaks(makeState({ homeStreak: 2, awayStreak: 3 }), "away", false, true);
    expect(next).toEqual({ homeStreak: 2, awayStreak: 3 });
  });

  it("preserves probability when momentum is disabled", () => {
    const original = tuning.momentum.enabled;
    try {
      tuning.momentum.enabled = false;
      const value = applyMomentumToShotMakeProbability(0.51, makeState({ homeStreak: 5, awayStreak: 5 }), "home");
      expect(value).toBeCloseTo(0.51, 8);
    } finally {
      tuning.momentum.enabled = original;
    }
  });

  it("applies capped additive momentum delta and clamps to [0, 1]", () => {
    const original = {
      enabled: tuning.momentum.enabled,
      maxStreak: tuning.momentum.maxStreak,
      perMakeBoost: tuning.momentum.perMakeBoost,
      perMakePenalty: tuning.momentum.perMakePenalty,
    };

    try {
      tuning.momentum.enabled = true;
      tuning.momentum.maxStreak = 5;
      tuning.momentum.perMakeBoost = 0.008;
      tuning.momentum.perMakePenalty = 0.008;

      const cappedBoost = applyMomentumToShotMakeProbability(0.5, makeState({ homeStreak: 99, awayStreak: 0 }), "home");
      expect(cappedBoost).toBeCloseTo(0.54, 8);

      const cappedPenalty = applyMomentumToShotMakeProbability(0.5, makeState({ homeStreak: 0, awayStreak: 99 }), "home");
      expect(cappedPenalty).toBeCloseTo(0.46, 8);

      const clampedHigh = applyMomentumToShotMakeProbability(0.99, makeState({ homeStreak: 99, awayStreak: 0 }), "home");
      expect(clampedHigh).toBe(1);

      const clampedLow = applyMomentumToShotMakeProbability(0.01, makeState({ homeStreak: 0, awayStreak: 99 }), "home");
      expect(clampedLow).toBe(0);
    } finally {
      tuning.momentum.enabled = original.enabled;
      tuning.momentum.maxStreak = original.maxStreak;
      tuning.momentum.perMakeBoost = original.perMakeBoost;
      tuning.momentum.perMakePenalty = original.perMakePenalty;
    }
  });

  it("persists touch counters across possession flips and resets on new game start", () => {
    const context = createContext();
    const rng = createSeededRng(777);
    const initial = initializePossession(context, LeagueLevel.PRO, rng, 240);

    const first = simulatePossession(context, initial, LeagueLevel.PRO, rng);
    const second = simulatePossession(context, first.nextState, LeagueLevel.PRO, rng);
    const fresh = initializePossession(context, LeagueLevel.PRO, createSeededRng(777), 240);

    expect(first.nextState.homeTouches.some((count) => count > 0) || first.nextState.awayTouches.some((count) => count > 0)).toBe(true);
    expect(second.nextState.homeTouches.reduce((sum, count) => sum + count, 0)).toBeGreaterThanOrEqual(
      first.nextState.homeTouches.reduce((sum, count) => sum + count, 0),
    );
    expect(second.nextState.awayTouches.reduce((sum, count) => sum + count, 0)).toBeGreaterThanOrEqual(
      first.nextState.awayTouches.reduce((sum, count) => sum + count, 0),
    );
    expect(fresh.homeTouches).toEqual([0, 0, 0, 0, 0]);
    expect(fresh.awayTouches).toEqual([0, 0, 0, 0, 0]);
  });

  it("stamina materially changes scoring rate under repeated possessions", () => {
    const lowContext = createContext(makeAttributes({ stamina: 10 }), makeAttributes({ stamina: 10 }));
    const highContext = createContext(makeAttributes({ stamina: 95 }), makeAttributes({ stamina: 95 }));

    const run = (context: MatchContext, seed: number): number => {
      const rng = createSeededRng(seed);
      let state = initializePossession(context, LeagueLevel.PRO, rng, 2400);
      let made = 0;
      let attempts = 0;
      for (let i = 0; i < 120 && state.secondsRemaining > 0; i += 1) {
        const result = simulatePossession(context, state, LeagueLevel.PRO, rng);
        if (!result.turnoverLikeFailure) {
          attempts += 1;
          if (result.madeShot) {
            made += 1;
          }
        }
        state = result.nextState;
      }
      return attempts > 0 ? made / attempts : 0;
    };

    const seeds = [321, 322, 323, 324, 325];
    const lowPct = seeds.reduce((sum, seed) => sum + run(lowContext, seed), 0) / seeds.length;
    const highPct = seeds.reduce((sum, seed) => sum + run(highContext, seed), 0) / seeds.length;
    expect(Math.abs(highPct - lowPct)).toBeGreaterThan(0.005);
  });

  it("heavy touch volume hurts low-stamina primary handlers more than high-stamina ones", () => {
    const buildDominantHandlerContext = (stamina: number): MatchContext => {
      const context = createContext(
        makeAttributes({ handle: 98, vision: 96, passing: 96, stamina, shortRange: 85, midrange: 85, threePoint: 85 }),
        makeAttributes({ perimeterDefense: 40, interiorDefense: 40, blocking: 40, stealing: 40 }),
      );
      context.home.roster[1].attributes = makeAttributes({ handle: 20, vision: 20, passing: 20, stamina });
      context.home.roster[2].attributes = makeAttributes({ handle: 20, vision: 20, passing: 20, stamina });
      context.home.roster[3].attributes = makeAttributes({ handle: 20, vision: 20, passing: 20, stamina });
      context.home.roster[4].attributes = makeAttributes({ handle: 20, vision: 20, passing: 20, stamina });
      return context;
    };

    const runLateRate = (context: MatchContext): number => {
      const rng = createSeededRng(404);
      let state = initializePossession(context, LeagueLevel.PRO, rng, 6000);
      const lateResults: boolean[] = [];

      for (let i = 0; i < 140 && state.secondsRemaining > 0; i += 1) {
        const result = simulatePossession(context, state, LeagueLevel.PRO, rng);
        if (!result.turnoverLikeFailure && result.shooterIndex === 0 && i >= 100) {
          lateResults.push(result.madeShot);
        }
        state = result.nextState;
      }

      return lateResults.filter(Boolean).length / Math.max(1, lateResults.length);
    };

    const lowStaminaLateRate = runLateRate(buildDominantHandlerContext(20));
    const highStaminaLateRate = runLateRate(buildDominantHandlerContext(95));

    expect(highStaminaLateRate).toBeGreaterThan(lowStaminaLateRate);
  });
});
