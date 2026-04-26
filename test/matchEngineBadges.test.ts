import {
  BADGE_TIER_SCALE,
  buildBadgeModifierTotals,
  createSeededRng,
  getUniqueBadges,
  initializePossession,
  simulatePossession,
} from "../src/matchEngine";
import { createMatchEngineAdapter } from "../src/matchEngineAdapter";
import { LeagueLevel } from "../src/types/career";
import type { GeneratedBadgeProfile, PlayerDNA } from "../src/types/backstory";
import type { Player, PlayerArchetype, PlayerAttributes, Position } from "../src/types/player";
import type { Team } from "../src/types/team";
import type { ResolvedBuilderBadge } from "../src/builder/badges/resolve";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 70,
  dunking: 70,
  midrange: 70,
  threePoint: 70,
  handle: 70,
  passing: 70,
  vision: 70,
  perimeterDefense: 70,
  interiorDefense: 70,
  stealing: 70,
  blocking: 70,
  offRebounding: 70,
  defRebounding: 70,
  speed: 70,
  strength: 70,
  stamina: 70,
  ...overrides,
});

const makeBuilderProfile = (badges: ResolvedBuilderBadge[]): GeneratedBadgeProfile => ({
  classification: {
    label: "Badge Test",
    legacyArchetype: "Playmaker",
    taxonomy: {
      family: "Creation",
      positionFamily: "Guard",
    },
    topStrengths: [],
  },
  badges,
});

const makeDna = (attributes: PlayerAttributes, badges: ResolvedBuilderBadge[]): PlayerDNA => ({
  potential: 85,
  potentialTier: "Gold",
  growthCurve: "STEADY",
  generationSeed: 1,
  growthByLeague: {
    [LeagueLevel.MIDDLE_SCHOOL]: 1,
    [LeagueLevel.HIGH_SCHOOL]: 1,
    [LeagueLevel.COLLEGE]: 1,
    [LeagueLevel.PRO]: 1,
  },
  caps: { ...attributes },
  growthResidue: {},
  publicTraits: [],
  builderProfile: makeBuilderProfile(badges),
});

const makePlayer = (
  id: string,
  position: Position,
  archetype: PlayerArchetype,
  attributeOverrides: Partial<PlayerAttributes> = {},
  badges: ResolvedBuilderBadge[] = [],
): Player => {
  const attributes = makeAttributes(attributeOverrides);
  return {
    id,
    name: id,
    age: 19,
    bankBalance: 0,
    morale: 50,
    position,
    secondaryPosition: position === "PG" ? "SG" : position,
    archetype,
    identity: null,
    dna: badges.length > 0 ? makeDna(attributes, badges) : null,
    attributes,
    gameStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 },
  };
};

const makeTeam = (prefix: string, roster: [Player, Player, Player, Player, Player]): Team => ({
  name: `${prefix}-team`,
  teamOvr: 0,
  roster,
});

const makeBaseContext = () => ({
  home: makeTeam("home", [
    makePlayer("h1", "PG", "Playmaker", { handle: 90, passing: 88, vision: 86, stamina: 85 }),
    makePlayer("h2", "SG", "Sharpshooter", { threePoint: 90, midrange: 82, speed: 74 }),
    makePlayer("h3", "SF", "Slasher", { shortRange: 82, dunking: 80, speed: 80, strength: 76 }),
    makePlayer("h4", "PF", "Stretch Big", { offRebounding: 70, defRebounding: 76, interiorDefense: 74, blocking: 68 }),
    makePlayer("h5", "C", "Paint Beast", { shortRange: 82, dunking: 80, offRebounding: 84, defRebounding: 88, interiorDefense: 84, blocking: 82, strength: 84 }),
  ]),
  away: makeTeam("away", [
    makePlayer("a1", "PG", "Playmaker", { handle: 88, passing: 84, vision: 82, stealing: 74, perimeterDefense: 76 }),
    makePlayer("a2", "SG", "Sharpshooter", { threePoint: 88, midrange: 80, speed: 73 }),
    makePlayer("a3", "SF", "Lockdown Defender", { perimeterDefense: 84, stealing: 82, speed: 80, blocking: 72 }),
    makePlayer("a4", "PF", "Stretch Big", { offRebounding: 72, defRebounding: 78, interiorDefense: 76, blocking: 70 }),
    makePlayer("a5", "C", "Paint Beast", { shortRange: 80, dunking: 78, offRebounding: 82, defRebounding: 86, interiorDefense: 86, blocking: 84, strength: 84 }),
  ]),
});

