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
  score: MatchScore;
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
  average([
    player.attributes.shooting,
    player.attributes.finishing,
    player.attributes.vision,
    player.attributes.handle,
    player.attributes.athleticism,
    player.attributes.defense,
    player.attributes.rebounding,
    player.attributes.bbiq,
    player.attributes.stamina,
  ]);

export const calculateTeamOvr = (team: Team): number =>
  Math.round(average(team.roster.map(getPlayerOvr)));

const getFatigueMultiplier = (stamina: number, possessionIndex: number): number => {
  const staminaResistance = (stamina - tuning.fatigueStaminaOffset) / 100;
  const decay = possessionIndex * tuning.fatiguePossessionScale * (1 - staminaResistance);
  return clamp(1 - decay, tuning.fatigueMinMultiplier, tuning.fatigueMaxMultiplier);
};

const getDecisionVariance = (bbiq: number, rng: () => number): number => {
  const spread = tuning.decisionVarianceBase + ((99 - bbiq) / 99) * tuning.decisionVarianceBbiqScale;
  return (rng() * 2 - 1) * spread;
};

const getPlayerImpact = (
  player: Player,
  state: PossessionState,
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
  const shooting = getScaledAttribute(player.attributes.shooting, leagueLevel);
  const finishing = getScaledAttribute(player.attributes.finishing, leagueLevel);
  const vision = getScaledAttribute(player.attributes.vision, leagueLevel);
  const handle = getScaledAttribute(player.attributes.handle, leagueLevel);
  const athleticism = getScaledAttribute(player.attributes.athleticism, leagueLevel);
  const defense = getScaledAttribute(player.attributes.defense, leagueLevel);
  const rebounding = getScaledAttribute(player.attributes.rebounding, leagueLevel);
  const bbiq = getScaledAttribute(player.attributes.bbiq, leagueLevel);
  const stamina = getScaledAttribute(player.attributes.stamina, leagueLevel);
  const fatigueMultiplier = getFatigueMultiplier(stamina, state.possessionIndex);

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
  state: PossessionState,
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = offenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, state, leagueLevel);
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight: impact.handle * 0.45 + impact.bbiq * 0.35 + impact.vision * 0.2,
    };
  });
  return weightedPick(weighted, rng);
};

const pickDefenderIndex = (
  defenseTeam: Team,
  state: PossessionState,
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = defenseTeam.roster.map((player, index) => {
    const impact = getPlayerImpact(player, state, leagueLevel);
    return {
      key: index as 0 | 1 | 2 | 3 | 4,
      weight: impact.defense * 0.6 + impact.athleticism * 0.4,
    };
  });
  return weightedPick(weighted, rng);
};

const pickAssistReceiverIndex = (
  offenseTeam: Team,
  ballHandlerIndex: number,
  state: PossessionState,
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = offenseTeam.roster
    .map((player, index) => ({ player, index }))
    .filter((entry) => entry.index !== ballHandlerIndex)
    .map(({ player, index }) => {
      const impact = getPlayerImpact(player, state, leagueLevel);
      return {
        key: index as 0 | 1 | 2 | 3 | 4,
        weight: impact.shooting * 0.5 + impact.finishing * 0.5,
      };
    });
  return weightedPick(weighted, rng);
};

