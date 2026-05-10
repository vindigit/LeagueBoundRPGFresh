import { BUILD_PRESETS_BY_POSITION, type BuildPreset } from "../src/builder/presets";
import { buildSimProjection } from "../src/builder/simProjection";
import { createSeededRng, initializePossession, simulatePossession } from "../src/matchEngine";
import { LeagueLevel } from "../src/types/career";
import type { Player, PlayerArchetype, PlayerAttributes, Position } from "../src/types/player";
import type { Team } from "../src/types/team";

const defaultGameStats = { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 };
const POSITIONS: readonly Position[] = ["PG", "SG", "SF", "PF", "C"];

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
  POSITIONS.map((position, index) => {
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
  touches: number;
  fga: number;
  threePa: number;
  rimPa: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  defensiveEvents: number;
}

const runPresetAggregate = (preset: BuildPreset): UserAggregate => {
  const totals: UserAggregate = { touches: 0, fga: 0, threePa: 0, rimPa: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, defensiveEvents: 0 };
  const userIndex = POSITIONS.indexOf(preset.position);
  const seeds = Array.from({ length: 8 }, (_, index) => 9001 + index * 37);

  for (const seed of seeds) {
    const context = {
      home: { name: "Home", teamOvr: 0, roster: makeRoster(preset) },
      away: { name: "Away", teamOvr: 0, roster: makeOpponentRoster() },
    };
    const rng = createSeededRng(seed);
    let state = initializePossession(context, LeagueLevel.MIDDLE_SCHOOL, rng, 16 * 60);
    let possessions = 0;
    while (state.secondsRemaining > 0 && possessions < 82) {
      const before = state;
      const result = simulatePossession(context, state, LeagueLevel.MIDDLE_SCHOOL, rng);
      if (before.offenseKey === "home") {
        totals.touches += result.nextState.homeTouches[userIndex] - before.homeTouches[userIndex];
      } else if (before.defenseKey === "home") {
        totals.touches += result.nextState.homeTouches[userIndex] - before.homeTouches[userIndex];
      }
      if (before.offenseKey === "home" && result.shooterIndex === userIndex && !result.turnoverLikeFailure) {
        totals.fga += 1;
        if (result.shotZone === "three") totals.threePa += 1;
        if (result.shotZone === "rim") totals.rimPa += 1;
      }
      if (before.offenseKey === "home" && result.assisterIndex === userIndex && result.assisted) {
        totals.assists += 1;
      }
      const reboundTeam = result.offensiveRebound ? before.offenseKey : result.eventType === "def_reb" ? before.defenseKey : undefined;
      if (reboundTeam === "home" && result.rebounderIndex === userIndex) {
        totals.rebounds += 1;
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

  return totals;
};

const preset = (position: Position, id: BuildPreset["id"]): BuildPreset => {
  const found = BUILD_PRESETS_BY_POSITION[position].find((entry) => entry.id === id);
  if (!found) throw new Error(`Missing preset ${position} ${id}`);
  return found;
};

describe("builder preset aggregate simulation identity", () => {
  it("separates SG shooting and rim-pressure profiles", () => {
    const movement = runPresetAggregate(preset("SG", "sg_movement_shooter"));
    const slasher = runPresetAggregate(preset("SG", "sg_slashing_scorer"));
    const poa = runPresetAggregate(preset("SG", "sg_point_of_attack_defender"));

    expect(movement.threePa).toBeGreaterThan(slasher.threePa);
    expect(movement.threePa).toBeGreaterThan(poa.threePa);
    expect(slasher.rimPa).toBeGreaterThan(movement.rimPa);
  });

  it("separates PG creator and rim-pressure profiles", () => {
    const creator = runPresetAggregate(preset("PG", "pg_primary_creator"));
    const shotmaker = runPresetAggregate(preset("PG", "pg_shotmaking_guard"));
    const rim = runPresetAggregate(preset("PG", "pg_rim_pressure_guard"));

    expect(creator.assists).toBeGreaterThan(shotmaker.assists);
    expect(creator.assists).toBeGreaterThan(rim.assists);
    expect(rim.rimPa).toBeGreaterThan(shotmaker.rimPa);
  });

  it("separates frontcourt rebound, defense, and stretch profiles", () => {
    const glass = runPresetAggregate(preset("PF", "pf_glass_defender"));
    const stretchFour = runPresetAggregate(preset("PF", "pf_stretch_four"));
    const athletic = runPresetAggregate(preset("PF", "pf_athletic_finisher"));
    const paint = runPresetAggregate(preset("C", "c_paint_beast"));
    const rimProtector = runPresetAggregate(preset("C", "c_rim_protector"));
    const stretchBig = runPresetAggregate(preset("C", "c_stretch_big"));

    expect(glass.rebounds).toBeGreaterThan(stretchFour.rebounds);
    expect(glass.rebounds).toBeGreaterThan(athletic.rebounds);
    expect(rimProtector.blocks + rimProtector.defensiveEvents).toBeGreaterThan(stretchBig.blocks + stretchBig.defensiveEvents);
    expect(stretchBig.threePa).toBeGreaterThan(paint.threePa);
    expect(stretchBig.threePa).toBeGreaterThan(rimProtector.threePa);
  });

  it("keeps guard rebounding materially below frontcourt rebounding", () => {
    const creator = runPresetAggregate(preset("PG", "pg_primary_creator"));
    const movement = runPresetAggregate(preset("SG", "sg_movement_shooter"));
    const glass = runPresetAggregate(preset("PF", "pf_glass_defender"));
    const paint = runPresetAggregate(preset("C", "c_paint_beast"));

    expect((creator.rebounds + movement.rebounds) / 2).toBeLessThan((glass.rebounds + paint.rebounds) / 2);
  });
});
