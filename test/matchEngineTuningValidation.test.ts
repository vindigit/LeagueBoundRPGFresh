import { validateMatchEngineTuning } from "../src/matchEngineTuningValidation";

describe("matchEngine tuning validation", () => {
  it("passes for valid min/max ranges", () => {
    expect(() =>
      validateMatchEngineTuning({
        turnoverEventSecondsMin: 5,
        turnoverEventSecondsMax: 11,
        minEventSeconds: 7,
        maxEventSeconds: 24,
      }),
    ).not.toThrow();
  });

  it("throws when min equals max", () => {
    expect(() =>
      validateMatchEngineTuning({
        turnoverEventSecondsMin: 8,
        turnoverEventSecondsMax: 8,
      }),
    ).toThrow(
      "Invalid match engine tuning range: turnoverEventSecondsMin (8) must be < turnoverEventSecondsMax (8).",
    );
  });

  it("throws when min is greater than max", () => {
    expect(() =>
      validateMatchEngineTuning({
        offensiveReboundEventSecondsMin: 10,
        offensiveReboundEventSecondsMax: 9,
      }),
    ).toThrow(
      "Invalid match engine tuning range: offensiveReboundEventSecondsMin (10) must be < offensiveReboundEventSecondsMax (9).",
    );
  });

  it("ignores min keys without a matching max key", () => {
    expect(() =>
      validateMatchEngineTuning({
        randomMin: 20,
      }),
    ).not.toThrow();
  });

  it("ignores non-numeric and non-finite pairs", () => {
    expect(() =>
      validateMatchEngineTuning({
        strangeMin: "5",
        strangeMax: 1,
        finiteMin: Number.NaN,
        finiteMax: Number.POSITIVE_INFINITY,
      }),
    ).not.toThrow();
  });
});
