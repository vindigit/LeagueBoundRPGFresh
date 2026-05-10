jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { act } from "@testing-library/react-native";
import { useCareerStore } from "../src/store/useCareerStore";
import type { MatchBoxScore } from "../src/features/match/store/useMatchStore";

const makeBoxScore = (playerName: string, playerPoints: number): MatchBoxScore => ({
  homePlayers: [
    {
      id: "home-0",
      name: playerName,
      team: "home",
      pts: playerPoints,
      reb: 4,
      ast: 5,
      stl: 1,
      blk: 0,
      to: 2,
      fgm: Math.max(1, Math.floor(playerPoints / 2)),
      fga: Math.max(2, Math.floor(playerPoints / 2) + 4),
      ftm: 0,
      fta: 0,
      pf: 1,
    },
  ],
  awayPlayers: [
    {
      id: "away-0",
      name: "Rivals High",
      team: "away",
      pts: 12,
      reb: 3,
      ast: 2,
      stl: 1,
      blk: 0,
      to: 1,
      fgm: 5,
      fga: 11,
      ftm: 0,
      fta: 0,
      pf: 2,
    },
  ],
  homeTotals: { pts: playerPoints + 40, reb: 20, ast: 14, stl: 5, blk: 2, to: 9, fgm: 24, fga: 50, ftm: 0, fta: 0, pf: 8 },
  awayTotals: { pts: 48, reb: 18, ast: 10, stl: 4, blk: 1, to: 11, fgm: 19, fga: 46, ftm: 0, fta: 0, pf: 9 },
});

