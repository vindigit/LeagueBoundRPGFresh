"use strict";

const { register } = require("tsx/cjs/api");
register();

const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const createPlayer = (id, name, archetype, position, attrs) => ({
  id,
  name,
  age: 19,
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

const createEvenContext = () => {
  const base = createBaseContext();
  const awayRoster = base.home.roster.map((player, index) => ({
    ...player,
    id: `eq-a${index + 1}`,
    name: `Even Away ${index + 1}`,
    attributes: { ...player.attributes },
    gameStats: { ...player.gameStats },
  }));
  return {
    home: {
      ...base.home,
      roster: base.home.roster.map((player, index) => ({
        ...player,
        id: `eq-h${index + 1}`,
        name: `Even Home ${index + 1}`,
        attributes: { ...player.attributes },
        gameStats: { ...player.gameStats },
      })),
    },
    away: {
      ...base.away,
      name: "Even Away",
      roster: awayRoster,
    },
  };
};

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

const classifyEventType = (eventType) => {
  if (eventType === "made_2" || eventType === "made_3" || eventType === "putback_make") {
    return "score";
  }
  if (eventType === "turnover" || eventType === "steal") {
    return "turnover";
  }
  if (eventType === "miss" || eventType === "block" || eventType === "def_reb" || eventType === "putback_miss") {
    return "miss";
  }
  if (eventType === "off_reb") {
    return "info";
  }
  return "info";
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
    turnoversHome: 0,
    turnoversAway: 0,
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
    scoreEvents: 0,
    missEvents: 0,
    turnoverEvents: 0,
    infoEvents: 0,
  };

  while (metrics.possessions < maxPossessions && state.secondsRemaining > 0) {
    const offenseKey = state.offenseKey;
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
      if (offenseKey === "home") {
        metrics.turnoversHome += 1;
      } else {
        metrics.turnoversAway += 1;
      }
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

    const category = classifyEventType(result.eventType);
    if (category === "score") {
      metrics.scoreEvents += 1;
    } else if (category === "miss") {
      metrics.missEvents += 1;
    } else if (category === "turnover") {
      metrics.turnoverEvents += 1;
    } else {
      metrics.infoEvents += 1;
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

const runHomeCourtCheck = ({ engine, leagueLevel, secondsRemaining, maxPossessions, sampleSize = 1000 }) => {
  const context = createEvenContext();
  const seeds = Array.from({ length: sampleSize }, (_, index) => 20270000 + index);
  const runs = seeds.map((seed) =>
    runSingleSimulation({
      context: cloneContext(context),
      seed,
      leagueLevel,
      secondsRemaining,
      maxPossessions,
      engine,
    }),
  );

  const aggregate = aggregateRuns(runs);
  let homeWins = 0;
  let awayWins = 0;
  let ties = 0;
  for (const run of runs) {
    if (run.metrics.pointsHome > run.metrics.pointsAway) {
      homeWins += 1;
    } else if (run.metrics.pointsAway > run.metrics.pointsHome) {
      awayWins += 1;
    } else {
      ties += 1;
    }
  }
  const homeWinRate = ((homeWins + ties * 0.5) / runs.length) * 100;
  const scoreDiff = aggregate.avg.pointsHome - aggregate.avg.pointsAway;
  const turnoverDiff = aggregate.avg.turnoversHome - aggregate.avg.turnoversAway;

  console.log("\n=== Home-Court Validation (Even Teams) ===");
  console.log(`Runs: ${runs.length} | Possession cap: ${maxPossessions}`);
  console.log(`Home win rate: ${homeWinRate.toFixed(2)}% (wins=${homeWins}, losses=${awayWins}, ties=${ties})`);
  console.log(`Avg score: HOME ${aggregate.avg.pointsHome.toFixed(2)} - AWAY ${aggregate.avg.pointsAway.toFixed(2)} (diff ${scoreDiff.toFixed(2)})`);
  console.log(
    `Avg turnovers: HOME ${aggregate.avg.turnoversHome.toFixed(2)} - AWAY ${aggregate.avg.turnoversAway.toFixed(2)} (diff ${turnoverDiff.toFixed(2)})`,
  );

  if (homeWinRate <= 50) {
    throw new Error(`Home win rate check failed: ${homeWinRate.toFixed(2)}% should be > 50%.`);
  }
  if (aggregate.avg.pointsHome < aggregate.avg.pointsAway) {
    throw new Error(
      `Home scoring check failed: HOME ${aggregate.avg.pointsHome.toFixed(2)} < AWAY ${aggregate.avg.pointsAway.toFixed(2)}.`,
    );
  }
  if (aggregate.avg.turnoversHome > aggregate.avg.turnoversAway) {
    throw new Error(
      `Home turnovers check failed: HOME ${aggregate.avg.turnoversHome.toFixed(2)} > AWAY ${aggregate.avg.turnoversAway.toFixed(2)}.`,
    );
  }

  if (homeWinRate < 51 || homeWinRate > 52.5) {
    console.log(
      "Tuning reminder: target near-neutral home edge is ~51.0-52.5% home win rate for evenly matched teams.",
    );
  }
};

const getHomeWinRate = (runs) => {
  let homeWins = 0;
  let awayWins = 0;
  let ties = 0;
  for (const run of runs) {
    if (run.metrics.pointsHome > run.metrics.pointsAway) {
      homeWins += 1;
    } else if (run.metrics.pointsAway > run.metrics.pointsHome) {
      awayWins += 1;
    } else {
      ties += 1;
    }
  }
  return {
    homeWins,
    awayWins,
    ties,
    homeWinRate: ((homeWins + ties * 0.5) / runs.length) * 100,
  };
};

const runMomentumCheck = ({ engine, tuning, leagueLevel, secondsRemaining, maxPossessions, sampleSize = 600 }) => {
  if (!tuning || !tuning.momentum) {
    throw new Error("Momentum tuning block is missing from matchEngineTuning.js.");
  }

  const context = createEvenContext();
  const seeds = Array.from({ length: sampleSize }, (_, index) => 20274000 + index);
  const originalEnabled = tuning.momentum.enabled;

  try {
    tuning.momentum.enabled = false;
    const disabledRuns = seeds.map((seed) =>
      runSingleSimulation({
        context: cloneContext(context),
        seed,
        leagueLevel,
        secondsRemaining,
        maxPossessions,
        engine,
      }),
    );
    const disabledAggregate = aggregateRuns(disabledRuns);
    const disabledWins = getHomeWinRate(disabledRuns);

    tuning.momentum.enabled = true;
    const enabledRuns = seeds.map((seed) =>
      runSingleSimulation({
        context: cloneContext(context),
        seed,
        leagueLevel,
        secondsRemaining,
        maxPossessions,
        engine,
      }),
    );
    const enabledAggregate = aggregateRuns(enabledRuns);
    const enabledWins = getHomeWinRate(enabledRuns);

    const homeWinRateShift = enabledWins.homeWinRate - disabledWins.homeWinRate;
    const fgPctShift = enabledAggregate.fgPct - disabledAggregate.fgPct;

    console.log("\n=== Momentum Validation (Even Teams, A/B) ===");
    console.log(`Runs per variant: ${sampleSize} | Possession cap: ${maxPossessions}`);
    console.log(
      `Momentum OFF -> homeWinRate ${disabledWins.homeWinRate.toFixed(2)}%, fgPct ${disabledAggregate.fgPct.toFixed(2)}%`,
    );
    console.log(
      `Momentum ON  -> homeWinRate ${enabledWins.homeWinRate.toFixed(2)}%, fgPct ${enabledAggregate.fgPct.toFixed(2)}%`,
    );
    console.log(`Shifts -> homeWinRate ${homeWinRateShift >= 0 ? "+" : ""}${homeWinRateShift.toFixed(2)} pts, fgPct ${fgPctShift >= 0 ? "+" : ""}${fgPctShift.toFixed(2)} pts`);

    if (Math.abs(homeWinRateShift) > 3) {
      throw new Error(`Momentum home win rate shift too large: ${homeWinRateShift.toFixed(2)} pts (expected <= 3.00).`);
    }
    if (Math.abs(fgPctShift) > 1.5) {
      throw new Error(`Momentum FG% shift too large: ${fgPctShift.toFixed(2)} pts (expected <= 1.50).`);
    }
  } finally {
    tuning.momentum.enabled = originalEnabled;
  }
};

const main = async () => {
  const engine = require("./matchEngine.ts");
  const tuning = require("./matchEngineTuning.js");
  const { LeagueLevel } = require("./types/career.ts");
  const args = process.argv.slice(2);
  const checkAttributesEnabled = args.includes("--check-attributes");
  const checkHomeCourtEnabled = args.includes("--check-home-court");
  const checkMomentumEnabled = args.includes("--check-momentum");

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
  const perRunRows = baselineRuns.map((run, index) => {
    const diff = run.metrics.pointsHome - run.metrics.pointsAway;
    return {
      run: index + 1,
      seed: seeds[index],
      home: run.metrics.pointsHome,
      away: run.metrics.pointsAway,
      diff,
      possessions: run.metrics.possessions,
      score: run.metrics.scoreEvents,
      miss: run.metrics.missEvents,
      turnover: run.metrics.turnoverEvents,
      info: run.metrics.infoEvents,
    };
  });

  const scoreDiffs = perRunRows.map((row) => row.diff);

  console.log("=== Core Box Score Simulation ===");
  console.log("Mode: fixed-seed deterministic");
  console.log(`Full Game Length: 48:00 (${secondsRemaining} seconds)`);
  console.log(`Run Count: ${seeds.length}`);
  console.log(`Possession Cap Per Run: ${maxPossessions}`);

  console.log("\n=== Per-Run Results (10 runs) ===");
  perRunRows.forEach((row) => {
    console.log(
      `Run ${String(row.run).padStart(2, "0")} [seed ${row.seed}] | Score ${row.home}-${row.away} | Diff ${row.diff >= 0 ? "+" : ""}${row.diff} | Poss ${row.possessions} | Events S:${row.score} M:${row.miss} T:${row.turnover} I:${row.info}`,
    );
  });

  console.log("\n=== Averages ===");
  console.log(
    `Avg Final Score: HOME ${baseline.avg.pointsHome.toFixed(1)} - AWAY ${baseline.avg.pointsAway.toFixed(1)} (Diff ${average(scoreDiffs).toFixed(1)})`,
  );
  console.log(`Avg Possessions: ${baseline.avg.possessions.toFixed(1)}`);
  console.log(
    `Avg Events: score ${baseline.avg.scoreEvents.toFixed(1)}, miss ${baseline.avg.missEvents.toFixed(1)}, turnover ${baseline.avg.turnoverEvents.toFixed(1)}, info ${baseline.avg.infoEvents.toFixed(1)}`,
  );
  console.log(
    `Avg Total Events: ${(baseline.avg.scoreEvents + baseline.avg.missEvents + baseline.avg.turnoverEvents + baseline.avg.infoEvents).toFixed(1)}`,
  );

  console.log("\n=== Range/Spread ===");
  console.log(`Score Diff (Home-Away): min=${Math.min(...scoreDiffs)} avg=${average(scoreDiffs).toFixed(2)} max=${Math.max(...scoreDiffs)}`);

  ensureRange("Avg Possessions", baseline.avg.possessions, 1, maxPossessions);
  ensureRange("Avg Home Score", baseline.avg.pointsHome, 0, 300);
  ensureRange("Avg Away Score", baseline.avg.pointsAway, 0, 300);

  console.log("\nSimulation complete.");

  if (checkAttributesEnabled) {
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

    console.log("\n=== Attribute Influence Checks (A/B) ===");
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
  }

  if (checkHomeCourtEnabled) {
    runHomeCourtCheck({
      engine,
      leagueLevel: LeagueLevel.PRO,
      secondsRemaining,
      maxPossessions,
      sampleSize: 1000,
    });
  }

  if (checkMomentumEnabled) {
    runMomentumCheck({
      engine,
      tuning,
      leagueLevel: LeagueLevel.PRO,
      secondsRemaining,
      maxPossessions,
      sampleSize: 600,
    });
  }
};

main().catch((error) => {
  console.error("Match engine verification failed:", error);
  process.exitCode = 1;
});
