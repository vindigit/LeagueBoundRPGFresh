import type { Player } from "./types/player";
import type { Team } from "./types/team";
import { LEAGUE_MODIFIERS } from "./constants/leagueScaling";
import { LeagueLevel } from "./types/career";
import { computeOverall } from "./builder/derivedRatings";
import { derivePlayerRoleTendencies, type PlayerRoleTendencies } from "./builder/roleTendencies";
import type { BuilderBadgeId, BuilderBadgeTier } from "./builder/badges/catalog";
import { BUILDER_BADGE_EFFECTS, type BuilderBadgeEffectModifier } from "./builder/badges/effects";
import type { ResolvedBuilderBadge } from "./builder/badges/resolve";
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

export type MatchWorkRate = "low" | "normal" | "high";
export type MatchFocus = "defense" | "balanced" | "offense";

export interface UserMatchState {
  workRate: MatchWorkRate;
  focus: MatchFocus;
  fatigue: number;
  touchLoad: number;
  lateGamePenalty: number;
}

export interface PossessionSimulationOptions {
  userControl?: {
    teamKey: "home" | "away";
    playerIndex: number;
    matchState: UserMatchState;
  };
  debugBadges?: boolean;
}

export type BadgeContributionStage = "turnover" | "shot_zone" | "shot_make" | "block" | "rebound" | "putback";

export interface BadgeContribution {
  badgeId: BuilderBadgeId;
  tier: BuilderBadgeTier;
  playerId: string;
  playerIndex: number;
  teamKey: TeamSide;
  stage: BadgeContributionStage;
  delta: number;
}

