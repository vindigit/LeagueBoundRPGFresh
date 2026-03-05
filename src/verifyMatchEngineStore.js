// TODO: Sprint 2 — this script uses the old 9-attr shape. Update when match engine is rewritten.
"use strict";

const makePlayer = (id, name, archetype, position, attrs) => ({
  id,
  name,
  age: 19,
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
  const store = createMatchEngineStore({
    onAutoSave: (event) => autosaves.push(event),
  });

  store.startMatch({
    home,
    away,
    userPlayerId: "h1",
    seed: 20260214,
    keyMomentRngChance: 1,
  });
  console.log("=== Store Verification ===");
  console.log(`Started: ${store.getState().started}`);

  // Step until first key moment pauses the store.
  for (let i = 0; i < 10 && !store.getState().pausedForKeyMoment; i += 1) {
    store.stepPossession();
  }

  console.log(`Paused for key moment: ${store.getState().pausedForKeyMoment}`);
  console.log(`Key moment present: ${Boolean(store.getState().keyMoment)}`);

  store.resolveKeyMomentChoice("pass_to_corner");
  console.log(`Paused after resolve: ${store.getState().pausedForKeyMoment}`);
  console.log(`Morale after resolve: ${store.getState().lastStep?.userInkState?.Morale}`);

  store.runPossessions(12);
  console.log(`Possessions after run: ${store.getState().lastStep?.metrics.possessions}`);
  console.log(`Autosave events: ${autosaves.map((e) => e.reason).join(", ")}`);
};

run().catch((error) => {
  console.error("Store verification failed:", error);
  process.exitCode = 1;
});

