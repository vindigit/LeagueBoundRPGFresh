"use strict";

const tuning = require("./matchEngineTuning");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

const createSeededRng = (seed) => {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const getPlayerOvr = (player) =>
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

const calculateTeamOvr = (team) => Math.round(average(team.roster.map(getPlayerOvr)));

const weightedChoice = (options, rng) => {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  const target = rng() * total;
  let accumulator = 0;
  for (const option of options) {
    accumulator += option.weight;
    if (target <= accumulator) return option.action;
  }
  return options[options.length - 1].action;
};

const chooseAction = (ballHandler, state, rng) => {
  const scoreDiff = Math.abs(state.score.home - state.score.away);
  const isHighPressure = state.secondsRemaining <= 120 && scoreDiff <= 8;
  const baseWeights = tuning.baseActionWeights;
  const archetypeAdjust = tuning.archetypeWeightAdjustments[ballHandler.archetype];
  const pressureAdjust = isHighPressure ? tuning.highPressureAdjustments : tuning.lowPressureAdjustments;
  const options = ["pass", "shoot", "dribble"].map((action) => ({
    action,
    weight: clamp(baseWeights[action] + archetypeAdjust[action] + pressureAdjust[action], 5, 95),
  }));
  return weightedChoice(options, rng);
};

const getDefenseValue = (defenseTeam) =>
  average(defenseTeam.roster.map((player) => average([player.attributes.defense, player.attributes.bbiq])));

const getEnergyModifier = (stamina) => (stamina - 50) * tuning.energyModifierScale;
const getBbiqModifier = (bbiq) => (bbiq - 50) * tuning.bbiqModifierScale;
const getVariance = (bbiq, rng) => {
  const spread = tuning.varianceBaseSpread + ((99 - bbiq) / 99) * tuning.varianceBbiqSpread;
  return (rng() * 2 - 1) * spread;
};
const getShotMakeProbability = (shotScore) =>
  clamp(
    tuning.shotMakeBase + shotScore / tuning.shotMakeDivisor,
    tuning.shotMakeMin,
    tuning.shotMakeMax,
  );
const getFailureProbability = (actionScore) =>
  clamp(
    tuning.failureBase - actionScore / tuning.failureDivisor,
    tuning.failureMin,
    tuning.failureMax,
  );

const getShotPoints = (shooter, rng) => {
  const threePointChance = clamp(
    (shooter.attributes.shooting - tuning.threePointOffset) / tuning.threePointDivisor,
    tuning.threePointMin,
    tuning.threePointMax,
  );
  return rng() <= threePointChance ? 3 : 2;
};

const getRandomTeammateIndex = (ballHandlerIndex, rng) => {
  const teammates = [0, 1, 2, 3, 4].filter((idx) => idx !== ballHandlerIndex);
  return teammates[Math.floor(rng() * teammates.length)];
};

const initializePossession = (home, away, rng) => {
  const homeOvr = calculateTeamOvr(home);
  const awayOvr = calculateTeamOvr(away);
  const homeControlChance = clamp(homeOvr / (homeOvr + awayOvr), 0.35, 0.65);
  const homeHasBall = rng() <= homeControlChance;
  return {
    possessionIndex: 1,
    secondsRemaining: 20 * 60,
    offenseKey: homeHasBall ? "home" : "away",
    score: { home: 0, away: 0 },
    ballHandlerIndex: Math.floor(rng() * 5),
  };
};

const simulate = (home, away, totalPossessions, seed) => {
  const rng = createSeededRng(seed);
  let state = initializePossession(home, away, rng);
  const metrics = {
    possessions: 0,
    fga: 0,
    fgm: 0,
    assists: 0,
    turnoverLikeFailures: 0,
    scoreByCheckpoint: [],
  };

  for (let i = 0; i < totalPossessions && state.secondsRemaining > 0; i += 1) {
    const offense = state.offenseKey === "home" ? home : away;
    const defense = state.offenseKey === "home" ? away : home;
    const ballHandler = offense.roster[state.ballHandlerIndex];
    const defenseValue = getDefenseValue(defense);
    const action = chooseAction(ballHandler, state, rng);

    let madeShot = false;
    let points = 0;
    let assisted = false;
    let turnoverLikeFailure = false;

    if (action === "shoot") {
      const shotScore =
        average([ballHandler.attributes.shooting, ballHandler.attributes.finishing]) +
        getEnergyModifier(ballHandler.attributes.stamina) +
        getBbiqModifier(ballHandler.attributes.bbiq) -
        defenseValue -
        getVariance(ballHandler.attributes.bbiq, rng);
      madeShot = rng() <= getShotMakeProbability(shotScore);
      if (madeShot) points = getShotPoints(ballHandler, rng);
    } else if (action === "pass") {
      const receiver = offense.roster[getRandomTeammateIndex(state.ballHandlerIndex, rng)];
      const actionScore =
        average([ballHandler.attributes.vision, ballHandler.attributes.handle, ballHandler.attributes.bbiq]) +
        getEnergyModifier(ballHandler.attributes.stamina) -
        defenseValue -
        getVariance(ballHandler.attributes.bbiq, rng);
      const passFailure = rng() <= getFailureProbability(actionScore);
      if (passFailure) {
        turnoverLikeFailure = true;
      } else {
        const receiverShotScore =
          average([receiver.attributes.shooting, receiver.attributes.finishing]) +
          getEnergyModifier(receiver.attributes.stamina) +
          getBbiqModifier(receiver.attributes.bbiq) -
          defenseValue -
          getVariance(receiver.attributes.bbiq, rng);
        madeShot = rng() <= getShotMakeProbability(receiverShotScore);
        assisted = madeShot;
        if (madeShot) points = getShotPoints(receiver, rng);
      }
    } else {
      const actionScore =
        average([ballHandler.attributes.handle, ballHandler.attributes.athleticism, ballHandler.attributes.bbiq]) +
        getEnergyModifier(ballHandler.attributes.stamina) -
        defenseValue -
        getVariance(ballHandler.attributes.bbiq, rng);
      const dribbleFailure = rng() <= getFailureProbability(actionScore);
      if (dribbleFailure) {
        turnoverLikeFailure = true;
      } else {
        const finishScore =
          average([ballHandler.attributes.finishing, ballHandler.attributes.athleticism]) +
          getEnergyModifier(ballHandler.attributes.stamina) +
          getBbiqModifier(ballHandler.attributes.bbiq) -
          defenseValue -
          getVariance(ballHandler.attributes.bbiq, rng);
        madeShot = rng() <= getShotMakeProbability(finishScore);
        if (madeShot) points = 2;
      }
    }

    metrics.possessions += 1;
    if (!turnoverLikeFailure) metrics.fga += 1;
    if (madeShot) metrics.fgm += 1;
    if (assisted) metrics.assists += 1;
    if (turnoverLikeFailure) metrics.turnoverLikeFailures += 1;

    if (points > 0) {
      if (state.offenseKey === "home") state.score.home += points;
      else state.score.away += points;
    }

    if ((i + 1) % 20 === 0) {
      metrics.scoreByCheckpoint.push(`P${i + 1}: HOME ${state.score.home} - AWAY ${state.score.away}`);
    }

    const elapsedSeconds = Math.floor(
      tuning.minEventSeconds + rng() * (tuning.maxEventSeconds - tuning.minEventSeconds + 1),
    );
    state.secondsRemaining = Math.max(0, state.secondsRemaining - elapsedSeconds);
    state.possessionIndex += 1;
    state.offenseKey = state.offenseKey === "home" ? "away" : "home";
    state.ballHandlerIndex = Math.floor(rng() * 5);
  }

  return { state, metrics };
};

const mkPlayer = (id, name, archetype, position, attrs) => ({
  id,
  name,
  age: 19,
  BankBalance: 0,
  Morale: 50,
  Position: position,
  bankBalance: 0,
  morale: 50,
  position,
  archetype,
  attributes: attrs,
  gameStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 },
});

