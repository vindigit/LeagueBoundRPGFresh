import { render } from "@testing-library/react-native";
import { buildSimProjection } from "../src/builder/simProjection";
import { BuilderReviewSection, type BuilderReviewSummary } from "../src/components/builderReview";
import type { PlayerAttributes } from "../src/types/player";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 60,
  dunking: 60,
  midrange: 60,
  threePoint: 60,
  handle: 60,
  passing: 60,
  vision: 60,
  perimeterDefense: 60,
  interiorDefense: 60,
  stealing: 60,
  blocking: 60,
  offRebounding: 60,
  defRebounding: 60,
  speed: 60,
  strength: 60,
  stamina: 60,
  ...overrides,
});

const makeSummary = (projection: ReturnType<typeof buildSimProjection>): BuilderReviewSummary => ({
  classification: projection.classification.taxonomy.label,
  archetypeFit: projection.classification.legacyArchetype,
  topStrengths: projection.classification.taxonomy.hasStandoutStrength ? ["Shooting", "Playmaking"] : [],
  badges: projection.badges,
  emptyBadgesLabel: "No badges unlocked at the current build thresholds.",
  growthOutlook: "Steady growth",
  archetypeConfidence: projection.classification.archetypeConfidence,
  hasStandoutStrength: projection.classification.taxonomy.hasStandoutStrength,
});

describe("BuilderReviewSection projection panel", () => {
  it("renders balanced build guidance", () => {
    const projection = buildSimProjection({ attributes: makeAttributes(), position: "PG", caps: makeAttributes() });
    const screen = render(<BuilderReviewSection summary={makeSummary(projection)} projection={projection} variant="slate" />);

    expect(screen.getByText("Projected Sim Identity")).toBeTruthy();
    expect(screen.getByText("Balanced Guard")).toBeTruthy();
    expect(screen.getByText("No standout strengths yet. Raise 2-3 core attributes to define your playstyle.")).toBeTruthy();
    expect(screen.getByText("Expected Sim Tendencies")).toBeTruthy();
    expect(screen.getByText("Shot Profile")).toBeTruthy();
  });

  it("renders shooter projection and badge watch", () => {
    const attributes = makeAttributes({ threePoint: 78, midrange: 72, vision: 68 });
    const projection = buildSimProjection({ attributes, position: "SG", caps: makeAttributes({ threePoint: 99, midrange: 99, vision: 99 }) });
    const screen = render(<BuilderReviewSection summary={makeSummary(projection)} projection={projection} variant="slate" />);

    expect(screen.getByText("Badge Watch")).toBeTruthy();
    expect(screen.getByText(/Deep Range/)).toBeTruthy();
    expect(screen.getByText("Three")).toBeTruthy();
  });
});
