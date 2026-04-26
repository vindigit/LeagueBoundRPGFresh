import type { Player } from "./types/player";
import type { Team } from "./types/team";
import { LEAGUE_MODIFIERS } from "./constants/leagueScaling";
import { LeagueLevel } from "./types/career";
import { computeOverall } from "./builder/derivedRatings";
import tuning from "./matchEngineTuning.js";
import { validateMatchEngineTuning } from "./matchEngineTuningValidation";

export type PossessionAction = "pass" | "shoot" | "dribble";
export type ShotZone = "three" | "midrange" | "rim";
export type RimAttemptType = "layup" | "dunk";
export type PossessionEventType =
  | "turnover"
  | "steal"
  | "block"
  | "made_2"
  | "made_3"
  | "miss"
  | "off_reb"
  | "def_reb"
  | "putback_make"
  | "putback_miss"
  | "free_throws";

export type MarkovStateNode =
  | "INIT_POSSESSION"
  | "DECIDE_ACTION"
  | "RESOLVE_TURNOVER_PRESSURE"
  | "SELECT_SHOT_ZONE"
  | "RESOLVE_SHOT_CONTEST"
  | "SHOT_MADE"
  | "SHOT_MISSED"
  | "RESOLVE_REBOUND"
  | "PUTBACK_ATTEMPT"
  | "END_POSSESSION";

export interface DefensivePlay {
  steal: boolean;
  block: boolean;
  defenderIndex?: number;
}

export interface MatchScore {
  home: number;
  away: number;
}

export interface FreeThrowSequence {
  mode: "one_and_one" | "two_shots";
  attempted: number;
  made: number;
  shooterIndex: number;
  foulOnTeam: "home" | "away";
  foulOnPlayerIndex?: number;
}

export interface PossessionState {
  possessionIndex: number;
  secondsRemaining: number;
  offenseKey: "home" | "away";
  defenseKey: "home" | "away";
  ballHandlerIndex: number;
  homeTouches: [number, number, number, number, number];
  awayTouches: [number, number, number, number, number];
  score: MatchScore;
  homeStreak: number;
  awayStreak: number;
}

export interface SimMetrics {
  possessions: number;
  fga: number;
  fgm: number;
  assists: number;
  turnoverLikeFailures: number;
}

export interface UserMatchState {
  baseWorkRate: number;
  baseFocus: number;
  workRate: number;
  focus: number;
}

export interface PossessionSimulationOptions {
  userControl?: {
    teamKey: "home" | "away";
    playerIndex: number;
    matchState: UserMatchState;
  };
}

export interface PossessionResult {
  action: PossessionAction;
  madeShot: boolean;
  points: 0 | 1 | 2 | 3;
  assisted: boolean;
  turnoverLikeFailure: boolean;
  nextState: PossessionState;
  eventType: PossessionEventType;
  shotZone?: ShotZone;
  rimAttemptType?: RimAttemptType;
  shooterIndex: number;
  assisterIndex?: number;
  rebounderIndex?: number;
  defensivePlay: DefensivePlay;
  offensiveRebound: boolean;
  putbackAttempted: boolean;
  freeThrows?: FreeThrowSequence;
  trace: MarkovStateNode[];
}

export interface MatchContext {
  home: Team;
  away: Team;
}

type TeamSide = "home" | "away";
type HomeCourtKind = "shot" | "turnover";
type DefenderRole = "turnover" | "perimeter" | "rim";

