import type { Player } from "./types/player";
import type { Team } from "./types/team";
import { LEAGUE_MODIFIERS } from "./constants/leagueScaling";
import { LeagueLevel } from "./types/career";
import tuning from "./matchEngineTuning.js";
import { validateMatchEngineTuning } from "./matchEngineTuningValidation";

export type PossessionAction = "pass" | "shoot" | "dribble";
export type ShotZone = "three" | "midrange" | "rim";
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
  | "putback_miss";

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

export interface PossessionResult {
  action: PossessionAction;
  madeShot: boolean;
  points: 0 | 2 | 3;
  assisted: boolean;
  turnoverLikeFailure: boolean;
  nextState: PossessionState;
  eventType: PossessionEventType;
  shotZone?: ShotZone;
  shooterIndex: number;
  assisterIndex?: number;
  rebounderIndex?: number;
  defensivePlay: DefensivePlay;
  offensiveRebound: boolean;
  putbackAttempted: boolean;
  trace: MarkovStateNode[];
}

export interface MatchContext {
  home: Team;
  away: Team;
}

type TeamSide = "home" | "away";
type HomeCourtKind = "shot" | "turnover";

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

const toCompositeAttributes = (player: Player): {
  shooting: number;
  finishing: number;
  vision: number;
  handle: number;
  athleticism: number;
  defense: number;
  rebounding: number;
  bbiq: number;
  stamina: number;
} => {
  const attrs = player.attributes;
  return {
    shooting: average([attrs.shortRange, attrs.midrange, attrs.threePoint]),
    finishing: attrs.shortRange * 0.35 + attrs.dunking * 0.4 + attrs.strength * 0.25,
    vision: attrs.passing * 0.65 + attrs.vision * 0.35,
    handle: attrs.handle,
    athleticism: attrs.speed * 0.55 + attrs.strength * 0.35 + attrs.dunking * 0.1,
    defense: attrs.perimeterDefense * 0.45 + attrs.interiorDefense * 0.35 + attrs.stealing * 0.1 + attrs.blocking * 0.1,
    rebounding: attrs.offRebounding * 0.45 + attrs.defRebounding * 0.55,
    bbiq: attrs.vision * 0.6 + attrs.handle * 0.2 + attrs.passing * 0.2,
    stamina: attrs.stamina,
  };
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

const addPoints = (score: MatchScore, offenseKey: "home" | "away", points: 2 | 3): MatchScore =>
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
  average(Object.values(toCompositeAttributes(player)));

export const calculateTeamOvr = (team: Team): number =>
  Math.round(average(team.roster.map(getPlayerOvr)));

const getFatigueMultiplier = (stamina: number, touchCount: number): number =>
  clamp(1 - touchCount * tuning.fatigueTouchScale * (1 - stamina / 100), tuning.fatigueMinMultiplier, tuning.fatigueMaxMultiplier);

const getDecisionVariance = (bbiq: number, rng: () => number): number => {
  const spread = tuning.decisionVarianceBase + ((99 - bbiq) / 99) * tuning.decisionVarianceBbiqScale;
  return (rng() * 2 - 1) * spread;
};

const getPlayerImpact = (
  player: Player,
  teamKey: TeamSide,
  playerIndex: number,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
): {
  shooting: number;
  finishing: number;
  vision: number;
  handle: number;
  athleticism: number;
  defense: number;
  rebounding: number;
  bbiq: number;
  stamina: number;
  fatigueMultiplier: number;
} => {
  const composite = toCompositeAttributes(player);
  const shooting = getScaledAttribute(composite.shooting, leagueLevel);
  const finishing = getScaledAttribute(composite.finishing, leagueLevel);
  const vision = getScaledAttribute(composite.vision, leagueLevel);
  const handle = getScaledAttribute(composite.handle, leagueLevel);
  const athleticism = getScaledAttribute(composite.athleticism, leagueLevel);
  const defense = getScaledAttribute(composite.defense, leagueLevel);
  const rebounding = getScaledAttribute(composite.rebounding, leagueLevel);
  const bbiq = getScaledAttribute(composite.bbiq, leagueLevel);
  const stamina = getScaledAttribute(composite.stamina, leagueLevel);
  const fatigueMultiplier = getFatigueMultiplier(stamina, touchCounts[teamKey][playerIndex]);

  return {
    shooting: shooting * fatigueMultiplier,
    finishing: finishing * fatigueMultiplier,
    vision: vision * fatigueMultiplier,
    handle: handle * fatigueMultiplier,
    athleticism: athleticism * fatigueMultiplier,
    defense: defense * fatigueMultiplier,
    rebounding: rebounding * fatigueMultiplier,
    bbiq: bbiq * fatigueMultiplier,
    stamina,
    fatigueMultiplier,
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
  state: PossessionState,
  rng: () => number,
): PossessionAction => {
  const scoreDiff = Math.abs(getScoreDiff(state));
  const isLateGame = state.secondsRemaining <= 120;
  const isHighPressure = isLateGame && scoreDiff <= 8;
  const baseWeights: Record<PossessionAction, number> = tuning.baseActionWeights;
  const archetypeAdjust = tuning.archetypeWeightAdjustments[ballHandler.archetype];
  const pressureAdjust: Record<PossessionAction, number> = isHighPressure
    ? tuning.highPressureAdjustments
    : tuning.lowPressureAdjustments;

  return weightedPick(
    (["pass", "shoot", "dribble"] as PossessionAction[]).map((action) => ({
      key: action,
      weight: clamp(baseWeights[action] + archetypeAdjust[action] + pressureAdjust[action], 1, 99),
    })),
    rng,
  );
};

const pickBallHandlerIndex = (
  offenseTeam: Team,
  teamKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = offenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
    const baseWeight = impact.handle * 0.45 + impact.bbiq * 0.35 + impact.vision * 0.2;
    const archetypePenalty = tuning.ballHandlerArchetypeMultipliers[player.archetype] ?? 1;
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight: baseWeight * archetypePenalty,
    };
  });
  return weightedPick(weighted, rng);
};

