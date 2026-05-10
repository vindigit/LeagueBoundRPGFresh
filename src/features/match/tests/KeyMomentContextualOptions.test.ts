import { buildFoulPressurePending } from "../../../match/keyMoments/foulPressure";
import { buildJumpLanePending } from "../../../match/keyMoments/jumpLane";
import { buildMakeTheReadPending } from "../../../match/keyMoments/makeTheRead";
import { buildOnBallStopPending } from "../../../match/keyMoments/onBallStop";
import type { KeyMomentBuildArgs } from "../../../match/keyMoments/types";
import type { MatchContext, PossessionState } from "../../../matchEngine";
import type { Player, PlayerArchetype, PlayerAttributes, Position } from "../../../types/player";

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

const makePlayer = (
  id: string,
  archetype: PlayerArchetype,
  position: Position,
  attributes: PlayerAttributes,
): Player => ({
  id,
  name: id,
  age: 18,
  bankBalance: 0,
  morale: 50,
  position,
  secondaryPosition: position,
  archetype,
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

const buildMatchContext = (player: Player): MatchContext => ({
  home: {
    name: "Home",
    teamOvr: 0,
    roster: [
      player,
      makePlayer("h2", "Sharpshooter", "SG", makeAttributes({ threePoint: 84 })),
      makePlayer("h3", "Slasher", "SF", makeAttributes({ shortRange: 80, speed: 82, dunking: 78 })),
      makePlayer("h4", "Stretch Big", "PF", makeAttributes({ threePoint: 78, strength: 74 })),
      makePlayer("h5", "Paint Beast", "C", makeAttributes({ interiorDefense: 82, strength: 84, blocking: 76 })),
    ] as MatchContext["home"]["roster"],
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [
      makePlayer("a1", "Playmaker", "PG", makeAttributes()),
      makePlayer("a2", "Sharpshooter", "SG", makeAttributes({ threePoint: 82 })),
      makePlayer("a3", "Lockdown Defender", "SF", makeAttributes({ perimeterDefense: 82, stealing: 78 })),
      makePlayer("a4", "Stretch Big", "PF", makeAttributes({ interiorDefense: 74, strength: 78 })),
      makePlayer("a5", "Paint Beast", "C", makeAttributes({ interiorDefense: 84, strength: 86, blocking: 80 })),
    ] as MatchContext["away"]["roster"],
  },
});

const buildPossessionState = (
  overrides: Partial<PossessionState> = {},
): PossessionState => ({
  possessionIndex: 12,
  secondsRemaining: 210,
  offenseKey: "home",
  defenseKey: "away",
  ballHandlerIndex: 0,
  homeTouches: [4, 0, 0, 0, 0],
  awayTouches: [0, 0, 0, 0, 0],
  score: { home: 42, away: 46 },
  homeStreak: 0,
  awayStreak: 0,
  ...overrides,
});

const buildArgs = (overrides: Partial<KeyMomentBuildArgs> = {}): KeyMomentBuildArgs => ({
  id: "pending-contextual",
  context: {
    id: "ctx-contextual",
    periodKey: "Q4",
    quarter: 4,
    timeRemaining: 95,
    offense: "home",
    defense: "away",
    userTeam: "home",
    userPlayerIndex: 0,
    possessionIndex: 12,
    score: { home: 42, away: 46 },
    workRate: "high",
    focus: "defense",
    fatigue: 0.5,
  },
  matchContext: buildMatchContext(
    makePlayer(
      "h1",
      "Playmaker",
      "PG",
      makeAttributes({ passing: 88, vision: 90, handle: 84, shortRange: 68, dunking: 55 }),
    ),
  ),
  possessionState: buildPossessionState(),
  userMatchState: {
    workRate: "high",
    focus: "defense",
    fatigue: 0.5,
    touchLoad: 4,
    lateGamePenalty: 0.2,
  },
  seedValue: 1234,
  ...overrides,
});

describe("Key moment contextual options", () => {
  it("varies make_the_read options by player build", () => {
    const playmakerArgs = buildArgs();
    const slasherArgs = buildArgs({
      matchContext: buildMatchContext(
        makePlayer(
          "h1",
          "Slasher",
          "SG",
          makeAttributes({ shortRange: 84, dunking: 82, speed: 84, handle: 80, passing: 62, vision: 60 }),
        ),
      ),
    });

    const playmakerPending = buildMakeTheReadPending(playmakerArgs);
    const slasherPending = buildMakeTheReadPending(slasherArgs);

    expect(playmakerPending?.options[0]?.label).toBe("Hit Weak-Side");
    expect(slasherPending?.options[0]?.label).toBe("Spray It Out");
  });

  it("makes make_the_read copy reflect trailing score, late clock, and low focus", () => {
    const pending = buildMakeTheReadPending(buildArgs());

    expect(pending).toBeDefined();
    const descriptions = pending!.options.map((option) => option.description).join(" ");
    expect(descriptions).toContain("down 4");
    expect(descriptions).toContain("clock shrinking");
    expect(descriptions).toContain("protecting the ball");
  });

  it("shifts on_ball_stop options for protecting a lead on defense", () => {
    const pending = buildOnBallStopPending(buildArgs({
      context: {
        id: "ctx-defense-lead",
        periodKey: "Q4",
        quarter: 4,
        timeRemaining: 88,
        offense: "away",
        defense: "home",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 18,
        score: { home: 59, away: 54 },
        workRate: "normal",
        focus: "defense",
        fatigue: 0.35,
      },
      possessionState: buildPossessionState({
        offenseKey: "away",
        defenseKey: "home",
        secondsRemaining: 88,
        score: { home: 59, away: 54 },
      }),
    }));

    expect(pending).toBeDefined();
    expect(pending!.options[2]?.label).toBe("Stay Vertical");
    expect(pending!.options[2]?.description).toContain("up 5");
  });

  it("changes jump_lane risk appetite with game state and focus", () => {
    const trailingPending = buildJumpLanePending(buildArgs({
      context: {
        id: "ctx-jump-trailing",
        periodKey: "Q4",
        quarter: 4,
        timeRemaining: 70,
        offense: "away",
        defense: "home",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 20,
        score: { home: 63, away: 67 },
        workRate: "high",
        focus: "defense",
        fatigue: 0.25,
      },
      possessionState: buildPossessionState({
        offenseKey: "away",
        defenseKey: "home",
        secondsRemaining: 70,
        score: { home: 63, away: 67 },
      }),
      matchContext: buildMatchContext(
        makePlayer(
          "h1",
          "Lockdown Defender",
          "SG",
          makeAttributes({ stealing: 86, vision: 80, speed: 82, perimeterDefense: 84 }),
        ),
      ),
    }));
    const leadingPending = buildJumpLanePending(buildArgs({
      context: {
        id: "ctx-jump-leading",
        periodKey: "Q4",
        quarter: 4,
        timeRemaining: 70,
        offense: "away",
        defense: "home",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 20,
        score: { home: 67, away: 63 },
        workRate: "high",
        focus: "offense",
        fatigue: 0.25,
      },
      possessionState: buildPossessionState({
        offenseKey: "away",
        defenseKey: "home",
        secondsRemaining: 70,
        score: { home: 67, away: 63 },
      }),
    }));

    expect(trailingPending?.options[0]?.label).toBe("Jump the Lane");
    expect(leadingPending?.options[3]?.label).toBe("Stay Home");
  });

  it("maps foul_pressure defense options to actual bonus context", () => {
    const pending = buildFoulPressurePending(buildArgs({
      context: {
        id: "ctx-foul-defense",
        periodKey: "Q2",
        quarter: 2,
        timeRemaining: 115,
        offense: "away",
        defense: "home",
        userTeam: "home",
        userPlayerIndex: 0,
        possessionIndex: 16,
        score: { home: 28, away: 26 },
        workRate: "normal",
        focus: "defense",
        fatigue: 0.35,
      },
      possessionState: buildPossessionState({
        offenseKey: "away",
        defenseKey: "home",
        secondsRemaining: 115,
        score: { home: 28, away: 26 },
      }),
      defenderTeamFoulsInSegment: 6,
    }));

    expect(pending).toBeDefined();
    expect(pending!.freeThrowMode).toBe("one_and_one");
    const descriptions = pending!.options.map((option) => option.description).join(" ");
    expect(descriptions).toContain("one-and-one");
    expect(descriptions).toContain("up 2");
  });
});
