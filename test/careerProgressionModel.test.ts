jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useCareerStore } from "../src/store/useCareerStore";
import { LeagueLevel } from "../src/types/career";
import type { MatchConsequence } from "../src/types/careerProgression";

describe("Career progression domain model", () => {
  beforeEach(() => {
    useCareerStore.getState().initializeCareer({
      firstName: "State",
      lastName: "Model",
      stateCode: "TX",
      citySlug: "houston-tx",
      archetype: "Playmaker",
      ageStarted: 8,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "PG",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 2 },
      weightLbs: 180,
      generationSeed: 20260425,
    });
  });

  it("pins the persisted store version for the expanded progression schema", () => {
    const version = (useCareerStore as unknown as { persist: { getOptions: () => { version?: number } } })
      .persist
      .getOptions().version;

    expect(version).toBe(15);
  });

  it("seeds initializeCareer with the new progression state", () => {
    const state = useCareerStore.getState();

    expect(state.careerPhase).toBe("MIDDLE_SCHOOL_AAU");
    expect(state.starRating).toBeGreaterThanOrEqual(1);
    expect(state.starRating).toBeLessThanOrEqual(5);
    expect(typeof state.scoutVisibility).toBe("number");
    expect(state.coachTrust).toBe(50);
    expect(state.fans).toBe(50);
    expect(state.teammates).toBe(50);
    expect(state.energy).toBe(100);
    expect(state.condition).toBe(100);
    expect(state.recentRatingTrend).toBe(0);
    expect(state.gpa).toBe(2.5);
    expect(state.teamInterestById).toEqual({});
    expect(state.schoolPath).toBe("LOCAL_3A");
    expect(state.pendingSchoolPathSelection).toBe(false);
    expect(state.offers).toEqual([]);
    expect(Array.isArray(state.seasonSchedule.weeks)).toBe(true);
    expect(state.relationships).toEqual({});
    expect(state.eligibility.status).toBe("ELIGIBLE");
    expect(state.injury).toBeNull();
    expect(state.wearTear).toBe(0);
    expect(state.financeState.ledger.nilEarnings).toBe(0);
    expect(state.financeLedger).toEqual([]);
    expect(state.legacyPerks).toEqual([]);
    expect(state.exileState.currentMode).toBe("NONE");
    expect(state.exile).toBeNull();
    expect(state.weeklyActionState).toMatchObject({
      slotsTotal: 2,
      slotsRemaining: 2,
      matchUnlocked: false,
      postgamePending: false,
    });
  });

  it("migrates a v7-style save into the richer progression model", () => {
    const migrate = (useCareerStore as unknown as { persist: { getOptions: () => { migrate?: (state: unknown) => unknown } } })
      .persist
      .getOptions().migrate;
    expect(migrate).toBeDefined();

    const current = useCareerStore.getState();
    const migrated = migrate?.({
      player: current.player,
      leagueLevel: LeagueLevel.COLLEGE,
      status: current.status,
      currentYear: 2028,
      seasonNumber: 3,
      currentWeek: 6,
      teamId: "houston-cougars",
      isGoatPath: current.isGoatPath,
      view: current.view,
      currentNarrativeFile: current.currentNarrativeFile,
      lastMatchResult: current.lastMatchResult,
      newsFeed: current.newsFeed,
      ovrBudget: 77,
      exile: "OVERSEAS",
    }) as ReturnType<typeof useCareerStore.getState>;

    expect(migrated.player.name).toBe(current.player.name);
    expect(migrated.careerPhase).toBe("COLLEGE");
    expect(migrated.starRating).toBeGreaterThanOrEqual(1);
    expect(migrated.starRating).toBeLessThanOrEqual(5);
    expect(migrated.scoutVisibility).toBeGreaterThan(0);
    expect(migrated.coachTrust).toBe(50);
    expect(migrated.fans).toBe(50);
    expect(migrated.teammates).toBe(50);
    expect(migrated.energy).toBe(100);
    expect(migrated.condition).toBe(100);
    expect(migrated.recentRatingTrend).toBe(0);
    expect(migrated.gpa).toBe(2.5);
    expect(migrated.schoolPath).toBe("LOCAL_3A");
    expect(migrated.pendingSchoolPathSelection).toBe(false);
    expect(migrated.offers).toEqual([]);
    expect(migrated.seasonSchedule.phase).toBe("COLLEGE");
    expect(migrated.relationships).toEqual({});
    expect(migrated.eligibility).toBeTruthy();
    expect(migrated.injury).toBeNull();
    expect(migrated.wearTear).toBe(0);
    expect(migrated.financeState).toBeTruthy();
    expect(migrated.financeLedger).toEqual([]);
    expect(migrated.legacyPerks).toEqual([]);
    expect(migrated.exileState.currentMode).toBe("OVERSEAS");
    expect(migrated.exileState.triggerReason).toBe("LEGACY_MIGRATION");
    expect(migrated.exile).toBe("OVERSEAS");
    expect(migrated.ovrBudget).toBe(77);
    expect(migrated.weeklyActionState).toMatchObject({
      slotsTotal: 3,
      slotsRemaining: 0,
      matchUnlocked: true,
      postgamePending: false,
    });
  });

  it("includes the new progression fields in persisted partialize output", () => {
    const partialize = (useCareerStore as unknown as { persist: { getOptions: () => { partialize?: (state: unknown) => unknown } } })
      .persist
      .getOptions().partialize;
    expect(partialize).toBeDefined();

    const partial = partialize?.(useCareerStore.getState()) as Record<string, unknown>;
    expect(partial).toHaveProperty("careerPhase");
    expect(partial).toHaveProperty("starRating");
    expect(partial).toHaveProperty("scoutVisibility");
    expect(partial).toHaveProperty("coachTrust");
    expect(partial).toHaveProperty("fans");
    expect(partial).toHaveProperty("teammates");
    expect(partial).toHaveProperty("energy");
    expect(partial).toHaveProperty("condition");
    expect(partial).toHaveProperty("recentRatingTrend");
    expect(partial).toHaveProperty("gpa");
    expect(partial).toHaveProperty("teamInterestById");
    expect(partial).toHaveProperty("schoolPath");
    expect(partial).toHaveProperty("pendingSchoolPathSelection");
    expect(partial).toHaveProperty("offers");
    expect(partial).toHaveProperty("seasonSchedule");
    expect(partial).toHaveProperty("relationships");
    expect(partial).toHaveProperty("eligibility");
    expect(partial).toHaveProperty("injury");
    expect(partial).toHaveProperty("wearTear");
    expect(partial).toHaveProperty("financeState");
    expect(partial).toHaveProperty("financeLedger");
    expect(partial).toHaveProperty("legacyPerks");
    expect(partial).toHaveProperty("exileState");
    expect(partial).toHaveProperty("weeklyActionState");
  });

  it("lets the optional study action raise GPA once per week", () => {
    const before = useCareerStore.getState();

    before.completeStudyActivity();
    const afterFirstStudy = useCareerStore.getState();
    expect(afterFirstStudy.gpa).toBe(2.6);
    expect(afterFirstStudy.weeklyActionState.actionsTaken.some((action) => action.id === "STUDY")).toBe(true);
    expect(afterFirstStudy.weeklyActionState.slotsRemaining).toBe(1);

    afterFirstStudy.completeStudyActivity();
    const afterSecondStudy = useCareerStore.getState();
    expect(afterSecondStudy.gpa).toBe(2.6);
  });

  it("blocks match navigation below a 2.0 GPA during academic phases and restores it on recovery", () => {
    useCareerStore.getState().takeWeeklyAction("TRAIN_SHOOTING");
    useCareerStore.getState().takeWeeklyAction("STUDY");
    useCareerStore.getState().adjustGpa(-0.8, "SYSTEM");

    useCareerStore.getState().navigateToMatch();
    const blockedState = useCareerStore.getState();
    expect(blockedState.gpa).toBe(1.8);
    expect(blockedState.eligibility.status).toBe("INELIGIBLE");
    expect(blockedState.view).toBe("HUB");

    useCareerStore.getState().adjustGpa(0.2, "SYSTEM");
    useCareerStore.getState().navigateToMatch();
    const recoveredState = useCareerStore.getState();
    expect(recoveredState.gpa).toBe(2);
    expect(recoveredState.eligibility.status).toBe("ELIGIBLE");
    expect(recoveredState.view).toBe("MATCH");
  });

  it("does not apply the GPA gate in the pro phase", () => {
    useCareerStore.getState().updateLeagueLevel(LeagueLevel.PRO);
    useCareerStore.getState().takeWeeklyAction("TRAIN_SHOOTING");
    useCareerStore.getState().takeWeeklyAction("TRAIN_FINISHING");
    useCareerStore.getState().takeWeeklyAction("REST_RECOVERY");
    useCareerStore.getState().adjustGpa(-0.7, "SYSTEM");

    useCareerStore.getState().navigateToMatch();
    const state = useCareerStore.getState();
    expect(state.gpa).toBe(1.8);
    expect(state.view).toBe("MATCH");
    expect(state.eligibility.status).toBe("ELIGIBLE");
  });

  it("soft-commits one high-school offer and blocks future recruiting offers", () => {
    actToHighSchool();

    const beforeAccept = useCareerStore.getState();
    const acceptedOfferId = beforeAccept.offers.find((offer) => offer.status === "AVAILABLE")?.id;
    expect(acceptedOfferId).toBeTruthy();

    useCareerStore.getState().respondToOffer(acceptedOfferId!, "ACCEPT");

    const acceptedState = useCareerStore.getState();
    expect(acceptedState.offers.filter((offer) => offer.status === "ACCEPTED")).toHaveLength(1);
    expect(acceptedState.offers.filter((offer) => offer.status === "AVAILABLE")).toHaveLength(0);
    expect(acceptedState.offers.filter((offer) => offer.status === "DECLINED").length).toBeGreaterThan(0);

    const acceptedTeamId = acceptedState.offers.find((offer) => offer.status === "ACCEPTED")?.sourceTeamId;
    const boostedInterest = Object.fromEntries(
      Object.keys(acceptedState.teamInterestById).map((teamId) => [teamId, 100]),
    );
    useCareerStore.setState((state) => ({
      ...state,
      currentWeek: state.currentWeek + 1,
      teamInterestById: boostedInterest,
    }));
    useCareerStore.getState().applyTeamInterestDelta("all", 0);

    const afterRegeneration = useCareerStore.getState();
    expect(afterRegeneration.offers.filter((offer) => offer.status === "ACCEPTED")).toHaveLength(1);
    expect(afterRegeneration.offers.filter((offer) => offer.status === "AVAILABLE")).toHaveLength(0);
    expect(afterRegeneration.offers.find((offer) => offer.status === "ACCEPTED")?.sourceTeamId).toBe(acceptedTeamId);
  });

  it("declines an offer without allowing that school to re-offer in the same cycle", () => {
    actToHighSchool();

    const initialState = useCareerStore.getState();
    const declinedOffer = initialState.offers.find((offer) => offer.status === "AVAILABLE");
    expect(declinedOffer).toBeTruthy();

    useCareerStore.getState().respondToOffer(declinedOffer!.id, "DECLINE");

    const afterDecline = useCareerStore.getState();
    expect(afterDecline.offers.find((offer) => offer.id === declinedOffer!.id)?.status).toBe("DECLINED");

    useCareerStore.setState((state) => ({
      ...state,
      currentWeek: state.currentWeek + 1,
      teamInterestById: {
        ...state.teamInterestById,
        [declinedOffer!.sourceTeamId]: 100,
      },
    }));
    useCareerStore.getState().applyTeamInterestDelta(declinedOffer!.sourceTeamId, 0);

    const afterRegen = useCareerStore.getState();
    expect(afterRegen.offers.find((offer) => offer.sourceTeamId === declinedOffer!.sourceTeamId)?.status).toBe("DECLINED");
  });

  it("ignores non-recruiting offers when responding to an offer", () => {
    actToHighSchool();

    useCareerStore.setState((state) => ({
      ...state,
      offers: [
        ...state.offers,
        {
          id: "nil-1",
          sourceTeamId: "sponsor-1",
          sourceLabel: "Sponsor One",
          exposureTier: "National",
          type: "NIL",
          phases: ["COLLEGE"],
          projectedRole: "STAR",
          interestLevel: 95,
          status: "AVAILABLE",
          createdWeek: state.currentWeek,
          expiresWeek: state.currentWeek + 2,
          tags: ["COLLEGE", "NIL"],
        },
      ],
    }));

    useCareerStore.getState().respondToOffer("nil-1", "DECLINE");

    expect(useCareerStore.getState().offers.find((offer) => offer.id === "nil-1")?.status).toBe("AVAILABLE");
  });

  it("backfills missing offer exposure tiers during migration", () => {
    const migrate = (useCareerStore as unknown as { persist: { getOptions: () => { migrate?: (state: unknown) => unknown } } })
      .persist
      .getOptions().migrate;
    expect(migrate).toBeDefined();

    const current = useCareerStore.getState();
    const migrated = migrate?.({
      ...current,
      leagueLevel: LeagueLevel.HIGH_SCHOOL,
      careerPhase: "HIGH_SCHOOL",
      schoolPath: "STATE_5A",
      offers: [
        {
          id: "legacy-offer",
          sourceTeamId: "duke-blue-devils",
          sourceLabel: "Duke Blue Devils",
          type: "SCHOLARSHIP",
          phases: ["HIGH_SCHOOL"],
          projectedRole: "STAR",
          scholarshipPercent: 90,
          interestLevel: 92,
          status: "AVAILABLE",
          createdWeek: 2,
          expiresWeek: 4,
          tags: ["HIGH_SCHOOL", "SCHOLARSHIP", "duke-blue-devils"],
        },
      ],
      teamInterestById: {
        "duke-blue-devils": 92,
      },
    }) as ReturnType<typeof useCareerStore.getState>;

    expect(migrated.offers[0]?.exposureTier).toBe("Blue Blood");
  });

  it("creates, persists, and recovers a minor ankle sprain across week advancement", () => {
    const consequences: MatchConsequence[] = [
      {
        kind: "injury",
        injuryType: "ankle_sprain",
        severity: "minor",
        weeksRemaining: 2,
        performanceMultiplier: 0.88,
        canPlayThrough: true,
        wearTearDelta: 10,
      },
    ];

    useCareerStore.getState().completeMatch({
      homeScore: 61,
      awayScore: 55,
      overtimePeriods: 0,
      consequences,
      boxScore: {
        homePlayers: [],
        awayPlayers: [],
        homeTotals: { pts: 61, reb: 20, ast: 12, stl: 4, blk: 2, to: 9, fgm: 24, fga: 48, ftm: 6, fta: 8, pf: 8 },
        awayTotals: { pts: 55, reb: 18, ast: 11, stl: 3, blk: 1, to: 10, fgm: 21, fga: 46, ftm: 7, fta: 9, pf: 9 },
      },
    });

    const injured = useCareerStore.getState();
    expect(injured.injury).toMatchObject({
      type: "ankle_sprain",
      severity: "minor",
      createdWeek: injured.currentWeek,
      weeksRemaining: 2,
      performanceMultiplier: 0.88,
      canPlayThrough: true,
    });
    expect(injured.wearTear).toBe(10);
    expect(injured.lastMatchResult?.consequences).toEqual(consequences);
    expect(injured.lastMatchResult?.matchRating).toBeLessThanOrEqual(10);
    expect(injured.lastMatchResult?.meterDeltas.condition).toBeLessThan(0);

    const partialize = (useCareerStore as unknown as { persist: { getOptions: () => { partialize?: (state: unknown) => unknown } } })
      .persist
      .getOptions().partialize;
    const persisted = partialize?.(injured) as Record<string, unknown>;
    expect(persisted.injury).toMatchObject({
      type: "ankle_sprain",
      weeksRemaining: 2,
    });

    useCareerStore.getState().resolvePostgameAndAdvanceWeek();
    const afterOneWeek = useCareerStore.getState();
    expect(afterOneWeek.injury?.weeksRemaining).toBe(2);
    expect(afterOneWeek.wearTear).toBe(5);
    expect(afterOneWeek.condition).toBeLessThan(100);

    useCareerStore.getState().advanceWeek();
    const afterTwoWeeks = useCareerStore.getState();
    expect(afterTwoWeeks.injury?.weeksRemaining).toBe(1);
    expect(afterTwoWeeks.wearTear).toBe(0);

    useCareerStore.getState().advanceWeek();
    const recovered = useCareerStore.getState();
    expect(recovered.injury).toBeNull();
    expect(recovered.wearTear).toBe(0);
  });

  it("keeps personal rating separate from team result", () => {
    useCareerStore.getState().completeMatch({
      homeScore: 55,
      awayScore: 62,
      overtimePeriods: 0,
      boxScore: {
        homePlayers: [
          {
            id: "home-0",
            name: useCareerStore.getState().player.name,
            team: "home",
            pts: 28,
            reb: 6,
            ast: 8,
            stl: 2,
            blk: 0,
            to: 2,
            fgm: 10,
            fga: 17,
            ftm: 0,
            fta: 0,
            pf: 1,
          },
        ],
        awayPlayers: [],
        homeTotals: { pts: 55, reb: 22, ast: 16, stl: 5, blk: 1, to: 10, fgm: 23, fga: 49, ftm: 0, fta: 0, pf: 8 },
        awayTotals: { pts: 62, reb: 21, ast: 14, stl: 4, blk: 2, to: 9, fgm: 25, fga: 48, ftm: 0, fta: 0, pf: 9 },
      },
    });
    const strongLossRating = useCareerStore.getState().lastMatchResult?.matchRating ?? 0;

    useCareerStore.getState().resolvePostgameAndAdvanceWeek();
    useCareerStore.getState().completeNarrativeEvent();
    useCareerStore.getState().completeMatch({
      homeScore: 61,
      awayScore: 58,
      overtimePeriods: 0,
      boxScore: {
        homePlayers: [
          {
            id: "home-0",
            name: useCareerStore.getState().player.name,
            team: "home",
            pts: 8,
            reb: 2,
            ast: 1,
            stl: 0,
            blk: 0,
            to: 5,
            fgm: 3,
            fga: 13,
            ftm: 0,
            fta: 0,
            pf: 2,
          },
        ],
        awayPlayers: [],
        homeTotals: { pts: 61, reb: 22, ast: 12, stl: 4, blk: 1, to: 12, fgm: 24, fga: 52, ftm: 0, fta: 0, pf: 8 },
        awayTotals: { pts: 58, reb: 20, ast: 11, stl: 3, blk: 1, to: 11, fgm: 22, fga: 50, ftm: 0, fta: 0, pf: 10 },
      },
    });
    const poorWinRating = useCareerStore.getState().lastMatchResult?.matchRating ?? 10;

    expect(strongLossRating).toBeGreaterThan(poorWinRating);
  });
});

