jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { loadNarrativeInkManager } from "../src/narrative/inkManager";
import { useCareerStore } from "../src/store/useCareerStore";
import type { SchoolPath } from "../src/types/careerProgression";

const makeBoxScore = () => ({
  homePlayers: [
      {
        id: "home-0",
        name: "Path Tester",
        team: "home" as const,
      pts: 24,
      reb: 5,
      ast: 6,
      stl: 1,
      blk: 0,
      to: 2,
      fgm: 9,
      fga: 16,
      ftm: 4,
      fta: 5,
      pf: 1,
    },
  ],
  awayPlayers: [
      {
        id: "away-0",
        name: "Rivals High",
        team: "away" as const,
      pts: 18,
      reb: 4,
      ast: 3,
      stl: 1,
      blk: 0,
      to: 3,
      fgm: 7,
      fga: 15,
      ftm: 2,
      fta: 3,
      pf: 2,
    },
  ],
  homeTotals: { pts: 66, reb: 22, ast: 16, stl: 6, blk: 2, to: 10, fgm: 25, fga: 50, ftm: 8, fta: 10, pf: 7 },
  awayTotals: { pts: 54, reb: 19, ast: 10, stl: 4, blk: 1, to: 12, fgm: 21, fga: 47, ftm: 4, fta: 6, pf: 9 },
});

const initializeCareer = () => {
  useCareerStore.getState().initializeCareer({
    firstName: "Path",
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
    generationSeed: 20260429,
  });
};

const finishTutorialAndSelectPath = (path: SchoolPath) => {
  const state = useCareerStore.getState();
  state.completeNarrativeEvent();
  state.navigateToMatch();
  useCareerStore.getState().completeMatch({
    homeScore: 62,
    awayScore: 50,
    overtimePeriods: 0,
    boxScore: makeBoxScore(),
  });
  useCareerStore.getState().resolvePostgameAndAdvanceWeek();
  useCareerStore.getState().selectSchoolPath(path);
};

describe("School path selection", () => {
  beforeEach(() => {
    initializeCareer();
  });

  it("promotes the tutorial player into high school when a path is selected", () => {
    finishTutorialAndSelectPath("PREP");

    const state = useCareerStore.getState();
    expect(state.schoolPath).toBe("PREP");
    expect(state.leagueLevel).toBe("HIGH_SCHOOL");
    expect(state.careerPhase).toBe("HIGH_SCHOOL");
    expect(state.pendingSchoolPathSelection).toBe(false);
    expect(state.view).toBe("HUB");
    expect(state.relationships["fanbase-hometown"]?.type).toBe("FANBASE");
    expect(Object.keys(state.teamInterestById).length).toBeGreaterThan(0);
  });

  it("does not retrigger the selector once a path has been chosen", () => {
    finishTutorialAndSelectPath("STATE_5A");
    useCareerStore.getState().resolvePostgameAndAdvanceWeek();

    const state = useCareerStore.getState();
    expect(state.pendingSchoolPathSelection).toBe(false);
    expect(state.view).toBe("HUB");
  });

  it("creates different high school reward trajectories by path", () => {
    const runPath = (path: SchoolPath) => {
      initializeCareer();
      finishTutorialAndSelectPath(path);
      const before = useCareerStore.getState();
      before.completeNarrativeEvent();
      before.navigateToMatch();
      useCareerStore.getState().completeMatch({
        homeScore: 68,
        awayScore: 55,
        overtimePeriods: 0,
        boxScore: makeBoxScore(),
      });
      useCareerStore.getState().resolvePostgameAndAdvanceWeek();
      const after = useCareerStore.getState();
      return {
        visibility: after.scoutVisibility,
        bank: after.player.bankBalance,
        morale: after.player.morale,
      };
    };

    const local3A = runPath("LOCAL_3A");
    const state5A = runPath("STATE_5A");
    const prep = runPath("PREP");

    expect(local3A.bank).toBeGreaterThan(state5A.bank);
    expect(state5A.bank).toBeGreaterThan(prep.bank);
    expect(prep.visibility).toBeGreaterThan(state5A.visibility);
    expect(state5A.visibility).toBeGreaterThan(local3A.visibility);
    expect(local3A.morale).toBeGreaterThanOrEqual(state5A.morale);
  });

  it("updates recruiting interest from high school match outcomes", () => {
    finishTutorialAndSelectPath("LOCAL_3A");
    const before = useCareerStore.getState().teamInterestById["houston-cougars"];

    useCareerStore.getState().completeNarrativeEvent();
    useCareerStore.getState().navigateToMatch();
    useCareerStore.getState().completeMatch({
      homeScore: 70,
      awayScore: 54,
      overtimePeriods: 0,
      boxScore: makeBoxScore(),
    });
    useCareerStore.getState().resolvePostgameAndAdvanceWeek();

    const after = useCareerStore.getState().teamInterestById["houston-cougars"];
    expect(after).toBeGreaterThan(before);
  });

  it("lets live narrative actions change recruiting interest", () => {
    finishTutorialAndSelectPath("STATE_5A");
    useCareerStore.getState().startNarrative("practice_coach.ink");
    const before = useCareerStore.getState().teamInterestById["houston-cougars"];

    const manager = loadNarrativeInkManager("practice_coach.ink");
    manager.continueStory();
    manager.chooseOption(0);

    const after = useCareerStore.getState().teamInterestById["houston-cougars"];
    expect(after).toBeGreaterThan(before);
  });

  it("does not duplicate active offers when interest updates multiple times", () => {
    finishTutorialAndSelectPath("STATE_5A");
    const beforeOffers = useCareerStore.getState().offers.length;

    useCareerStore.getState().applyTeamInterestDelta("houston-cougars", 12);
    useCareerStore.getState().applyTeamInterestDelta("houston-cougars", 6);

    const state = useCareerStore.getState();
    const houstonOffers = state.offers.filter((offer) => offer.sourceTeamId === "houston-cougars" && offer.status === "AVAILABLE");
    expect(state.offers.length).toBeGreaterThanOrEqual(beforeOffers);
    expect(houstonOffers).toHaveLength(1);
  });
});