const cloneContext = (context: { home: Team; away: Team }): { home: Team; away: Team } => ({
  home: {
    ...context.home,
    roster: context.home.roster.map((player) => ({
      ...player,
      dna: player.dna
        ? {
            ...player.dna,
            caps: { ...player.dna.caps },
            growthResidue: { ...player.dna.growthResidue },
            publicTraits: [...player.dna.publicTraits],
            builderProfile: player.dna.builderProfile
              ? {
                  ...player.dna.builderProfile,
                  classification: {
                    ...player.dna.builderProfile.classification,
                    taxonomy: { ...player.dna.builderProfile.classification.taxonomy },
                    topStrengths: [...player.dna.builderProfile.classification.topStrengths],
                  },
                  badges: player.dna.builderProfile.badges.map((badge) => ({ ...badge })),
                }
              : undefined,
          }
        : null,
      attributes: { ...player.attributes },
      gameStats: { ...player.gameStats },
    })) as Team["roster"],
  },
  away: {
    ...context.away,
    roster: context.away.roster.map((player) => ({
      ...player,
      dna: player.dna
        ? {
            ...player.dna,
            caps: { ...player.dna.caps },
            growthResidue: { ...player.dna.growthResidue },
            publicTraits: [...player.dna.publicTraits],
            builderProfile: player.dna.builderProfile
              ? {
                  ...player.dna.builderProfile,
                  classification: {
                    ...player.dna.builderProfile.classification,
                    taxonomy: { ...player.dna.builderProfile.classification.taxonomy },
                    topStrengths: [...player.dna.builderProfile.classification.topStrengths],
                  },
                  badges: player.dna.builderProfile.badges.map((badge) => ({ ...badge })),
                }
              : undefined,
          }
        : null,
      attributes: { ...player.attributes },
      gameStats: { ...player.gameStats },
    })) as Team["roster"],
  },
});

const applyBadges = (context: { home: Team; away: Team }, teamKey: "home" | "away", playerIndex: number, badges: ResolvedBuilderBadge[]) => {
  context[teamKey].roster[playerIndex].dna = makeDna(context[teamKey].roster[playerIndex].attributes, badges);
};

const runAggregate = (
  baseContext: { home: Team; away: Team },
  seeds: number[],
  options: { debugBadges?: boolean } = {},
) => {
  const metrics = {
    possessions: 0,
    turnovers: 0,
    threePa: 0,
    threePm: 0,
    midPa: 0,
    midPm: 0,
    offReb: 0,
    missedShots: 0,
    rimPa: 0,
    rimPm: 0,
    assists: 0,
  };

  for (const seed of seeds) {
    const context = cloneContext(baseContext);
    const rng = createSeededRng(seed);
    let state = initializePossession(context, LeagueLevel.PRO, rng, 48 * 60);
    let possessions = 0;
    while (state.secondsRemaining > 0 && possessions < 220) {
      const result = simulatePossession(context, state, LeagueLevel.PRO, rng, { debugBadges: options.debugBadges });
      metrics.possessions += 1;
      if (result.turnoverLikeFailure) {
        metrics.turnovers += 1;
      }
      if (result.shotZone === "three") {
        metrics.threePa += 1;
        if (result.eventType === "made_3") {
          metrics.threePm += 1;
        }
      }
      if (result.shotZone === "midrange") {
        metrics.midPa += 1;
        if (result.eventType === "made_2") {
          metrics.midPm += 1;
        }
      }
      if (result.shotZone === "rim") {
        metrics.rimPa += 1;
        if (result.eventType === "made_2" || result.eventType === "putback_make") {
          metrics.rimPm += 1;
        }
      }
      if (result.assisted && result.madeShot) {
        metrics.assists += 1;
      }
      if (!result.turnoverLikeFailure && !result.madeShot) {
        metrics.missedShots += 1;
      }
      if (result.offensiveRebound) {
        metrics.offReb += 1;
      }
      state = result.nextState;
      possessions += 1;
    }
  }

  return {
    turnoverRate: metrics.possessions > 0 ? (metrics.turnovers / metrics.possessions) * 100 : 0,
    threePct: metrics.threePa > 0 ? (metrics.threePm / metrics.threePa) * 100 : 0,
    midPct: metrics.midPa > 0 ? (metrics.midPm / metrics.midPa) * 100 : 0,
    offensiveReboundRate: metrics.missedShots > 0 ? (metrics.offReb / metrics.missedShots) * 100 : 0,
    rimPct: metrics.rimPa > 0 ? (metrics.rimPm / metrics.rimPa) * 100 : 0,
    assistRate: (metrics.threePm + metrics.midPm + metrics.rimPm) > 0 ? (metrics.assists / (metrics.threePm + metrics.midPm + metrics.rimPm)) * 100 : 0,
  };
};