type PlayerImpact = {
  vision: number;
  passing: number;
  handle: number;
  consistency: number;
  discipline: number;
  stamina: number;
  fatigueMultiplier: number;
  threePoint: number;
  midrange: number;
  shortRange: number;
  dunking: number;
  perimeterDefense: number;
  interiorDefense: number;
  blocking: number;
  stealing: number;
  offRebounding: number;
  defRebounding: number;
  speed: number;
  strength: number;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

validateMatchEngineTuning(tuning as Record<string, unknown>);

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const pushTrace = (trace: MarkovStateNode[], node: MarkovStateNode): void => {
  trace.push(node);
};

const normalizeWeights = <T extends string | number>(entries: Array<{ key: T; weight: number }>): Array<{ key: T; weight: number }> => {
  const sanitized = entries.map((entry) => ({ key: entry.key, weight: Math.max(0.001, entry.weight) }));
  const total = sanitized.reduce((sum, entry) => sum + entry.weight, 0);
  return sanitized.map((entry) => ({ key: entry.key, weight: entry.weight / total }));
};

const weightedPick = <T extends string | number>(entries: Array<{ key: T; weight: number }>, rng: () => number): T => {
  const normalized = normalizeWeights(entries);
  const target = rng();
  let cumulative = 0;
  for (const entry of normalized) {
    cumulative += entry.weight;
    if (target <= cumulative) {
      return entry.key;
    }
  }
  return normalized[normalized.length - 1].key;
};

const getTeam = (context: MatchContext, key: "home" | "away"): Team =>
  key === "home" ? context.home : context.away;

const getPlayerByIndex = (team: Team, index: number): Player => team.roster[clamp(index, 0, 4) as 0 | 1 | 2 | 3 | 4];

const varianceAmpFromConsistency = (consistency: number): number => 0.08 - (consistency / 99) * 0.03;

const applyConsistencyVariance = (pBase: number, rng: () => number, consistency: number): number => {
  const amp = varianceAmpFromConsistency(consistency);
  const noise = (rng() * 2 - 1) * amp;
  return clamp(pBase + noise, 0, 1);
};

const getDiscipline = (player: Player): number => {
  const attrs = player.attributes;
  return clamp(Math.round(attrs.vision * 0.4 + attrs.handle * 0.25 + attrs.stamina * 0.35), 0, 99);
};

const getConsistency = (player: Player): number => {
  const attrs = player.attributes;
  return clamp(Math.round(attrs.vision * 0.45 + attrs.handle * 0.3 + attrs.stamina * 0.25), 0, 99);
};

export const getPressure = (state: PossessionState): number => {
  const timePressure = clamp((180 - state.secondsRemaining) / 180, 0, 1);
  const marginPressure = clamp((10 - Math.abs(getScoreDiff(state))) / 10, 0, 1);
  return clamp(timePressure * marginPressure, 0, 1);
};

const getComposureMultiplier = (discipline: number, pressure: number): number => {
  if (pressure <= 0) {
    return 1;
  }
  const disciplineEdge = clamp((discipline - 50) / 49, -1, 1);
  return clamp(1 + disciplineEdge * 0.06 * pressure, 0.94, 1.06);
};

const getElapsedByEvent = (eventType: PossessionEventType, rng: () => number): number => {
  let elapsedSeconds: number;
  if (eventType === "turnover" || eventType === "steal") {
    elapsedSeconds = Math.floor(
      tuning.turnoverEventSecondsMin +
        rng() * (tuning.turnoverEventSecondsMax - tuning.turnoverEventSecondsMin + 1),
    );
    return Math.max(1, elapsedSeconds);
  }
  if (eventType === "off_reb" || eventType === "putback_make" || eventType === "putback_miss") {
    elapsedSeconds = Math.floor(
      tuning.offensiveReboundEventSecondsMin +
        rng() * (tuning.offensiveReboundEventSecondsMax - tuning.offensiveReboundEventSecondsMin + 1),
    );
    return Math.max(1, elapsedSeconds);
  }
  elapsedSeconds = Math.floor(tuning.minEventSeconds + rng() * (tuning.maxEventSeconds - tuning.minEventSeconds + 1));
  return Math.max(1, elapsedSeconds);
};

const addPoints = (score: MatchScore, offenseKey: "home" | "away", points: 1 | 2 | 3): MatchScore =>
  offenseKey === "home"
    ? { ...score, home: score.home + points }
    : { ...score, away: score.away + points };

export const getScaledAttribute = (value: number, leagueLevel: LeagueLevel): number =>
  clamp(value * LEAGUE_MODIFIERS[leagueLevel], 0, 99);

export const createSeededRng = (seed: number): (() => number) => {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

export const getPlayerOvr = (player: Player): number =>
  computeOverall(player.attributes, player.position);

export const calculateTeamOvr = (team: Team): number =>
  Math.round(average(team.roster.map(getPlayerOvr)));

const getFatigueMultiplier = (stamina: number, touchCount: number, fatigueLoadMultiplier = 1): number =>
  clamp(
    1 - touchCount * fatigueLoadMultiplier * tuning.fatigueTouchScale * 1.35 * (1 - stamina / 100),
    tuning.fatigueMinMultiplier,
    tuning.fatigueMaxMultiplier,
  );

const getPlayerImpact = (
  player: Player,
  teamKey: TeamSide,
  playerIndex: number,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  fatigueLoadMultiplier = 1,
): PlayerImpact => {
  const consistency = getScaledAttribute(getConsistency(player), leagueLevel);
  const discipline = getScaledAttribute(getDiscipline(player), leagueLevel);
  const stamina = getScaledAttribute(player.attributes.stamina, leagueLevel);
  const fatigueMultiplier = getFatigueMultiplier(stamina, touchCounts[teamKey][playerIndex], fatigueLoadMultiplier);
  const scaledAttrs = {
    vision: getScaledAttribute(player.attributes.vision, leagueLevel),
    passing: getScaledAttribute(player.attributes.passing, leagueLevel),
    handle: getScaledAttribute(player.attributes.handle, leagueLevel),
    threePoint: getScaledAttribute(player.attributes.threePoint, leagueLevel),
    midrange: getScaledAttribute(player.attributes.midrange, leagueLevel),
    shortRange: getScaledAttribute(player.attributes.shortRange, leagueLevel),
    dunking: getScaledAttribute(player.attributes.dunking, leagueLevel),
    perimeterDefense: getScaledAttribute(player.attributes.perimeterDefense, leagueLevel),
    interiorDefense: getScaledAttribute(player.attributes.interiorDefense, leagueLevel),
    blocking: getScaledAttribute(player.attributes.blocking, leagueLevel),
    stealing: getScaledAttribute(player.attributes.stealing, leagueLevel),
    offRebounding: getScaledAttribute(player.attributes.offRebounding, leagueLevel),
    defRebounding: getScaledAttribute(player.attributes.defRebounding, leagueLevel),
    speed: getScaledAttribute(player.attributes.speed, leagueLevel),
    strength: getScaledAttribute(player.attributes.strength, leagueLevel),
  };

  return {
    vision: scaledAttrs.vision * fatigueMultiplier,
    passing: scaledAttrs.passing * fatigueMultiplier,
    handle: scaledAttrs.handle * fatigueMultiplier,
    // Consistency is used only to dampen variance; no direct mean boost.
    consistency: consistency * fatigueMultiplier,
    // Discipline models late-game composure only through pressure-scaled multipliers.
    discipline: discipline * fatigueMultiplier,
    stamina,
    fatigueMultiplier,
    threePoint: scaledAttrs.threePoint * fatigueMultiplier,
    midrange: scaledAttrs.midrange * fatigueMultiplier,
    shortRange: scaledAttrs.shortRange * fatigueMultiplier,
    dunking: scaledAttrs.dunking * fatigueMultiplier,
    perimeterDefense: scaledAttrs.perimeterDefense * fatigueMultiplier,
    interiorDefense: scaledAttrs.interiorDefense * fatigueMultiplier,
    blocking: scaledAttrs.blocking * fatigueMultiplier,
    stealing: scaledAttrs.stealing * fatigueMultiplier,
    offRebounding: scaledAttrs.offRebounding * fatigueMultiplier,
    defRebounding: scaledAttrs.defRebounding * fatigueMultiplier,
    speed: scaledAttrs.speed * fatigueMultiplier,
    strength: scaledAttrs.strength * fatigueMultiplier,
  };
};

const getScoreDiff = (state: PossessionState): number => state.score.home - state.score.away;

const getHomeCourtMultiplier = (side: TeamSide, kind: HomeCourtKind): number => {
  if (!tuning.homeCourt.enabled) {
    return 1;
  }
  const baseMultiplier = kind === "shot" ? tuning.homeCourt.shotMultiplier : tuning.homeCourt.turnoverMultiplier;
  return side === "home" ? baseMultiplier : 1 / baseMultiplier;
};

const applyHomeCourtToProbability = (probability: number, side: TeamSide, kind: HomeCourtKind): number =>
  clamp(probability * getHomeCourtMultiplier(side, kind), 0, 1);

const getClampedStreak = (streak: number): number => {
  const maxStreak = Math.max(0, Math.floor(tuning.momentum.maxStreak));
  return clamp(Math.floor(streak), 0, maxStreak);
};

export const getNextMomentumStreaks = (
  state: PossessionState,
  offenseKey: TeamSide,
  madeShot: boolean,
  turnoverLikeFailure: boolean,
): { homeStreak: number; awayStreak: number } => {
  if (turnoverLikeFailure) {
    return {
      homeStreak: state.homeStreak,
      awayStreak: state.awayStreak,
    };
  }

  if (offenseKey === "home") {
    return madeShot
      ? { homeStreak: state.homeStreak + 1, awayStreak: 0 }
      : { homeStreak: 0, awayStreak: state.awayStreak };
  }

  return madeShot
    ? { homeStreak: 0, awayStreak: state.awayStreak + 1 }
    : { homeStreak: state.homeStreak, awayStreak: 0 };
};

export const applyMomentumToShotMakeProbability = (
  probability: number,
  state: PossessionState,
  offenseKey: TeamSide,
): number => {
  if (!tuning.momentum.enabled) {
    return clamp(probability, 0, 1);
  }

  const offenseStreak = offenseKey === "home" ? state.homeStreak : state.awayStreak;
  const defenseStreak = offenseKey === "home" ? state.awayStreak : state.homeStreak;
  const offenseCapped = getClampedStreak(offenseStreak);
  const defenseCapped = getClampedStreak(defenseStreak);
  const delta = offenseCapped * tuning.momentum.perMakeBoost - defenseCapped * tuning.momentum.perMakePenalty;

  return clamp(probability + delta, 0, 1);
};

export const chooseAction = (
  ballHandler: Player,
  ballHandlerImpact: PlayerImpact,
  state: PossessionState,
  rng: () => number,
  focusComposureBonus = 0,
): PossessionAction => {
  const pressure = getPressure(state);
  const baseWeights: Record<PossessionAction, number> = tuning.baseActionWeights;
  const archetypeAdjust = tuning.archetypeWeightAdjustments[ballHandler.archetype];
  const pressureAdjust: Record<PossessionAction, number> = {
    pass:
      tuning.lowPressureAdjustments.pass +
      (tuning.highPressureAdjustments.pass - tuning.lowPressureAdjustments.pass) * pressure,
    shoot:
      tuning.lowPressureAdjustments.shoot +
      (tuning.highPressureAdjustments.shoot - tuning.lowPressureAdjustments.shoot) * pressure,
    dribble:
      tuning.lowPressureAdjustments.dribble +
      (tuning.highPressureAdjustments.dribble - tuning.lowPressureAdjustments.dribble) * pressure,
  };
  const composureMultiplier = getComposureMultiplier(ballHandlerImpact.discipline + focusComposureBonus, pressure);
  const composureAdjustment = (composureMultiplier - 1) * 20;
  const shootingProfile = average([
    ballHandlerImpact.threePoint,
    ballHandlerImpact.midrange,
    ballHandlerImpact.shortRange,
    ballHandlerImpact.dunking,
  ]);
  const skillAdjust: Record<PossessionAction, number> = {
    pass:
      (ballHandlerImpact.vision - 50) * 0.12 +
      (ballHandlerImpact.passing - 50) * 0.1 +
      composureAdjustment,
    shoot:
      (shootingProfile - 50) * 0.1 +
      (ballHandlerImpact.vision - 50) * 0.05 +
      composureAdjustment * 0.5,
    dribble:
      (ballHandlerImpact.handle - 50) * 0.14 +
      (ballHandlerImpact.speed - 50) * 0.06 -
      composureAdjustment * 0.5,
  };

  return weightedPick(
    (["pass", "shoot", "dribble"] as PossessionAction[]).map((action) => ({
      key: action,
      weight: clamp(baseWeights[action] + archetypeAdjust[action] + pressureAdjust[action] + skillAdjust[action], 1, 99),
    })),
    rng,
  );
};

export const pickBallHandlerIndex = (
  offenseTeam: Team,
  teamKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = offenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight: impact.handle * 0.45 + impact.vision * 0.3 + impact.passing * 0.25,
    };
  });
  return weightedPick(weighted, rng);
};

