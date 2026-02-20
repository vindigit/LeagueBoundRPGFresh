"use strict";

const { register } = require("tsx/cjs/api");
register();

const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const createPlayer = (id, name, archetype, position, attrs) => ({
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

const createBaseContext = () => {
  const home = {
    name: "Metro State",
    teamOvr: 0,
    roster: [
      createPlayer("h1", "A1", "Playmaker", "PG", { shooting: 70, finishing: 66, vision: 82, handle: 84, athleticism: 71, defense: 58, rebounding: 44, bbiq: 78, stamina: 80 }),
      createPlayer("h2", "A2", "Sharpshooter", "SG", { shooting: 85, finishing: 61, vision: 58, handle: 63, athleticism: 64, defense: 54, rebounding: 47, bbiq: 70, stamina: 76 }),
      createPlayer("h3", "A3", "Slasher", "SF", { shooting: 63, finishing: 79, vision: 55, handle: 72, athleticism: 81, defense: 66, rebounding: 60, bbiq: 68, stamina: 79 }),
      createPlayer("h4", "A4", "Stretch Big", "PF", { shooting: 77, finishing: 68, vision: 57, handle: 48, athleticism: 60, defense: 70, rebounding: 74, bbiq: 71, stamina: 74 }),
      createPlayer("h5", "A5", "Paint Beast", "C", { shooting: 52, finishing: 83, vision: 46, handle: 41, athleticism: 65, defense: 79, rebounding: 86, bbiq: 69, stamina: 72 }),
    ],
  };

  const away = {
    name: "Central Tech",
    teamOvr: 0,
    roster: [
      createPlayer("a1", "B1", "Playmaker", "PG", { shooting: 68, finishing: 64, vision: 80, handle: 81, athleticism: 70, defense: 57, rebounding: 43, bbiq: 76, stamina: 79 }),
      createPlayer("a2", "B2", "Sharpshooter", "SG", { shooting: 82, finishing: 59, vision: 55, handle: 61, athleticism: 63, defense: 53, rebounding: 45, bbiq: 68, stamina: 75 }),
      createPlayer("a3", "B3", "Lockdown Defender", "SF", { shooting: 61, finishing: 72, vision: 52, handle: 67, athleticism: 77, defense: 81, rebounding: 64, bbiq: 72, stamina: 81 }),
      createPlayer("a4", "B4", "Stretch Big", "PF", { shooting: 74, finishing: 66, vision: 55, handle: 45, athleticism: 59, defense: 72, rebounding: 76, bbiq: 70, stamina: 73 }),
      createPlayer("a5", "B5", "Paint Beast", "C", { shooting: 50, finishing: 81, vision: 43, handle: 39, athleticism: 63, defense: 80, rebounding: 85, bbiq: 68, stamina: 71 }),
    ],
  };

  return { home, away };
};

const cloneContext = (context) => ({
  home: {
    ...context.home,
    roster: context.home.roster.map((player) => ({ ...player, attributes: { ...player.attributes }, gameStats: { ...player.gameStats } })),
  },
  away: {
    ...context.away,
    roster: context.away.roster.map((player) => ({ ...player, attributes: { ...player.attributes }, gameStats: { ...player.gameStats } })),
  },
});

const applyBoost = (context, teamKey, attrKey, boost) => {
  const target = context[teamKey];
  target.roster = target.roster.map((player) => {
    const current = player.attributes[attrKey];
    return {
      ...player,
      attributes: {
        ...player.attributes,
        [attrKey]: clamp(current + boost, 0, 99),
      },
    };
  });
};

const runSingleSimulation = ({ context, seed, leagueLevel, secondsRemaining, maxPossessions, engine }) => {
  const rng = engine.createSeededRng(seed);
  let state = engine.initializePossession(context, leagueLevel, rng, secondsRemaining);

  const metrics = {
    possessions: 0,
    fga: 0,
    fgm: 0,
    assists: 0,
    turnovers: 0,
    steals: 0,
    blocks: 0,
    threePa: 0,
    threePm: 0,
    midPa: 0,
    midPm: 0,
    rimPa: 0,
    rimPm: 0,
    offReb: 0,
    defReb: 0,
    putbackAttempts: 0,
    putbackMakes: 0,
    missedShots: 0,
    pointsHome: 0,
    pointsAway: 0,
    q4HomePoints: 0,
    q4AwayPoints: 0,
  };

  while (metrics.possessions < maxPossessions && state.secondsRemaining > 0) {
    const preScore = { ...state.score };
    const preSeconds = state.secondsRemaining;
    const result = engine.simulatePossession(context, state, leagueLevel, rng);

    metrics.possessions += 1;
    if (!result.turnoverLikeFailure) {
      metrics.fga += 1;
    }
    if (result.madeShot) {
      metrics.fgm += 1;
    } else if (!result.turnoverLikeFailure) {
      metrics.missedShots += 1;
    }
    if (result.assisted) {
      metrics.assists += 1;
    }
    if (result.turnoverLikeFailure) {
      metrics.turnovers += 1;
    }

    if (result.defensivePlay.steal) {
      metrics.steals += 1;
    }
    if (result.defensivePlay.block) {
      metrics.blocks += 1;
    }

    if (result.shotZone === "three") {
      metrics.threePa += 1;
      if (result.eventType === "made_3") {
        metrics.threePm += 1;
      }
    } else if (result.shotZone === "midrange") {
      metrics.midPa += 1;
      if (result.eventType === "made_2") {
        metrics.midPm += 1;
      }
    } else if (result.shotZone === "rim") {
      metrics.rimPa += 1;
      if (result.eventType === "made_2" || result.eventType === "putback_make") {
        metrics.rimPm += 1;
      }
    }

    if (result.offensiveRebound) {
      metrics.offReb += 1;
    }
    if (result.eventType === "def_reb") {
      metrics.defReb += 1;
    }
    if (result.putbackAttempted) {
      metrics.putbackAttempts += 1;
      if (result.eventType === "putback_make") {
        metrics.putbackMakes += 1;
      }
    }

    const homeDelta = result.nextState.score.home - preScore.home;
    const awayDelta = result.nextState.score.away - preScore.away;
    metrics.pointsHome += homeDelta;
    metrics.pointsAway += awayDelta;

    const quarterBefore = 1 + Math.floor((secondsRemaining - preSeconds) / 720);
    if (quarterBefore >= 4) {
      metrics.q4HomePoints += homeDelta;
      metrics.q4AwayPoints += awayDelta;
    }

    state = result.nextState;
  }

  return { state, metrics };
};

const aggregateRuns = (runs) => {
  const keys = Object.keys(runs[0].metrics);
  const totals = Object.fromEntries(keys.map((key) => [key, 0]));

  for (const run of runs) {
    for (const key of keys) {
      totals[key] += run.metrics[key];
    }
  }

  const count = runs.length;
  const avg = Object.fromEntries(keys.map((key) => [key, totals[key] / count]));

  return {
    avg,
    fgPct: avg.fga > 0 ? (avg.fgm / avg.fga) * 100 : 0,
    threePct: avg.threePa > 0 ? (avg.threePm / avg.threePa) * 100 : 0,
    midPct: avg.midPa > 0 ? (avg.midPm / avg.midPa) * 100 : 0,
    rimPct: avg.rimPa > 0 ? (avg.rimPm / avg.rimPa) * 100 : 0,
    assistRate: avg.fgm > 0 ? (avg.assists / avg.fgm) * 100 : 0,
    turnoverRate: avg.possessions > 0 ? (avg.turnovers / avg.possessions) * 100 : 0,
    offensiveReboundRate: avg.missedShots > 0 ? (avg.offReb / avg.missedShots) * 100 : 0,
  };
};

const ensureRange = (name, value, min, max) => {
  if (value < min || value > max) {
    throw new Error(`${name} out of range: ${value.toFixed(2)} (expected ${min}..${max})`);
  }
};

const assertDirectional = (label, baseline, compared, direction, tolerance = 0) => {
  const ok = direction === "up" ? compared >= baseline - tolerance : compared <= baseline + tolerance;
  if (!ok) {
    throw new Error(
      `${label} directional check failed: baseline=${baseline.toFixed(2)}, compared=${compared.toFixed(2)}, tolerance=${tolerance.toFixed(2)}`,
    );
  }
};

const main = async () => {
  const engine = require("./matchEngine.ts");
  const { LeagueLevel } = require("./types/career.ts");

  const seeds = [20260210, 20260211, 20260212, 20260213, 20260214, 20260215, 20260216, 20260217, 20260218, 20260219];
  const context = createBaseContext();
  const secondsRemaining = 48 * 60;
  const maxPossessions = 220;

  const baselineRuns = seeds.map((seed) =>
    runSingleSimulation({
      context: cloneContext(context),
      seed,
      leagueLevel: LeagueLevel.PRO,
      secondsRemaining,
      maxPossessions,
      engine,
    }),
  );

  const baseline = aggregateRuns(baselineRuns);

  console.log("=== Match Engine Verification (Markov 5v5) ===");
  console.log(`Avg Possessions: ${baseline.avg.possessions.toFixed(1)}`);
  console.log(`Avg Final Score: HOME ${baseline.avg.pointsHome.toFixed(1)} - AWAY ${baseline.avg.pointsAway.toFixed(1)}`);
  console.log(`FG%: ${baseline.fgPct.toFixed(1)} | 3P%: ${baseline.threePct.toFixed(1)} | MID%: ${baseline.midPct.toFixed(1)} | RIM%: ${baseline.rimPct.toFixed(1)}`);
  console.log(`Assist Rate: ${baseline.assistRate.toFixed(1)}% | TOV Rate: ${baseline.turnoverRate.toFixed(1)}%`);
  console.log(`OREB Rate: ${baseline.offensiveReboundRate.toFixed(1)}% | STL: ${baseline.avg.steals.toFixed(1)} | BLK: ${baseline.avg.blocks.toFixed(1)}`);

  ensureRange("Avg Possessions", baseline.avg.possessions, 120, 210);
  ensureRange("FG%", baseline.fgPct, 35, 60);
  ensureRange("Turnover Rate", baseline.turnoverRate, 6, 24);

  const attributeChecks = [
    {
      attr: "shooting",
      metric: (x) =>
        x.avg.threePa + x.avg.midPa > 0
          ? ((x.avg.threePm + x.avg.midPm) / (x.avg.threePa + x.avg.midPa)) * 100
          : 0,
      direction: "up",
      tolerance: 1,
    },
    { attr: "finishing", metric: (x) => x.rimPct, direction: "up", tolerance: 0.5 },
    { attr: "vision", metric: (x) => x.assistRate, direction: "up", tolerance: 0.5 },
    { attr: "handle", metric: (x) => x.turnoverRate, direction: "down", tolerance: 0.5 },
    { attr: "athleticism", metric: (x) => x.avg.steals + x.avg.blocks + x.offensiveReboundRate, direction: "up", tolerance: 0.5 },
    { attr: "defense", metric: (x) => x.avg.pointsAway, direction: "down", tolerance: 0.5 },
    { attr: "rebounding", metric: (x) => x.offensiveReboundRate, direction: "up", tolerance: 0.5 },
    { attr: "bbiq", metric: (x) => x.turnoverRate, direction: "down", tolerance: 0.5 },
    { attr: "stamina", metric: (x) => x.avg.q4HomePoints, direction: "up", tolerance: 0.5 },
  ];

  console.log("=== Attribute Influence Checks (A/B) ===");
  for (const check of attributeChecks) {
    const boostedContext = cloneContext(context);
    applyBoost(boostedContext, "home", check.attr, 18);

    const boostedRuns = seeds.map((seed) =>
      runSingleSimulation({
        context: cloneContext(boostedContext),
        seed,
        leagueLevel: LeagueLevel.PRO,
        secondsRemaining,
        maxPossessions,
        engine,
      }),
    );

    const boosted = aggregateRuns(boostedRuns);
    const baselineMetric = check.metric(baseline);
    const boostedMetric = check.metric(boosted);
    assertDirectional(check.attr, baselineMetric, boostedMetric, check.direction, check.tolerance ?? 0);

    console.log(
      `- ${check.attr}: baseline=${baselineMetric.toFixed(2)}, boosted=${boostedMetric.toFixed(2)} (${check.direction})`,
    );
  }

  const scoreDiffs = baselineRuns.map((run) => run.metrics.pointsHome - run.metrics.pointsAway);
  console.log("=== Score Distribution (Home-Away diff) ===");
  console.log(`min=${Math.min(...scoreDiffs)} avg=${average(scoreDiffs).toFixed(2)} max=${Math.max(...scoreDiffs)}`);

  console.log("Verification complete.");
};

main().catch((error) => {
  console.error("Match engine verification failed:", error);
  process.exitCode = 1;
});