const expectDirectional = (baseline: number, compared: number, direction: "up" | "down", tolerance = 0): void => {
  if (direction === "up") {
    expect(compared).toBeGreaterThanOrEqual(baseline - tolerance);
    return;
  }
  expect(compared).toBeLessThanOrEqual(baseline + tolerance);
};

describe("match engine badges", () => {
  it("exposes badge tier scales and ignores duplicate badge ids", () => {
    const duplicated = makePlayer(
      "dup",
      "PG",
      "Playmaker",
      {},
      [
        { id: "deep_range", label: "Deep Range", tier: "GOLD", description: "a" },
        { id: "deep_range", label: "Deep Range", tier: "BRONZE", description: "b" },
        { id: "floor_general", label: "Floor General", tier: "SILVER", description: "c" },
      ],
    );

    expect(BADGE_TIER_SCALE).toEqual({ BRONZE: 1, SILVER: 1.75, GOLD: 2.5 });
    expect(getUniqueBadges(duplicated).map((badge) => badge.id)).toEqual(["deep_range", "floor_general"]);

    const modifiers = buildBadgeModifierTotals(duplicated);
    expect(modifiers.deepRangeThreeMake).toBeCloseTo(0.0375, 5);
    expect(modifiers.floorGeneralBallSecurity).toBeCloseTo(7, 5);
  });

  it("raises three-point efficiency with deep range", () => {
    const seeds = Array.from({ length: 20 }, (_, index) => 41000 + index);
    const baselineContext = makeBaseContext();
    const badgedContext = cloneContext(baselineContext);
    applyBadges(badgedContext, "home", 1, [{ id: "deep_range", label: "Deep Range", tier: "GOLD", description: "test" }]);

    const baseline = runAggregate(baselineContext, seeds);
    const badged = runAggregate(badgedContext, seeds);

    expect(badged.threePct).toBeGreaterThan(baseline.threePct);
  });

  it("lowers turnover rate with floor general", () => {
    const seeds = Array.from({ length: 20 }, (_, index) => 42000 + index);
    const baselineContext = makeBaseContext();
    const badgedContext = cloneContext(baselineContext);
    applyBadges(badgedContext, "home", 0, [{ id: "floor_general", label: "Floor General", tier: "GOLD", description: "test" }]);

    const baseline = runAggregate(baselineContext, seeds);
    const badged = runAggregate(badgedContext, seeds);

    expect(badged.turnoverRate).toBeLessThan(baseline.turnoverRate);
  });

  it("raises midrange efficiency with mid-range magician", () => {
    const seeds = Array.from({ length: 20 }, (_, index) => 42500 + index);
    const baselineContext = makeBaseContext();
    const badgedContext = cloneContext(baselineContext);
    applyBadges(badgedContext, "home", 1, [{ id: "mid_range_magician", label: "Mid-Range Magician", tier: "GOLD", description: "test" }]);

    const baseline = runAggregate(baselineContext, seeds);
    const badged = runAggregate(badgedContext, seeds);

    expectDirectional(baseline.midPct, badged.midPct, "up", 1);
  });

  it("raises jumper efficiency with catch and shoot", () => {
    const seeds = Array.from({ length: 20 }, (_, index) => 42700 + index);
    const baselineContext = makeBaseContext();
    const badgedContext = cloneContext(baselineContext);
    applyBadges(badgedContext, "home", 1, [{ id: "catch_and_shoot", label: "Catch and Shoot", tier: "GOLD", description: "test" }]);

    const baseline = runAggregate(baselineContext, seeds);
    const badged = runAggregate(badgedContext, seeds);

    expectDirectional(baseline.threePct, badged.threePct, "up", 0.25);
  });

  it("raises rim efficiency with posterizer", () => {
    const seeds = Array.from({ length: 20 }, (_, index) => 42800 + index);
    const baselineContext = makeBaseContext();
    const badgedContext = cloneContext(baselineContext);
    applyBadges(badgedContext, "home", 2, [{ id: "posterizer", label: "Posterizer", tier: "GOLD", description: "test" }]);

    const baseline = runAggregate(baselineContext, seeds);
    const badged = runAggregate(badgedContext, seeds);

    expectDirectional(baseline.rimPct, badged.rimPct, "up", 0.5);
  });

  it("raises turnover creation with pickpocket", () => {
    const seeds = Array.from({ length: 20 }, (_, index) => 42900 + index);
    const baselineContext = makeBaseContext();
    const badgedContext = cloneContext(baselineContext);
    applyBadges(badgedContext, "away", 2, [{ id: "pickpocket", label: "Pickpocket", tier: "GOLD", description: "test" }]);

    const baseline = runAggregate(baselineContext, seeds);
    const badged = runAggregate(badgedContext, seeds);

    expect(badged.turnoverRate).toBeGreaterThan(baseline.turnoverRate);
  });

  it("reduces opponent rim efficiency with anchor", () => {
    const seeds = Array.from({ length: 20 }, (_, index) => 43000 + index);
    const baselineContext = makeBaseContext();
    const badgedContext = cloneContext(baselineContext);
    applyBadges(badgedContext, "home", 4, [{ id: "anchor", label: "Anchor", tier: "GOLD", description: "test" }]);

    const baseline = runAggregate(baselineContext, seeds);
    const badged = runAggregate(badgedContext, seeds);

    expect(badged.rimPct).toBeLessThan(baseline.rimPct);
  });

  it("raises offensive rebound rate with putback boss", () => {
    const seeds = Array.from({ length: 20 }, (_, index) => 43100 + index);
    const baselineContext = makeBaseContext();
    const badgedContext = cloneContext(baselineContext);
    applyBadges(badgedContext, "home", 4, [{ id: "putback_boss", label: "Putback Boss", tier: "GOLD", description: "test" }]);

    const baseline = runAggregate(baselineContext, seeds);
    const badged = runAggregate(badgedContext, seeds);

    expect(badged.offensiveReboundRate).toBeGreaterThan(baseline.offensiveReboundRate);
  });

  it("populates badge debug traces only when enabled", () => {
    const context = makeBaseContext();
    applyBadges(context, "home", 0, [{ id: "floor_general", label: "Floor General", tier: "GOLD", description: "test" }]);

    const disabledAdapter = createMatchEngineAdapter({
      home: cloneContext(context).home,
      away: cloneContext(context).away,
      userPlayerId: "h1",
      seed: 2026,
      enableKeyMoments: false,
      debugBadges: false,
    });
    disabledAdapter.startGame();
    const disabledStep = disabledAdapter.stepPossession();
    expect(disabledStep.result?.badgeDebug).toBeUndefined();

    const enabledAdapter = createMatchEngineAdapter({
      home: cloneContext(context).home,
      away: cloneContext(context).away,
      userPlayerId: "h1",
      seed: 2026,
      enableKeyMoments: false,
      debugBadges: true,
    });
    enabledAdapter.startGame();
    const enabledStep = enabledAdapter.stepPossession();
    expect(enabledStep.result?.badgeDebug).toBeDefined();
    expect(Array.isArray(enabledStep.result?.badgeDebug?.contributions)).toBe(true);
  });
});
