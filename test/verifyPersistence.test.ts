import { useCareerStore } from "../src/store/useCareerStore";

const wait = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const verifyPersistence = async (): Promise<void> => {
  const store = useCareerStore;

  store.getState().initializeCareer("Test Pro", "Slasher");

  const initialAthleticism = store.getState().player.attributes.athleticism;
  console.log(`[verifyPersistence] Initial athleticism: ${initialAthleticism}`);

  store.getState().updateAttribute("athleticism", 5);
  const updatedAthleticism = store.getState().player.attributes.athleticism;
  console.log(`[verifyPersistence] Updated athleticism (+5): ${updatedAthleticism}`);

  await wait(300);

  console.log("[verifyPersistence] Save trigger complete (waited 300ms for persistence write).");
  console.log("[verifyPersistence] Manual check:");
  console.log("1) Restart the app/session.");
  console.log("2) Rehydrate the career store.");
  console.log("3) Confirm player name is 'Test Pro' and athleticism remained incremented.");
};
