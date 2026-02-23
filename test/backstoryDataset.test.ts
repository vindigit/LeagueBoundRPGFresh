import { CITIES_BY_STATE } from "../src/features/backstory/data/citiesByState";
import { US_STATES } from "../src/features/backstory/data/states";

describe("Backstory state/city dataset", () => {
  it("contains all 50 states", () => {
    expect(US_STATES).toHaveLength(50);
  });

  it("contains exactly 100 city options per state with unique slugs", () => {
    for (const state of US_STATES) {
      const cities = CITIES_BY_STATE[state.code];
      expect(cities).toBeDefined();
      expect(cities).toHaveLength(100);

      const slugs = new Set(cities.map((city) => city.slug));
      expect(slugs.size).toBe(cities.length);
    }
  });
});
