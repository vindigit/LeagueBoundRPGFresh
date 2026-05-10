import fs from "node:fs";
import path from "node:path";

describe("Backstory screen builder integration", () => {
  it("uses the preset-driven generator path and removes archetype/secondary selection from the active flow", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src", "features", "backstory", "screens", "BackstoryScreen.tsx"),
      "utf8",
    );

    expect(source).toContain("createBuildBackstorySeed");
    expect(source).toContain("generateBackstoryFromBuildInput");
    expect(source).toContain("attributes: preview.startingAttributes");
    expect(source).toContain("caps: preview.dna.caps");
    expect(source).toContain("ARCHETYPE_PROFILES_BY_POSITION");
    expect(source).toContain("getDefaultSecondaryPosition(primaryPosition)");
    expect(source).toContain("Step 3: Archetype");
    expect(source).not.toContain('positionRecommendations');
    expect(source).not.toContain("setArchetype");
    expect(source).not.toContain("setSecondaryPosition");
    expect(source).not.toContain("ARCHETYPES");
  });
});
