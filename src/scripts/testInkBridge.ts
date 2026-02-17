const run = async (): Promise<void> => {
  const { setupNodeVerificationEnv } = await import("./setupNodeVerificationEnv");
  await setupNodeVerificationEnv();

  const { loadPracticeCoachInkManager } = await import("../narrative/inkManager");
  const { useCareerStore } = await import("../store/useCareerStore");

  const runChoiceVerification = (choiceIndex: number, attributeKey: "bbiq" | "athleticism", label: string): void => {
    useCareerStore.getState().initializeCareer("Ink Bridge Tester", "Playmaker");

    const before = useCareerStore.getState().player.attributes[attributeKey];
    const manager = loadPracticeCoachInkManager();

    manager.continueStory();
    manager.chooseOption(choiceIndex);

    const after = useCareerStore.getState().player.attributes[attributeKey];
    const delta = after - before;

    console.log(`\n[${label}]`);
    console.log(`Choice index: ${choiceIndex}`);
    console.log(`${attributeKey} before: ${before}`);
    console.log(`${attributeKey} after:  ${after}`);
    console.log(`${attributeKey} delta:  ${delta}`);

    if (delta !== 1) {
      throw new Error(`Expected ${attributeKey} to increase by 1, got delta ${delta}.`);
    }
  };

  console.log("=== Ink Bridge Verification ===");
  runChoiceVerification(0, "bbiq", "Study Film path");
  runChoiceVerification(1, "athleticism", "Conditioning path");
  console.log("\nInk bridge verification passed.");
};

run().catch((error) => {
  console.error("Ink bridge verification failed:", error);
  process.exitCode = 1;
});

export {};
