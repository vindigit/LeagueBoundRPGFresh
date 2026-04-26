import type { MatchBoxScore } from "../features/match/store/useMatchStore";

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

const run = async (): Promise<void> => {
  const { setupNodeVerificationEnv } = await import("./setupNodeVerificationEnv");
  await setupNodeVerificationEnv();

  const { loadNarrativeInkManager } = await import("../narrative/inkManager");
  const { useCareerStore } = await import("../store/useCareerStore");

  const boxScore: MatchBoxScore = {
    homePlayers: [
      {
        id: "home-0",
        name: "Smoke Tester",
        team: "home",
        pts: 22,
        reb: 4,
        ast: 6,
        stl: 1,
        blk: 0,
        to: 2,
        fgm: 8,
        fga: 15,
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
        reb: 3,
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
    homeTotals: { pts: 64, reb: 21, ast: 15, stl: 5, blk: 2, to: 10, fgm: 25, fga: 49, ftm: 0, fta: 0, pf: 8 },
    awayTotals: { pts: 52, reb: 18, ast: 9, stl: 4, blk: 1, to: 12, fgm: 20, fga: 47, ftm: 0, fta: 0, pf: 10 },
  };

  useCareerStore.getState().initializeCareer({
    firstName: "Smoke",
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
    generationSeed: 20260428,
  });

  const initialized = useCareerStore.getState();
  assert(initialized.view === "HUB", `Expected HUB after init, got ${initialized.view}.`);
  assert(initialized.player.name === "Smoke Tester", `Expected initialized player name, got ${initialized.player.name}.`);
  assert(Boolean(initialized.player.identity), "Expected player identity after init.");
  assert(Boolean(initialized.player.dna), "Expected player DNA after init.");
  assert(initialized.currentWeek === 1, `Expected currentWeek 1 after init, got ${initialized.currentWeek}.`);
  assert(initialized.newsFeed.length >= 1, `Expected creation news item, got ${initialized.newsFeed.length}.`);

  const baselineBank = initialized.player.bankBalance;
  const baselineMorale = initialized.player.morale;

  useCareerStore.getState().startNarrative("practice_coach.ink");
  const stateAfterStart = useCareerStore.getState();
  assert(stateAfterStart.view === "NARRATIVE", `Expected NARRATIVE after startNarrative, got ${stateAfterStart.view}.`);
  assert(
    stateAfterStart.currentNarrativeFile === "practice_coach.ink",
    `Expected currentNarrativeFile to be practice_coach.ink, got ${stateAfterStart.currentNarrativeFile}.`,
  );

  const manager = loadNarrativeInkManager("practice_coach.ink");
  manager.continueStory();
  const resolvedNarrative = manager.chooseOption(0);
  const hasSceneComplete = resolvedNarrative.tags.some((tag) => tag.trim().toUpperCase() === "SCENE_COMPLETE");
  assert(hasSceneComplete, "Expected SCENE_COMPLETE tag after narrative resolution.");

  useCareerStore.getState().completeNarrativeEvent();
  const stateAfterNarrative = useCareerStore.getState();
  assert(stateAfterNarrative.view === "HUB", `Expected HUB after narrative completion, got ${stateAfterNarrative.view}.`);
  assert(stateAfterNarrative.weeklyLoop.eventCompleted, "Expected weekly event to be marked complete.");
  assert(Boolean(stateAfterNarrative.player.identity), "Expected player identity to remain populated after narrative resolution.");
  assert(Boolean(stateAfterNarrative.player.dna), "Expected player DNA to remain populated after narrative resolution.");

  useCareerStore.getState().navigateToMatch();
  const stateAtMatch = useCareerStore.getState();
  assert(stateAtMatch.view === "MATCH", `Expected MATCH after navigateToMatch, got ${stateAtMatch.view}.`);

  useCareerStore.getState().completeMatch({
    homeScore: 64,
    awayScore: 52,
    overtimePeriods: 0,
    boxScore,
  });
  const stateAfterMatch = useCareerStore.getState();
  assert(stateAfterMatch.view === "POSTGAME", `Expected POSTGAME after completeMatch, got ${stateAfterMatch.view}.`);
  assert(Boolean(stateAfterMatch.lastMatchResult), "Expected lastMatchResult after completeMatch.");
  assert(stateAfterMatch.currentWeek === 1, `Expected week to remain 1 until resolution, got ${stateAfterMatch.currentWeek}.`);
  assert(stateAfterMatch.weeklyLoop.postgamePending, "Expected postgamePending after completeMatch.");
  assert(stateAfterMatch.newsFeed.length === initialized.newsFeed.length, "Expected feed not to grow until week resolution.");

  useCareerStore.getState().resolvePostgameAndAdvanceWeek();
  const resolvedWeek = useCareerStore.getState();
  assert(
    resolvedWeek.view === "SCHOOL_PATH_SELECT",
    `Expected SCHOOL_PATH_SELECT after resolving tutorial week, got ${resolvedWeek.view}.`,
  );
  assert(resolvedWeek.pendingSchoolPathSelection, "Expected pendingSchoolPathSelection after tutorial resolution.");
  useCareerStore.getState().selectSchoolPath("STATE_5A");
  const selectedPath = useCareerStore.getState();
  assert(selectedPath.view === "HUB", `Expected HUB after school-path selection, got ${selectedPath.view}.`);
  assert(selectedPath.leagueLevel === "HIGH_SCHOOL", `Expected HIGH_SCHOOL after selection, got ${selectedPath.leagueLevel}.`);
  assert(selectedPath.schoolPath === "STATE_5A", `Expected STATE_5A after selection, got ${selectedPath.schoolPath}.`);
  assert(selectedPath.currentWeek === 2, `Expected currentWeek 2 after resolution, got ${selectedPath.currentWeek}.`);
  assert(selectedPath.lastMatchResult === null, "Expected lastMatchResult to clear after resolution.");
  assert(selectedPath.newsFeed.length >= 3, `Expected feed to contain creation + postgame + path items, got ${selectedPath.newsFeed.length}.`);
  assert(selectedPath.newsFeed.some((item) => item.category === "POSTGAME_RECAP"), "Expected a postgame recap in the feed.");
  assert(Boolean(selectedPath.player.identity), "Expected player identity to persist after week resolution.");
  assert(Boolean(selectedPath.player.dna), "Expected player DNA to persist after week resolution.");
  assert(selectedPath.player.name === "Smoke Tester", `Expected player name to persist, got ${selectedPath.player.name}.`);
  assert(selectedPath.player.bankBalance > baselineBank, "Expected bank balance to increase after postgame resolution.");
  assert(selectedPath.player.morale !== baselineMorale, "Expected morale to change after postgame resolution.");
  assert(
    !selectedPath.weeklyLoop.eventCompleted &&
      !selectedPath.weeklyLoop.matchCompleted &&
      !selectedPath.weeklyLoop.postgamePending,
    "Expected weekly loop state to reset for the next week.",
  );

  console.log("Vertical slice loop verification passed.");
};

run().catch((error) => {
  console.error("Vertical slice loop verification failed:", error);
  process.exitCode = 1;
});

export {};