const pickDefenderIndex = (
  defenseTeam: Team,
  teamKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = defenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight: impact.defense * 0.6 + impact.athleticism * 0.4,
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
      return {
        key: index as 0 | 1 | 2 | 3 | 4,
        weight: impact.shooting * 0.5 + impact.finishing * 0.5,
      };
    });
  return weightedPick(weighted, rng);
};

const pickRebounderIndex = (
  team: Team,
  teamKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = team.roster.map((player, index) => {
    const impact = getPlayerImpact(player, teamKey, index, touchCounts, leagueLevel);
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight: impact.rebounding * 0.7 + impact.athleticism * 0.3,
    };
  });
  return weightedPick(weighted, rng);
};

const pickShotZone = (
  action: PossessionAction,
  shooterImpact: ReturnType<typeof getPlayerImpact>,
  rng: () => number,
): ShotZone => {
  const base = tuning.shotZoneByAction[action];
  const suppressThree = shooterImpact.shooting < tuning.lowShootingThreeSuppressionThreshold;
  const shootingTilt = (shooterImpact.shooting - 50) * tuning.shotZoneSkillWeight;
  const finishingTilt = (shooterImpact.finishing - 50) * tuning.shotZoneSkillWeight;
  const bbiqTilt = (shooterImpact.bbiq - 50) * tuning.shotZoneBbiqWeight;
  const fatigueTilt = (shooterImpact.fatigueMultiplier - 1) * 100 * tuning.shotZoneFatigueWeight;
  const entries: Array<{ key: ShotZone; weight: number }> = [
    {
      key: "midrange",
      weight: base.midrange + bbiqTilt * 0.3 - Math.abs(shootingTilt - finishingTilt) * 0.25,
    },
    {
      key: "rim",
      weight: base.rim + finishingTilt + bbiqTilt * 0.8 - fatigueTilt * 0.2,
    },
  ];

  if (!suppressThree) {
    entries.unshift({
      key: "three",
      weight: base.three + shootingTilt + bbiqTilt + fatigueTilt,
    });
  }

  return weightedPick(entries, rng);
};

