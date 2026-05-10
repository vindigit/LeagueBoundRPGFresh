import { ARCHETYPE_SIM_CONTRACTS } from "../src/builder/archetypeSimContracts";
import { BUILD_PRESETS_BY_POSITION, type BuildPreset } from "../src/builder/presets";
import { buildSimProjection } from "../src/builder/simProjection";
import { createSeededRng, initializePossession, simulatePossession } from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { Player, PlayerArchetype, PlayerAttributes, Position } from "../src/types/player";
import type { Team } from "../src/types/team";

const defaultGameStats = { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 };
const POSITIONS: readonly Position[] = ["PG", "SG", "SF", "PF", "C"];
const SEEDS = Array.from({ length: 16 }, (_, index) => 9001 + index * 37);
const POSSESSIONS_PER_SEED = 96;

const baseByPosition: Record<Position, PlayerAttributes> = {
  PG: { shortRange: 62, dunking: 44, midrange: 62, threePoint: 60, handle: 70, passing: 68, vision: 68, perimeterDefense: 64, interiorDefense: 42, stealing: 62, blocking: 34, offRebounding: 36, defRebounding: 44, speed: 72, strength: 48, stamina: 70 },
  SG: { shortRange: 62, dunking: 52, midrange: 68, threePoint: 70, handle: 64, passing: 58, vision: 60, perimeterDefense: 64, interiorDefense: 44, stealing: 60, blocking: 36, offRebounding: 38, defRebounding: 46, speed: 70, strength: 50, stamina: 70 },
  SF: { shortRange: 66, dunking: 64, midrange: 64, threePoint: 62, handle: 60, passing: 58, vision: 60, perimeterDefense: 68, interiorDefense: 58, stealing: 62, blocking: 56, offRebounding: 52, defRebounding: 60, speed: 68, strength: 62, stamina: 70 },
  PF: { shortRange: 70, dunking: 68, midrange: 58, threePoint: 52, handle: 48, passing: 54, vision: 56, perimeterDefense: 60, interiorDefense: 72, stealing: 56, blocking: 70, offRebounding: 72, defRebounding: 76, speed: 62, strength: 74, stamina: 70 },
  C: { shortRange: 74, dunking: 72, midrange: 44, threePoint: 34, handle: 38, passing: 48, vision: 52, perimeterDefense: 46, interiorDefense: 78, stealing: 50, blocking: 78, offRebounding: 76, defRebounding: 82, speed: 54, strength: 82, stamina: 68 },
};

const archetypeByPosition: Record<Position, PlayerArchetype> = {
  PG: "Playmaker",
  SG: "Sharpshooter",
  SF: "Slasher",
  PF: "Paint Beast",
  C: "Paint Beast",
};

const makePlayer = (id: string, position: Position, attributes: PlayerAttributes, name = id): Player => {
  const projection = buildSimProjection({ attributes, position, leagueLevel: LeagueLevel.MIDDLE_SCHOOL });
  return {
    id,
    name,
    age: 13,
    bankBalance: 0,
    morale: 50,
    position,
    secondaryPosition: position,
    archetype: projection.classification.legacyArchetype,
    identity: null,
    dna: {
      potential: 80,
      potentialTier: "Gold",
      growthCurve: "STEADY",
      generationSeed: 1,
      growthByLeague: {
        [LeagueLevel.MIDDLE_SCHOOL]: 1,
        [LeagueLevel.HIGH_SCHOOL]: 1,
        [LeagueLevel.COLLEGE]: 1,
        [LeagueLevel.PRO]: 1,
      },
      caps: attributes,
      growthResidue: {},
      publicTraits: [],
      builderProfile: {
        classification: projection.classification,
        badges: projection.badges,
      },
    },
    attributes,
    gameStats: { ...defaultGameStats },
  };
};

const makeRoster = (userPreset: BuildPreset): Team["roster"] =>
  POSITIONS.map((position) => {
    if (position === userPreset.position) {
      return makePlayer("user", position, userPreset.attributes, userPreset.label);
    }
    return {
      ...makePlayer(`mate-${position}`, position, baseByPosition[position], `Mate ${position}`),
      archetype: archetypeByPosition[position],
    };
  }) as Team["roster"];

const makeOpponentRoster = (): Team["roster"] =>
  POSITIONS.map((position) => ({
    ...makePlayer(`opp-${position}`, position, baseByPosition[position], `Opp ${position}`),
    archetype: archetypeByPosition[position],
  })) as Team["roster"];

interface UserAggregate {
  possessions: number;
  touches: number;
  fga: number;
  threePa: number;
  rimPa: number;
  midPa: number;
  assists: number;
  rebounds: number;
  offRebounds: number;
  defRebounds: number;
  steals: number;
  blocks: number;
  defensiveEvents: number;
  turnovers: number;
}