export interface BadgeDebugPayload {
  contributions: BadgeContribution[];
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
  badgeDebug?: BadgeDebugPayload;
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

type BadgeModifierTotals = Record<BuilderBadgeEffectModifier, number>;

type BadgeContext = {
  enabled: boolean;
  contributions: BadgeContribution[];
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const clamp01 = (value: number): number => clamp(value, 0, 1);

export const getWorkRateInvolvementMultiplier = (workRate: MatchWorkRate): number => {
  if (workRate === "high") {
    return 1.26;
  }
  if (workRate === "low") {
    return 0.8;
  }
  return 1;
};

export const getWorkRateFatigueLoadMultiplier = (workRate: MatchWorkRate): number => {
  if (workRate === "high") {
    return 1.45;
  }
  if (workRate === "low") {
    return 0.72;
  }
  return 1;
};

const getFocusComposureBonus = (
  focus: MatchFocus,
  teamKey: TeamSide,
  userControl?: PossessionSimulationOptions["userControl"],
): number => {
  if (!userControl || userControl.teamKey !== teamKey) {
    return 0;
  }
  if (focus === "offense") {
    return 6;
  }
  if (focus === "defense") {
    return -3;
  }
  return 2;
};

const getFocusActionBias = (
  focus: MatchFocus,
): Record<PossessionAction, number> => {
  if (focus === "offense") {
    return { pass: -3, shoot: 6, dribble: 5 };
  }
  if (focus === "defense") {
    return { pass: 5, shoot: -5, dribble: -2 };
  }
  return { pass: 1, shoot: 1, dribble: 1 };
};

const getFocusShotZoneBias = (focus: MatchFocus): Record<ShotZone, number> => {
  if (focus === "offense") {
    return { rim: 8, midrange: -2, three: 6 };
  }
  if (focus === "defense") {
    return { rim: -6, midrange: 2, three: -4 };
  }
  return { rim: 0, midrange: 0, three: 0 };
};

export const BADGE_TIER_SCALE: Record<BuilderBadgeTier, number> = {
  BRONZE: 1,
  SILVER: 1.75,
  GOLD: 2.5,
};

const BADGE_MODIFIER_KEYS: readonly BuilderBadgeEffectModifier[] = [
  "deepRangeThreeMake",
  "deepRangeThreeZoneWeight",
  "rimPressureRimMake",
  "rimPressurePutbackMake",
  "floorGeneralBallSecurity",
  "floorGeneralAssistProbability",
  "pointOfAttackDefenderPressure",
  "pointOfAttackStealProbability",
  "pointOfAttackPerimeterContest",
  "anchorOpponentRimMake",
  "anchorRimBlockProbability",
  "glassCleanerReboundWeight",
  "glassCleanerPutbackMake",
  "powerDriverRimBallSecurity",
  "powerDriverRimMake",
  "slitheryRimBallSecurity",
  "slitheryLayupMake",
  "posterizerDunkAttempt",
  "posterizerDunkMake",
  "posterizerDunkBlockResistance",
  "midRangeMagicianMidrangeZoneWeight",
  "midRangeMagicianMidrangeMake",
  "catchAndShootAssistedJumperMake",
  "needleThreaderPassBallSecurity",
  "needleThreaderAssistProbability",
  "quickFirstStepRimZoneWeight",
  "quickFirstStepRimBallSecurity",
  "pickpocketDefenderPressure",
  "pickpocketStealProbability",
  "helpDefenderRimContest",
  "helpDefenderWeakSideBlock",
  "chaseDownRimBlockProbability",
  "chaseDownPutbackBlockProbability",
  "boxOutBeastDefReboundWeight",
  "boxOutBeastOffReboundSuppression",
  "putbackBossOffReboundWeight",
  "putbackBossPutbackMake",
];

const createEmptyBadgeModifierTotals = (): BadgeModifierTotals =>
  Object.fromEntries(BADGE_MODIFIER_KEYS.map((key) => [key, 0])) as BadgeModifierTotals;

const createBadgeContext = (enabled: boolean): BadgeContext => ({
  enabled,
  contributions: [],
});

const uniqueBadgeCache = new WeakMap<Player, ResolvedBuilderBadge[]>();
const badgeModifierTotalsCache = new WeakMap<Player, BadgeModifierTotals>();

export const getUniqueBadges = (player: Player): ResolvedBuilderBadge[] => {
  const cached = uniqueBadgeCache.get(player);
  if (cached) {
    return cached;
  }
  const badges = player.dna?.builderProfile?.badges ?? [];
  const seen = new Set<BuilderBadgeId>();
  const unique: ResolvedBuilderBadge[] = [];
  for (const badge of badges) {
    if (seen.has(badge.id)) {
      continue;
    }
    seen.add(badge.id);
    unique.push(badge);
  }
  uniqueBadgeCache.set(player, unique);
  return unique;
};

export const buildBadgeModifierTotals = (player: Player): BadgeModifierTotals => {
  const cached = badgeModifierTotalsCache.get(player);
  if (cached) {
    return cached;
  }
  const totals = createEmptyBadgeModifierTotals();
  for (const badge of getUniqueBadges(player)) {
    const scale = BADGE_TIER_SCALE[badge.tier];
    const effectProfile = BUILDER_BADGE_EFFECTS[badge.id];
    for (const [modifierKey, baseValue] of Object.entries(effectProfile.modifiers) as Array<[BuilderBadgeEffectModifier, number]>) {
      totals[modifierKey] += baseValue * scale;
    }
  }
  badgeModifierTotalsCache.set(player, totals);
  return totals;
};

const recordBadgeContribution = (
  context: BadgeContext,
  player: Player,
  playerIndex: number,
  teamKey: TeamSide,
  stage: BadgeContributionStage,
  badgeId: BuilderBadgeId,
  tier: BuilderBadgeTier,
  delta: number,
): void => {
  if (!context.enabled || delta === 0) {
    return;
  }
  context.contributions.push({
    badgeId,
    tier,
    playerId: player.id,
    playerIndex,
    teamKey,
    stage,
    delta,
  });
};

const recordBadgeStageContributions = (
  context: BadgeContext,
  player: Player,
  playerIndex: number,
  teamKey: TeamSide,
  stage: BadgeContributionStage,
  selectDelta: (badgeId: BuilderBadgeId, scale: number) => number,
): void => {
  for (const badge of getUniqueBadges(player)) {
    const delta = selectDelta(badge.id, BADGE_TIER_SCALE[badge.tier]);
    recordBadgeContribution(context, player, playerIndex, teamKey, stage, badge.id, badge.tier, delta);
  }
};

validateMatchEngineTuning(tuning as Record<string, unknown>);

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const teamRelativeContextCache = new WeakMap<Team, ReturnType<typeof buildTeamRelativeContext>>();
const playerRoleTendencyCache = new WeakMap<Player, Map<string, PlayerRoleTendencies>>();

const getPlayerSizeInput = (player: Player) => ({
  height: player.identity?.height,
  weightLbs: player.identity?.weightLbs,
  bodyFrame: player.identity?.bodyFrame,
});

const buildTeamRelativeContext = (team: Team) => ({
  averageThreePoint: average(team.roster.map((player) => player.attributes.threePoint)),
  averageCreation: average(team.roster.map((player) => player.attributes.handle * 0.42 + player.attributes.passing * 0.28 + player.attributes.vision * 0.3)),
  averageRebounding: average(team.roster.map((player) => player.attributes.offRebounding * 0.45 + player.attributes.defRebounding * 0.55)),
  averageDefense: average(team.roster.map((player) => player.attributes.perimeterDefense * 0.3 + player.attributes.interiorDefense * 0.25 + player.attributes.stealing * 0.2 + player.attributes.blocking * 0.25)),
});

const getTeamRelativeContext = (team: Team): ReturnType<typeof buildTeamRelativeContext> => {
  const cached = teamRelativeContextCache.get(team);
  if (cached) {
    return cached;
  }
  const context = buildTeamRelativeContext(team);
  teamRelativeContextCache.set(team, context);
  return context;
};

const getRoleTendencies = (player: Player, leagueLevel: LeagueLevel, team?: Team): PlayerRoleTendencies => {
  const cacheKey = `${leagueLevel}:${team ? getTeamRelativeContext(team).averageThreePoint : "solo"}`;
  const playerCache = playerRoleTendencyCache.get(player) ?? new Map<string, PlayerRoleTendencies>();
  const cached = playerCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const tendencies = derivePlayerRoleTendencies({
    attributes: player.attributes,
    position: player.position,
    badges: getUniqueBadges(player),
    leagueLevel,
    teamContext: team ? getTeamRelativeContext(team) : undefined,
    ...getPlayerSizeInput(player),
  });
  playerCache.set(cacheKey, tendencies);
  playerRoleTendencyCache.set(player, playerCache);
  return tendencies;
};

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
    1 - touchCount * fatigueLoadMultiplier * tuning.fatigueTouchScale * 1.7 * (1 - stamina / 100),
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
  conditionPenalty = 0,
): PlayerImpact => {
  const consistency = getScaledAttribute(getConsistency(player), leagueLevel);
  const discipline = getScaledAttribute(getDiscipline(player), leagueLevel);
  const stamina = getScaledAttribute(player.attributes.stamina, leagueLevel);
  const fatigueMultiplier = clamp(
    getFatigueMultiplier(stamina, touchCounts[teamKey][playerIndex], fatigueLoadMultiplier) - conditionPenalty,
    tuning.fatigueMinMultiplier,
    tuning.fatigueMaxMultiplier,
  );
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
  roleTendencies: PlayerRoleTendencies,
  state: PossessionState,
  rng: () => number,
  focusComposureBonus = 0,
  actionBias?: Partial<Record<PossessionAction, number>>,
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
      composureAdjustment +
      (roleTendencies.passCreationWeight - 0.5) * 38,
    shoot:
      (shootingProfile - 50) * 0.1 +
      (ballHandlerImpact.vision - 50) * 0.05 +
      composureAdjustment * 0.5 +
      (roleTendencies.selfCreationWeight + roleTendencies.offBallShotWeight - 1) * 12,
    dribble:
      (ballHandlerImpact.handle - 50) * 0.14 +
      (ballHandlerImpact.speed - 50) * 0.06 -
      composureAdjustment * 0.5 +
      (roleTendencies.selfCreationWeight - 0.5) * 20 -
      (roleTendencies.turnoverRiskWeight - 0.5) * 8,
  };