const pickDefenderIndex = (
  defenseTeam: Team,
  teamKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  role: DefenderRole,
  rng: () => number,
): number => {
  const weighted = defenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
    const weight =
      role === "turnover"
        ? impact.stealing * 0.55 + impact.speed * 0.3 + impact.perimeterDefense * 0.15
        : role === "perimeter"
          ? impact.perimeterDefense * 0.75 + impact.speed * 0.25
          : impact.interiorDefense * 0.55 + impact.blocking * 0.3 + impact.strength * 0.15;
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight,
    };
  });
  return weightedPick(weighted, rng);
};

const pickAssistReceiverIndex = (
  offenseTeam: Team,
  teamKey: TeamSide,
  ballHandlerIndex: number,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = offenseTeam.roster
    .map((player, index) => ({ player, index }))
    .filter((entry) => entry.index !== ballHandlerIndex)
    .map(({ player, index }) => {
      const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
      const receiverShotValue =
        impact.threePoint * 0.28 +
        impact.midrange * 0.24 +
        impact.shortRange * 0.32 +
        impact.dunking * 0.1 +
        impact.vision * 0.06;
      return {
        key: index as 0 | 1 | 2 | 3 | 4,
        weight: receiverShotValue,
      };
    });
  return weightedPick(weighted, rng);
};