describe("Career vertical slice weekly loop", () => {
  beforeEach(() => {
    useCareerStore.getState().initializeCareer({
      firstName: "Loop",
      lastName: "Tester",
      stateCode: "TX",
      citySlug: "houston-tx",
      archetype: "Playmaker",
      ageStarted: 8,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "PG",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 2 },
      weightLbs: 185,
      generationSeed: 20260426,
    });
  });

  it("supports the four-match middle-school tournament before the high-school handoff", () => {
    const seeded = useCareerStore.getState();
    const playerName = seeded.player.name;
    const initialBank = seeded.player.bankBalance;
    const initialMorale = seeded.player.morale;
    const initialNewsCount = seeded.newsFeed.length;
    const initialCoachTrust = seeded.coachTrust;

    for (let cycle = 1; cycle <= 5; cycle += 1) {
      const beforeCycle = useCareerStore.getState();
      expect(beforeCycle.view).toBe("HUB");
      expect(beforeCycle.currentWeek).toBe(cycle <= 4 ? cycle : 1);
      expect(beforeCycle.weeklyActionState).toMatchObject({
        slotsRemaining: cycle <= 4 ? 2 : 3,
        matchUnlocked: false,
        postgamePending: false,
      });

      beforeCycle.takeWeeklyAction("FILM_COACH_TRUST");
      useCareerStore.getState().completeNarrativeEvent();
      useCareerStore.getState().takeWeeklyAction("STUDY");
      if (cycle > 4) {
        useCareerStore.getState().takeWeeklyAction("TEAM_BONDING");
      }

      const afterEvent = useCareerStore.getState();
      expect(afterEvent.view).toBe("HUB");
      expect(afterEvent.weeklyActionState.matchUnlocked).toBe(true);
      expect(afterEvent.weeklyActionState.postgamePending).toBe(false);
      expect(afterEvent.player.attributes.vision).toBeGreaterThanOrEqual(beforeCycle.player.attributes.vision);

      afterEvent.navigateToMatch();
      expect(useCareerStore.getState().view).toBe("MATCH");

      useCareerStore.getState().completeMatch({
        homeScore: 62 + cycle,
        awayScore: 48,
        overtimePeriods: 0,
        boxScore: makeBoxScore(playerName, 22 + cycle),
      });

      const afterMatch = useCareerStore.getState();
      expect(afterMatch.view).toBe("POSTGAME");
      expect(afterMatch.currentWeek).toBe(cycle <= 4 ? cycle : 1);
      const expectedWeekAfter = cycle === 4 ? 1 : cycle === 5 ? 2 : cycle + 1;
      expect(afterMatch.lastMatchResult?.weekAfter).toBe(expectedWeekAfter);
      expect(afterMatch.weeklyActionState).toMatchObject({
        matchUnlocked: true,
        postgamePending: true,
      });
      expect(afterMatch.newsFeed.length).toBeGreaterThanOrEqual(initialNewsCount + Math.max(0, cycle - 1));
      expect(afterMatch.player.bankBalance).toBeGreaterThanOrEqual(initialBank + 500 * (cycle - 1));
      expect(afterMatch.lastMatchResult?.matchRating).toBeGreaterThan(0);
      expect(afterMatch.lastMatchResult?.meterDeltas.energy).toBeLessThan(0);

      afterMatch.resolvePostgameAndAdvanceWeek();

      const resolved = useCareerStore.getState();
      if (cycle < 4) {
        expect(resolved.view).toBe("HUB");
        expect(resolved.pendingSchoolPathSelection).toBe(false);
        expect(resolved.middleSchoolTournament?.currentMatchIndex).toBe(cycle);
        continue;
      }

      if (cycle === 4) {
        expect(resolved.view).toBe("SCHOOL_PATH_SELECT");
        expect(resolved.pendingSchoolPathSelection).toBe(true);
        useCareerStore.getState().selectSchoolPath("STATE_5A");
        const afterSelection = useCareerStore.getState();
        expect(afterSelection.view).toBe("HUB");
        expect(afterSelection.leagueLevel).toBe("HIGH_SCHOOL");
        expect(afterSelection.careerPhase).toBe("HIGH_SCHOOL");
        expect(afterSelection.pendingSchoolPathSelection).toBe(false);
        expect(afterSelection.currentWeek).toBe(1);
        expect(afterSelection.weeklyActionState).toMatchObject({
          slotsTotal: 3,
          slotsRemaining: 3,
          matchUnlocked: false,
          postgamePending: false,
        });
        expect(afterSelection.newsFeed.length).toBeGreaterThanOrEqual(initialNewsCount + cycle + 1);
        expect(afterSelection.player.bankBalance).toBe(initialBank + 500 * cycle);
        expect(afterSelection.player.morale).toBe(initialMorale + 5 * cycle);
        expect(afterSelection.coachTrust).not.toBe(initialCoachTrust);
        expect(afterSelection.financeLedger).toHaveLength(cycle);
        expect(afterSelection.financeLedger.at(-1)).toMatchObject({
          type: "income",
          category: "match_reward",
          source: "match",
        });
        continue;
      }

      expect(resolved.view).toBe("HUB");
      expect(resolved.currentWeek).toBe(2);
      expect(resolved.weeklyActionState).toMatchObject({
        slotsTotal: 3,
        slotsRemaining: 3,
        matchUnlocked: false,
        postgamePending: false,
      });
      expect(resolved.newsFeed.length).toBeGreaterThanOrEqual(initialNewsCount + cycle + 1);
      expect(resolved.player.bankBalance).toBeGreaterThan(initialBank + 500 * cycle);
      expect(resolved.player.morale).toBeGreaterThanOrEqual(initialMorale + 5 * cycle);
      expect(resolved.energy).toBeLessThanOrEqual(100);
      expect(resolved.condition).toBeLessThanOrEqual(100);
      expect(resolved.financeLedger).toHaveLength(cycle);
      expect(resolved.financeLedger.at(-1)).toMatchObject({
        type: "income",
        category: "match_reward",
        source: "match",
      });
      expect((resolved.financeLedger.at(-1)?.amount ?? 0)).toBeGreaterThan(0);
    }
  });

  it("applies CourtFuel as a paid weekly action and exposes a dismissible result popup state", () => {
    act(() => {
      useCareerStore.setState((state) => ({
        player: {
          ...state.player,
          bankBalance: 40,
        },
        energy: 70,
        condition: 80,
      }));
    });

    useCareerStore.getState().takeWeeklyAction("COURTFUEL");

    const afterDrink = useCareerStore.getState();
    expect(afterDrink.energy).toBe(88);
    expect(afterDrink.condition).toBe(83);
    expect(afterDrink.player.bankBalance).toBe(15);
    expect(afterDrink.weeklyActionState.actionsTaken.at(-1)).toMatchObject({ id: "COURTFUEL" });
    expect(afterDrink.lastWeeklyActionResult).toMatchObject({
      actionId: "COURTFUEL",
      title: "CourtFuel — Tropical Surge",
      tagline: "Fuel the run.",
      moneyDelta: -25,
      energyDelta: 18,
      conditionDelta: 3,
    });
    expect(afterDrink.financeLedger.at(-1)).toMatchObject({
      type: "expense",
      category: "misc",
      description: "CourtFuel purchase",
      source: "weekly_action",
      amount: 25,
    });
    expect(afterDrink.lastWeeklyActionResult?.statusLabel).toBe("Added to your gym bag.");
    expect(afterDrink.courtFuelEconomy).toMatchObject({
      weeklyBought: 1,
      seasonBought: 1,
      lastPurchaseWeek: 1,
      lastPurchaseSeason: 1,
    });

    useCareerStore.getState().dismissWeeklyActionResult();
    expect(useCareerStore.getState().lastWeeklyActionResult).toBeNull();
  });

  it("does not allow CourtFuel when the player cannot afford it", () => {
    act(() => {
      useCareerStore.setState((state) => ({
        player: {
          ...state.player,
          bankBalance: 5,
        },
        energy: 70,
        condition: 80,
      }));
    });

    useCareerStore.getState().takeWeeklyAction("COURTFUEL");

    const blocked = useCareerStore.getState();
    expect(blocked.energy).toBe(70);
    expect(blocked.condition).toBe(80);
    expect(blocked.player.bankBalance).toBe(5);
    expect(blocked.weeklyActionState.actionsTaken).toHaveLength(0);
    expect(blocked.financeLedger).toHaveLength(0);
    expect(blocked.lastWeeklyActionResult).toBeNull();
  });

  it("inflates CourtFuel inside a week and resets weekly demand after week advance", () => {
    act(() => {
      useCareerStore.setState((state) => ({
        player: {
          ...state.player,
          bankBalance: 100,
        },
        energy: 40,
        condition: 40,
      }));
    });

    expect(useCareerStore.getState().getCourtFuelPrice()).toBe(25);
    useCareerStore.getState().takeWeeklyAction("COURTFUEL");
    expect(useCareerStore.getState().getCourtFuelPrice()).toBe(35);
    useCareerStore.getState().takeWeeklyAction("COURTFUEL");
    expect(useCareerStore.getState().getCourtFuelPrice()).toBe(46);

    useCareerStore.getState().advanceWeek();

    const afterAdvance = useCareerStore.getState();
    expect(afterAdvance.currentWeek).toBe(2);
    expect(afterAdvance.courtFuelEconomy).toMatchObject({
      weeklyBought: 0,
      seasonBought: 2,
    });
    expect(afterAdvance.getCourtFuelPrice()).toBe(27);
  });
});