interface UserAggregateRates extends UserAggregate {
  rimRate: number;
  threeRate: number;
  midRate: number;
  assistPerTouch: number;
  reboundPerPossession: number;
  defensiveEventPerPossession: number;
  turnoverPerTouch: number;
}

const emptyAggregate = (): UserAggregate => ({
  possessions: 0,
  touches: 0,
  fga: 0,
  threePa: 0,
  rimPa: 0,
  midPa: 0,
  assists: 0,
  rebounds: 0,
  offRebounds: 0,
  defRebounds: 0,
  steals: 0,
  blocks: 0,
  defensiveEvents: 0,
  turnovers: 0,
});

const rate = (numerator: number, denominator: number): number => numerator / Math.max(1, denominator);

const withRates = (aggregate: UserAggregate): UserAggregateRates => ({
  ...aggregate,
  rimRate: rate(aggregate.rimPa, aggregate.fga),
  threeRate: rate(aggregate.threePa, aggregate.fga),
  midRate: rate(aggregate.midPa, aggregate.fga),
  assistPerTouch: rate(aggregate.assists, aggregate.touches),
  reboundPerPossession: rate(aggregate.rebounds, aggregate.possessions),
  defensiveEventPerPossession: rate(aggregate.defensiveEvents, aggregate.possessions),
  turnoverPerTouch: rate(aggregate.turnovers, aggregate.touches),
});

const runPresetAggregate = (preset: BuildPreset): UserAggregateRates => {
  const totals = emptyAggregate();
  const userIndex = POSITIONS.indexOf(preset.position);

  for (const seed of SEEDS) {
    const context = {
      home: { name: "Home", teamOvr: 0, roster: makeRoster(preset) },
      away: { name: "Away", teamOvr: 0, roster: makeOpponentRoster() },
    };
    const rng = createSeededRng(seed);
    let state = initializePossession(context, LeagueLevel.MIDDLE_SCHOOL, rng, 20 * 60);
    let possessions = 0;
    while (state.secondsRemaining > 0 && possessions < POSSESSIONS_PER_SEED) {
      const before = state;
      const result = simulatePossession(context, state, LeagueLevel.MIDDLE_SCHOOL, rng);
      totals.possessions += 1;

      const touchDelta = result.nextState.homeTouches[userIndex] - before.homeTouches[userIndex];
      if (touchDelta > 0) {
        totals.touches += touchDelta;
      }
      if (before.offenseKey === "home" && result.shooterIndex === userIndex && !result.turnoverLikeFailure) {
        totals.fga += 1;
        if (result.shotZone === "three") totals.threePa += 1;
        if (result.shotZone === "rim") totals.rimPa += 1;
        if (result.shotZone === "midrange") totals.midPa += 1;
      }
      if (before.offenseKey === "home" && result.assisterIndex === userIndex && result.assisted) {
        totals.assists += 1;
      }
      if (before.offenseKey === "home" && result.turnoverLikeFailure && result.shooterIndex === userIndex) {
        totals.turnovers += 1;
      }

      const reboundTeam = result.offensiveRebound ? before.offenseKey : result.eventType === "def_reb" ? before.defenseKey : undefined;
      if (reboundTeam === "home" && result.rebounderIndex === userIndex) {
        totals.rebounds += 1;
        if (result.offensiveRebound) {
          totals.offRebounds += 1;
        } else {
          totals.defRebounds += 1;
        }
      }
      if (before.defenseKey === "home" && result.eventType === "steal" && result.defensivePlay.defenderIndex === userIndex) {
        totals.steals += 1;
        totals.defensiveEvents += 1;
      }
      if (before.defenseKey === "home" && result.eventType === "block" && result.defensivePlay.defenderIndex === userIndex) {
        totals.blocks += 1;
        totals.defensiveEvents += 1;
      }
      state = result.nextState;
      possessions += 1;
    }
  }

  return withRates(totals);
};

const allPresets = (): BuildPreset[] => POSITIONS.flatMap((position) => [...BUILD_PRESETS_BY_POSITION[position]]);

const buildAggregates = (): Record<BuildPreset["id"], UserAggregateRates> =>
  allPresets().reduce(
    (acc, buildPreset) => ({
      ...acc,
      [buildPreset.id]: runPresetAggregate(buildPreset),
    }),
    {} as Record<BuildPreset["id"], UserAggregateRates>,
  );