const pickRebounderIndex = (
  team: Team,
  teamKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  reboundType: "offense" | "defense",
  rng: () => number,
): number => {
  const weighted = team.roster.map((player, index) => {
    const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight:
        reboundType === "offense"
          ? impact.offRebounding * 0.85 + impact.strength * 0.15
          : impact.defRebounding * 0.8 + impact.strength * 0.2,
    };
  });
  return weightedPick(weighted, rng);
};

const pickShotZone = (
  action: PossessionAction,
  shooterImpact: PlayerImpact,
  rng: () => number,
): ShotZone => {
  const base = tuning.shotZoneByAction[action];
  const suppressThree = shooterImpact.threePoint < tuning.lowShootingThreeSuppressionThreshold;
  const decisionTilt = 1 + ((shooterImpact.vision - 50) / 49) * 0.08;
  const threeTilt = (shooterImpact.threePoint - 50) * tuning.shotZoneThreePointWeight * decisionTilt;
  const midrangeTilt = (shooterImpact.midrange - 50) * tuning.shotZoneMidrangeWeight * decisionTilt;
  const rimTilt =
    ((shooterImpact.shortRange - 50) * tuning.shotZoneRimShortRangeWeight +
      (shooterImpact.dunking - 50) * tuning.shotZoneRimDunkingWeight) *
    decisionTilt;
  const fatigueTilt = (shooterImpact.fatigueMultiplier - 1) * 100 * tuning.shotZoneFatigueWeight;
  const entries: Array<{ key: ShotZone; weight: number }> = [
    {
      key: "midrange",
      weight: base.midrange + midrangeTilt - Math.abs(midrangeTilt - rimTilt) * 0.1,
    },
    {
      key: "rim",
      weight: base.rim + rimTilt - fatigueTilt * 0.2,
    },
  ];

  if (!suppressThree) {
    entries.unshift({
      key: "three",
      weight: base.three + threeTilt + fatigueTilt,
    });
  }

  return weightedPick(entries, rng);
};

const getDunkProbability = (shooterImpact: PlayerImpact): number => {
  if (shooterImpact.dunking < tuning.dunkAttemptThreshold) {
    return 0;
  }

  return clamp(
    tuning.dunkAttemptBase +
      (shooterImpact.dunking - tuning.dunkAttemptThreshold) * tuning.dunkAttemptDunkingWeight +
      shooterImpact.strength * tuning.dunkAttemptStrengthWeight +
      shooterImpact.speed * tuning.dunkAttemptSpeedWeight,
    tuning.dunkAttemptMin,
    tuning.dunkAttemptMax,
  );
};

const pickRimAttemptType = (shooterImpact: PlayerImpact, rng: () => number): RimAttemptType =>
  rng() <= getDunkProbability(shooterImpact) ? "dunk" : "layup";

const getTurnoverProbability = (
  ballHandlerImpact: ReturnType<typeof getPlayerImpact>,
  defenseTeam: Team,
  defenseKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  state: PossessionState,
  focusComposureBonus = 0,
): number => {
  const defenderPressure = average(defenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, defenseKey, index, touchCounts, leagueLevel);
    return impact.stealing * 0.45 + impact.speed * 0.35 + impact.perimeterDefense * 0.2;
  }));
  const ballSecurity = ballHandlerImpact.handle * 0.65 + ballHandlerImpact.vision * 0.35;
  const pressure = getPressure(state);
  const composureMultiplier = getComposureMultiplier(ballHandlerImpact.discipline + focusComposureBonus, pressure);

  return clamp(
    (tuning.turnoverBase + (defenderPressure - ballSecurity) / tuning.turnoverDivisor) / composureMultiplier,
    tuning.turnoverMin,
    tuning.turnoverMax,
  );
};

const getStealProbability = (
  defenderImpact: PlayerImpact,
  ballHandlerImpact: PlayerImpact,
): number =>
  clamp(
    tuning.stealBase +
      (defenderImpact.stealing * tuning.stealDefenseWeight +
        defenderImpact.speed * tuning.stealSpeedWeight -
        ballHandlerImpact.handle) /
        tuning.stealDivisor,
    tuning.stealMin,
    tuning.stealMax,
  );

