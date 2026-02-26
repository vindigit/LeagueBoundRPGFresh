import { composeKeyMomentLogText } from "../../../match/keyMoments/logComposer";

describe("Key Moment log composer", () => {
  it("includes success label, prompt, and outcome text", () => {
    const text = composeKeyMomentLogText(true, "Key Moment: Defense is tilted. Make a quick decision.", "Vindon finishes for 2");
    expect(text).toContain("Key Moment (Success)");
    expect(text).toContain("Defense is tilted");
    expect(text).toContain("finishes for 2");
  });

  it("includes failed label for unsuccessful outcomes", () => {
    const text = composeKeyMomentLogText(false, "Key Moment: Find your shooting window and place the shot.", "Vindon misses");
    expect(text).toContain("Key Moment (Failed)");
    expect(text).toContain("Find your shooting window");
    expect(text).toContain("Vindon misses");
  });
});
