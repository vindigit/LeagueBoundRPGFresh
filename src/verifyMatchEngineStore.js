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

  const storeModule = require("./matchEngineStore.ts");
  const createMatchEngineStore =
    storeModule.createMatchEngineStore ?? storeModule.default?.createMatchEngineStore;
  if (typeof createMatchEngineStore !== "function") {
    throw new Error("Failed to load createMatchEngineStore.");
  }
  const autosaves = [];
  const context = createBaseContext();
  context.home.roster = context.home.roster.map((player) => ({ ...player, bankBalance: 1000, morale: 60 }));
  context.away.roster = context.away.roster.map((player) => ({ ...player, bankBalance: 1000, morale: 60 }));

  const store = createMatchEngineStore({
    onAutoSave: (event) => autosaves.push(event),
  });

  store.startMatch({
    home: context.home,
    away: context.away,
    userPlayerId: "h1",
    seed: 20260214,
    keyMomentRngChance: 1,
  });
  console.log("=== Store Verification ===");
  console.log(`Started: ${store.getState().started}`);

  for (let i = 0; i < 10 && !store.getState().pausedForKeyMoment; i += 1) {
    store.stepPossession();
  }

  console.log(`Paused for key moment: ${store.getState().pausedForKeyMoment}`);
  console.log(`Paused for pending possession: ${store.getState().pausedForPendingPossession}`);
  console.log(`Key moment present: ${Boolean(store.getState().keyMoment)}`);
  console.log(`Pending key moment present: ${Boolean(store.getState().pendingKeyMoment)}`);
  console.log(`Pending possession present: ${Boolean(store.getState().pendingPossession)}`);

  store.resolveKeyMomentChoice("pass_to_corner");
  console.log(`Paused after resolve: ${store.getState().pausedForKeyMoment}`);
  console.log(`Pending possession after resolve: ${Boolean(store.getState().pendingPossession)}`);
  console.log(`Morale after resolve: ${store.getState().lastStep?.userInkState?.Morale}`);

  store.runPossessions(12);
  console.log(`Possessions after run: ${store.getState().lastStep?.metrics.possessions}`);
  console.log(`Autosave events: ${autosaves.map((e) => e.reason).join(", ")}`);
};

run().catch((error) => {
  console.error("Store verification failed:", error);
  process.exitCode = 1;
});


