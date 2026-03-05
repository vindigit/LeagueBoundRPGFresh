import { LeagueLevel } from "../src/types/career";
import type { MatchContext } from "../src/matchEngine";
import type { Player, PlayerAttributes } from "../src/types/player";

const baseAttributes: PlayerAttributes = {
  shortRange: 66,
  dunking: 63,
  midrange: 63,
  threePoint: 70,
  handle: 84,
  passing: 73,
  vision: 78,
  perimeterDefense: 58,
  interiorDefense: 50,
  stealing: 55,
  blocking: 45,
  offRebounding: 35,
  defRebounding: 44,
  speed: 71,
  strength: 62,
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

const createContext = (): MatchContext => ({
  home: {
    name: "Home",
    teamOvr: 0,
    roster: [createPlayer("h1"), createPlayer("h2"), createPlayer("h3"), createPlayer("h4"), createPlayer("h5")],
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [createPlayer("a1"), createPlayer("a2"), createPlayer("a3"), createPlayer("a4"), createPlayer("a5")],
  },
});

describe("matchEngine elapsed guard", () => {
  afterEach(() => {
    jest.dontMock("../src/matchEngineTuning.js");
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("fails fast at module load when a tuning min/max pair is invalid", () => {
    jest.isolateModules(() => {
      jest.doMock("../src/matchEngineTuning.js", () => ({
        __esModule: true,
        default: {
          minEventSeconds: 7,
          maxEventSeconds: 24,
          turnoverEventSecondsMin: 11,
          turnoverEventSecondsMax: 11,
          offensiveReboundEventSecondsMin: 4,
          offensiveReboundEventSecondsMax: 8,
        },
      }));

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("../src/matchEngine");
      }).toThrow(
        "Invalid match engine tuning range: turnoverEventSecondsMin (11) must be < turnoverEventSecondsMax (11).",
      );
    });
  });

  it("always advances game clock by at least one second per possession even if tuning mutates at runtime", () => {
    const engine = require("../src/matchEngine") as typeof import("../src/matchEngine");
    const tuning = require("../src/matchEngineTuning.js") as {
      minEventSeconds: number;
      maxEventSeconds: number;
      turnoverEventSecondsMin: number;
      turnoverEventSecondsMax: number;
      offensiveReboundEventSecondsMin: number;
      offensiveReboundEventSecondsMax: number;
    };

    const original = {
      minEventSeconds: tuning.minEventSeconds,
      maxEventSeconds: tuning.maxEventSeconds,
      turnoverEventSecondsMin: tuning.turnoverEventSecondsMin,
      turnoverEventSecondsMax: tuning.turnoverEventSecondsMax,
      offensiveReboundEventSecondsMin: tuning.offensiveReboundEventSecondsMin,
      offensiveReboundEventSecondsMax: tuning.offensiveReboundEventSecondsMax,
    };

    try {
      tuning.minEventSeconds = 0;
      tuning.maxEventSeconds = 0;
      tuning.turnoverEventSecondsMin = 0;
      tuning.turnoverEventSecondsMax = 0;
      tuning.offensiveReboundEventSecondsMin = 0;
      tuning.offensiveReboundEventSecondsMax = 0;

      const context = createContext();
      const rng = engine.createSeededRng(20260226);
      let state = engine.initializePossession(context, LeagueLevel.PRO, rng, 12);

      for (let i = 0; i < 5 && state.secondsRemaining > 0; i += 1) {
        const previous = state.secondsRemaining;
        const result = engine.simulatePossession(context, state, LeagueLevel.PRO, rng);
        const consumed = previous - result.nextState.secondsRemaining;
        expect(consumed).toBeGreaterThanOrEqual(1);
        state = result.nextState;
      }
    } finally {
      tuning.minEventSeconds = original.minEventSeconds;
      tuning.maxEventSeconds = original.maxEventSeconds;
      tuning.turnoverEventSecondsMin = original.turnoverEventSecondsMin;
      tuning.turnoverEventSecondsMax = original.turnoverEventSecondsMax;
      tuning.offensiveReboundEventSecondsMin = original.offensiveReboundEventSecondsMin;
      tuning.offensiveReboundEventSecondsMax = original.offensiveReboundEventSecondsMax;
    }
  });
});
