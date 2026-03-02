import { initializePossession, simulatePossession, createSeededRng, type MatchContext, type PossessionState } from "../matchEngine";
import { CPI_CHECKPOINTS, CPI_TARGET_BAND, calculateCpi, getCpiRatio } from "../features/backstory/constants/growthModel";
import type { AttributeGainSource } from "../types/backstory";
import { LeagueLevel } from "../types/career";
import type { Player, PlayerArchetype, PlayerAttributes } from "../types/player";

type ProfileKey =
  | "SLASHER_INSIDE_FINISHER"
  | "PERIMETER_SHOT_CREATOR"
  | "PRIMARY_PLAYMAKER"
  | "DEFENSIVE_ANCHOR_REBOUNDER"
  | "BALANCED_CONTROL";

interface ProfileConfig {
  key: ProfileKey;
  label: string;
  archetype: PlayerArchetype;
  intendedDirection: "up";
}

interface TeamMetrics {
  ppp: number;
  turnoverRate: number;
  defensiveStopRate: number;
  survivabilityRaw: number;
}

interface CpiCheckpointRow {
  checkpoint: string;
  profile: string;
  throughputIndex: number;
  survivabilityIndex: number;
  economyIndex: number;
  cpi: number;
  cpiRatioVsControl: number;
  inTargetBand: boolean;
  violatesDominanceGuard: boolean;
}

const PROFILE_CONFIGS: ProfileConfig[] = [
  { key: "SLASHER_INSIDE_FINISHER", label: "Slasher / Inside Finisher", archetype: "Slasher", intendedDirection: "up" },
  { key: "PERIMETER_SHOT_CREATOR", label: "Perimeter Shot Creator", archetype: "Sharpshooter", intendedDirection: "up" },
  { key: "PRIMARY_PLAYMAKER", label: "Primary Playmaker", archetype: "Playmaker", intendedDirection: "up" },
  { key: "DEFENSIVE_ANCHOR_REBOUNDER", label: "Defensive Anchor / Rebounder", archetype: "Lockdown Defender", intendedDirection: "up" },
  { key: "BALANCED_CONTROL", label: "Balanced Control", archetype: "Stretch Big", intendedDirection: "up" },
];

const CONTROL_PROFILE = PROFILE_CONFIGS.find((profile) => profile.key === "BALANCED_CONTROL")!;

const CYCLE_EVENTS: Array<{ attr: keyof PlayerAttributes; amount: number; source: AttributeGainSource }> = [
  { attr: "shooting", amount: 2, source: "TRAINING" },
  { attr: "finishing", amount: 2, source: "MATCH_REWARD" },
  { attr: "vision", amount: 2, source: "TRAINING" },
  { attr: "handle", amount: 2, source: "MATCH_REWARD" },
  { attr: "athleticism", amount: 2, source: "TRAINING" },
  { attr: "defense", amount: 2, source: "MATCH_REWARD" },
  { attr: "rebounding", amount: 2, source: "TRAINING" },
  { attr: "bbiq", amount: 2, source: "NARRATIVE" },
  { attr: "stamina", amount: 2, source: "SYSTEM" },
];

