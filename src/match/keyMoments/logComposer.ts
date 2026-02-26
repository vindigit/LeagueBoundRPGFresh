export const composeKeyMomentLogText = (
  success: boolean,
  promptText: string,
  outcomeText: string,
): string => `Key Moment (${success ? "Success" : "Failed"}): ${promptText} - ${outcomeText}`;
