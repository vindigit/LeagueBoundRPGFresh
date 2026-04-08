"use strict";

const { register } = require("tsx/cjs/api");
register();

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

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
  const updates = [];
  const context = createBaseContext();
  context.home.roster = context.home.roster.map((player) => ({ ...player, bankBalance: 1000, morale: 60 }));
  context.away.roster = context.away.roster.map((player) => ({ ...player, bankBalance: 1000, morale: 60 }));

  const store = createMatchEngineStore({
    onAutoSave: (event) => autosaves.push(event.reason),
  });
  const unsubscribe = store.subscribe((next) => updates.push(next));

  let snapshot = store.startMatch({
    home: context.home,
    away: context.away,
    userPlayerId: "h1",
    seed: 20260214,
    keyMomentRngChance: 1,
  });

  assert(snapshot.started, "Store should be started after startMatch().");
  assert(!snapshot.pausedForKeyMoment, "Store should not start paused.");
  assert(!snapshot.pausedForPendingPossession, "Store should not start with a pending possession.");
  assert(Boolean(snapshot.lastStep?.userInkState?.Position), "Ink-facing state should be present on start.");

  for (let i = 0; i < 15 && !snapshot.pausedForKeyMoment; i += 1) {
    snapshot = store.stepPossession();
  }

  assert(snapshot.pausedForKeyMoment, "Store should pause when key moment triggers.");
  assert(snapshot.pausedForPendingPossession, "Store should expose generic paused pending state when key moment triggers.");
  assert(Boolean(snapshot.keyMoment), "Key moment payload should exist when paused.");
  assert(Boolean(snapshot.pendingKeyMoment), "Pending key moment payload should exist when paused.");
  assert(Boolean(snapshot.pendingPossession), "Pending possession should exist when paused.");
  const pendingMetrics = snapshot.lastStep?.metrics.possessions ?? -1;
  const interruptedAutosavesBeforeResolve = autosaves.length;
  const interruptedSnapshot = store.runPossessions(8);
  assert(interruptedSnapshot.pausedForPendingPossession, "Interrupted run should remain paused for pending possession.");
  assert(
    (interruptedSnapshot.lastStep?.metrics.possessions ?? -1) === pendingMetrics,
    "Interrupted run must not advance committed possession metrics while paused.",
  );
  assert(
    autosaves.length === interruptedAutosavesBeforeResolve,
    "Interrupted run must not emit a week_advance autosave.",
  );

  const updatesBeforeResolve = updates.length;
  const moraleBefore = snapshot.lastStep?.userInkState?.Morale ?? -1;
  snapshot = store.resolveKeyMomentChoice("pass_to_corner");

  assert(!snapshot.pausedForKeyMoment, "Store should unpause after resolving key moment.");
  assert(!snapshot.pausedForPendingPossession, "Store should clear generic paused state after resolving key moment.");
  assert(!snapshot.keyMoment, "Key moment should be cleared after resolution.");
  assert(!snapshot.pendingKeyMoment, "Pending key moment should be cleared after resolution.");
  assert(!snapshot.pendingPossession, "Pending possession should be cleared after resolution.");
  assert((snapshot.lastStep?.userInkState?.Morale ?? -1) === moraleBefore + 1, "Pass to corner should increase morale by 1.");
  assert((snapshot.lastStep?.metrics.possessions ?? 0) === pendingMetrics + 1, "Resolving should commit the stored possession exactly once.");
  assert(updates.length === updatesBeforeResolve + 1, "resolveKeyMomentChoice() should notify subscribers exactly once.");
  assert(autosaves.includes("key_moment_resolution"), "Autosave should fire on key moment resolution.");

  const completionAutosaves = [];
  const completionStore = createMatchEngineStore({
    onAutoSave: (event) => completionAutosaves.push(event.reason),
  });
  let completionSnapshot = completionStore.startMatch({
    home: context.home,
    away: context.away,
    userPlayerId: "h1",
    seed: 20260215,
    keyMomentRngChance: 0,
  });
  const possessionsBeforeCompletedRun = completionSnapshot.lastStep?.metrics.possessions ?? 0;
  completionSnapshot = completionStore.runPossessions(8);
  const possessionsAfterCompletedRun = completionSnapshot.lastStep?.metrics.possessions ?? 0;
  assert(
    possessionsAfterCompletedRun > possessionsBeforeCompletedRun,
    "runPossessions() should advance possessions when not interrupted.",
  );
  assert(
    completionAutosaves.includes("week_advance"),
    "Completed run should emit week_advance autosave.",
  );

  assert(updates.length > 0, "Subscribers should receive state updates.");

  unsubscribe();
  console.log("PASS verifyMatchEngineStoreTransitions");
};

run().catch((error) => {
  console.error("FAIL verifyMatchEngineStoreTransitions:", error.message);
  process.exitCode = 1;
});