const getTurnoverProbability = (
  ballHandlerImpact: ReturnType<typeof getPlayerImpact>,
  defenseTeam: Team,
  defenseKey: TeamSide,
  touchCounts: { home: [number, number, number, number, number]; away: [number, number, number, number, number] },
  leagueLevel: LeagueLevel,
): number => {
  const defenderPressure = average(defenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, defenseKey, index, touchCounts, leagueLevel);
    return impact.defense * 0.65 + impact.athleticism * 0.35;
  }));
  const ballSecurity = ballHandlerImpact.handle * 0.7 + ballHandlerImpact.bbiq * 0.3;

  return clamp(
    tuning.turnoverBase + (defenderPressure - ballSecurity) / tuning.turnoverDivisor,
    tuning.turnoverMin,
    tuning.turnoverMax,
  );
};

const getStealProbability = (
  defenderImpact: ReturnType<typeof getPlayerImpact>,
  ballHandlerImpact: ReturnType<typeof getPlayerImpact>,
): number =>
  clamp(
    tuning.stealBase +
      (defenderImpact.defense * 0.65 + defenderImpact.athleticism * 0.35 - ballHandlerImpact.handle) /
        tuning.stealDivisor,
    tuning.stealMin,
    tuning.stealMax,
  );

const getAssistProbability = (
  passerImpact: ReturnType<typeof getPlayerImpact>,
  shooterImpact: ReturnType<typeof getPlayerImpact>,
): number =>
  clamp(
    tuning.assistBase +
      (passerImpact.vision * 0.7 + passerImpact.bbiq * 0.3 - shooterImpact.bbiq * 0.15) / tuning.assistDivisor,
    tuning.assistMin,
    tuning.assistMax,
  );

const getBlockProbability = (
  defenderImpact: ReturnType<typeof getPlayerImpact>,
  shooterImpact: ReturnType<typeof getPlayerImpact>,
  shotZone: ShotZone,
): number => {
  if (shotZone === "three") {
    return clamp(tuning.blockBase * 0.35, tuning.blockMin, tuning.blockMax);
  }

  const defenderBlockValue = defenderImpact.defense * 0.55 + defenderImpact.athleticism * 0.45;
  const shooterReleaseValue = shooterImpact.finishing * (shotZone === "rim" ? 0.7 : 0.45) + shooterImpact.shooting * 0.35;

  return clamp(
    tuning.blockBase + (defenderBlockValue - shooterReleaseValue) / tuning.blockDivisor,
    tuning.blockMin,
    tuning.blockMax,
  );
};

