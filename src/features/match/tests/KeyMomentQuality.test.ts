import { buildCreateShotPending } from "../../../match/keyMoments/createShot";
import { scoreTimingChallenge } from "../../../match/keyMoments/actionChallenges";
import type { KeyMomentBuildArgs } from "../../../match/keyMoments/types";
import type { MatchContext, MatchFocus, MatchWorkRate, PossessionState } from "../../../matchEngine";
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
    roster: [makePlayer("h1"), makePlayer("h2"), makePlayer("h3"), makePlayer("h4"), makePlayer("h5")] as const,
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [makePlayer("a1"), makePlayer("a2"), makePlayer("a3"), makePlayer("a4"), makePlayer("a5")] as const,
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

const buildArgs = (workRate: MatchWorkRate, focus: MatchFocus, fatigue: number, userTouches: number): KeyMomentBuildArgs => ({
  id: `pending-${workRate}-${focus}-${fatigue}-${userTouches}`,
  context: {
    id: `ctx-${workRate}-${focus}-${fatigue}-${userTouches}`,
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
    fatigue,
  },
  matchContext,
  possessionState: buildPossessionState(userTouches),
  userMatchState: {
    workRate,
    focus,
    fatigue,
    touchLoad: userTouches,
    lateGamePenalty: 0.15,
  },
  seedValue: 1234,
});

describe("Key moment baseline quality", () => {
  it("raises baseline quality when focus is offense instead of defense on user offense moments", () => {
    const defenseFocus = buildCreateShotPending(buildArgs("normal", "defense", 0.15, 1));
    const offenseFocus = buildCreateShotPending(buildArgs("normal", "offense", 0.15, 1));

    expect(defenseFocus).toBeDefined();
    expect(offenseFocus).toBeDefined();
    expect(offenseFocus!.simBaselineQuality).toBeGreaterThan(defenseFocus!.simBaselineQuality);
  });

  it("gives high workRate a small upside before fatigue becomes relevant", () => {
    const lowWorkRate = buildCreateShotPending(buildArgs("low", "balanced", 0.05, 0));
    const highWorkRate = buildCreateShotPending(buildArgs("high", "balanced", 0.05, 0));

    expect(lowWorkRate).toBeDefined();
    expect(highWorkRate).toBeDefined();
    expect(highWorkRate!.simBaselineQuality).toBeGreaterThan(lowWorkRate!.simBaselineQuality);
  });

  it("amplifies fatigue penalties more aggressively at high workRate", () => {
    const lowWorkRateFresh = buildCreateShotPending(buildArgs("low", "balanced", 0.05, 0));
    const lowWorkRateTired = buildCreateShotPending(buildArgs("low", "balanced", 0.65, 8));
    const highWorkRateFresh = buildCreateShotPending(buildArgs("high", "balanced", 0.05, 0));
    const highWorkRateTired = buildCreateShotPending(buildArgs("high", "balanced", 0.65, 8));

    expect(lowWorkRateFresh).toBeDefined();
    expect(lowWorkRateTired).toBeDefined();
    expect(highWorkRateFresh).toBeDefined();
    expect(highWorkRateTired).toBeDefined();

    const lowWorkRateDrop = lowWorkRateFresh!.simBaselineQuality - lowWorkRateTired!.simBaselineQuality;
    const highWorkRateDrop = highWorkRateFresh!.simBaselineQuality - highWorkRateTired!.simBaselineQuality;

    expect(highWorkRateDrop).toBeGreaterThan(lowWorkRateDrop);
  });

  it("widens the shooting timing window for better shooters without replacing execution", () => {
    const weakShooterPending = buildCreateShotPending({
      ...buildArgs("normal", "offense", 0.15, 1),
      id: "weak-shooter",
      matchContext: {
        ...matchContext,
        home: {
          ...matchContext.home,
          roster: [makePlayer("h1", makeAttributes({ threePoint: 58, midrange: 60 })), makePlayer("h2"), makePlayer("h3"), makePlayer("h4"), makePlayer("h5")] as const,
        },
      },
    });
    const eliteShooterPending = buildCreateShotPending({
      ...buildArgs("normal", "offense", 0.15, 1),
      id: "elite-shooter",
      matchContext: {
        ...matchContext,
        home: {
          ...matchContext.home,
          roster: [makePlayer("h1", makeAttributes({ threePoint: 95, midrange: 92 })), makePlayer("h2"), makePlayer("h3"), makePlayer("h4"), makePlayer("h5")] as const,
        },
      },
    });

    expect(weakShooterPending?.challenge?.execution.kind).toBe("timing");
    expect(eliteShooterPending?.challenge?.execution.kind).toBe("timing");

    const weakScore = scoreTimingChallenge(0.9, weakShooterPending!.challenge!).normalizedScore;
    const eliteScore = scoreTimingChallenge(0.9, eliteShooterPending!.challenge!).normalizedScore;

    expect(eliteScore).toBeGreaterThan(weakScore);
    expect(eliteScore).toBeLessThan(1);
  });

  it("lets stamina protect late-game timing windows under fatigue", () => {
    const lowStaminaPending = buildCreateShotPending({
      ...buildArgs("high", "offense", 0.75, 8),
      id: "low-stamina",
      matchContext: {
        ...matchContext,
        home: {
          ...matchContext.home,
          roster: [makePlayer("h1", makeAttributes({ stamina: 52 })), makePlayer("h2"), makePlayer("h3"), makePlayer("h4"), makePlayer("h5")] as const,
        },
      },
    });
    const highStaminaPending = buildCreateShotPending({
      ...buildArgs("high", "offense", 0.75, 8),
      id: "high-stamina",
      matchContext: {
        ...matchContext,
        home: {
          ...matchContext.home,
          roster: [makePlayer("h1", makeAttributes({ stamina: 96 })), makePlayer("h2"), makePlayer("h3"), makePlayer("h4"), makePlayer("h5")] as const,
        },
      },
    });

    const lowScore = scoreTimingChallenge(0.81, lowStaminaPending!.challenge!).normalizedScore;
    const highScore = scoreTimingChallenge(0.81, highStaminaPending!.challenge!).normalizedScore;

    expect(highScore).toBeGreaterThan(lowScore);
  });
});
