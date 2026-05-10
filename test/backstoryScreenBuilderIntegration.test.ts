import fs from "node:fs";
import path from "node:path";

describe("Backstory screen builder integration", () => {
  it("uses the public-attribute builder flow and hides exact potential tiers", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src", "features", "backstory", "screens", "BackstoryScreen.tsx"),
      "utf8",
    );

    expect(source).toContain("createBuildBackstorySeed");
    expect(source).toContain("generateBackstoryFromBuildInput");
    expect(source).toContain("deriveEngineRatings");
    expect(source).toContain("PUBLIC_ATTRIBUTE_KEYS");
    expect(source).toContain("STARTING_ARCHETYPES");
    expect(source).toContain("Step 1: Name + Hometown");
    expect(source).toContain("Step 2: Position + Body");
    expect(source).toContain("Step 3: Starting Archetype");
    expect(source).toContain("Step 4: Allocate Attributes");
    expect(source).toContain("Step 5: Preview");
    expect(source).toContain("caps: preview.dna.caps");
    expect(source).toContain("getDefaultSecondaryPosition(primaryPosition)");
    expect(source).toContain("fuzzyScoutingSummary");
    expect(source).not.toContain("ARCHETYPE_PROFILES_BY_POSITION");
    expect(source).not.toContain("Basketball Background");
    expect(source).not.toContain("Potential Tier");
    expect(source).not.toContain("Bronze");
    expect(source).not.toContain("Silver");
    expect(source).not.toContain("Gold");
    expect(source).not.toContain("Platinum");
    expect(source).not.toContain("Age started determines growth curve");
    expect(source).not.toContain("setAgeStarted");
    expect(source).not.toContain('positionRecommendations');
    expect(source).not.toContain("setArchetype");
    expect(source).not.toContain("setSecondaryPosition");
    expect(source).not.toContain("ARCHETYPES_BY_POSITION");
  });
});
