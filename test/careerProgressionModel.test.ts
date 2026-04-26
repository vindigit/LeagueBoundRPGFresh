jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useCareerStore } from "../src/store/useCareerStore";
import { LeagueLevel } from "../src/types/career";

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

    expect(version).toBe(9);
  });

  it("seeds initializeCareer with the new progression state", () => {
    const state = useCareerStore.getState();

    expect(state.careerPhase).toBe("MIDDLE_SCHOOL_AAU");
    expect(state.starRating).toBeGreaterThanOrEqual(1);
    expect(state.starRating).toBeLessThanOrEqual(5);
    expect(typeof state.scoutVisibility).toBe("number");
    expect(state.teamInterestById).toEqual({});
    expect(state.schoolPath).toBe("LOCAL_3A");
    expect(state.offers).toEqual([]);
    expect(Array.isArray(state.seasonSchedule.weeks)).toBe(true);
    expect(state.relationships).toEqual({});
    expect(state.eligibility.status).toBe("ELIGIBLE");
    expect(state.injuryState.status).toBe("HEALTHY");
    expect(state.financeState.ledger.nilEarnings).toBe(0);
    expect(state.legacyPerks).toEqual([]);
    expect(state.exileState.currentMode).toBe("NONE");
    expect(state.exile).toBeNull();
    expect(state.weeklyLoop).toEqual({
      eventCompleted: false,
      matchCompleted: false,
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
    expect(migrated.schoolPath).toBe("LOCAL_3A");
    expect(migrated.offers).toEqual([]);
    expect(migrated.seasonSchedule.phase).toBe("COLLEGE");
    expect(migrated.relationships).toEqual({});
    expect(migrated.eligibility).toBeTruthy();
    expect(migrated.injuryState.status).toBe("HEALTHY");
    expect(migrated.financeState).toBeTruthy();
    expect(migrated.legacyPerks).toEqual([]);
    expect(migrated.exileState.currentMode).toBe("OVERSEAS");
    expect(migrated.exileState.triggerReason).toBe("LEGACY_MIGRATION");
    expect(migrated.exile).toBe("OVERSEAS");
    expect(migrated.ovrBudget).toBe(77);
    expect(migrated.weeklyLoop).toEqual({
      eventCompleted: true,
      matchCompleted: false,
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
    expect(partial).toHaveProperty("teamInterestById");
    expect(partial).toHaveProperty("schoolPath");
    expect(partial).toHaveProperty("offers");
    expect(partial).toHaveProperty("seasonSchedule");
    expect(partial).toHaveProperty("relationships");
    expect(partial).toHaveProperty("eligibility");
    expect(partial).toHaveProperty("injuryState");
    expect(partial).toHaveProperty("financeState");
    expect(partial).toHaveProperty("legacyPerks");
    expect(partial).toHaveProperty("exileState");
    expect(partial).toHaveProperty("weeklyLoop");
  });
});