const home = {
  name: "Metro State",
  roster: [
    mkPlayer("h1", "A1", "Playmaker", "PG", { shooting: 70, finishing: 66, vision: 82, handle: 84, athleticism: 71, defense: 58, rebounding: 44, bbiq: 78, stamina: 80 }),
    mkPlayer("h2", "A2", "Sharpshooter", "SG", { shooting: 85, finishing: 61, vision: 58, handle: 63, athleticism: 64, defense: 54, rebounding: 47, bbiq: 70, stamina: 76 }),
    mkPlayer("h3", "A3", "Slasher", "SF", { shooting: 63, finishing: 79, vision: 55, handle: 72, athleticism: 81, defense: 66, rebounding: 60, bbiq: 68, stamina: 79 }),
    mkPlayer("h4", "A4", "Stretch Big", "PF", { shooting: 77, finishing: 68, vision: 57, handle: 48, athleticism: 60, defense: 70, rebounding: 74, bbiq: 71, stamina: 74 }),
    mkPlayer("h5", "A5", "Paint Beast", "C", { shooting: 52, finishing: 83, vision: 46, handle: 41, athleticism: 65, defense: 79, rebounding: 86, bbiq: 69, stamina: 72 }),
  ],
  teamOvr: 0,
};

const away = {
  name: "Central Tech",
  roster: [
    mkPlayer("a1", "B1", "Playmaker", "PG", { shooting: 68, finishing: 64, vision: 80, handle: 81, athleticism: 70, defense: 57, rebounding: 43, bbiq: 76, stamina: 79 }),
    mkPlayer("a2", "B2", "Sharpshooter", "SG", { shooting: 82, finishing: 59, vision: 55, handle: 61, athleticism: 63, defense: 53, rebounding: 45, bbiq: 68, stamina: 75 }),
    mkPlayer("a3", "B3", "Lockdown Defender", "SF", { shooting: 61, finishing: 72, vision: 52, handle: 67, athleticism: 77, defense: 81, rebounding: 64, bbiq: 72, stamina: 81 }),
    mkPlayer("a4", "B4", "Stretch Big", "PF", { shooting: 74, finishing: 66, vision: 55, handle: 45, athleticism: 59, defense: 72, rebounding: 76, bbiq: 70, stamina: 73 }),
    mkPlayer("a5", "B5", "Paint Beast", "C", { shooting: 50, finishing: 81, vision: 43, handle: 39, athleticism: 63, defense: 80, rebounding: 85, bbiq: 68, stamina: 71 }),
  ],
  teamOvr: 0,
};

