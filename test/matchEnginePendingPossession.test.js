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
  it("holds a triggered possession as pending until resolved", () => {
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
    expect(step.result).toBeUndefined();
    expect(step.pendingKeyMoment.options?.length).toBeGreaterThan(0);

    const aggressive = adapter.resolvePendingKeyMoment({
      pendingId: step.pendingKeyMoment.id,
      choiceId: step.pendingKeyMoment.options[0].id,
    });
    expect(aggressive.pendingPossession).toBeUndefined();
    expect(aggressive.pendingKeyMoment).toBeUndefined();
    expect(aggressive.metrics.possessions).toBe(step.metrics.possessions + 1);
    expect(aggressive.result).toBeDefined();
  });

  it("uses the user choice to influence the resolved possession result", () => {
    const context = createContext();
    const createPendingStep = () => {
      const adapter = createMatchEngineAdapter({
        home: context.home,
        away: context.away,
        userPlayerId: "h1",
        seed: 20260214,
        keyMomentRngChance: 1,
      });

      adapter.startGame();
      let step;
      for (let i = 0; i < 15; i += 1) {
        step = adapter.stepPossession();
        if (step.pendingKeyMoment) {
          return { adapter, step };
        }
      }
      throw new Error("Expected a pending key moment.");
    };

    const aggressive = createPendingStep();
    const conservative = createPendingStep();
    const aggressiveChoice = aggressive.step.pendingKeyMoment.options[0].id;
    const conservativeChoice = conservative.step.pendingKeyMoment.options[conservative.step.pendingKeyMoment.options.length - 1].id;

    const aggressiveResolved = aggressive.adapter.resolvePendingKeyMoment({
      pendingId: aggressive.step.pendingKeyMoment.id,
      choiceId: aggressiveChoice,
    });
    const conservativeResolved = conservative.adapter.resolvePendingKeyMoment({
      pendingId: conservative.step.pendingKeyMoment.id,
      choiceId: conservativeChoice,
    });

    expect(aggressiveResolved.result).toBeDefined();
    expect(conservativeResolved.result).toBeDefined();
    expect(
      aggressiveResolved.result.points !== conservativeResolved.result.points ||
        aggressiveResolved.result.eventType !== conservativeResolved.result.eventType,
    ).toBe(true);
  });

  it("accepts execution quality input when resolving a pending possession", () => {
    const context = createContext();
    const createPendingStep = () => {
      const adapter = createMatchEngineAdapter({
        home: context.home,
        away: context.away,
        userPlayerId: "h1",
        seed: 20260214,
        keyMomentRngChance: 1,
      });

      adapter.startGame();
      let step;
      for (let i = 0; i < 15; i += 1) {
        step = adapter.stepPossession();
        if (step.pendingKeyMoment) {
          return { adapter, step };
        }
      }
      throw new Error("Expected a pending key moment.");
    };

    const lowAttempt = createPendingStep();
    const highAttempt = createPendingStep();

    const lowResolved = lowAttempt.adapter.resolvePendingKeyMoment({
      pendingId: lowAttempt.step.pendingKeyMoment.id,
      choiceId: lowAttempt.step.pendingKeyMoment.options[0].id,
      executionQuality: {
        normalizedScore: 0.2,
        source: "minigame",
      },
    });
    const highResolved = highAttempt.adapter.resolvePendingKeyMoment({
      pendingId: highAttempt.step.pendingKeyMoment.id,
      choiceId: highAttempt.step.pendingKeyMoment.options[0].id,
      executionQuality: {
        normalizedScore: 0.85,
        source: "minigame",
      },
    });

    expect(lowResolved.result).toBeDefined();
    expect(highResolved.result).toBeDefined();
    expect(lowResolved.result.eventType === highResolved.result.eventType && lowResolved.result.points === highResolved.result.points).toBe(false);
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
    expect(interrupted.lastStep.result).toBeUndefined();

    const resolved = store.resolveKeyMoment({
      pendingId: snapshot.pendingKeyMoment.id,
      choiceId: snapshot.pendingKeyMoment.options[0].id,
    });
    expect(resolved.pausedForKeyMoment).toBe(false);
    expect(resolved.pausedForPendingPossession).toBe(false);
    expect(resolved.pendingPossession).toBeUndefined();
    expect(resolved.pendingKeyMoment).toBeUndefined();
    expect(resolved.lastStep.metrics.possessions).toBe(pendingMetrics + 1);
    expect(resolved.lastStep.result).toBeDefined();
  });

  it("exposes authoritative possession snapshots and debug traces for normal and resolved steps", () => {
    const context = createContext();
    const store = createMatchEngineStore();
    let snapshot = store.startMatch({
      home: context.home,
      away: context.away,
      userPlayerId: "h1",
      seed: 20260214,
      keyMomentRngChance: 1,
      totalSeconds: 48 * 60,
    });

    expect(snapshot.currentPossession).toEqual(snapshot.lastStep.state);
    expect(snapshot.lastTrace.kind).toBe("start");
    expect(snapshot.lastTrace.afterState).toEqual(snapshot.currentPossession);
    expect(snapshot.totalSeconds).toBe(48 * 60);
    expect(snapshot.matchContext.home.roster[0].name).toBeDefined();
    expect(snapshot.userPlayerLocation).toEqual({ teamKey: "home", playerIndex: 0 });

    do {
      snapshot = store.stepPossession();
    } while (!snapshot.pausedForPendingPossession);

    expect(snapshot.lastTrace.kind).toBe("step");
    expect(snapshot.lastTrace.pendingPossession).toBeDefined();
    expect(snapshot.lastTrace.afterState).toEqual(snapshot.pendingPossession.state);
    expect(snapshot.currentPossession).toEqual(snapshot.pendingPossession.state);

    snapshot = store.resolveKeyMoment({
      pendingId: snapshot.pendingKeyMoment.id,
      choiceId: snapshot.pendingKeyMoment.options[0].id,
    });

    expect(snapshot.lastTrace.kind).toBe("resolved_key_moment");
    expect(snapshot.lastTrace.result).toBeDefined();
    expect(snapshot.lastTrace.resolvedKeyMoment).toBeDefined();
    expect(snapshot.lastTrace.afterState).toEqual(snapshot.lastStep.result.nextState);
    expect(snapshot.currentPossession).toEqual(snapshot.lastStep.state);
  });

  it("suppresses key moments at the store layer in full_game mode", () => {
    const context = createContext();
    const store = createMatchEngineStore();
    let snapshot = store.startMatch({
      home: context.home,
      away: context.away,
      userPlayerId: "h1",
      seed: 20260214,
      keyMomentRngChance: 1,
      simulationMode: "full_game",
    });

    for (let i = 0; i < 40 && snapshot.currentPossession?.secondsRemaining > 0; i += 1) {
      snapshot = store.stepPossession();
      expect(snapshot.pausedForPendingPossession).toBe(false);
      expect(snapshot.pendingKeyMoment).toBeUndefined();
      expect(snapshot.pendingPossession).toBeUndefined();
    }

    expect(snapshot.simulationMode).toBe("full_game");
    expect(snapshot.lastTrace.kind).toBe("step");
  });
});