  return weightedPick(
    (["pass", "shoot", "dribble"] as PossessionAction[]).map((action) => ({
      key: action,
      weight: clamp(
        baseWeights[action] +
          archetypeAdjust[action] +
          pressureAdjust[action] +
          skillAdjust[action] +
          (actionBias?.[action] ?? 0),
        1,
        99,
      ),
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
  userControl?: PossessionSimulationOptions["userControl"],
): number => {
  const weighted = offenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
    const role = getRoleTendencies(player, leagueLevel, offenseTeam);
    const isUserControlled = userControl?.teamKey === teamKey && userControl.playerIndex === index;
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight:
        (impact.handle * 0.28 + impact.vision * 0.22 + impact.passing * 0.18 + role.touchWeight * 44 + role.passCreationWeight * 30 + role.selfCreationWeight * 10) *
        (isUserControlled ? getWorkRateInvolvementMultiplier(userControl.matchState.workRate) : 1),
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
    const roleTendencies = getRoleTendencies(player, leagueLevel, defenseTeam);
    const weight =
      role === "turnover"
        ? impact.stealing * 0.45 + impact.speed * 0.22 + impact.perimeterDefense * 0.13 + roleTendencies.stealEventWeight * 35
        : role === "perimeter"
          ? impact.perimeterDefense * 0.58 + impact.speed * 0.18 + roleTendencies.contestWeight * 32
          : impact.interiorDefense * 0.44 + impact.blocking * 0.22 + impact.strength * 0.12 + roleTendencies.blockEventWeight * 42 + roleTendencies.contestWeight * 18;
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
      const role = getRoleTendencies(player, leagueLevel, offenseTeam);
      const receiverShotValue =
        impact.threePoint * 0.28 +
        impact.midrange * 0.24 +
        impact.shortRange * 0.32 +
        impact.dunking * 0.1 +
        impact.vision * 0.06 +
        role.offBallShotWeight * 22 +
        role.threeVolumeWeight * 10 +
        role.rimPressureWeight * 8;
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
  badgeContext: BadgeContext,
  rng: () => number,
): number => {
  const weighted = team.roster.map((player, index) => {
    const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
    const role = getRoleTendencies(player, leagueLevel, team);
    const badgeModifiers = buildBadgeModifierTotals(player);
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight:
        reboundType === "offense"
          ? impact.offRebounding * 0.55 +
            impact.strength * 0.12 +
            role.offensiveReboundWeight * 104 +
            badgeModifiers.glassCleanerReboundWeight +
            badgeModifiers.putbackBossOffReboundWeight
          : impact.defRebounding * 0.52 +
            impact.strength * 0.13 +
            role.defensiveReboundWeight * 122 +
            badgeModifiers.glassCleanerReboundWeight +
            badgeModifiers.boxOutBeastDefReboundWeight,
    };
  });
  const rebounderIndex = weightedPick(weighted, rng);
  const rebounder = getPlayerByIndex(team, rebounderIndex);
  recordBadgeStageContributions(
    badgeContext,
    rebounder,
    rebounderIndex,
    teamKey,
    "rebound",
    (badgeId, scale) => {
      if (badgeId === "glass_cleaner") {
        return 5 * scale;
      }
      if (badgeId === "putback_boss" && reboundType === "offense") {
        return 5 * scale;
      }
      if (badgeId === "box_out_beast" && reboundType === "defense") {
        return 5 * scale;
      }
      return 0;
    },
  );
  return rebounderIndex;
};

const pickShotZone = (
  shooter: Player,
  shooterIndex: number,
  offenseKey: TeamSide,
  action: PossessionAction,
  shooterImpact: PlayerImpact,
  roleTendencies: PlayerRoleTendencies,
  badgeContext: BadgeContext,
  rng: () => number,
  shotZoneBias?: Partial<Record<ShotZone, number>>,
): ShotZone => {
  const badgeModifiers = buildBadgeModifierTotals(shooter);
  const base = tuning.shotZoneByAction[action];
  const suppressThree = shooterImpact.threePoint < tuning.lowShootingThreeSuppressionThreshold;
  const decisionTilt = 1 + ((shooterImpact.vision - 50) / 49) * 0.08;
  const threeTilt =
    (shooterImpact.threePoint - 50) * tuning.shotZoneThreePointWeight * decisionTilt +
    badgeModifiers.deepRangeThreeZoneWeight +
    (roleTendencies.threeVolumeWeight - 0.5) * 28;
  const midrangeTilt =
    (shooterImpact.midrange - 50) * tuning.shotZoneMidrangeWeight * decisionTilt +
    badgeModifiers.midRangeMagicianMidrangeZoneWeight +
    (roleTendencies.midrangeVolumeWeight - 0.5) * 14;
  const rimTilt =
    ((shooterImpact.shortRange - 50) * tuning.shotZoneRimShortRangeWeight +
      (shooterImpact.dunking - 50) * tuning.shotZoneRimDunkingWeight) *
      decisionTilt +
    badgeModifiers.quickFirstStepRimZoneWeight +
    (roleTendencies.rimPressureWeight - 0.5) * 26;
  const fatigueTilt = (shooterImpact.fatigueMultiplier - 1) * 100 * tuning.shotZoneFatigueWeight;
  const entries: Array<{ key: ShotZone; weight: number }> = [
    {
      key: "midrange",
      weight: base.midrange + midrangeTilt - Math.abs(midrangeTilt - rimTilt) * 0.1 + (shotZoneBias?.midrange ?? 0),
    },
    {
      key: "rim",
      weight: base.rim + rimTilt - fatigueTilt * 0.2 + (shotZoneBias?.rim ?? 0),
    },
  ];

  if (!suppressThree) {
    entries.unshift({
      key: "three",
      weight: base.three + threeTilt + fatigueTilt + (shotZoneBias?.three ?? 0),
    });
  }

  recordBadgeStageContributions(
    badgeContext,
    shooter,
    shooterIndex,
    offenseKey,
    "shot_zone",
    (badgeId, scale) => {
      if (badgeId === "deep_range") {
        return 4 * scale;
      }
      if (badgeId === "mid_range_magician") {
        return 4 * scale;
      }
      if (badgeId === "quick_first_step") {
        return 4 * scale;
      }
      return 0;
    },
  );

  return weightedPick(entries, rng);
};

const getTurnoverShotZoneHint = (shooterImpact: PlayerImpact): ShotZone => {
  const rimProfile = shooterImpact.shortRange * 0.55 + shooterImpact.dunking * 0.45;
  const threeProfile = shooterImpact.threePoint;
  const midrangeProfile = shooterImpact.midrange * 0.8 + shooterImpact.shortRange * 0.2;
  if (rimProfile >= threeProfile && rimProfile >= midrangeProfile) {
    return "rim";
  }
  if (threeProfile >= midrangeProfile) {
    return "three";
  }
  return "midrange";
};

const getDunkProbability = (shooterImpact: PlayerImpact, shooter?: Player): number => {
  if (shooterImpact.dunking < tuning.dunkAttemptThreshold) {
    return 0;
  }

  const badgeModifiers = shooter ? buildBadgeModifierTotals(shooter) : createEmptyBadgeModifierTotals();
  return clamp(
    tuning.dunkAttemptBase +
      badgeModifiers.posterizerDunkAttempt +
      (shooterImpact.dunking - tuning.dunkAttemptThreshold) * tuning.dunkAttemptDunkingWeight +
      shooterImpact.strength * tuning.dunkAttemptStrengthWeight +
      shooterImpact.speed * tuning.dunkAttemptSpeedWeight,
    tuning.dunkAttemptMin,
    tuning.dunkAttemptMax,
  );
};

const pickRimAttemptType = (shooter: Player, shooterImpact: PlayerImpact, rng: () => number): RimAttemptType =>
  rng() <= getDunkProbability(shooterImpact, shooter) ? "dunk" : "layup";

const getTurnoverProbability = (
  ballHandler: Player,
  ballHandlerIndex: number,
  offenseKey: TeamSide,
  ballHandlerImpact: ReturnType<typeof getPlayerImpact>,
  ballHandlerRole: PlayerRoleTendencies,
  defenseTeam: Team,
  defenseKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  state: PossessionState,
  action: PossessionAction,
  shotZoneHint: ShotZone | undefined,
  badgeContext: BadgeContext,
  focusComposureBonus = 0,
): number => {
  const ballHandlerBadgeModifiers = buildBadgeModifierTotals(ballHandler);
  const defenderPressure = average(defenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, defenseKey, index, touchCounts, leagueLevel);
    const badgeModifiers = buildBadgeModifierTotals(player);
    return (
      impact.stealing * 0.45 +
      impact.speed * 0.35 +
      impact.perimeterDefense * 0.2 +
      getRoleTendencies(player, leagueLevel, defenseTeam).stealEventWeight * 18 +
      badgeModifiers.pointOfAttackDefenderPressure +
      badgeModifiers.pickpocketDefenderPressure
    );
  }));
  const rimBallSecurityBonus =
    shotZoneHint === "rim"
      ? ballHandlerBadgeModifiers.powerDriverRimBallSecurity +
        ballHandlerBadgeModifiers.slitheryRimBallSecurity +
        ballHandlerBadgeModifiers.quickFirstStepRimBallSecurity
      : 0;
  const ballSecurity =
    ballHandlerImpact.handle * 0.65 +
    ballHandlerImpact.vision * 0.35 +
    ballHandlerBadgeModifiers.floorGeneralBallSecurity +
    (action === "pass" ? ballHandlerBadgeModifiers.needleThreaderPassBallSecurity : 0) +
    rimBallSecurityBonus;
  const pressure = getPressure(state);
  const composureMultiplier = getComposureMultiplier(ballHandlerImpact.discipline + focusComposureBonus, pressure);