const BASE_INPUT = {
  firstName: "Progression",
  lastName: "Probe",
  stateCode: "TX",
  citySlug: "houston-tx",
  ageStarted: 8,
  bodyFrame: "Athletic" as const,
  dominantHand: "Right" as const,
  primaryPosition: "PG" as const,
  secondaryPosition: "SG" as const,
  height: { feet: 6, inches: 2 },
  weightLbs: 185,
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const getLeagueLevelForCycle = (cycle: number): LeagueLevel => {
  if (cycle < 9) {
    return LeagueLevel.MIDDLE_SCHOOL;
  }
  if (cycle < 19) {
    return LeagueLevel.HIGH_SCHOOL;
  }
  if (cycle < 29) {
    return LeagueLevel.COLLEGE;
  }
  return LeagueLevel.PRO;
};

const makePlayer = (id: string, archetype: PlayerArchetype, attributes: PlayerAttributes): Player => ({
  id,
  name: id,
  age: 19,
  bankBalance: 0,
  morale: 50,
  position: "PG",
  secondaryPosition: "SG",
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

const makeTeamContext = (homeArchetype: PlayerArchetype, homeAttrs: PlayerAttributes, awayArchetype: PlayerArchetype, awayAttrs: PlayerAttributes): MatchContext => ({
  home: {
    name: "Home",
    teamOvr: 0,
    roster: [
      makePlayer("h1", homeArchetype, homeAttrs),
      makePlayer("h2", homeArchetype, homeAttrs),
      makePlayer("h3", homeArchetype, homeAttrs),
      makePlayer("h4", homeArchetype, homeAttrs),
      makePlayer("h5", homeArchetype, homeAttrs),
    ],
  },
  away: {
    name: "Away",
    teamOvr: 0,
    roster: [
      makePlayer("a1", awayArchetype, awayAttrs),
      makePlayer("a2", awayArchetype, awayAttrs),
      makePlayer("a3", awayArchetype, awayAttrs),
      makePlayer("a4", awayArchetype, awayAttrs),
      makePlayer("a5", awayArchetype, awayAttrs),
    ],
  },
});

const getDelta = (state: PossessionState, nextState: PossessionState, offenseKey: "home" | "away"): number =>
  offenseKey === "home"
    ? nextState.score.home - state.score.home
    : nextState.score.away - state.score.away;

const runTeamMetrics = (context: MatchContext, seed: number): TeamMetrics => {
  const rng = createSeededRng(seed);
  let state = initializePossession(context, LeagueLevel.PRO, rng, 48 * 60);
  let homeOffensivePossessions = 0;
  let homePoints = 0;
  let homeTurnovers = 0;
  let awayOffensivePossessions = 0;
  let homeDefensiveStops = 0;

  for (let i = 0; i < 220 && state.secondsRemaining > 0; i += 1) {
    const offenseKey = state.offenseKey;
    const result = simulatePossession(context, state, LeagueLevel.PRO, rng);
    const pointsDelta = getDelta(state, result.nextState, offenseKey);

    if (offenseKey === "home") {
      homeOffensivePossessions += 1;
      homePoints += pointsDelta;
      if (result.turnoverLikeFailure) {
        homeTurnovers += 1;
      }
    } else {
      awayOffensivePossessions += 1;
      if (pointsDelta === 0) {
        homeDefensiveStops += 1;
      }
    }

    state = result.nextState;
  }

  const homePossessions = Math.max(1, homeOffensivePossessions);
  const awayPossessions = Math.max(1, awayOffensivePossessions);
  const ppp = homePoints / homePossessions;
  const turnoverRate = homeTurnovers / homePossessions;
  const defensiveStopRate = homeDefensiveStops / awayPossessions;
  const security = 1 - turnoverRate;
  const survivabilityRaw = 0.6 * security + 0.4 * defensiveStopRate;

  return {
    ppp,
    turnoverRate,
    defensiveStopRate,
    survivabilityRaw,
  };
};

const toLeagueValue = (cycleCount: number): number => {
  if (cycleCount <= 0) {
    return 1;
  }
  return cycleCount;
};

const getEconomyRaw = (initial: PlayerAttributes, current: PlayerAttributes, cycleCount: number): number => {
  const totalPositiveDelta =
    Math.max(0, current.shooting - initial.shooting) +
    Math.max(0, current.finishing - initial.finishing) +
    Math.max(0, current.vision - initial.vision) +
    Math.max(0, current.handle - initial.handle) +
    Math.max(0, current.athleticism - initial.athleticism) +
    Math.max(0, current.defense - initial.defense) +
    Math.max(0, current.rebounding - initial.rebounding) +
    Math.max(0, current.bbiq - initial.bbiq) +
    Math.max(0, current.stamina - initial.stamina);

  return 1 + totalPositiveDelta / (9 * toLeagueValue(cycleCount));
};

const runProfileAtCheckpoint = async (
  profile: ProfileConfig,
  checkpointCycleCount: number,
  seed: number,
): Promise<{ initial: PlayerAttributes; current: PlayerAttributes }> => {
  const { useCareerStore } = await import("../store/useCareerStore");

  useCareerStore.getState().initializeCareer({
    ...BASE_INPUT,
    archetype: profile.archetype,
    generationSeed: seed,
  });

  const initial = { ...useCareerStore.getState().player.attributes };

  for (let cycle = 0; cycle < checkpointCycleCount; cycle += 1) {
    useCareerStore.getState().updateLeagueLevel(getLeagueLevelForCycle(cycle));
    for (const event of CYCLE_EVENTS) {
      useCareerStore.getState().applyAttributeGain(event.attr, event.amount, event.source);
    }
  }

  const current = { ...useCareerStore.getState().player.attributes };
  return { initial, current };
};

const run = async (): Promise<void> => {
  const { setupNodeVerificationEnv } = await import("./setupNodeVerificationEnv");
  await setupNodeVerificationEnv();

  const rows: CpiCheckpointRow[] = [];

  for (const checkpoint of CPI_CHECKPOINTS) {
    const controlState = await runProfileAtCheckpoint(CONTROL_PROFILE, checkpoint.cycleCount, 20261000 + checkpoint.cycleCount);
    const controlMetrics = runTeamMetrics(
      makeTeamContext(CONTROL_PROFILE.archetype, controlState.current, CONTROL_PROFILE.archetype, controlState.current),
      20262000 + checkpoint.cycleCount,
    );
    const controlEconomy = getEconomyRaw(controlState.initial, controlState.current, checkpoint.cycleCount);
    const controlCpi = calculateCpi({
      throughputIndex: 1,
      survivabilityIndex: 1,
      economyIndex: 1,
    });

    for (const profile of PROFILE_CONFIGS) {
      const profileState = await runProfileAtCheckpoint(profile, checkpoint.cycleCount, 20263000 + checkpoint.cycleCount + rows.length);
      const profileMetrics = runTeamMetrics(
        makeTeamContext(profile.archetype, profileState.current, CONTROL_PROFILE.archetype, controlState.current),
        20264000 + checkpoint.cycleCount + rows.length,
      );
      const profileEconomy = getEconomyRaw(profileState.initial, profileState.current, checkpoint.cycleCount);

      const throughputIndex = controlMetrics.ppp > 0 ? profileMetrics.ppp / controlMetrics.ppp : 0;
      const survivabilityIndex = controlMetrics.survivabilityRaw > 0
        ? profileMetrics.survivabilityRaw / controlMetrics.survivabilityRaw
        : 0;
      const economyIndex = controlEconomy > 0 ? profileEconomy / controlEconomy : 0;
      const cpi = calculateCpi({
        throughputIndex,
        survivabilityIndex,
        economyIndex,
      });
      const cpiRatioVsControl = getCpiRatio(cpi, controlCpi);
      const inTargetBand = profile.key === CONTROL_PROFILE.key
        ? true
        : cpiRatioVsControl >= CPI_TARGET_BAND.min && cpiRatioVsControl <= CPI_TARGET_BAND.max;
      const violatesDominanceGuard = cpiRatioVsControl > CPI_TARGET_BAND.dominanceMax;

      rows.push({
        checkpoint: checkpoint.label,
        profile: profile.label,
        throughputIndex: Number(throughputIndex.toFixed(3)),
        survivabilityIndex: Number(survivabilityIndex.toFixed(3)),
        economyIndex: Number(economyIndex.toFixed(3)),
        cpi: Number(cpi.toFixed(3)),
        cpiRatioVsControl: Number(cpiRatioVsControl.toFixed(3)),
        inTargetBand,
        violatesDominanceGuard,
      });
    }
  }

  console.table(rows);

  const failures = rows.filter((row) =>
    row.profile !== CONTROL_PROFILE.label && (!row.inTargetBand || row.violatesDominanceGuard),
  );

  if (failures.length > 0) {
    console.error(`CPI gate failed for ${failures.length} profile checkpoints.`);
    process.exitCode = 1;
    return;
  }

  console.log("CPI gate passed at all checkpoints.");
};

run().catch((error) => {
  console.error("Progression spread verification failed:", error);
  process.exitCode = 1;
});
