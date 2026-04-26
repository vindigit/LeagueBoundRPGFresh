import { buildCreateShotPending } from "../../../match/keyMoments/createShot";
import type { KeyMomentBuildArgs } from "../../../match/keyMoments/types";
import type { MatchContext, PossessionState } from "../../../matchEngine";
import type { Player, PlayerAttributes } from "../../../types/player";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 72,
  dunking: 70,
  midrange: 76,
  threePoint: 80,
  handle: 78,
  passing: 72,
  vision: 74,
  perimeterDefense: 66,
  interiorDefense: 54,
  stealing: 62,
  blocking: 48,
  offRebounding: 42,
  defRebounding: 46,
  speed: 76,
  strength: 68,
  stamina: 82,
  ...overrides,
});

const makePlayer = (id: string, attributes: PlayerAttributes = makeAttributes()): Player => ({
  id,
  name: id,
  age: 18,
  bankBalance: 0,
  morale: 50,
  position: "PG",
  secondaryPosition: "SG",
  archetype: "Playmaker",
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

const matchContext: MatchContext = {
  home: {
    name: "Home",
    teamOvr: 0,
    roster: [
      makePlayer("h1"),
      makePlayer("h2"),
      makePlayer("h3"),
      makePlayer("h4"),
      makePlayer("h5"),
    ] as const,
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [
      makePlayer("a1"),
      makePlayer("a2"),
      makePlayer("a3"),
      makePlayer("a4"),
      makePlayer("a5"),
    ] as const,
  },
};

const buildPossessionState = (userTouches: number): PossessionState => ({
  possessionIndex: 12,
  secondsRemaining: 300,
  offenseKey: "home",
  defenseKey: "away",
  ballHandlerIndex: 0,
  homeTouches: [userTouches, 0, 0, 0, 0],
  awayTouches: [0, 0, 0, 0, 0],
  score: { home: 42, away: 39 },
  homeStreak: 0,
  awayStreak: 0,
});

const buildArgs = (workRate: number, focus: number, userTouches: number): KeyMomentBuildArgs => ({
  id: `pending-${workRate}-${focus}-${userTouches}`,
  context: {
    id: `ctx-${workRate}-${focus}-${userTouches}`,
    periodKey: "Q3",
    quarter: 3,
    timeRemaining: 300,
    offense: "home",
    defense: "away",
    userTeam: "home",
    userPlayerIndex: 0,
    possessionIndex: 12,
    score: { home: 42, away: 39 },
    workRate,
    focus,
  },
  matchContext,
  possessionState: buildPossessionState(userTouches),
  userMatchState: {
    baseWorkRate: 82,
    baseFocus: 50,
    workRate,
    focus,
  },
  seedValue: 1234,
});

describe("Key moment baseline quality", () => {
  it("raises baseline quality when focus is higher", () => {
    const lowFocus = buildCreateShotPending(buildArgs(60, 30, 1));
    const highFocus = buildCreateShotPending(buildArgs(60, 80, 1));

    expect(lowFocus).toBeDefined();
    expect(highFocus).toBeDefined();
    expect(highFocus!.simBaselineQuality).toBeGreaterThan(lowFocus!.simBaselineQuality);
  });

  it("gives high workRate a small upside before fatigue becomes relevant", () => {
    const lowWorkRate = buildCreateShotPending(buildArgs(35, 50, 0));
    const highWorkRate = buildCreateShotPending(buildArgs(80, 50, 0));

    expect(lowWorkRate).toBeDefined();
    expect(highWorkRate).toBeDefined();
    expect(highWorkRate!.simBaselineQuality).toBeGreaterThan(lowWorkRate!.simBaselineQuality);
  });

  it("amplifies fatigue penalties more aggressively at high workRate", () => {
    const lowWorkRateFresh = buildCreateShotPending(buildArgs(35, 50, 0));
    const lowWorkRateTired = buildCreateShotPending(buildArgs(35, 50, 8));
    const highWorkRateFresh = buildCreateShotPending(buildArgs(80, 50, 0));
    const highWorkRateTired = buildCreateShotPending(buildArgs(80, 50, 8));

    expect(lowWorkRateFresh).toBeDefined();
    expect(lowWorkRateTired).toBeDefined();
    expect(highWorkRateFresh).toBeDefined();
    expect(highWorkRateTired).toBeDefined();

    const lowWorkRateDrop = lowWorkRateFresh!.simBaselineQuality - lowWorkRateTired!.simBaselineQuality;
    const highWorkRateDrop = highWorkRateFresh!.simBaselineQuality - highWorkRateTired!.simBaselineQuality;

    expect(highWorkRateDrop).toBeGreaterThan(lowWorkRateDrop);
  });
});