const getAssistProbability = (
  passerImpact: ReturnType<typeof getPlayerImpact>,
  shooterImpact: ReturnType<typeof getPlayerImpact>,
): number => {
  const baseAssist =
    tuning.assistBase +
    (passerImpact.vision * 0.5 +
      passerImpact.passing * 0.35 +
      passerImpact.handle * 0.15 -
      shooterImpact.handle * 0.15) /
      tuning.assistDivisor;
  return clamp(baseAssist, tuning.assistMin, tuning.assistMax);
};

const getContestValue = (shotZone: ShotZone, defenderImpact: PlayerImpact): number =>
  shotZone === "rim"
    ? defenderImpact.interiorDefense * 0.9 + defenderImpact.strength * 0.1
    : defenderImpact.perimeterDefense * 0.9 + defenderImpact.speed * 0.1;

const getBlockProbability = (
  defenderImpact: PlayerImpact,
  shooterImpact: PlayerImpact,
  shotZone: ShotZone,
  rimAttemptType?: RimAttemptType,
): number => {
  const zoneMultiplier =
    shotZone === "three"
      ? tuning.threeBlockMultiplier
      : shotZone === "midrange"
        ? tuning.midrangeBlockMultiplier
        : tuning.rimBlockMultiplier;
  const defenderBlockValue = defenderImpact.blocking * 0.65 + defenderImpact.interiorDefense * 0.35;
  const zoneDefenseValue = shotZone === "rim" ? defenderImpact.interiorDefense : defenderImpact.perimeterDefense;
  const shooterResistance =
    shotZone === "rim"
      ? rimAttemptType === "dunk"
        ? (shooterImpact.dunking * 0.55 + shooterImpact.strength * 0.3 + shooterImpact.speed * 0.15) *
          tuning.dunkBlockResistance
        : (shooterImpact.shortRange * 0.6 + shooterImpact.speed * 0.25 + shooterImpact.strength * 0.15) *
          tuning.layupBlockResistance
      : shotZone === "midrange"
        ? shooterImpact.midrange * 0.7 + shooterImpact.speed * 0.15 + shooterImpact.handle * 0.15
        : shooterImpact.threePoint * 0.75 + shooterImpact.handle * 0.15 + shooterImpact.speed * 0.1;

  return clamp(
    (tuning.blockBase + (defenderBlockValue + zoneDefenseValue * 0.15 - shooterResistance) / tuning.blockDivisor) * zoneMultiplier,
    tuning.blockMin * zoneMultiplier,
    tuning.blockMax * zoneMultiplier,
  );
};

const getShotMakeProbability = (
  shotZone: ShotZone,
  shooterImpact: PlayerImpact,
  defenderImpact: PlayerImpact,
  state: PossessionState,
  offenseKey: TeamSide,
  rng: () => number,
  rimAttemptType?: RimAttemptType,
  focusComposureBonus = 0,
): number => {
  const zoneBase =
    shotZone === "three"
      ? tuning.threeShotMakeBase
      : shotZone === "midrange"
        ? tuning.midrangeShotMakeBase
        : tuning.rimShotMakeBase;

  const offenseValue =
    shotZone === "three"
      ? shooterImpact.threePoint * 0.88 + shooterImpact.speed * 0.12
      : shotZone === "midrange"
        ? shooterImpact.midrange * 0.8 + shooterImpact.shortRange * 0.1 + shooterImpact.speed * 0.1
        : rimAttemptType === "dunk"
          ? shooterImpact.dunking * 0.6 + shooterImpact.strength * 0.25 + shooterImpact.speed * 0.15
          : shooterImpact.shortRange * 0.7 + shooterImpact.speed * 0.15 + shooterImpact.strength * 0.15;

  const defenseValue = getContestValue(shotZone, defenderImpact);
  const pressure = getPressure(state);
  const composureMultiplier = getComposureMultiplier(shooterImpact.discipline + focusComposureBonus, pressure);
  const fatiguePenalty = (1 - shooterImpact.fatigueMultiplier) * 4;
  const attemptBonus =
    shotZone === "rim" ? (rimAttemptType === "dunk" ? tuning.dunkMakeBonus : tuning.layupMakeBonus) : 0;
  const offenseEdge = (offenseValue - defenseValue) / tuning.shotOffenseDivisor;

  const makeWithoutVariance = clamp(
    zoneBase + tuning.shotMakeBase + attemptBonus + offenseEdge - defenseValue / tuning.shotContestDivisor - fatiguePenalty,
    tuning.shotMakeMin,
    tuning.shotMakeMax,
  );
  // Consistency only dampens or widens variance around the base make chance.
  const baseProbability = clamp(
    applyConsistencyVariance(makeWithoutVariance, rng, shooterImpact.consistency) * composureMultiplier,
    tuning.shotMakeMin,
    tuning.shotMakeMax,
  );

  return applyMomentumToShotMakeProbability(baseProbability, state, offenseKey);
};