  recordBadgeStageContributions(
    badgeContext,
    ballHandler,
    ballHandlerIndex,
    offenseKey,
    "turnover",
    (badgeId, scale) => {
      if (badgeId === "floor_general") {
        return -4 * scale;
      }
      if (badgeId === "needle_threader" && action === "pass") {
        return -4 * scale;
      }
      if (badgeId === "power_driver" && shotZoneHint === "rim") {
        return -(3 * scale);
      }
      if (badgeId === "slithery" && shotZoneHint === "rim") {
        return -(3 * scale);
      }
      if (badgeId === "quick_first_step" && shotZoneHint === "rim") {
        return -(3 * scale);
      }
      return 0;
    },
  );

  return clamp(
    (tuning.turnoverBase + (defenderPressure - ballSecurity) / tuning.turnoverDivisor + (ballHandlerRole.turnoverRiskWeight - 0.5) * 0.05) / composureMultiplier,
    tuning.turnoverMin,
    tuning.turnoverMax,
  );
};

const getStealProbability = (
  defender: Player,
  defenderIndex: number,
  defenseKey: TeamSide,
  defenderImpact: PlayerImpact,
  defenderRole: PlayerRoleTendencies,
  ballHandlerImpact: PlayerImpact,
  badgeContext: BadgeContext,
): number =>
  {
    const badgeModifiers = buildBadgeModifierTotals(defender);
    recordBadgeStageContributions(
      badgeContext,
      defender,
      defenderIndex,
      defenseKey,
      "turnover",
      (badgeId, scale) => {
        if (badgeId === "point_of_attack" || badgeId === "pickpocket") {
          return 4 * scale;
        }
        return 0;
      },
    );
    recordBadgeStageContributions(
      badgeContext,
      defender,
      defenderIndex,
      defenseKey,
      "turnover",
      (badgeId, scale) => {
        if (badgeId === "point_of_attack" || badgeId === "pickpocket") {
          return 0.01 * scale;
        }
        return 0;
      },
    );
    return clamp(
      tuning.stealBase +
        badgeModifiers.pointOfAttackStealProbability +
        badgeModifiers.pickpocketStealProbability +
        (defenderRole.stealEventWeight - 0.5) * 0.08 +
        (defenderImpact.stealing * tuning.stealDefenseWeight +
          defenderImpact.speed * tuning.stealSpeedWeight -
          ballHandlerImpact.handle) /
          tuning.stealDivisor,
      tuning.stealMin,
      tuning.stealMax,
    );
  };

