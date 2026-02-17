"use strict";

const makePlayer = (id, name, archetype, position, attrs, usePascal) => {
  if (usePascal) {
    return {
      id,
      name,
      age: 19,
      BankBalance: 250,
      Morale: 62,
      Position: position,
      archetype,
      attributes: attrs,
      gameStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 },
    };
  }
  return {
    id,
    name,
    age: 19,
    bankBalance: 250,
    morale: 62,
    position,
    archetype,
    attributes: attrs,
    gameStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fga: 0, fgm: 0 },
  };
};

const home = {
  name: "Metro State",
  teamOvr: 0,
  roster: [
    makePlayer("h1", "A1", "Playmaker", "PG", { shooting: 70, finishing: 66, vision: 82, handle: 84, athleticism: 71, defense: 58, rebounding: 44, bbiq: 78, stamina: 80 }, true),
    makePlayer("h2", "A2", "Sharpshooter", "SG", { shooting: 85, finishing: 61, vision: 58, handle: 63, athleticism: 64, defense: 54, rebounding: 47, bbiq: 70, stamina: 76 }, false),
    makePlayer("h3", "A3", "Slasher", "SF", { shooting: 63, finishing: 79, vision: 55, handle: 72, athleticism: 81, defense: 66, rebounding: 60, bbiq: 68, stamina: 79 }, true),
    makePlayer("h4", "A4", "Stretch Big", "PF", { shooting: 77, finishing: 68, vision: 57, handle: 48, athleticism: 60, defense: 70, rebounding: 74, bbiq: 71, stamina: 74 }, false),
    makePlayer("h5", "A5", "Paint Beast", "C", { shooting: 52, finishing: 83, vision: 46, handle: 41, athleticism: 65, defense: 79, rebounding: 86, bbiq: 69, stamina: 72 }, true),
  ],
};

const away = {
  name: "Central Tech",
  teamOvr: 0,
  roster: [
    makePlayer("a1", "B1", "Playmaker", "PG", { shooting: 68, finishing: 64, vision: 80, handle: 81, athleticism: 70, defense: 57, rebounding: 43, bbiq: 76, stamina: 79 }, false),
    makePlayer("a2", "B2", "Sharpshooter", "SG", { shooting: 82, finishing: 59, vision: 55, handle: 61, athleticism: 63, defense: 53, rebounding: 45, bbiq: 68, stamina: 75 }, true),
    makePlayer("a3", "B3", "Lockdown Defender", "SF", { shooting: 61, finishing: 72, vision: 52, handle: 67, athleticism: 77, defense: 81, rebounding: 64, bbiq: 72, stamina: 81 }, false),
    makePlayer("a4", "B4", "Stretch Big", "PF", { shooting: 74, finishing: 66, vision: 55, handle: 45, athleticism: 59, defense: 72, rebounding: 76, bbiq: 70, stamina: 73 }, true),
    makePlayer("a5", "B5", "Paint Beast", "C", { shooting: 50, finishing: 81, vision: 43, handle: 39, athleticism: 63, defense: 80, rebounding: 85, bbiq: 68, stamina: 71 }, false),
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

  const adapterModule = await import("./matchEngineAdapter.ts");
  const createMatchEngineAdapter =
    adapterModule.createMatchEngineAdapter ?? adapterModule.default?.createMatchEngineAdapter;
  if (typeof createMatchEngineAdapter !== "function") {
    throw new Error("Failed to load createMatchEngineAdapter.");
  }

  const adapter = createMatchEngineAdapter({
    home,
    away,
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
    `Step1 -> action=${step1.result?.action}, points=${step1.result?.points}, turnover=${step1.result?.turnoverLikeFailure}`,
  );
  if (step1.keyMoment) {
    console.log(`Step1 keyMoment: ${step1.keyMoment.reason} | ${step1.keyMoment.contextLine}`);
  }

  const step2 = adapter.stepPossession();
  console.log(
    `Step2 -> action=${step2.result?.action}, points=${step2.result?.points}, turnover=${step2.result?.turnoverLikeFailure}`,
  );
  if (step2.keyMoment) {
    console.log(`Step2 keyMoment: ${step2.keyMoment.reason} | ${step2.keyMoment.contextLine}`);
  }

  const batch = adapter.runPossessions(30);
  console.log("=== Batch Summary ===");
  console.log(`Clock after batch: ${batch.state.secondsRemaining}`);
  console.log(
    `Metrics: possessions=${batch.metrics.possessions}, fga=${batch.metrics.fga}, fgm=${batch.metrics.fgm}, turnovers=${batch.metrics.turnoverLikeFailures}`,
  );
  console.log(`Key moments triggered: ${batch.keyMoments.length}`);
  if (batch.keyMoments[0]) {
    console.log(`Sample key moment choice labels: ${batch.keyMoments[0].choices.map((c) => c.label).join(", ")}`);
  }
};

run().catch((error) => {
  console.error("Integration verification failed:", error);
  process.exitCode = 1;
});