const getOffensiveReboundProbability = (
  offenseTeam: Team,
  defenseTeam: Team,
  offenseKey: TeamSide,
  defenseKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  shotZone: ShotZone,
): number => {
  const offenseReb = average(
    offenseTeam.roster.map((player, index) => {
      const impact = getPlayerImpact(player, offenseKey, index, touchCounts, leagueLevel);
      return impact.offRebounding * 0.85 + impact.strength * 0.15;
    }),
  );

  const defenseReb = average(
    defenseTeam.roster.map((player, index) => {
      const impact = getPlayerImpact(player, defenseKey, index, touchCounts, leagueLevel);
      return impact.defRebounding * 0.85 + impact.strength * 0.15;
    }),
  );

  const shotZoneBonus = shotZone === "three" ? tuning.longReboundThreeBonus : 0;

  return clamp(
    tuning.offensiveReboundBase + (offenseReb - defenseReb) / tuning.offensiveReboundDivisor + shotZoneBonus,
    tuning.offensiveReboundMin,
    tuning.offensiveReboundMax,
  );
};

const getPutbackMakeProbability = (
  shooterImpact: ReturnType<typeof getPlayerImpact>,
  defenderImpact: ReturnType<typeof getPlayerImpact>,
  rng: () => number,
): number => {
  const offenseValue = shooterImpact.shortRange * 0.55 + shooterImpact.dunking * 0.25 + shooterImpact.strength * 0.2;
  const defenseValue =
    defenderImpact.interiorDefense * 0.5 + defenderImpact.defRebounding * 0.25 + defenderImpact.blocking * 0.25;
  const makeWithoutVariance = clamp(
    tuning.putbackBase + (offenseValue - defenseValue) / tuning.putbackDivisor,
    tuning.putbackMin,
    tuning.putbackMax,
  );
  // Consistency only controls putback variance amplitude.
  return applyConsistencyVariance(makeWithoutVariance, rng, shooterImpact.consistency);
};

const flipPossession = (
  state: PossessionState,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  score: MatchScore,
  elapsedSeconds: number,
  nextBallHandlerIndex: number,
  streaks: { homeStreak: number; awayStreak: number },
): PossessionState => ({
  ...state,
  possessionIndex: state.possessionIndex + 1,
  secondsRemaining: Math.max(0, state.secondsRemaining - elapsedSeconds),
  offenseKey: state.offenseKey === "home" ? "away" : "home",
  defenseKey: state.offenseKey,
  ballHandlerIndex: nextBallHandlerIndex,
  homeTouches: [...touchCounts.home] as [number, number, number, number, number],
  awayTouches: [...touchCounts.away] as [number, number, number, number, number],
  score,
  homeStreak: streaks.homeStreak,
  awayStreak: streaks.awayStreak,
});

