const { createBaseContext } = require("../src/verifyFixtures.js");
const { createMatchEngineAdapter } = require("../src/matchEngineAdapter");
const { createMatchEngineStore } = require("../src/matchEngineStore");

const createContext = () => {
  const context = createBaseContext();
  context.home.roster = context.home.roster.map((player) => ({ ...player, bankBalance: 1000, morale: 60 }));
  context.away.roster = context.away.roster.map((player) => ({ ...player, bankBalance: 1000, morale: 60 }));
  return context;
};

describe("pending possession plumbing", () => {
  it("holds a triggered possession as pending until resumed", () => {
    const context = createContext();
    const adapter = createMatchEngineAdapter({
      home: context.home,
      away: context.away,
      userPlayerId: "h1",
      seed: 20260214,
      keyMomentRngChance: 1,
    });

    adapter.startGame();

    let step;
    let previousMetrics = 0;
    for (let i = 0; i < 15; i += 1) {
      step = adapter.stepPossession();
      if (step.pendingPossession) {
        break;
      }
      previousMetrics = step.metrics.possessions;
    }

    expect(step.pendingPossession).toBeDefined();
    expect(step.pendingKeyMoment).toBeDefined();
    expect(step.metrics.possessions).toBe(previousMetrics);
    expect(step.state).toEqual(step.pendingPossession.state);

    const resumed = adapter.resumePendingPossession();
    expect(resumed.pendingPossession).toBeUndefined();
    expect(resumed.pendingKeyMoment).toBeUndefined();
    expect(resumed.metrics.possessions).toBe(step.metrics.possessions + 1);
    expect(resumed.state).toEqual(step.pendingPossession.result.nextState);
  });

  it("keeps the store paused until the pending possession is resolved", () => {
    const context = createContext();
    const store = createMatchEngineStore();
    let snapshot = store.startMatch({
      home: context.home,
      away: context.away,
      userPlayerId: "h1",
      seed: 20260214,
      keyMomentRngChance: 1,
    });

    for (let i = 0; i < 15 && !snapshot.pausedForPendingPossession; i += 1) {
      snapshot = store.stepPossession();
    }

    expect(snapshot.pausedForKeyMoment).toBe(true);
    expect(snapshot.pausedForPendingPossession).toBe(true);
    expect(snapshot.pendingPossession).toBeDefined();
    expect(snapshot.pendingKeyMoment).toBeDefined();

    const pendingMetrics = snapshot.lastStep.metrics.possessions;
    const interrupted = store.runPossessions(5);
    expect(interrupted.lastStep.metrics.possessions).toBe(pendingMetrics);
    expect(interrupted.pausedForPendingPossession).toBe(true);

    const resolved = store.resolveKeyMomentChoice("pass_to_corner");
    expect(resolved.pausedForKeyMoment).toBe(false);
    expect(resolved.pausedForPendingPossession).toBe(false);
    expect(resolved.pendingPossession).toBeUndefined();
    expect(resolved.pendingKeyMoment).toBeUndefined();
    expect(resolved.lastStep.metrics.possessions).toBe(pendingMetrics + 1);
  });
});
