import { createKeyMomentScheduler } from "../../../match/keyMoments/scheduler";
import type { KeyMomentContext } from "../../../match/keyMoments/types";

const buildContext = (timeRemaining: number, possessionIndex: number): KeyMomentContext => ({
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
});

describe("KeyMomentScheduler", () => {
  it("guarantees six moments in a regulation period and respects cooldown", () => {
    const scheduler = createKeyMomentScheduler({ targetPerPeriod: 6, cooldownPossessions: 1 });
    const triggeredAt: number[] = [];

    for (let possessionIndex = 1; possessionIndex <= 70; possessionIndex += 1) {
      const elapsed = possessionIndex * 10;
      const timeRemaining = Math.max(0, 720 - elapsed);
      const response = scheduler.onPossessionBoundary({
        context: buildContext(timeRemaining, possessionIndex),
        periodTotalSeconds: 720,
      });
      if (response.trigger) {
        triggeredAt.push(possessionIndex);
      }
    }

    expect(triggeredAt.length).toBe(6);
    for (let i = 1; i < triggeredAt.length; i += 1) {
      expect(triggeredAt[i] - triggeredAt[i - 1]).toBeGreaterThan(1);
    }
  });

  it("only schedules defensive types on away offense possessions", () => {
    const scheduler = createKeyMomentScheduler({ targetPerPeriod: 6, cooldownPossessions: 1 });
    const triggeredTypes: string[] = [];

    for (let possessionIndex = 1; possessionIndex <= 70; possessionIndex += 1) {
      const elapsed = possessionIndex * 10;
      const timeRemaining = Math.max(0, 720 - elapsed);
      const response = scheduler.onPossessionBoundary({
        context: buildContext(timeRemaining, possessionIndex),
        periodTotalSeconds: 720,
      });
      if (response.trigger && response.pending) {
        if (response.pending.context.offense === "away") {
          triggeredTypes.push(response.pending.type);
        }
      }
    }

    expect(triggeredTypes.every((type) => type === "on_ball_stop" || type === "jump_lane")).toBe(true);
  });
});