const getAssistProbability = (
  passer: Player,
  passerIndex: number,
  offenseKey: TeamSide,
  passerImpact: ReturnType<typeof getPlayerImpact>,
  passerRole: PlayerRoleTendencies,
  shooterImpact: ReturnType<typeof getPlayerImpact>,
  shooterRole: PlayerRoleTendencies,
  badgeContext: BadgeContext,
): number => {
  const badgeModifiers = buildBadgeModifierTotals(passer);
  const baseAssist =
    tuning.assistBase +
    badgeModifiers.floorGeneralAssistProbability +
    badgeModifiers.needleThreaderAssistProbability +
    (passerImpact.vision * 0.5 +
      passerImpact.passing * 0.35 +
      passerImpact.handle * 0.15 -
      shooterImpact.handle * 0.08) /
      tuning.assistDivisor +
    (passerRole.assistCreationWeight - 0.5) * 0.32 +
    (shooterRole.offBallShotWeight - 0.5) * 0.08;
  recordBadgeStageContributions(
    badgeContext,
    passer,
    passerIndex,
    offenseKey,
    "shot_make",
    (badgeId, scale) => {
      if (badgeId === "floor_general" || badgeId === "needle_threader") {
        return 0.01 * scale;
      }
      return 0;
    },
  );
  return clamp(baseAssist, tuning.assistMin, tuning.assistMax);
};

const getContestValue = (shotZone: ShotZone, defenderImpact: PlayerImpact, defender: Player): number => {
  const badgeModifiers = buildBadgeModifierTotals(defender);
  return shotZone === "rim"
    ? defenderImpact.interiorDefense * 1.35 + defenderImpact.strength * 0.05 + badgeModifiers.helpDefenderRimContest
    : defenderImpact.perimeterDefense * 0.9 + defenderImpact.speed * 0.1 + badgeModifiers.pointOfAttackPerimeterContest;
};

const getBlockProbability = (
  shooter: Player,
  shooterIndex: number,
  offenseKey: TeamSide,
  defender: Player,
  defenderIndex: number,
  defenseKey: TeamSide,
  defenderImpact: PlayerImpact,
  defenderRole: PlayerRoleTendencies,
  shooterImpact: PlayerImpact,
  shotZone: ShotZone,
  badgeContext: BadgeContext,
  rimAttemptType?: RimAttemptType,
): number => {
  const badgeModifiers = buildBadgeModifierTotals(defender);
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
        ? ((shooterImpact.dunking * 0.55 +
            shooterImpact.strength * 0.3 +
            shooterImpact.speed * 0.15 +
            buildBadgeModifierTotals(shooter).posterizerDunkBlockResistance) *
            tuning.dunkBlockResistance)
        : (shooterImpact.shortRange * 0.6 + shooterImpact.speed * 0.25 + shooterImpact.strength * 0.15) *
          tuning.layupBlockResistance
      : shotZone === "midrange"
        ? shooterImpact.midrange * 0.7 + shooterImpact.speed * 0.15 + shooterImpact.handle * 0.15
        : shooterImpact.threePoint * 0.75 + shooterImpact.handle * 0.15 + shooterImpact.speed * 0.1;
  const badgeBlockBonus =
    shotZone === "rim"
      ? badgeModifiers.anchorRimBlockProbability +
        badgeModifiers.helpDefenderWeakSideBlock +
        badgeModifiers.chaseDownRimBlockProbability
      : 0;

  recordBadgeStageContributions(
    badgeContext,
    shooter,
    shooterIndex,
    offenseKey,
    "block",
    (badgeId, scale) => (badgeId === "posterizer" && shotZone === "rim" && rimAttemptType === "dunk" ? -(4 * scale) : 0),
  );

  recordBadgeStageContributions(
    badgeContext,
    defender,
    defenderIndex,
    defenseKey,
    "block",
    (badgeId, scale) => {
      if (shotZone !== "rim") {
        return 0;
      }
      if (badgeId === "anchor" || badgeId === "help_defender" || badgeId === "chase_down") {
        return 0.008 * scale;
      }
      return 0;
    },
  );

  return clamp(
    (tuning.blockBase + badgeBlockBonus + (defenderRole.blockEventWeight - 0.5) * 0.055 + (defenderBlockValue + zoneDefenseValue * 0.15 - shooterResistance) / tuning.blockDivisor) * zoneMultiplier,
    tuning.blockMin * zoneMultiplier,
    tuning.blockMax * zoneMultiplier,
  );
};

