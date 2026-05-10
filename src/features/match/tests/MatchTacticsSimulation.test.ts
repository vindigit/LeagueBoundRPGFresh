import { createMatchEngineAdapter } from "../../../matchEngineAdapter";
import { LeagueLevel } from "../../../types/career";
import type { LegacyPlayerStateInput, PlayerAttributes } from "../../../types/player";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 74,
  dunking: 72,
  midrange: 76,
  threePoint: 78,
  handle: 79,
  passing: 73,
  vision: 75,
  perimeterDefense: 71,
  interiorDefense: 60,
  stealing: 68,
  blocking: 46,
  offRebounding: 44,
  defRebounding: 49,
  speed: 77,
  strength: 69,
  stamina: 84,
  ...overrides,
});

const makePlayer = (id: string, position: LegacyPlayerStateInput["position"], attributes: PlayerAttributes): LegacyPlayerStateInput => ({
  id,
  name: id,
  age: 18,
  bankBalance: 0,
  morale: 50,
  position,
  secondaryPosition: position,
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

const buildTeam = (prefix: "h" | "a") => ({
  name: prefix === "h" ? "Home" : "Away",
  teamOvr: 0,
  roster: [
    makePlayer(`${prefix}1`, "PG", makeAttributes()),
    makePlayer(`${prefix}2`, "SG", makeAttributes({ threePoint: 81, handle: 74 })),
    makePlayer(`${prefix}3`, "SF", makeAttributes({ shortRange: 79, speed: 80 })),
    makePlayer(`${prefix}4`, "PF", makeAttributes({ strength: 77, defRebounding: 60 })),
    makePlayer(`${prefix}5`, "C", makeAttributes({ interiorDefense: 76, blocking: 61, defRebounding: 66 })),
  ] as [LegacyPlayerStateInput, LegacyPlayerStateInput, LegacyPlayerStateInput, LegacyPlayerStateInput, LegacyPlayerStateInput],
});

const runSeededWindow = (workRate: "low" | "high"): { keyMoments: number; finalFatigue: number } => {
  const adapter = createMatchEngineAdapter({
    home: buildTeam("h"),
    away: buildTeam("a"),
    userPlayerId: "h1",
    seed: 42,
    leagueLevel: LeagueLevel.PRO,
    enableKeyMoments: true,
    secondsRemaining: 48 * 60,
  });
  adapter.setWorkRate(workRate);

  let keyMoments = 0;
  let safety = 0;
  let current = adapter.startGame();
  while (current.state.secondsRemaining > 0 && safety < 90) {
    safety += 1;
    current = adapter.stepPossession();
    if (current.pendingKeyMoment) {
      keyMoments += 1;
      current = adapter.resolvePendingKeyMoment({
        pendingId: current.pendingKeyMoment.id,
        usedFallbackBaseline: true,
      });
    }
  }

  return {
    keyMoments,
    finalFatigue: current.userMatchState?.fatigue ?? 0,
  };
};

describe("match tactics simulation", () => {
  it("high work rate produces more user involvement and more fatigue than low work rate in seeded sims", () => {
    const low = runSeededWindow("low");
    const high = runSeededWindow("high");

    expect(high.keyMoments).toBeGreaterThanOrEqual(low.keyMoments);
    expect(high.finalFatigue).toBeGreaterThan(low.finalFatigue);
  });
});