const pickRebounderIndex = (
  team: Team,
  state: PossessionState,
  leagueLevel: LeagueLevel,
  rng: () => number,
): number => {
  const weighted = team.roster.map((player, index) => {
    const impact = getPlayerImpact(player, state, leagueLevel);
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
  const shootingTilt = (shooterImpact.shooting - 50) * tuning.shotZoneSkillWeight;
  const finishingTilt = (shooterImpact.finishing - 50) * tuning.shotZoneSkillWeight;
  const bbiqTilt = (shooterImpact.bbiq - 50) * tuning.shotZoneBbiqWeight;
  const fatigueTilt = (shooterImpact.fatigueMultiplier - 1) * 100 * tuning.shotZoneFatigueWeight;

  return weightedPick(
    [
      {
        key: "three",
        weight: base.three + shootingTilt + bbiqTilt + fatigueTilt,
      },
      {
        key: "midrange",
        weight: base.midrange + bbiqTilt * 0.3 - Math.abs(shootingTilt - finishingTilt) * 0.25,
      },
      {
        key: "rim",
        weight: base.rim + finishingTilt + bbiqTilt * 0.8 - fatigueTilt * 0.2,
      },
    ],
    rng,
  );
};

const getTurnoverProbability = (
  ballHandlerImpact: ReturnType<typeof getPlayerImpact>,
  defenseTeam: Team,
  state: PossessionState,
  leagueLevel: LeagueLevel,
): number => {
  const defenderPressure = average(
    defenseTeam.roster.map((player) => {
      const impact = getPlayerImpact(player, state, leagueLevel);
      return impact.defense * 0.65 + impact.athleticism * 0.35;
    }),
  );
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

  return clamp(
    zoneBase + tuning.shotMakeBase + offenseEdge - defenseValue / tuning.shotContestDivisor + variance / 180 - fatiguePenalty,
    tuning.shotMakeMin,
    tuning.shotMakeMax,
  );
};

const getOffensiveReboundProbability = (
  offenseTeam: Team,
  defenseTeam: Team,
  state: PossessionState,
  leagueLevel: LeagueLevel,
  shotZone: ShotZone,
): number => {
  const offenseReb = average(
    offenseTeam.roster.map((player) => {
      const impact = getPlayerImpact(player, state, leagueLevel);
      return impact.rebounding * 0.7 + impact.athleticism * 0.3;
    }),
  );

  const defenseReb = average(
    defenseTeam.roster.map((player) => {
      const impact = getPlayerImpact(player, state, leagueLevel);
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
): PossessionState => ({
  ...state,
  possessionIndex: state.possessionIndex + 1,
  secondsRemaining: Math.max(0, state.secondsRemaining - elapsedSeconds),
  offenseKey: state.offenseKey === "home" ? "away" : "home",
  defenseKey: state.offenseKey,
  ballHandlerIndex: nextBallHandlerIndex,
  score,
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

  const ballHandlerIndex = pickBallHandlerIndex(offenseTeam, state, leagueLevel, rng);
  const ballHandler = getPlayerByIndex(offenseTeam, ballHandlerIndex);
  const ballHandlerImpact = getPlayerImpact(ballHandler, state, leagueLevel);

  pushTrace(trace, "DECIDE_ACTION");
  const action = chooseAction(ballHandler, state, rng);

  pushTrace(trace, "RESOLVE_TURNOVER_PRESSURE");
  const primaryDefenderIndex = pickDefenderIndex(defenseTeam, state, leagueLevel, rng);
  const primaryDefender = getPlayerByIndex(defenseTeam, primaryDefenderIndex);
  const primaryDefenderImpact = getPlayerImpact(primaryDefender, state, leagueLevel);

  const turnoverProb = getTurnoverProbability(ballHandlerImpact, defenseTeam, state, leagueLevel);
  if (rng() <= turnoverProb) {
    const steal = rng() <= getStealProbability(primaryDefenderImpact, ballHandlerImpact);
    const elapsedSeconds = getElapsedByEvent(steal ? "steal" : "turnover", rng);
    const nextBallHandlerIndex = pickBallHandlerIndex(defenseTeam, state, leagueLevel, rng);

    const nextState = flipPossession(state, state.score, elapsedSeconds, nextBallHandlerIndex);

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
    const receiverIndex = pickAssistReceiverIndex(offenseTeam, ballHandlerIndex, state, leagueLevel, rng);
    shooterIndex = receiverIndex;
    const receiverImpact = getPlayerImpact(getPlayerByIndex(offenseTeam, receiverIndex), state, leagueLevel);
    const assistProb = getAssistProbability(ballHandlerImpact, receiverImpact);
    assisted = rng() <= assistProb;
    if (assisted) {
      assisterIndex = ballHandlerIndex;
    }
  }

  const shooter = getPlayerByIndex(offenseTeam, shooterIndex);
  const shooterImpact = getPlayerImpact(shooter, state, leagueLevel);
  const shotZone = pickShotZone(action, shooterImpact, rng);

  pushTrace(trace, "RESOLVE_SHOT_CONTEST");
  const shotDefenderIndex = pickDefenderIndex(defenseTeam, state, leagueLevel, rng);
  const shotDefender = getPlayerByIndex(defenseTeam, shotDefenderIndex);
  const shotDefenderImpact = getPlayerImpact(shotDefender, state, leagueLevel);

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
    const makeProb = getShotMakeProbability(shotZone, shooterImpact, shotDefenderImpact, rng);
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
    const orebProb = getOffensiveReboundProbability(offenseTeam, defenseTeam, state, leagueLevel, shotZone);
    offensiveRebound = rng() <= orebProb;

    if (offensiveRebound) {
      eventType = "off_reb";
      rebounderIndex = pickRebounderIndex(offenseTeam, state, leagueLevel, rng);
      pushTrace(trace, "PUTBACK_ATTEMPT");
      putbackAttempted = true;

      const rebounderImpact = getPlayerImpact(getPlayerByIndex(offenseTeam, rebounderIndex), state, leagueLevel);
      const rimDefenderIndex = pickDefenderIndex(defenseTeam, state, leagueLevel, rng);
      const rimDefenderImpact = getPlayerImpact(getPlayerByIndex(defenseTeam, rimDefenderIndex), state, leagueLevel);

      const putbackProb = getPutbackMakeProbability(rebounderImpact, rimDefenderImpact, rng);
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
        rebounderIndex = pickRebounderIndex(defenseTeam, state, leagueLevel, rng);
      }
    }
  }

  const elapsedSeconds = getElapsedByEvent(eventType, rng);
  const nextOffenseTeam = getTeam(context, state.defenseKey);
  const nextBallHandlerIndex = pickBallHandlerIndex(nextOffenseTeam, state, leagueLevel, rng);
  const nextState = flipPossession(state, score, elapsedSeconds, nextBallHandlerIndex);

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
            getScaledAttribute(player.attributes.shooting, leagueLevel),
            getScaledAttribute(player.attributes.finishing, leagueLevel),
            getScaledAttribute(player.attributes.vision, leagueLevel),
            getScaledAttribute(player.attributes.handle, leagueLevel),
            getScaledAttribute(player.attributes.athleticism, leagueLevel),
            getScaledAttribute(player.attributes.defense, leagueLevel),
            getScaledAttribute(player.attributes.rebounding, leagueLevel),
            getScaledAttribute(player.attributes.bbiq, leagueLevel),
            getScaledAttribute(player.attributes.stamina, leagueLevel),
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
    score: { home: 0, away: 0 },
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
    if (result.assisted) {
      metrics.assists += 1;
    }
    if (result.turnoverLikeFailure) {
      metrics.turnoverLikeFailures += 1;
    }
    state = result.nextState;
  }

  return { finalState: state, metrics };
};
