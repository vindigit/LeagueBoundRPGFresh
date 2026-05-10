import { createKeyMomentScheduler } from "../../../match/keyMoments/scheduler";
import type { KeyMomentContext } from "../../../match/keyMoments/types";

const buildContext = (
  timeRemaining: number,
  possessionIndex: number,
  workRate: KeyMomentContext["workRate"],
  focus: KeyMomentContext["focus"] = "balanced",
  extras: Partial<Pick<KeyMomentContext, "coachTrust" | "staminaRating">> = {},
): KeyMomentContext => ({
  ...(() => {
    const periodLength = 720;
    const elapsed = Math.max(0, 2880 - timeRemaining);
    const quarter = Math.min(4, Math.floor(elapsed / periodLength) + 1) as 1 | 2 | 3 | 4;
    const elapsedInQuarter = elapsed - (quarter - 1) * periodLength;
    const periodTimeRemaining = Math.max(0, periodLength - elapsedInQuarter);
    return {
      periodKey: `Q${quarter}` as const,
      quarter,
      timeRemaining: periodTimeRemaining,
    };
  })(),
  id: `ctx-${possessionIndex}`,
  offense: possessionIndex % 2 === 0 ? "home" : "away",
  defense: possessionIndex % 2 === 0 ? "away" : "home",
  userTeam: "home",
  userPlayerIndex: 0,
  possessionIndex,
  score: { home: 0, away: 0 },
  workRate,
  focus,
  fatigue: 0.2,
  coachTrust: extras.coachTrust ?? 50,
  staminaRating: extras.staminaRating ?? 78,
});

