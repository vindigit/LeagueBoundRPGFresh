jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

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

  it("supports three full event to match to postgame to week-resolution loops in a row", () => {
    const seeded = useCareerStore.getState();
    const playerName = seeded.player.name;
    const initialBank = seeded.player.bankBalance;
    const initialMorale = seeded.player.morale;
    const initialNewsCount = seeded.newsFeed.length;

    for (let cycle = 1; cycle <= 3; cycle += 1) {
      const beforeCycle = useCareerStore.getState();
      expect(beforeCycle.view).toBe("HUB");
      expect(beforeCycle.currentWeek).toBe(cycle);
      expect(beforeCycle.weeklyLoop).toEqual({
        eventCompleted: false,
        matchCompleted: false,
        postgamePending: false,
        studyCompleted: false,
      });

      beforeCycle.applyAttributeGain("vision", 1, "NARRATIVE");
      beforeCycle.completeNarrativeEvent();

      const afterEvent = useCareerStore.getState();
      expect(afterEvent.view).toBe("HUB");
      expect(afterEvent.weeklyLoop.eventCompleted).toBe(true);
      expect(afterEvent.weeklyLoop.matchCompleted).toBe(false);
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
      expect(afterMatch.currentWeek).toBe(cycle);
      expect(afterMatch.weeklyLoop).toEqual({
        eventCompleted: true,
        matchCompleted: true,
        postgamePending: true,
        studyCompleted: false,
      });
      const expectedNewsBeforeResolution = cycle === 1 ? initialNewsCount : initialNewsCount + cycle;
      expect(afterMatch.newsFeed.length).toBe(expectedNewsBeforeResolution);
      expect(afterMatch.player.bankBalance).toBeGreaterThanOrEqual(initialBank + 500 * (cycle - 1));

      afterMatch.resolvePostgameAndAdvanceWeek();

      const resolved = useCareerStore.getState();
      if (cycle === 1) {
        expect(resolved.view).toBe("SCHOOL_PATH_SELECT");
        expect(resolved.pendingSchoolPathSelection).toBe(true);
        useCareerStore.getState().selectSchoolPath("STATE_5A");
        const afterSelection = useCareerStore.getState();
        expect(afterSelection.view).toBe("HUB");
        expect(afterSelection.leagueLevel).toBe("HIGH_SCHOOL");
        expect(afterSelection.careerPhase).toBe("HIGH_SCHOOL");
        expect(afterSelection.pendingSchoolPathSelection).toBe(false);
        expect(afterSelection.currentWeek).toBe(cycle + 1);
        expect(afterSelection.weeklyLoop).toEqual({
          eventCompleted: false,
          matchCompleted: false,
          postgamePending: false,
          studyCompleted: false,
        });
        expect(afterSelection.newsFeed.length).toBe(initialNewsCount + cycle + 1);
        expect(afterSelection.player.bankBalance).toBe(initialBank + 500 * cycle);
        expect(afterSelection.player.morale).toBe(initialMorale + 5 * cycle);
        expect(afterSelection.financeLedger).toHaveLength(cycle);
        expect(afterSelection.financeLedger.at(-1)).toMatchObject({
          type: "income",
          category: "match_reward",
          source: "match",
        });
        continue;
      }

      expect(resolved.view).toBe("HUB");
      expect(resolved.currentWeek).toBe(cycle + 1);
      expect(resolved.weeklyLoop).toEqual({
        eventCompleted: false,
        matchCompleted: false,
        postgamePending: false,
        studyCompleted: false,
      });
      expect(resolved.newsFeed.length).toBe(initialNewsCount + cycle + 1);
      expect(resolved.player.bankBalance).toBeGreaterThan(initialBank + 500 * cycle);
      expect(resolved.player.morale).toBeGreaterThanOrEqual(initialMorale + 5 * cycle);
      expect(resolved.financeLedger).toHaveLength(cycle);
      expect(resolved.financeLedger.at(-1)).toMatchObject({
        type: "income",
        category: "match_reward",
        source: "match",
      });
      expect((resolved.financeLedger.at(-1)?.amount ?? 0)).toBeGreaterThan(0);
    }
  });
});
