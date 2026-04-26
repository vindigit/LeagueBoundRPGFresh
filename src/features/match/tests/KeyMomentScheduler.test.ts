import { createKeyMomentScheduler } from "../../../match/keyMoments/scheduler";
import type { KeyMomentContext } from "../../../match/keyMoments/types";

const buildContext = (timeRemaining: number, possessionIndex: number, workRate: number): KeyMomentContext => ({
  id: `ctx-${possessionIndex}`,
  periodKey: "Q1",
  quarter: 1,
  timeRemaining,
  offense: possessionIndex % 2 === 0 ? "home" : "away",
  defense: possessionIndex % 2 === 0 ? "away" : "home",
  userTeam: "home",
  userPlayerIndex: 0,
  possessionIndex,
  score: { home: 0, away: 0 },
  workRate,
  focus: 50,
});

describe("KeyMomentScheduler", () => {
  it("uses higher workRate to schedule more moments per period", () => {
    const run = (workRate: number): number[] => {
      const scheduler = createKeyMomentScheduler();
      const triggeredAt: number[] = [];

      for (let possessionIndex = 1; possessionIndex <= 70; possessionIndex += 1) {
        const elapsed = possessionIndex * 10;
        const timeRemaining = Math.max(0, 720 - elapsed);
        const response = scheduler.onPossessionBoundary({
          context: buildContext(timeRemaining, possessionIndex, workRate),
          periodTotalSeconds: 720,
        });
        if (response.trigger) {
          triggeredAt.push(possessionIndex);
        }
      }

      return triggeredAt;
    };

    const lowTriggered = run(20);
    const highTriggered = run(85);

    expect(highTriggered.length).toBeGreaterThan(lowTriggered.length);
  });

  it("uses lower workRate to increase cooldown spacing", () => {
    const run = (workRate: number): number[] => {
      const scheduler = createKeyMomentScheduler();
      const triggeredAt: number[] = [];

      for (let possessionIndex = 1; possessionIndex <= 70; possessionIndex += 1) {
        const elapsed = possessionIndex * 10;
        const timeRemaining = Math.max(0, 720 - elapsed);
        const response = scheduler.onPossessionBoundary({
          context: buildContext(timeRemaining, possessionIndex, workRate),
          periodTotalSeconds: 720,
        });
        if (response.trigger) {
          triggeredAt.push(possessionIndex);
        }
      }

      return triggeredAt;
    };

    const lowTriggered = run(20);
    const highTriggered = run(85);
    const minSpacing = (triggers: number[]): number =>
      triggers.slice(1).reduce((smallest, trigger, index) => Math.min(smallest, trigger - triggers[index]), Number.POSITIVE_INFINITY);

    expect(minSpacing(lowTriggered)).toBeGreaterThan(minSpacing(highTriggered));
  });

  it("allows critical-state forcing even when pacing would otherwise wait", () => {
    const scheduler = createKeyMomentScheduler();
    const first = scheduler.onPossessionBoundary({
      context: buildContext(710, 1, 20),
      periodTotalSeconds: 720,
    });
    const cooledDownBlocked = scheduler.onPossessionBoundary({
      context: buildContext(700, 2, 20),
      periodTotalSeconds: 720,
    });
    const critical = scheduler.onPossessionBoundary({
      context: buildContext(90, 5, 20),
      periodTotalSeconds: 720,
      forceTrigger: true,
    });

    expect(first.trigger).toBe(true);
    expect(cooledDownBlocked.trigger).toBe(false);
    expect(critical.trigger).toBe(true);
  });

  it("only schedules defensive types on away offense possessions", () => {
    const scheduler = createKeyMomentScheduler();
    const triggeredTypes: string[] = [];

    for (let possessionIndex = 1; possessionIndex <= 70; possessionIndex += 1) {
      const elapsed = possessionIndex * 10;
      const timeRemaining = Math.max(0, 720 - elapsed);
      const response = scheduler.onPossessionBoundary({
        context: buildContext(timeRemaining, possessionIndex, 80),
        periodTotalSeconds: 720,
      });
      if (response.trigger && response.pending) {
        if (response.pending.context.offense === "away") {
          triggeredTypes.push(response.pending.type);
        }
      }
    }

    expect(triggeredTypes.every((type) => type === "on_ball_stop" || type === "jump_lane" || type === "foul_pressure")).toBe(true);
  });

  it("can schedule foul_pressure in both offensive and defensive pools", () => {
    const scheduler = createKeyMomentScheduler();
    const offensiveTypes = new Set<string>();
    const defensiveTypes = new Set<string>();

    for (let possessionIndex = 1; possessionIndex <= 90; possessionIndex += 1) {
      const elapsed = possessionIndex * 10;
      const timeRemaining = Math.max(0, 720 - elapsed);
      const response = scheduler.onPossessionBoundary({
        context: buildContext(timeRemaining, possessionIndex, 80),
        periodTotalSeconds: 720,
        defenderTeamFoulsInSegment: possessionIndex % 10,
      });
      if (response.trigger && response.pending) {
        if (response.pending.context.offense === response.pending.context.userTeam) {
          offensiveTypes.add(response.pending.type);
        } else {
          defensiveTypes.add(response.pending.type);
        }
      }
    }

    expect(offensiveTypes.has("foul_pressure")).toBe(true);
    expect(defensiveTypes.has("foul_pressure")).toBe(true);
  });
});