describe("KeyMomentScheduler", () => {
  it("keeps whole-match pacing within a sane multi-quarter range", () => {
    const run = (workRate: KeyMomentContext["workRate"]): number[] => {
      const scheduler = createKeyMomentScheduler();
      const triggeredAt: number[] = [];

      for (let possessionIndex = 1; possessionIndex <= 280; possessionIndex += 1) {
        const elapsed = possessionIndex * 10;
        const timeRemaining = Math.max(0, 2880 - elapsed);
        const response = scheduler.onPossessionBoundary({
          context: buildContext(timeRemaining, possessionIndex, workRate),
          periodTotalSeconds: 720,
          matchTotalSeconds: 2880,
        });
        if (response.trigger) {
          triggeredAt.push(possessionIndex);
        }
      }

      return triggeredAt;
    };

    const normalTriggered = run("normal");
    expect(normalTriggered.length).toBeGreaterThanOrEqual(8);
    expect(normalTriggered.length).toBeLessThanOrEqual(20);
  });

  it("does not front-load moments into the first quarter", () => {
    const scheduler = createKeyMomentScheduler();
    const byQuarter = [0, 0, 0, 0];

    for (let possessionIndex = 1; possessionIndex <= 280; possessionIndex += 1) {
      const elapsed = possessionIndex * 10;
      const timeRemaining = Math.max(0, 2880 - elapsed);
      const context = buildContext(timeRemaining, possessionIndex, "normal");
      const response = scheduler.onPossessionBoundary({
        context,
        periodTotalSeconds: 720,
        matchTotalSeconds: 2880,
      });
      if (response.trigger) {
        byQuarter[context.quarter - 1] += 1;
      }
    }

    expect(byQuarter[0]).toBeLessThanOrEqual(4);
    expect(byQuarter[1]).toBeGreaterThanOrEqual(1);
    expect(byQuarter[2]).toBeGreaterThanOrEqual(1);
  });

  it("suppresses opportunities for low trust and low stamina profiles", () => {
    const run = (coachTrust: number, staminaRating: number): number[] => {
      const scheduler = createKeyMomentScheduler();
      const triggeredAt: number[] = [];

      for (let possessionIndex = 1; possessionIndex <= 280; possessionIndex += 1) {
        const elapsed = possessionIndex * 10;
        const timeRemaining = Math.max(0, 2880 - elapsed);
        const response = scheduler.onPossessionBoundary({
          context: buildContext(timeRemaining, possessionIndex, "normal", "balanced", { coachTrust, staminaRating }),
          periodTotalSeconds: 720,
          matchTotalSeconds: 2880,
        });
        if (response.trigger) {
          triggeredAt.push(possessionIndex);
        }
      }

      return triggeredAt;
    };

    const lowProfile = run(25, 40);
    const highProfile = run(80, 88);
    expect(lowProfile.length).toBeLessThan(highProfile.length);
  });

  it("allows critical-state forcing even when pacing would otherwise wait", () => {
    const scheduler = createKeyMomentScheduler();
    const first = scheduler.onPossessionBoundary({
      context: buildContext(2870, 1, "low"),
      periodTotalSeconds: 720,
      matchTotalSeconds: 2880,
    });
    const cooledDownBlocked = scheduler.onPossessionBoundary({
      context: buildContext(2860, 2, "low"),
      periodTotalSeconds: 720,
      matchTotalSeconds: 2880,
    });
    const critical = scheduler.onPossessionBoundary({
      context: buildContext(90, 5, "low"),
      periodTotalSeconds: 720,
      matchTotalSeconds: 2880,
      forceTrigger: true,
    });

    expect(first.trigger).toBe(false);
    expect(cooledDownBlocked.trigger).toBe(false);
    expect(critical.trigger).toBe(true);
  });

  it("only schedules defensive types on away offense possessions", () => {
    const scheduler = createKeyMomentScheduler();
    const triggeredTypes: string[] = [];

      for (let possessionIndex = 1; possessionIndex <= 280; possessionIndex += 1) {
        const elapsed = possessionIndex * 10;
        const timeRemaining = Math.max(0, 2880 - elapsed);
        const response = scheduler.onPossessionBoundary({
          context: buildContext(timeRemaining, possessionIndex, "high", "defense"),
          periodTotalSeconds: 720,
          matchTotalSeconds: 2880,
        });
        if (response.trigger && response.pending && response.pending.context.offense === "away") {
          triggeredTypes.push(response.pending.type);
      }
    }

    expect(triggeredTypes.every((type) => type === "on_ball_stop" || type === "jump_lane" || type === "foul_pressure")).toBe(true);
  });

  it("biases offense focus toward offensive moments and defense focus toward defensive moments", () => {
    const offenseScheduler = createKeyMomentScheduler();
    const defenseScheduler = createKeyMomentScheduler();
    const offenseFocusTypes = new Set<string>();
    const defenseFocusTypes = new Set<string>();

    for (let possessionIndex = 1; possessionIndex <= 280; possessionIndex += 1) {
      const elapsed = possessionIndex * 10;
      const timeRemaining = Math.max(0, 2880 - elapsed);
      const offensiveResponse = offenseScheduler.onPossessionBoundary({
        context: buildContext(timeRemaining, possessionIndex * 2, "normal", "offense"),
        periodTotalSeconds: 720,
        matchTotalSeconds: 2880,
        defenderTeamFoulsInSegment: possessionIndex % 10,
      });
      const defensiveResponse = defenseScheduler.onPossessionBoundary({
        context: buildContext(timeRemaining, possessionIndex * 2 + 1, "normal", "defense"),
        periodTotalSeconds: 720,
        matchTotalSeconds: 2880,
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

  it("gives high-trust players more clutch opportunities", () => {
    const run = (coachTrust: number): number => {
      const scheduler = createKeyMomentScheduler();
      let clutchMoments = 0;
      for (let possessionIndex = 1; possessionIndex <= 280; possessionIndex += 1) {
        const elapsed = possessionIndex * 10;
        const timeRemaining = Math.max(0, 2880 - elapsed);
        const response = scheduler.onPossessionBoundary({
          context: buildContext(timeRemaining, possessionIndex, "normal", "balanced", { coachTrust }),
          periodTotalSeconds: 720,
          matchTotalSeconds: 2880,
          forceTrigger: timeRemaining <= 120 && possessionIndex % 12 === 0,
        });
        if (response.trigger && timeRemaining <= 240) {
          clutchMoments += 1;
        }
      }
      return clutchMoments;
    };

    expect(run(80)).toBeGreaterThanOrEqual(run(25));
  });
});