const getShotMakeProbability = (
  shooter: Player,
  shooterIndex: number,
  offenseKey: TeamSide,
  shotZone: ShotZone,
  shooterImpact: PlayerImpact,
  defender: Player,
  defenderIndex: number,
  defenseKey: TeamSide,
  defenderImpact: PlayerImpact,
  state: PossessionState,
  isAssisted: boolean,
  rng: () => number,
  badgeContext: BadgeContext,
  rimAttemptType?: RimAttemptType,
  focusComposureBonus = 0,
): number => {
  const shooterBadgeModifiers = buildBadgeModifierTotals(shooter);
  const defenderBadgeModifiers = buildBadgeModifierTotals(defender);
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

  const defenseValue = getContestValue(shotZone, defenderImpact, defender);
  const pressure = getPressure(state);
  const composureMultiplier = getComposureMultiplier(shooterImpact.discipline + focusComposureBonus, pressure);
  const fatiguePenalty = (1 - shooterImpact.fatigueMultiplier) * 8;
  const attemptBonus =
    shotZone === "rim" ? (rimAttemptType === "dunk" ? tuning.dunkMakeBonus : tuning.layupMakeBonus) : 0;
  const offenseEdge = (offenseValue - defenseValue) / tuning.shotOffenseDivisor;
  const badgeShotMakeBonus =
    (shotZone === "three" ? shooterBadgeModifiers.deepRangeThreeMake : 0) +
    (shotZone === "midrange" ? shooterBadgeModifiers.midRangeMagicianMidrangeMake : 0) +
    (shotZone === "rim"
      ? shooterBadgeModifiers.rimPressureRimMake +
        (rimAttemptType === "layup" ? shooterBadgeModifiers.slitheryLayupMake : 0) +
        (rimAttemptType === "dunk" ? shooterBadgeModifiers.posterizerDunkMake : 0) +
        shooterBadgeModifiers.powerDriverRimMake +
        defenderBadgeModifiers.anchorOpponentRimMake
      : 0);
  const assistedJumperBonus =
    isAssisted && (shotZone === "three" || shotZone === "midrange")
      ? shooterBadgeModifiers.catchAndShootAssistedJumperMake
      : 0;

  recordBadgeStageContributions(
    badgeContext,
    shooter,
    shooterIndex,
    offenseKey,
    "shot_make",
    (badgeId, scale) => {
      if (badgeId === "deep_range" && shotZone === "three") {
        return 0.015 * scale;
      }
      if (badgeId === "mid_range_magician" && shotZone === "midrange") {
        return 0.012 * scale;
      }
      if (badgeId === "rim_pressure" && shotZone === "rim") {
        return 0.012 * scale;
      }
      if (badgeId === "slithery" && shotZone === "rim" && rimAttemptType === "layup") {
        return 0.01 * scale;
      }
      if (badgeId === "posterizer" && shotZone === "rim" && rimAttemptType === "dunk") {
        return 0.012 * scale;
      }
      if (badgeId === "power_driver" && shotZone === "rim") {
        return 0.01 * scale;
      }
      if (badgeId === "catch_and_shoot" && isAssisted && (shotZone === "three" || shotZone === "midrange")) {
        return 0.012 * scale;
      }
      return 0;
    },
  );
  recordBadgeStageContributions(
    badgeContext,
    defender,
    defenderIndex,
    defenseKey,
    "shot_make",
    (badgeId, scale) => (badgeId === "anchor" && shotZone === "rim" ? -(0.012 * scale) : 0),
  );

  const makeWithoutVariance = clamp(
    zoneBase + tuning.shotMakeBase + attemptBonus + badgeShotMakeBonus + assistedJumperBonus + offenseEdge - defenseValue / tuning.shotContestDivisor - fatiguePenalty,
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
      const badgeModifiers = buildBadgeModifierTotals(player);
      return (
        impact.offRebounding * 0.55 +
        impact.strength * 0.15 +
        getRoleTendencies(player, leagueLevel, offenseTeam).offensiveReboundWeight * 52 +
        badgeModifiers.glassCleanerReboundWeight +
        badgeModifiers.putbackBossOffReboundWeight
      );
    }),
  );

  const defenseReb = average(
    defenseTeam.roster.map((player, index) => {
      const impact = getPlayerImpact(player, defenseKey, index, touchCounts, leagueLevel);
      const badgeModifiers = buildBadgeModifierTotals(player);
      return (
        impact.defRebounding * 0.55 +
        impact.strength * 0.15 +
        getRoleTendencies(player, leagueLevel, defenseTeam).defensiveReboundWeight * 58 +
        badgeModifiers.glassCleanerReboundWeight +
        badgeModifiers.boxOutBeastDefReboundWeight
      );
    }),
  );

  const shotZoneBonus = shotZone === "three" ? tuning.longReboundThreeBonus : 0;
  const suppression = average(
    defenseTeam.roster.map((player) => buildBadgeModifierTotals(player).boxOutBeastOffReboundSuppression),
  );

  return clamp(
    tuning.offensiveReboundBase + (offenseReb - defenseReb) / tuning.offensiveReboundDivisor + shotZoneBonus - suppression,
    tuning.offensiveReboundMin,
    tuning.offensiveReboundMax,
  );
};

