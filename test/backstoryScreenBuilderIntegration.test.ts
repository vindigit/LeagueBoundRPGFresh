import fs from "node:fs";
import path from "node:path";

describe("Backstory screen builder integration", () => {
  it("uses the build-driven generator path and removes archetype selection from the active flow", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src", "features", "backstory", "screens", "BackstoryScreen.tsx"),
      "utf8",
    );

    expect(source).toContain("createBuildBackstorySeed");
    expect(source).toContain("generateBackstoryFromBuildInput");
    expect(source).not.toContain('positionRecommendations');
    expect(source).not.toContain("setArchetype");
    expect(source).not.toContain("ARCHETYPES");
  });
});
