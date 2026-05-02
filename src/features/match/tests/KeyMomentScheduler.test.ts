import { createKeyMomentScheduler } from "../../../match/keyMoments/scheduler";
import type { KeyMomentContext } from "../../../match/keyMoments/types";

const buildContext = (
  timeRemaining: number,
  possessionIndex: number,
  workRate: KeyMomentContext["workRate"],
  focus: KeyMomentContext["focus"] = "balanced",
): KeyMomentContext => ({
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
  focus,
  fatigue: 0.2,
});

describe("KeyMomentScheduler", () => {
  it("uses higher workRate to schedule more moments per period", () => {
    const run = (workRate: KeyMomentContext["workRate"]): number[] => {
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

    const lowTriggered = run("low");
    const highTriggered = run("high");

    expect(highTriggered.length).toBeGreaterThan(lowTriggered.length);
  });

  it("uses lower workRate to increase cooldown spacing", () => {
    const run = (workRate: KeyMomentContext["workRate"]): number[] => {
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

    const lowTriggered = run("low");
    const highTriggered = run("high");
    const minSpacing = (triggers: number[]): number =>
      triggers.slice(1).reduce((smallest, trigger, index) => Math.min(smallest, trigger - triggers[index]), Number.POSITIVE_INFINITY);

    expect(minSpacing(lowTriggered)).toBeGreaterThanOrEqual(minSpacing(highTriggered));
  });

  it("allows critical-state forcing even when pacing would otherwise wait", () => {
    const scheduler = createKeyMomentScheduler();
    const first = scheduler.onPossessionBoundary({
      context: buildContext(710, 1, "low"),
      periodTotalSeconds: 720,
    });
    const cooledDownBlocked = scheduler.onPossessionBoundary({
      context: buildContext(700, 2, "low"),
      periodTotalSeconds: 720,
    });
    const critical = scheduler.onPossessionBoundary({
      context: buildContext(90, 5, "low"),
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
        context: buildContext(timeRemaining, possessionIndex, "high", "defense"),
        periodTotalSeconds: 720,
      });
      if (response.trigger && response.pending && response.pending.context.offense === "away") {
        triggeredTypes.push(response.pending.type);
      }
    }

    expect(triggeredTypes.every((type) => type === "on_ball_stop" || type === "jump_lane" || type === "foul_pressure")).toBe(true);
  });

  it("biases offense focus toward offensive moments and defense focus toward defensive moments", () => {
    const scheduler = createKeyMomentScheduler();
    const offenseFocusTypes = new Set<string>();
    const defenseFocusTypes = new Set<string>();

    for (let possessionIndex = 1; possessionIndex <= 90; possessionIndex += 1) {
      const elapsed = possessionIndex * 10;
      const timeRemaining = Math.max(0, 720 - elapsed);
      const offensiveResponse = scheduler.onPossessionBoundary({
        context: buildContext(timeRemaining, possessionIndex * 2, "normal", "offense"),
        periodTotalSeconds: 720,
        defenderTeamFoulsInSegment: possessionIndex % 10,
      });
      const defensiveResponse = scheduler.onPossessionBoundary({
        context: buildContext(timeRemaining, possessionIndex * 2 + 1, "normal", "defense"),
        periodTotalSeconds: 720,
        defenderTeamFoulsInSegment: possessionIndex % 10,
      });
      if (offensiveResponse.trigger && offensiveResponse.pending) {
        offenseFocusTypes.add(offensiveResponse.pending.type);
      }
      if (defensiveResponse.trigger && defensiveResponse.pending) {
        defenseFocusTypes.add(defensiveResponse.pending.type);
      }
    }

    expect([...offenseFocusTypes].some((type) => type === "create_shot" || type === "make_the_read" || type === "foul_pressure")).toBe(true);
    expect([...defenseFocusTypes].some((type) => type === "jump_lane" || type === "on_ball_stop" || type === "foul_pressure")).toBe(true);
  });
});