const actToHighSchool = () => {
  useCareerStore.getState().takeWeeklyAction("FILM_COACH_TRUST");
  useCareerStore.getState().completeNarrativeEvent();
  useCareerStore.getState().takeWeeklyAction("STUDY");
  useCareerStore.getState().completeMatch({
    homeScore: 68,
    awayScore: 54,
    overtimePeriods: 0,
    boxScore: {
      homePlayers: [
        {
          id: "home-0",
          name: useCareerStore.getState().player.name,
          team: "home",
          pts: 24,
          reb: 5,
          ast: 7,
          stl: 2,
          blk: 0,
          to: 2,
          fgm: 9,
          fga: 16,
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
          pts: 16,
          reb: 4,
          ast: 2,
          stl: 1,
          blk: 0,
          to: 3,
          fgm: 6,
          fga: 14,
          ftm: 0,
          fta: 0,
          pf: 2,
        },
      ],
      homeTotals: { pts: 68, reb: 24, ast: 18, stl: 6, blk: 1, to: 10, fgm: 26, fga: 52, ftm: 0, fta: 0, pf: 8 },
      awayTotals: { pts: 54, reb: 19, ast: 10, stl: 4, blk: 1, to: 12, fgm: 21, fga: 48, ftm: 0, fta: 0, pf: 10 },
    },
  });
  useCareerStore.getState().resolvePostgameAndAdvanceWeek();
  useCareerStore.getState().selectSchoolPath("STATE_5A");
};
