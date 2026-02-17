"use strict";

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const makePlayer = (id, name, archetype, position, attrs) => ({
  id,
  name,
  age: 19,
  BankBalance: 1000,
  Morale: 60,
  Position: position,
  bankBalance: 1000,
  morale: 60,
  position,
  archetype,
  attributes: attrs,
  gameStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 },
});

const home = {
  name: "Metro State",
  teamOvr: 0,
  roster: [
    makePlayer("h1", "A1", "Playmaker", "PG", { shooting: 70, finishing: 66, vision: 82, handle: 84, athleticism: 71, defense: 58, rebounding: 44, bbiq: 78, stamina: 80 }),
    makePlayer("h2", "A2", "Sharpshooter", "SG", { shooting: 85, finishing: 61, vision: 58, handle: 63, athleticism: 64, defense: 54, rebounding: 47, bbiq: 70, stamina: 76 }),
    makePlayer("h3", "A3", "Slasher", "SF", { shooting: 63, finishing: 79, vision: 55, handle: 72, athleticism: 81, defense: 66, rebounding: 60, bbiq: 68, stamina: 79 }),
    makePlayer("h4", "A4", "Stretch Big", "PF", { shooting: 77, finishing: 68, vision: 57, handle: 48, athleticism: 60, defense: 70, rebounding: 74, bbiq: 71, stamina: 74 }),
    makePlayer("h5", "A5", "Paint Beast", "C", { shooting: 52, finishing: 83, vision: 46, handle: 41, athleticism: 65, defense: 79, rebounding: 86, bbiq: 69, stamina: 72 }),
  ],
};

const away = {
  name: "Central Tech",
  teamOvr: 0,
  roster: [
    makePlayer("a1", "B1", "Playmaker", "PG", { shooting: 68, finishing: 64, vision: 80, handle: 81, athleticism: 70, defense: 57, rebounding: 43, bbiq: 76, stamina: 79 }),
    makePlayer("a2", "B2", "Sharpshooter", "SG", { shooting: 82, finishing: 59, vision: 55, handle: 61, athleticism: 63, defense: 53, rebounding: 45, bbiq: 68, stamina: 75 }),
    makePlayer("a3", "B3", "Lockdown Defender", "SF", { shooting: 61, finishing: 72, vision: 52, handle: 67, athleticism: 77, defense: 81, rebounding: 64, bbiq: 72, stamina: 81 }),
    makePlayer("a4", "B4", "Stretch Big", "PF", { shooting: 74, finishing: 66, vision: 55, handle: 45, athleticism: 59, defense: 72, rebounding: 76, bbiq: 70, stamina: 73 }),
    makePlayer("a5", "B5", "Paint Beast", "C", { shooting: 50, finishing: 81, vision: 43, handle: 39, athleticism: 63, defense: 80, rebounding: 85, bbiq: 68, stamina: 71 }),
  ],
};

const run = async () => {
  const setupModule = await import("./scripts/setupNodeVerificationEnv.ts");
  const setupNodeVerificationEnv =
    setupModule.setupNodeVerificationEnv ?? setupModule.default?.setupNodeVerificationEnv;
  if (typeof setupNodeVerificationEnv !== "function") {
    throw new Error("Failed to load setupNodeVerificationEnv.");
  }
  await setupNodeVerificationEnv();

  const storeModule = await import("./matchEngineStore.ts");
  const createMatchEngineStore =
    storeModule.createMatchEngineStore ?? storeModule.default?.createMatchEngineStore;
  if (typeof createMatchEngineStore !== "function") {
    throw new Error("Failed to load createMatchEngineStore.");
  }
  const autosaves = [];
  const updates = [];

  const store = createMatchEngineStore({
    onAutoSave: (event) => autosaves.push(event.reason),
  });
  const unsubscribe = store.subscribe((next) => updates.push(next));

  let snapshot = store.startMatch({
    home,
    away,
    userPlayerId: "h1",
    seed: 20260214,
    keyMomentRngChance: 1,
  });

  assert(snapshot.started, "Store should be started after startMatch().");
  assert(!snapshot.pausedForKeyMoment, "Store should not start paused.");
  assert(Boolean(snapshot.lastStep?.userInkState?.Position), "Ink-facing state should be present on start.");

  for (let i = 0; i < 15 && !snapshot.pausedForKeyMoment; i += 1) {
    snapshot = store.stepPossession();
  }

  assert(snapshot.pausedForKeyMoment, "Store should pause when key moment triggers.");
  assert(Boolean(snapshot.keyMoment), "Key moment payload should exist when paused.");

  const updatesBeforeResolve = updates.length;
  const moraleBefore = snapshot.lastStep?.userInkState?.Morale ?? -1;
  snapshot = store.resolveKeyMomentChoice("pass_to_corner");

  assert(!snapshot.pausedForKeyMoment, "Store should unpause after resolving key moment.");
  assert(!snapshot.keyMoment, "Key moment should be cleared after resolution.");
  assert((snapshot.lastStep?.userInkState?.Morale ?? -1) === moraleBefore + 1, "Pass to corner should increase morale by 1.");
  assert(updates.length === updatesBeforeResolve + 1, "resolveKeyMomentChoice() should notify subscribers exactly once.");
  assert(autosaves.includes("key_moment_resolution"), "Autosave should fire on key moment resolution.");

  // If run is attempted while paused, it must not emit a week_advance autosave.
  let pausedSnapshot = snapshot;
  for (let i = 0; i < 15 && !pausedSnapshot.pausedForKeyMoment; i += 1) {
    pausedSnapshot = store.stepPossession();
  }
  assert(pausedSnapshot.pausedForKeyMoment, "Store should be paused before interrupted run test.");
  const autosavesBeforeInterruptedRun = autosaves.length;
  pausedSnapshot = store.runPossessions(8);
  assert(pausedSnapshot.pausedForKeyMoment, "Interrupted run should remain paused for key moment.");
  assert(
    autosaves.length === autosavesBeforeInterruptedRun,
    "Interrupted run must not emit a week_advance autosave.",
  );

  // A run with no key-moment interruptions should emit week_advance autosave.
  const completionAutosaves = [];
  const completionStore = createMatchEngineStore({
    onAutoSave: (event) => completionAutosaves.push(event.reason),
  });
  let completionSnapshot = completionStore.startMatch({
    home,
    away,
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
