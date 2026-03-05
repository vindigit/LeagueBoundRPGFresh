import tuning from "../src/matchEngineTuning.js";
import {
  applyMomentumToShotMakeProbability,
  createSeededRng,
  getNextMomentumStreaks,
  initializePossession,
  type MatchContext,
  type PossessionState,
} from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { OldPlayerAttributes, Player } from "../src/types/player";

// TODO: Sprint 2 — update to new 16-attr shape when match engine is rewritten
const baseAttributes: OldPlayerAttributes = {
  shooting: 70,
  finishing: 66,
  vision: 82,
  handle: 84,
  athleticism: 71,
  defense: 58,
  rebounding: 44,
  bbiq: 78,
  stamina: 80,
};

const createPlayer = (id: string): Player => ({
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
  attributes: {
    ...baseAttributes,
  } as any, // TODO: Sprint 2 — match engine still reads old 9-attr keys
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

const createContext = (): MatchContext => ({
  home: {
    name: "Home",
    teamOvr: 0,
    roster: [createPlayer("h1"), createPlayer("h2"), createPlayer("h3"), createPlayer("h4"), createPlayer("h5")] as const,
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [createPlayer("a1"), createPlayer("a2"), createPlayer("a3"), createPlayer("a4"), createPlayer("a5")] as const,
  },
});

const makeState = (overrides: Partial<PossessionState> = {}): PossessionState => ({
  possessionIndex: 1,
  secondsRemaining: 720,
  offenseKey: "home",
  defenseKey: "away",
  ballHandlerIndex: 0,
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
});