export const simulatePossession = (
  context: MatchContext,
  state: PossessionState,
  leagueLevel: LeagueLevel,
  rng: () => number,
  options?: PossessionSimulationOptions,
): PossessionResult => {
  const trace: MarkovStateNode[] = [];
  pushTrace(trace, "INIT_POSSESSION");

  const offenseTeam = getTeam(context, state.offenseKey);
  const defenseTeam = getTeam(context, state.defenseKey);
  const touchCounts = {
    home: [...state.homeTouches] as [number, number, number, number, number],
    away: [...state.awayTouches] as [number, number, number, number, number],
  };
  const incrementTouch = (teamKey: TeamSide, index: number): void => {
    touchCounts[teamKey][index as 0 | 1 | 2 | 3 | 4] += 1;
  };
  const isUserControlledPlayer = (teamKey: TeamSide, playerIndex: number): boolean =>
    options?.userControl?.teamKey === teamKey && options.userControl.playerIndex === playerIndex;
  const userFatigueLoadMultiplier =
    options?.userControl
      ? 1 + Math.max(0, options.userControl.matchState.workRate - 50) / 75
      : 1;
  const userFocusComposureBonus =
    options?.userControl
      ? (options.userControl.matchState.focus - 50) * 0.3
      : 0;

  const ballHandlerIndex = pickBallHandlerIndex(offenseTeam, state.offenseKey, touchCounts, leagueLevel, rng);
  incrementTouch(state.offenseKey, ballHandlerIndex);
  const ballHandler = getPlayerByIndex(offenseTeam, ballHandlerIndex);
  const ballHandlerIsUser = isUserControlledPlayer(state.offenseKey, ballHandlerIndex);
  const ballHandlerImpact = getPlayerImpact(
    ballHandler,
    state.offenseKey,
    ballHandlerIndex,
    touchCounts,
    leagueLevel,
    ballHandlerIsUser ? userFatigueLoadMultiplier : 1,
  );

  pushTrace(trace, "DECIDE_ACTION");
  const action = chooseAction(ballHandler, ballHandlerImpact, state, rng, ballHandlerIsUser ? userFocusComposureBonus : 0);

  pushTrace(trace, "RESOLVE_TURNOVER_PRESSURE");
  const primaryDefenderIndex = pickDefenderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, "turnover", rng);
  incrementTouch(state.defenseKey, primaryDefenderIndex);
  const primaryDefender = getPlayerByIndex(defenseTeam, primaryDefenderIndex);
  const primaryDefenderImpact = getPlayerImpact(
    primaryDefender,
    state.defenseKey,
    primaryDefenderIndex,
    touchCounts,
    leagueLevel,
    isUserControlledPlayer(state.defenseKey, primaryDefenderIndex) ? userFatigueLoadMultiplier : 1,
  );

  const turnoverProb = applyHomeCourtToProbability(
    getTurnoverProbability(
      ballHandlerImpact,
      defenseTeam,
      state.defenseKey,
      touchCounts,
      leagueLevel,
      state,
      ballHandlerIsUser ? userFocusComposureBonus : 0,
    ),
    state.offenseKey,
    "turnover",
  );
  if (rng() <= turnoverProb) {
    const steal = rng() <= getStealProbability(primaryDefenderImpact, ballHandlerImpact);
    const elapsedSeconds = getElapsedByEvent(steal ? "steal" : "turnover", rng);
    const nextBallHandlerIndex = pickBallHandlerIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, rng);

    const nextState = flipPossession(
      state,
      touchCounts,
      state.score,
      elapsedSeconds,
      nextBallHandlerIndex,
      getNextMomentumStreaks(state, state.offenseKey, false, true),
    );

    pushTrace(trace, "END_POSSESSION");
    return {
      action,
      madeShot: false,
      points: 0,
      assisted: false,
      turnoverLikeFailure: true,
      nextState,
      eventType: steal ? "steal" : "turnover",
      shooterIndex: ballHandlerIndex,
      defensivePlay: {
        steal,
        block: false,
        defenderIndex: primaryDefenderIndex,
      },
      offensiveRebound: false,
      putbackAttempted: false,
      trace,
    };
  }

  pushTrace(trace, "SELECT_SHOT_ZONE");

  let shooterIndex = ballHandlerIndex;
  let pendingAssisterIndex: number | undefined;

  if (action === "pass") {
    const receiverIndex = pickAssistReceiverIndex(offenseTeam, state.offenseKey, ballHandlerIndex, touchCounts, leagueLevel, rng);
    incrementTouch(state.offenseKey, ballHandlerIndex);
    incrementTouch(state.offenseKey, receiverIndex);
    shooterIndex = receiverIndex;
    const receiverImpact = getPlayerImpact(
      getPlayerByIndex(offenseTeam, receiverIndex),
      state.offenseKey,
      receiverIndex,
      touchCounts,
      leagueLevel,
      isUserControlledPlayer(state.offenseKey, receiverIndex) ? userFatigueLoadMultiplier : 1,
    );
    const assistProb = getAssistProbability(ballHandlerImpact, receiverImpact);
    if (rng() <= assistProb) {
      pendingAssisterIndex = ballHandlerIndex;
    }
  }

  const shooter = getPlayerByIndex(offenseTeam, shooterIndex);
  incrementTouch(state.offenseKey, shooterIndex);
  const shooterIsUser = isUserControlledPlayer(state.offenseKey, shooterIndex);
  const shooterImpact = getPlayerImpact(
    shooter,
    state.offenseKey,
    shooterIndex,
    touchCounts,
    leagueLevel,
    shooterIsUser ? userFatigueLoadMultiplier : 1,
  );
  const shotZone = pickShotZone(action, shooterImpact, rng);
  const rimAttemptType = shotZone === "rim" ? pickRimAttemptType(shooterImpact, rng) : undefined;

  pushTrace(trace, "RESOLVE_SHOT_CONTEST");
  const shotDefenderIndex = pickDefenderIndex(
    defenseTeam,
    state.defenseKey,
    touchCounts,
    leagueLevel,
    shotZone === "rim" ? "rim" : "perimeter",
    rng,
  );
  incrementTouch(state.defenseKey, shotDefenderIndex);
  const shotDefender = getPlayerByIndex(defenseTeam, shotDefenderIndex);
  const shotDefenderImpact = getPlayerImpact(
    shotDefender,
    state.defenseKey,
    shotDefenderIndex,
    touchCounts,
    leagueLevel,
  );

  const blockProb = getBlockProbability(shotDefenderImpact, shooterImpact, shotZone, rimAttemptType);
  const blocked = rng() <= blockProb;

  let madeShot = false;
  let points: 0 | 2 | 3 = 0;
  let eventType: PossessionEventType = "miss";
  let assisted = false;
  let assisterIndex: number | undefined;
  let offensiveRebound = false;
  let rebounderIndex: number | undefined;
  let putbackAttempted = false;
  let score = state.score;

  if (!blocked) {
    const makeProb = applyHomeCourtToProbability(
      getShotMakeProbability(
        shotZone,
        shooterImpact,
        shotDefenderImpact,
        state,
        state.offenseKey,
        rng,
        rimAttemptType,
        shooterIsUser ? userFocusComposureBonus : 0,
      ),
      state.offenseKey,
      "shot",
    );
    madeShot = rng() <= makeProb;
  }

  if (madeShot) {
    pushTrace(trace, "SHOT_MADE");
    points = shotZone === "three" ? 3 : 2;
    score = addPoints(state.score, state.offenseKey, points);
    eventType = points === 3 ? "made_3" : "made_2";
    if (action === "pass" && pendingAssisterIndex !== undefined && pendingAssisterIndex !== shooterIndex) {
      assisted = true;
      assisterIndex = pendingAssisterIndex;
    }
  } else {
    pushTrace(trace, "SHOT_MISSED");
    eventType = blocked ? "block" : "miss";

    pushTrace(trace, "RESOLVE_REBOUND");
    const orebProb = getOffensiveReboundProbability(
      offenseTeam,
      defenseTeam,
      state.offenseKey,
      state.defenseKey,
      touchCounts,
      leagueLevel,
      shotZone,
    );
    offensiveRebound = rng() <= orebProb;

    if (offensiveRebound) {
      eventType = "off_reb";
      rebounderIndex = pickRebounderIndex(offenseTeam, state.offenseKey, touchCounts, leagueLevel, "offense", rng);
      incrementTouch(state.offenseKey, rebounderIndex);
      pushTrace(trace, "PUTBACK_ATTEMPT");
      putbackAttempted = true;

      const rebounderImpact = getPlayerImpact(
        getPlayerByIndex(offenseTeam, rebounderIndex),
        state.offenseKey,
        rebounderIndex,
        touchCounts,
        leagueLevel,
        isUserControlledPlayer(state.offenseKey, rebounderIndex) ? userFatigueLoadMultiplier : 1,
      );
      const rimDefenderIndex = pickDefenderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, "rim", rng);
      incrementTouch(state.defenseKey, rimDefenderIndex);
      const rimDefenderImpact = getPlayerImpact(
        getPlayerByIndex(defenseTeam, rimDefenderIndex),
        state.defenseKey,
        rimDefenderIndex,
        touchCounts,
        leagueLevel,
      );

      const putbackProb = applyHomeCourtToProbability(
        getPutbackMakeProbability(rebounderImpact, rimDefenderImpact, rng),
        state.offenseKey,
        "shot",
      );
      const putbackMade = rng() <= putbackProb;

      shooterIndex = rebounderIndex;
      pendingAssisterIndex = undefined;

      if (putbackMade) {
        madeShot = true;
        points = 2;
        score = addPoints(score, state.offenseKey, 2);
        eventType = "putback_make";
      } else {
        madeShot = false;
        points = 0;
        eventType = "putback_miss";
      }
    }

    if (!offensiveRebound || eventType === "putback_miss") {
      if (eventType === "putback_miss") {
        const secondChanceProb = clamp(orebProb * 0.5, tuning.offensiveReboundMin, tuning.offensiveReboundMax);
        offensiveRebound = rng() <= secondChanceProb;
        eventType = offensiveRebound ? "off_reb" : "def_reb";
        rebounderIndex = pickRebounderIndex(
          offensiveRebound ? offenseTeam : defenseTeam,
          offensiveRebound ? state.offenseKey : state.defenseKey,
          touchCounts,
          leagueLevel,
          offensiveRebound ? "offense" : "defense",
          rng,
        );
        incrementTouch(offensiveRebound ? state.offenseKey : state.defenseKey, rebounderIndex);
      } else if (!offensiveRebound) {
        eventType = "def_reb";
        rebounderIndex = pickRebounderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, "defense", rng);
        incrementTouch(state.defenseKey, rebounderIndex);
      }
    }
  }

  if (!madeShot || action !== "pass" || assisterIndex === undefined || eventType === "putback_make") {
    assisted = false;
    assisterIndex = undefined;
  }

  const elapsedSeconds = getElapsedByEvent(eventType, rng);
  const nextOffenseTeam = getTeam(context, state.defenseKey);
  const nextBallHandlerIndex = pickBallHandlerIndex(nextOffenseTeam, state.defenseKey, touchCounts, leagueLevel, rng);
  const nextState = flipPossession(
    state,
    touchCounts,
    score,
    elapsedSeconds,
    nextBallHandlerIndex,
    getNextMomentumStreaks(state, state.offenseKey, madeShot, false),
  );

  pushTrace(trace, "END_POSSESSION");

  return {
    action,
    madeShot,
    points,
    assisted,
    turnoverLikeFailure: false,
    nextState,
    eventType,
    shotZone,
    rimAttemptType,
    shooterIndex,
    assisterIndex,
    rebounderIndex,
    defensivePlay: {
      steal: false,
      block: blocked,
      defenderIndex: shotDefenderIndex,
    },
    offensiveRebound,
    putbackAttempted,
    trace,
  };
};

