import { renderPossessionPlayByPlayLine } from "../../../match/playByPlay/renderer";
import type { MatchContext, PossessionResult } from "../../../matchEngine";
import type { Player } from "../../../types/player";

const makePlayer = (id: string, name: string): Player => ({
  id,
  name,
  age: 18,
  bankBalance: 0,
  morale: 50,
  position: "PG",
  secondaryPosition: "PG",
  archetype: "Playmaker",
  identity: null,
  dna: null,
  attributes: {
    shooting: 70,
    finishing: 70,
    vision: 70,
    handle: 70,
    athleticism: 70,
    defense: 70,
    rebounding: 70,
    bbiq: 70,
    stamina: 70,
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

const context: MatchContext = {
  home: {
    name: "Home",
    teamOvr: 0,
    roster: [
      makePlayer("h1", "Home One"),
      makePlayer("h2", "Home Two"),
      makePlayer("h3", "Home Three"),
      makePlayer("h4", "Home Four"),
      makePlayer("h5", "Home Five"),
    ],
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [
      makePlayer("a1", "Away One"),
      makePlayer("a2", "Away Two"),
      makePlayer("a3", "Away Three"),
      makePlayer("a4", "Away Four"),
      makePlayer("a5", "Away Five"),
    ],
  },
};

const baseResult: PossessionResult = {
  action: "shoot",
  madeShot: true,
  points: 3,
  assisted: false,
  turnoverLikeFailure: false,
  nextState: {
    possessionIndex: 2,
    secondsRemaining: 700,
    offenseKey: "away",
    defenseKey: "home",
    ballHandlerIndex: 0,
    score: { home: 3, away: 0 },
  },
  eventType: "made_3",
  shotZone: "three",
  shooterIndex: 0,
  assisterIndex: 1,
  defensivePlay: { steal: false, block: false },
  offensiveRebound: false,
  putbackAttempted: false,
  trace: ["INIT_POSSESSION", "END_POSSESSION"],
};

describe("PlayByPlayRenderer", () => {
  it("renders scorer and assister names for made shots", () => {
    const line = renderPossessionPlayByPlayLine({
      result: baseResult,
      context,
      offense: "home",
      defense: "away",
      ballHandlerIndex: 0,
    });
    expect(line.type).toBe("score");
    expect(line.text).toContain("Home One");
    expect(line.text).toContain("Home Two");
  });

  it("renders turnover category for steals", () => {
    const line = renderPossessionPlayByPlayLine({
      result: {
        ...baseResult,
        eventType: "steal",
        turnoverLikeFailure: true,
        madeShot: false,
        points: 0,
        defensivePlay: { steal: true, block: false, defenderIndex: 2 },
      },
      context,
      offense: "home",
      defense: "away",
      ballHandlerIndex: 1,
    });
    expect(line.type).toBe("turnover");
    expect(line.text).toContain("Away Three");
  });
});