describe("builder preset aggregate simulation identity", () => {
  let rates: Record<BuildPreset["id"], UserAggregateRates>;

  beforeAll(() => {
    rates = buildAggregates();
  });

  it("reports derived aggregate rates for every preset", () => {
    expect(Object.keys(rates).sort()).toEqual(ARCHETYPE_SIM_CONTRACTS.map((contract) => contract.id).sort());
    for (const buildPreset of allPresets()) {
      const aggregate = rates[buildPreset.id];
      expect(aggregate.possessions).toBeGreaterThan(SEEDS.length * 70);
      expect(aggregate.fga).toBeGreaterThan(0);
      expect(aggregate.rimRate + aggregate.threeRate + aggregate.midRate).toBeCloseTo(1, 5);
      expect(Number.isFinite(aggregate.assistPerTouch)).toBe(true);
      expect(Number.isFinite(aggregate.reboundPerPossession)).toBe(true);
      expect(Number.isFinite(aggregate.defensiveEventPerPossession)).toBe(true);
    }
  });

  it("gives SG shooter a shooter-like three rate", () => {
    const movement = rates.sg_movement_shooter;
    const slasher = rates.sg_slashing_scorer;
    const poa = rates.sg_point_of_attack_defender;

    expect(movement.threeRate).toBeGreaterThan(0.36);
    expect(movement.threeRate).toBeGreaterThan(slasher.threeRate + 0.08);
    expect(movement.threeRate).toBeGreaterThan(poa.threeRate + 0.06);
  });

  it("gives SG slasher a rim-pressure shot profile", () => {
    const slasher = rates.sg_slashing_scorer;
    const movement = rates.sg_movement_shooter;

    expect(slasher.rimRate).toBeGreaterThan(0.34);
    expect(slasher.rimRate).toBeGreaterThan(movement.rimRate + 0.08);
  });

  it("gives PG creator a stronger assist fingerprint than scoring guards", () => {
    const creator = rates.pg_primary_creator;
    const shotmaker = rates.pg_shotmaking_guard;
    const rim = rates.pg_rim_pressure_guard;

    expect(creator.assistPerTouch).toBeGreaterThan(shotmaker.assistPerTouch + 0.01);
    expect(creator.assistPerTouch).toBeGreaterThan(rim.assistPerTouch + 0.006);
    expect(creator.touches).toBeGreaterThan(rates.sg_movement_shooter.touches);
  });

  it("keeps lockdown SG defense-first without star offensive usage", () => {
    const poa = rates.sg_point_of_attack_defender;
    const movement = rates.sg_movement_shooter;
    const slasher = rates.sg_slashing_scorer;

    expect(poa.defensiveEventPerPossession).toBeGreaterThan(movement.defensiveEventPerPossession);
    expect(poa.defensiveEventPerPossession).toBeGreaterThan(slasher.defensiveEventPerPossession);
    expect(poa.fga).toBeLessThan(slasher.fga);
  });

  it("keeps frontcourt rebounders materially ahead of guards", () => {
    const guardAverage = (rates.pg_primary_creator.reboundPerPossession + rates.sg_movement_shooter.reboundPerPossession) / 2;
    const frontcourtAverage = (rates.pf_glass_defender.reboundPerPossession + rates.c_paint_beast.reboundPerPossession) / 2;

    expect(rates.pf_glass_defender.reboundPerPossession).toBeGreaterThan(rates.pf_stretch_four.reboundPerPossession);
    expect(rates.c_paint_beast.reboundPerPossession).toBeGreaterThan(rates.pg_primary_creator.reboundPerPossession);
    expect(frontcourtAverage).toBeGreaterThan(guardAverage + 0.035);
  });

  it("keeps stretch bigs spacing without turning them into guards", () => {
    const stretchBig = rates.c_stretch_big;
    const paint = rates.c_paint_beast;
    const rimProtector = rates.c_rim_protector;

    expect(stretchBig.threeRate).toBeGreaterThan(paint.threeRate + 0.12);
    expect(stretchBig.threeRate).toBeGreaterThan(rimProtector.threeRate + 0.12);
    expect(stretchBig.assistPerTouch).toBeLessThan(rates.pg_primary_creator.assistPerTouch);
    expect(stretchBig.assists).toBeLessThan(rates.pg_primary_creator.assists);
  });

  it("gives rim protector a stronger block and defensive event profile than stretch big", () => {
    const rimProtector = rates.c_rim_protector;
    const stretchBig = rates.c_stretch_big;

    expect(rimProtector.defensiveEventPerPossession).toBeGreaterThan(stretchBig.defensiveEventPerPossession);
    expect(rimProtector.defensiveEventPerPossession).toBeGreaterThan(rates.c_paint_beast.defensiveEventPerPossession);
  });
});