const getShotMakeProbability = (
  shotZone: ShotZone,
  shooterImpact: ReturnType<typeof getPlayerImpact>,
  defenderImpact: ReturnType<typeof getPlayerImpact>,
  state: PossessionState,
  offenseKey: TeamSide,
  rng: () => number,
): number => {
  const zoneBase =
    shotZone === "three"
      ? tuning.threeShotMakeBase
      : shotZone === "midrange"
        ? tuning.midrangeShotMakeBase
        : tuning.rimShotMakeBase;

  const offenseValue =
    shotZone === "three"
      ? shooterImpact.shooting * 0.85 + shooterImpact.bbiq * 0.15
      : shotZone === "midrange"
        ? shooterImpact.shooting * 0.6 + shooterImpact.finishing * 0.2 + shooterImpact.bbiq * 0.2
        : shooterImpact.finishing * 0.65 + shooterImpact.athleticism * 0.25 + shooterImpact.bbiq * 0.1;

  const defenseValue = defenderImpact.defense * 0.7 + defenderImpact.athleticism * 0.3;
  const variance = getDecisionVariance(shooterImpact.bbiq, rng);
  const fatiguePenalty = (1 - shooterImpact.fatigueMultiplier) * 0.2;
  const offenseEdge = (offenseValue - defenseValue) / tuning.shotOffenseDivisor;

  const baseProbability = clamp(
    zoneBase + tuning.shotMakeBase + offenseEdge - defenseValue / tuning.shotContestDivisor + variance / 180 - fatiguePenalty,
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
      return impact.rebounding * 0.7 + impact.athleticism * 0.3;
    }),
  );

  const defenseReb = average(
    defenseTeam.roster.map((player, index) => {
      const impact = getPlayerImpact(player, defenseKey, index, touchCounts, leagueLevel);
      return impact.rebounding * 0.75 + impact.bbiq * 0.25;
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
  const offenseValue = shooterImpact.finishing * 0.65 + shooterImpact.athleticism * 0.35;
  const defenseValue = defenderImpact.defense * 0.65 + defenderImpact.rebounding * 0.35;
  const variance = getDecisionVariance(shooterImpact.bbiq, rng);

  return clamp(
    tuning.putbackBase + (offenseValue - defenseValue) / tuning.putbackDivisor + variance / 120,
    tuning.putbackMin,
    tuning.putbackMax,
  );
};

const flipPossession = (
  state: PossessionState,
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
  homeTouches: [0, 0, 0, 0, 0],
  awayTouches: [0, 0, 0, 0, 0],
  score,
  homeStreak: streaks.homeStreak,
  awayStreak: streaks.awayStreak,
});

export const simulatePossession = (
  context: MatchContext,
  state: PossessionState,
  leagueLevel: LeagueLevel,
  rng: () => number,
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

  const ballHandlerIndex = pickBallHandlerIndex(offenseTeam, state.offenseKey, touchCounts, leagueLevel, rng);
  incrementTouch(state.offenseKey, ballHandlerIndex);
  const ballHandler = getPlayerByIndex(offenseTeam, ballHandlerIndex);
  const ballHandlerImpact = getPlayerImpact(ballHandler, state.offenseKey, ballHandlerIndex, touchCounts, leagueLevel);

  pushTrace(trace, "DECIDE_ACTION");
  const action = chooseAction(ballHandler, state, rng);

  pushTrace(trace, "RESOLVE_TURNOVER_PRESSURE");
  const primaryDefenderIndex = pickDefenderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, rng);
  incrementTouch(state.defenseKey, primaryDefenderIndex);
  const primaryDefender = getPlayerByIndex(defenseTeam, primaryDefenderIndex);
  const primaryDefenderImpact = getPlayerImpact(
    primaryDefender,
    state.defenseKey,
    primaryDefenderIndex,
    touchCounts,
    leagueLevel,
  );

  const turnoverProb = applyHomeCourtToProbability(
    getTurnoverProbability(ballHandlerImpact, defenseTeam, state.defenseKey, touchCounts, leagueLevel),
    state.offenseKey,
    "turnover",
  );
  if (rng() <= turnoverProb) {
    const steal = rng() <= getStealProbability(primaryDefenderImpact, ballHandlerImpact);
    const elapsedSeconds = getElapsedByEvent(steal ? "steal" : "turnover", rng);
    const nextBallHandlerIndex = pickBallHandlerIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, rng);

    const nextState = flipPossession(
      state,
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
  let assisterIndex: number | undefined;
  let assisted = false;

  if (action === "pass") {
    const receiverIndex = pickAssistReceiverIndex(offenseTeam, state.offenseKey, ballHandlerIndex, touchCounts, leagueLevel, rng);
    incrementTouch(state.offenseKey, receiverIndex);
    shooterIndex = receiverIndex;
    const receiverImpact = getPlayerImpact(
      getPlayerByIndex(offenseTeam, receiverIndex),
      state.offenseKey,
      receiverIndex,
      touchCounts,
      leagueLevel,
    );
    const assistProb = getAssistProbability(ballHandlerImpact, receiverImpact);
    assisted = rng() <= assistProb;
    if (assisted) {
      assisterIndex = ballHandlerIndex;
    }
  }

  const shooter = getPlayerByIndex(offenseTeam, shooterIndex);
  incrementTouch(state.offenseKey, shooterIndex);
  const shooterImpact = getPlayerImpact(shooter, state.offenseKey, shooterIndex, touchCounts, leagueLevel);
  const shotZone = pickShotZone(action, shooterImpact, rng);

  pushTrace(trace, "RESOLVE_SHOT_CONTEST");
  const shotDefenderIndex = pickDefenderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, rng);
  incrementTouch(state.defenseKey, shotDefenderIndex);
  const shotDefender = getPlayerByIndex(defenseTeam, shotDefenderIndex);
  const shotDefenderImpact = getPlayerImpact(
    shotDefender,
    state.defenseKey,
    shotDefenderIndex,
    touchCounts,
    leagueLevel,
  );

  const blockProb = getBlockProbability(shotDefenderImpact, shooterImpact, shotZone);
  const blocked = rng() <= blockProb;

  let madeShot = false;
  let points: 0 | 2 | 3 = 0;
  let eventType: PossessionEventType = "miss";
  let offensiveRebound = false;
  let rebounderIndex: number | undefined;
  let putbackAttempted = false;
  let score = state.score;

  if (!blocked) {
    const makeProb = applyHomeCourtToProbability(
      getShotMakeProbability(shotZone, shooterImpact, shotDefenderImpact, state, state.offenseKey, rng),
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
      rebounderIndex = pickRebounderIndex(offenseTeam, state.offenseKey, touchCounts, leagueLevel, rng);
      incrementTouch(state.offenseKey, rebounderIndex);
      pushTrace(trace, "PUTBACK_ATTEMPT");
      putbackAttempted = true;

      const rebounderImpact = getPlayerImpact(
        getPlayerByIndex(offenseTeam, rebounderIndex),
        state.offenseKey,
        rebounderIndex,
        touchCounts,
        leagueLevel,
      );
      const rimDefenderIndex = pickDefenderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, rng);
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
      assisted = false;
      assisterIndex = undefined;

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
      eventType = eventType === "putback_miss" ? "def_reb" : eventType;
      if (eventType === "def_reb") {
        rebounderIndex = pickRebounderIndex(defenseTeam, state.defenseKey, touchCounts, leagueLevel, rng);
        incrementTouch(state.defenseKey, rebounderIndex);
      }
    }
  }

  if (!madeShot || action !== "pass" || assisterIndex === undefined) {
    assisted = false;
    assisterIndex = undefined;
  }

  const elapsedSeconds = getElapsedByEvent(eventType, rng);
  const nextOffenseTeam = getTeam(context, state.defenseKey);
  const nextBallHandlerIndex = pickBallHandlerIndex(nextOffenseTeam, state.defenseKey, touchCounts, leagueLevel, rng);
  const nextState = flipPossession(
    state,
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
    Math.round(
      average(
        team.roster.map((player) =>
          average([
            getScaledAttribute(toCompositeAttributes(player).shooting, leagueLevel),
            getScaledAttribute(toCompositeAttributes(player).finishing, leagueLevel),
            getScaledAttribute(toCompositeAttributes(player).vision, leagueLevel),
            getScaledAttribute(toCompositeAttributes(player).handle, leagueLevel),
            getScaledAttribute(toCompositeAttributes(player).athleticism, leagueLevel),
            getScaledAttribute(toCompositeAttributes(player).defense, leagueLevel),
            getScaledAttribute(toCompositeAttributes(player).rebounding, leagueLevel),
            getScaledAttribute(toCompositeAttributes(player).bbiq, leagueLevel),
            getScaledAttribute(toCompositeAttributes(player).stamina, leagueLevel),
          ]),
        ),
      ),
    );

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
