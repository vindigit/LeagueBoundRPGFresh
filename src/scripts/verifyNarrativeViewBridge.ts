const run = async (): Promise<void> => {
  const { setupNodeVerificationEnv } = await import("./setupNodeVerificationEnv");
  await setupNodeVerificationEnv();

  const { useCareerStore } = await import("../store/useCareerStore");
  const { loadNarrativeInkManager } = await import("../narrative/inkManager");

  useCareerStore.getState().initializeCareer("Narrative Bridge Tester", "Playmaker");
  useCareerStore.getState().startNarrative("practice_coach.ink");

  const stateAfterStart = useCareerStore.getState();
  if (stateAfterStart.view !== "NARRATIVE") {
    throw new Error(`Expected view to be NARRATIVE, got ${stateAfterStart.view}.`);
  }
  if (stateAfterStart.currentNarrativeFile !== "practice_coach.ink") {
    throw new Error(`Expected currentNarrativeFile to be practice_coach.ink, got ${stateAfterStart.currentNarrativeFile}.`);
  }

  const manager = loadNarrativeInkManager("practice_coach.ink");
  manager.continueStory();
  const resolvedState = manager.chooseOption(0);
  const hasSceneComplete = resolvedState.tags.some((tag) => tag.trim().toUpperCase() === "SCENE_COMPLETE");
  if (!hasSceneComplete) {
    throw new Error("Expected SCENE_COMPLETE tag after narrative resolution.");
  }

  console.log("Narrative bridge verification passed.");
};

run().catch((error) => {
  console.error("Narrative bridge verification failed:", error);
  process.exitCode = 1;
});

export {};