export const initializePossession = (
  context: MatchContext,
  leagueLevel: LeagueLevel,
  rng: () => number,
  secondsRemaining = 20 * 60,
): PossessionState => {
  const getScaledTeamOvr = (team: Team): number =>
    Math.round(average(team.roster.map((player) => getScaledAttribute(getPlayerOvr(player), leagueLevel))));

  const homeOvr = getScaledTeamOvr(context.home);
  const awayOvr = getScaledTeamOvr(context.away);
  const homeControlChance = clamp(homeOvr / (homeOvr + awayOvr), 0.35, 0.65);
  const homeHasBall = rng() <= homeControlChance;

  return {
    possessionIndex: 1,
    secondsRemaining,
    offenseKey: homeHasBall ? "home" : "away",
    defenseKey: homeHasBall ? "away" : "home",
    ballHandlerIndex: Math.floor(rng() * 5),
    homeTouches: [0, 0, 0, 0, 0],
    awayTouches: [0, 0, 0, 0, 0],
    score: { home: 0, away: 0 },
    homeStreak: 0,
    awayStreak: 0,
  };
};

export const runPossessionBatch = (
  context: MatchContext,
  possessions: number,
  seed: number,
  leagueLevel: LeagueLevel,
): { finalState: PossessionState; metrics: SimMetrics } => {
  const rng = createSeededRng(seed);
  let state = initializePossession(context, leagueLevel, rng);
  const metrics: SimMetrics = {
    possessions: 0,
    fga: 0,
    fgm: 0,
    assists: 0,
    turnoverLikeFailures: 0,
  };

  for (let i = 0; i < possessions && state.secondsRemaining > 0; i += 1) {
    const result = simulatePossession(context, state, leagueLevel, rng);
    metrics.possessions += 1;
    if (!result.turnoverLikeFailure) {
      metrics.fga += 1;
    }
    if (result.madeShot) {
      metrics.fgm += 1;
    }
    if (result.assisted && result.madeShot) {
      metrics.assists += 1;
    }
    if (result.turnoverLikeFailure) {
      metrics.turnoverLikeFailures += 1;
    }
    state = result.nextState;
  }

  return { finalState: state, metrics };
};
