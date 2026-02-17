import type { Player } from "./types/player";
import type { Team } from "./types/team";
import { LEAGUE_MODIFIERS } from "./constants/leagueScaling";
import { LeagueLevel } from "./types/career";
import tuning from "./matchEngineTuning.js";

export type PossessionAction = "pass" | "shoot" | "dribble";

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
}

export interface MatchContext {
  home: Team;
  away: Team;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

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

const getScoreDiff = (state: PossessionState): number => state.score.home - state.score.away;

const weightedChoice = (
  options: Array<{ action: PossessionAction; weight: number }>,
  rng: () => number,
): PossessionAction => {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  const target = rng() * total;
  let accumulator = 0;
  for (const option of options) {
    accumulator += option.weight;
    if (target <= accumulator) {
      return option.action;
    }
  }
  return options[options.length - 1].action;
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

  const options: Array<{ action: PossessionAction; weight: number }> = ([
    "pass",
    "shoot",
    "dribble",
  ] as PossessionAction[]).map((action) => ({
    action,
    weight: clamp(baseWeights[action] + archetypeAdjust[action] + pressureAdjust[action], 5, 95),
  }));

  return weightedChoice(options, rng);
};

const getDefenseValue = (defenseTeam: Team, leagueLevel: LeagueLevel): number =>
  average(
    defenseTeam.roster.map((player) => {
      // Preserve original equal weighting while applying league efficiency scaling.
      const scaledDefense = getScaledAttribute(player.attributes.defense, leagueLevel);
      const scaledBbiq = getScaledAttribute(player.attributes.bbiq, leagueLevel);
      return average([scaledDefense, scaledBbiq]);
    }),
  );

const getEnergyModifier = (stamina: number): number => (stamina - 50) * tuning.energyModifierScale;
const getBbiqModifier = (bbiq: number): number => (bbiq - 50) * tuning.bbiqModifierScale;

const getVariance = (bbiq: number, rng: () => number): number => {
  // Lower BBIQ means larger uncertainty ("fog of war").
  const spread = tuning.varianceBaseSpread + ((99 - bbiq) / 99) * tuning.varianceBbiqSpread;
  return (rng() * 2 - 1) * spread;
};

const getShotMakeProbability = (shotScore: number): number =>
  clamp(
    tuning.shotMakeBase + shotScore / tuning.shotMakeDivisor,
    tuning.shotMakeMin,
    tuning.shotMakeMax,
  );

const getFailureProbability = (actionScore: number): number =>
  clamp(
    tuning.failureBase - actionScore / tuning.failureDivisor,
    tuning.failureMin,
    tuning.failureMax,
  );

const getOffenseAndDefense = (
  context: MatchContext,
  state: PossessionState,
): { offenseTeam: Team; defenseTeam: Team } =>
  state.offenseKey === "home"
    ? { offenseTeam: context.home, defenseTeam: context.away }
    : { offenseTeam: context.away, defenseTeam: context.home };

const getRandomTeammateIndex = (ballHandlerIndex: number, rng: () => number): number => {
  const teammates = [0, 1, 2, 3, 4].filter((index) => index !== ballHandlerIndex);
  const idx = Math.floor(rng() * teammates.length);
  return teammates[idx];
};

const getShotPoints = (shooter: Player, leagueLevel: LeagueLevel, rng: () => number): 2 | 3 => {
  const scaledShooting = getScaledAttribute(shooter.attributes.shooting, leagueLevel);
  const threePointChance = clamp(
    (scaledShooting - tuning.threePointOffset) / tuning.threePointDivisor,
    tuning.threePointMin,
    tuning.threePointMax,
  );
  return rng() <= threePointChance ? 3 : 2;
};

const swapPossession = (state: PossessionState, elapsedSeconds: number): PossessionState => ({
  ...state,
  possessionIndex: state.possessionIndex + 1,
  secondsRemaining: Math.max(0, state.secondsRemaining - elapsedSeconds),
  offenseKey: state.offenseKey === "home" ? "away" : "home",
  defenseKey: state.offenseKey,
  ballHandlerIndex: state.ballHandlerIndex,
});

const addPoints = (state: PossessionState, offenseKey: "home" | "away", points: 2 | 3): MatchScore => {
  if (offenseKey === "home") {
    return { ...state.score, home: state.score.home + points };
  }
  return { ...state.score, away: state.score.away + points };
};

export const simulatePossession = (
  context: MatchContext,
  state: PossessionState,
  leagueLevel: LeagueLevel,
  rng: () => number,
): PossessionResult => {
  const { offenseTeam, defenseTeam } = getOffenseAndDefense(context, state);
  const ballHandler = offenseTeam.roster[state.ballHandlerIndex];
  const defenseValue = getDefenseValue(defenseTeam, leagueLevel);
  const action = chooseAction(ballHandler, state, rng);

  const ballHandlerShooting = getScaledAttribute(ballHandler.attributes.shooting, leagueLevel);
  const ballHandlerFinishing = getScaledAttribute(ballHandler.attributes.finishing, leagueLevel);
  const ballHandlerVision = getScaledAttribute(ballHandler.attributes.vision, leagueLevel);
  const ballHandlerHandle = getScaledAttribute(ballHandler.attributes.handle, leagueLevel);
  const ballHandlerAthleticism = getScaledAttribute(ballHandler.attributes.athleticism, leagueLevel);
  const ballHandlerBbiq = getScaledAttribute(ballHandler.attributes.bbiq, leagueLevel);
  const ballHandlerStamina = getScaledAttribute(ballHandler.attributes.stamina, leagueLevel);

  let madeShot = false;
  let points: 0 | 2 | 3 = 0;
  let assisted = false;
  let turnoverLikeFailure = false;

  if (action === "shoot") {
    const shotScore =
      average([ballHandlerShooting, ballHandlerFinishing]) +
      getEnergyModifier(ballHandlerStamina) +
      getBbiqModifier(ballHandlerBbiq) -
      defenseValue -
      getVariance(ballHandlerBbiq, rng);

    madeShot = rng() <= getShotMakeProbability(shotScore);
    if (madeShot) {
      points = getShotPoints(ballHandler, leagueLevel, rng);
    }
  } else if (action === "pass") {
    const targetIndex = getRandomTeammateIndex(state.ballHandlerIndex, rng);
    const receiver = offenseTeam.roster[targetIndex];
    const actionScore =
      average([ballHandlerVision, ballHandlerHandle, ballHandlerBbiq]) +
      getEnergyModifier(ballHandlerStamina) +
      getBbiqModifier(ballHandlerBbiq) -
      defenseValue -
      getVariance(ballHandlerBbiq, rng);

    const passFailure = rng() <= getFailureProbability(actionScore);
    if (passFailure) {
      turnoverLikeFailure = true;
    } else {
      const receiverShooting = getScaledAttribute(receiver.attributes.shooting, leagueLevel);
      const receiverFinishing = getScaledAttribute(receiver.attributes.finishing, leagueLevel);
      const receiverStamina = getScaledAttribute(receiver.attributes.stamina, leagueLevel);
      const receiverBbiq = getScaledAttribute(receiver.attributes.bbiq, leagueLevel);
      const receiverShotScore =
        average([receiverShooting, receiverFinishing]) +
        getEnergyModifier(receiverStamina) +
        getBbiqModifier(receiverBbiq) -
        defenseValue -
        getVariance(receiverBbiq, rng);

      madeShot = rng() <= getShotMakeProbability(receiverShotScore);
      assisted = madeShot;
      if (madeShot) {
        points = getShotPoints(receiver, leagueLevel, rng);
      }
    }
  } else {
    const actionScore =
      average([ballHandlerHandle, ballHandlerAthleticism, ballHandlerBbiq]) +
      getEnergyModifier(ballHandlerStamina) -
      defenseValue -
      getVariance(ballHandlerBbiq, rng);

    const dribbleFailure = rng() <= getFailureProbability(actionScore);
    if (dribbleFailure) {
      turnoverLikeFailure = true;
    } else {
      const finishScore =
        average([ballHandlerFinishing, ballHandlerAthleticism]) +
        getEnergyModifier(ballHandlerStamina) +
        getBbiqModifier(ballHandlerBbiq) -
        defenseValue -
        getVariance(ballHandlerBbiq, rng);
      madeShot = rng() <= getShotMakeProbability(finishScore);
      if (madeShot) {
        points = 2;
      }
    }
  }

  const elapsedSeconds = Math.floor(
    tuning.minEventSeconds + rng() * (tuning.maxEventSeconds - tuning.minEventSeconds + 1),
  );
  const updatedScore =
    points === 2 || points === 3 ? addPoints(state, state.offenseKey, points) : state.score;
  const nextState = swapPossession({ ...state, score: updatedScore }, elapsedSeconds);

  return {
    action,
    madeShot,
    points,
    assisted,
    turnoverLikeFailure,
    nextState,
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
    state = {
      ...result.nextState,
      ballHandlerIndex: Math.floor(rng() * 5),
    };
  }

  return { finalState: state, metrics };
};
