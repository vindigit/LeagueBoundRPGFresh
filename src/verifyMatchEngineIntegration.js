"use strict";

const { register } = require("tsx/cjs/api");
register();

const { createBaseContext } = require("./verifyFixtures.js");

const run = async () => {
  const setupModule = require("./scripts/setupNodeVerificationEnv.ts");
  const setupNodeVerificationEnv =
    setupModule.setupNodeVerificationEnv ?? setupModule.default?.setupNodeVerificationEnv;
  if (typeof setupNodeVerificationEnv !== "function") {
    throw new Error("Failed to load setupNodeVerificationEnv.");
  }
  await setupNodeVerificationEnv();

  const adapterModule = require("./matchEngineAdapter.ts");
  const createMatchEngineAdapter =
    adapterModule.createMatchEngineAdapter ?? adapterModule.default?.createMatchEngineAdapter;
  if (typeof createMatchEngineAdapter !== "function") {
    throw new Error("Failed to load createMatchEngineAdapter.");
  }

  const context = createBaseContext();
  context.home.roster = context.home.roster.map((player) => ({ ...player, bankBalance: 250, morale: 62 }));
  context.away.roster = context.away.roster.map((player) => ({ ...player, bankBalance: 250, morale: 62 }));

  const adapter = createMatchEngineAdapter({
    home: context.home,
    away: context.away,
    userPlayerId: "h1",
    seed: 20260214,
    keyMomentRngChance: 1,
  });

  const initial = adapter.startGame();
  console.log("=== Integration Verification (Headless) ===");
  console.log(`Initial clock: ${initial.state.secondsRemaining}`);
  console.log(
    `Ink fields present: ${Boolean(initial.userInkState?.BankBalance)} / ${Boolean(initial.userInkState?.Morale)} / ${Boolean(initial.userInkState?.Position)}`,
  );

  const step1 = adapter.stepPossession();
  console.log(
    `Step1 -> action=${step1.result?.action}, points=${step1.result?.points}, turnover=${step1.result?.turnoverLikeFailure}, pending=${Boolean(step1.pendingPossession)}`,
  );
  if (step1.keyMoment) {
    console.log(`Step1 keyMoment: ${step1.keyMoment.promptText}`);
    console.log(`Step1 pending id: ${step1.pendingKeyMoment?.id}`);
  }

  const step2 = step1.pendingPossession
    ? adapter.resolvePendingKeyMoment({
        pendingId: step1.pendingKeyMoment.id,
        choiceId: step1.pendingKeyMoment.options[0].id,
      })
    : adapter.stepPossession();
  console.log(
    `Step2 -> action=${step2.result?.action}, points=${step2.result?.points}, turnover=${step2.result?.turnoverLikeFailure}, pending=${Boolean(step2.pendingPossession)}`,
  );
  if (step2.keyMoment) {
    console.log(`Step2 keyMoment: ${step2.keyMoment.promptText}`);
  }

  const batch = adapter.runPossessions(30);
  console.log("=== Batch Summary ===");
  console.log(`Clock after batch: ${batch.state.secondsRemaining}`);
  console.log(
    `Metrics: possessions=${batch.metrics.possessions}, fga=${batch.metrics.fga}, fgm=${batch.metrics.fgm}, turnovers=${batch.metrics.turnoverLikeFailures}`,
  );
  console.log(`Key moments triggered: ${batch.keyMoments.length}`);
  if (batch.keyMoments[0]) {
    console.log(`Sample key moment choice labels: ${batch.keyMoments[0].options.map((c) => c.label).join(", ")}`);
  }
};

run().catch((error) => {
  console.error("Integration verification failed:", error);
  process.exitCode = 1;
});