const getPutbackMakeProbability = (
  shooter: Player,
  shooterIndex: number,
  offenseKey: TeamSide,
  shooterImpact: ReturnType<typeof getPlayerImpact>,
  defender: Player,
  defenderIndex: number,
  defenseKey: TeamSide,
  defenderImpact: ReturnType<typeof getPlayerImpact>,
  rng: () => number,
  badgeContext: BadgeContext,
): number => {
  const shooterBadgeModifiers = buildBadgeModifierTotals(shooter);
  const defenderBadgeModifiers = buildBadgeModifierTotals(defender);
  const offenseValue = shooterImpact.shortRange * 0.55 + shooterImpact.dunking * 0.25 + shooterImpact.strength * 0.2;
  const defenseValue =
    defenderImpact.interiorDefense * 0.5 + defenderImpact.defRebounding * 0.25 + defenderImpact.blocking * 0.25;
  const badgePutbackBonus =
    shooterBadgeModifiers.rimPressurePutbackMake +
    shooterBadgeModifiers.glassCleanerPutbackMake +
    shooterBadgeModifiers.putbackBossPutbackMake +
    defenderBadgeModifiers.anchorOpponentRimMake;
  recordBadgeStageContributions(
    badgeContext,
    shooter,
    shooterIndex,
    offenseKey,
    "putback",
    (badgeId, scale) => {
      if (badgeId === "rim_pressure") {
        return 0.01 * scale;
      }
      if (badgeId === "glass_cleaner") {
        return 0.008 * scale;
      }
      if (badgeId === "putback_boss") {
        return 0.01 * scale;
      }
      return 0;
    },
  );
  recordBadgeStageContributions(
    badgeContext,
    defender,
    defenderIndex,
    defenseKey,
    "putback",
    (badgeId, scale) => {
      if (badgeId === "anchor") {
        return -(0.012 * scale);
      }
      if (badgeId === "chase_down") {
        return -(0.008 * scale);
      }
      return 0;
    },
  );
  const makeWithoutVariance = clamp(
    tuning.putbackBase +
      badgePutbackBonus -
      defenderBadgeModifiers.chaseDownPutbackBlockProbability +
      (offenseValue - defenseValue) / tuning.putbackDivisor,
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
  const badgeContext = createBadgeContext(Boolean(options?.debugBadges));
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
  const userFatigueLoadMultiplier = options?.userControl
    ? getWorkRateFatigueLoadMultiplier(options.userControl.matchState.workRate)
    : 1;
  const userConditionPenalty = options?.userControl
    ? options.userControl.matchState.fatigue * 0.14 + options.userControl.matchState.lateGamePenalty * 0.12
    : 0;
  const userActionBias = options?.userControl ? getFocusActionBias(options.userControl.matchState.focus) : undefined;
  const userShotZoneBias = options?.userControl ? getFocusShotZoneBias(options.userControl.matchState.focus) : undefined;

  const ballHandlerIndex = pickBallHandlerIndex(offenseTeam, state.offenseKey, touchCounts, leagueLevel, rng, options?.userControl);
  incrementTouch(state.offenseKey, ballHandlerIndex);
  const ballHandler = getPlayerByIndex(offenseTeam, ballHandlerIndex);
  const ballHandlerRole = getRoleTendencies(ballHandler, leagueLevel, offenseTeam);
  const ballHandlerIsUser = isUserControlledPlayer(state.offenseKey, ballHandlerIndex);
  const ballHandlerImpact = getPlayerImpact(
    ballHandler,
    state.offenseKey,
    ballHandlerIndex,
    touchCounts,
    leagueLevel,
    ballHandlerIsUser ? userFatigueLoadMultiplier : 1,
    ballHandlerIsUser ? userConditionPenalty : 0,
  );
  const turnoverShotZoneHint = getTurnoverShotZoneHint(ballHandlerImpact);

  pushTrace(trace, "DECIDE_ACTION");
  const action = chooseAction(
    ballHandler,
    ballHandlerImpact,
    ballHandlerRole,
    state,
    rng,
    getFocusComposureBonus(ballHandlerIsUser ? options?.userControl?.matchState.focus ?? "balanced" : "balanced", state.offenseKey, options?.userControl),
    ballHandlerIsUser ? userActionBias : undefined,
  );

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
    isUserControlledPlayer(state.defenseKey, primaryDefenderIndex) ? userConditionPenalty : 0,
  );

  const turnoverProb = applyHomeCourtToProbability(
    getTurnoverProbability(
      ballHandler,
      ballHandlerIndex,
      state.offenseKey,
      ballHandlerImpact,
      ballHandlerRole,
      defenseTeam,
      state.defenseKey,
      touchCounts,
      leagueLevel,
      state,
      action,
      turnoverShotZoneHint,
      badgeContext,
      getFocusComposureBonus(ballHandlerIsUser ? options?.userControl?.matchState.focus ?? "balanced" : "balanced", state.offenseKey, options?.userControl),
    ),
    state.offenseKey,
    "turnover",
  );
  if (rng() <= turnoverProb) {
    const primaryDefenderRole = getRoleTendencies(primaryDefender, leagueLevel, defenseTeam);
    const steal =
      rng() <= getStealProbability(primaryDefender, primaryDefenderIndex, state.defenseKey, primaryDefenderImpact, primaryDefenderRole, ballHandlerImpact, badgeContext);
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
      badgeDebug: badgeContext.enabled ? { contributions: badgeContext.contributions } : undefined,
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
      isUserControlledPlayer(state.offenseKey, receiverIndex) ? userConditionPenalty : 0,
    );
    const receiverRole = getRoleTendencies(getPlayerByIndex(offenseTeam, receiverIndex), leagueLevel, offenseTeam);
    const assistProb = getAssistProbability(
      ballHandler,
      ballHandlerIndex,
      state.offenseKey,
      ballHandlerImpact,
      ballHandlerRole,
      receiverImpact,
      receiverRole,
      badgeContext,
    );
    if (rng() <= assistProb) {
      pendingAssisterIndex = ballHandlerIndex;
    }
  }

  const shooter = getPlayerByIndex(offenseTeam, shooterIndex);
  const shooterRole = getRoleTendencies(shooter, leagueLevel, offenseTeam);
  incrementTouch(state.offenseKey, shooterIndex);
  const shooterIsUser = isUserControlledPlayer(state.offenseKey, shooterIndex);
  const shooterImpact = getPlayerImpact(
    shooter,
    state.offenseKey,
    shooterIndex,
    touchCounts,
    leagueLevel,
    shooterIsUser ? userFatigueLoadMultiplier : 1,
    shooterIsUser ? userConditionPenalty : 0,
  );
  const shotZone = pickShotZone(
    shooter,
    shooterIndex,
    state.offenseKey,
    action,
    shooterImpact,
    shooterRole,
    badgeContext,
    rng,
    shooterIsUser ? userShotZoneBias : undefined,
  );
  const rimAttemptType = shotZone === "rim" ? pickRimAttemptType(shooter, shooterImpact, rng) : undefined;

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
  const shotDefenderRole = getRoleTendencies(shotDefender, leagueLevel, defenseTeam);
  const shotDefenderImpact = getPlayerImpact(
    shotDefender,
    state.defenseKey,
    shotDefenderIndex,
    touchCounts,
    leagueLevel,
    isUserControlledPlayer(state.defenseKey, shotDefenderIndex) ? userFatigueLoadMultiplier : 1,
    isUserControlledPlayer(state.defenseKey, shotDefenderIndex) ? userConditionPenalty : 0,
  );

  const blockProb = getBlockProbability(
    shooter,
    shooterIndex,
    state.offenseKey,
    shotDefender,
    shotDefenderIndex,
    state.defenseKey,
    shotDefenderImpact,
    shotDefenderRole,
    shooterImpact,
    shotZone,
    badgeContext,
    rimAttemptType,
  );
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
        shooter,
        shooterIndex,
        state.offenseKey,
        shotZone,
        shooterImpact,
        shotDefender,
        shotDefenderIndex,
        state.defenseKey,
        shotDefenderImpact,
        state,
        pendingAssisterIndex !== undefined,
        rng,
        badgeContext,
        rimAttemptType,
        getFocusComposureBonus(shooterIsUser ? options?.userControl?.matchState.focus ?? "balanced" : "balanced", state.offenseKey, options?.userControl),
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
      rebounderIndex = pickRebounderIndex(offenseTeam, state.offenseKey, touchCounts, leagueLevel, "offense", badgeContext, rng);
      incrementTouch(state.offenseKey, rebounderIndex);
      pushTrace(trace, "PUTBACK_ATTEMPT");
      putbackAttempted = true;

      const rebounder = getPlayerByIndex(offenseTeam, rebounderIndex);
      const rebounderImpact = getPlayerImpact(
        rebounder,
        state.offenseKey,
        rebounderIndex,
        touchCounts,
        leagueLevel,
        isUserControlledPlayer(state.offenseKey, rebounderIndex) ? userFatigueLoadMultiplier : 1,
      );
      const rimDefenderIndex = pickDefenderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, "rim", rng);
      incrementTouch(state.defenseKey, rimDefenderIndex);
      const rimDefender = getPlayerByIndex(defenseTeam, rimDefenderIndex);
      const rimDefenderImpact = getPlayerImpact(
        rimDefender,
        state.defenseKey,
        rimDefenderIndex,
        touchCounts,
        leagueLevel,
      );

      const putbackProb = applyHomeCourtToProbability(
        getPutbackMakeProbability(
          rebounder,
          rebounderIndex,
          state.offenseKey,
          rebounderImpact,
          rimDefender,
          rimDefenderIndex,
          state.defenseKey,
          rimDefenderImpact,
          rng,
          badgeContext,
        ),
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
          badgeContext,
          rng,
        );
        incrementTouch(offensiveRebound ? state.offenseKey : state.defenseKey, rebounderIndex);
      } else if (!offensiveRebound) {
        eventType = "def_reb";
        rebounderIndex = pickRebounderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, "defense", badgeContext, rng);
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
    badgeDebug: badgeContext.enabled ? { contributions: badgeContext.contributions } : undefined,
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