const runAndReport = (seed) => {
  const { state, metrics } = simulate(home, away, 120, seed);
  const fgPct = metrics.fga > 0 ? (metrics.fgm / metrics.fga) * 100 : 0;
  const assistRate = metrics.fgm > 0 ? (metrics.assists / metrics.fgm) * 100 : 0;
  const tovRate = metrics.possessions > 0 ? (metrics.turnoverLikeFailures / metrics.possessions) * 100 : 0;
  return { seed, state, metrics, fgPct, assistRate, tovRate };
};

const main = async () => {
  const setupModule = await import("./scripts/setupNodeVerificationEnv.ts");
  const setupNodeVerificationEnv =
    setupModule.setupNodeVerificationEnv ?? setupModule.default?.setupNodeVerificationEnv;
  if (typeof setupNodeVerificationEnv !== "function") {
    throw new Error("Failed to load setupNodeVerificationEnv.");
  }
  await setupNodeVerificationEnv();

  const primary = runAndReport(20260214);
  console.log("=== Match Engine Verification (Seeded) ===");
  console.log(`Possessions Simulated: ${primary.metrics.possessions}`);
  console.log(`Final Score: HOME ${primary.state.score.home} - AWAY ${primary.state.score.away}`);
  console.log(`FGA/FGM: ${primary.metrics.fga}/${primary.metrics.fgm} (${primary.fgPct.toFixed(1)}%)`);
  console.log(`Assist Rate: ${primary.assistRate.toFixed(1)}%`);
  console.log(`Turnover-like Failure Rate: ${primary.tovRate.toFixed(1)}%`);
  console.log("Score Progression:");
  for (const line of primary.metrics.scoreByCheckpoint) console.log(`- ${line}`);

  const seeds = [20260210, 20260211, 20260212, 20260213, 20260214, 20260215, 20260216, 20260217, 20260218, 20260219];
  const summaries = seeds.map(runAndReport);
  const avgFg = summaries.reduce((sum, item) => sum + item.fgPct, 0) / summaries.length;
  const avgAssist = summaries.reduce((sum, item) => sum + item.assistRate, 0) / summaries.length;
  const avgTov = summaries.reduce((sum, item) => sum + item.tovRate, 0) / summaries.length;
  const avgPossessions = summaries.reduce((sum, item) => sum + item.metrics.possessions, 0) / summaries.length;
  const avgHome = summaries.reduce((sum, item) => sum + item.state.score.home, 0) / summaries.length;
  const avgAway = summaries.reduce((sum, item) => sum + item.state.score.away, 0) / summaries.length;

  console.log("=== Multi-Seed Averages (10 runs) ===");
  console.log(`Avg Possessions: ${avgPossessions.toFixed(1)}`);
  console.log(`Avg FG%: ${avgFg.toFixed(1)}%`);
  console.log(`Avg Assist Rate: ${avgAssist.toFixed(1)}%`);
  console.log(`Avg Turnover-like Failure Rate: ${avgTov.toFixed(1)}%`);
  console.log(`Avg Final Score: HOME ${avgHome.toFixed(1)} - AWAY ${avgAway.toFixed(1)}`);
};

main().catch((error) => {
  console.error("Match engine verification failed:", error);
  process.exitCode = 1;
});
