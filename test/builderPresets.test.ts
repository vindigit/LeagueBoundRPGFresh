import { BUILD_PRESETS_BY_POSITION, getDefaultBuildPreset, type BuildPreset } from "../src/builder/presets";
import { buildSimProjection } from "../src/builder/simProjection";
import type { PlayerAttributes, Position } from "../src/types/player";

const POSITIONS: readonly Position[] = ["PG", "SG", "SF", "PF", "C"];
const ATTRIBUTE_KEYS: Array<keyof PlayerAttributes> = [
  "shortRange",
  "dunking",
  "midrange",
  "threePoint",
  "handle",
  "passing",
  "vision",
  "perimeterDefense",
  "interiorDefense",
  "stealing",
  "blocking",
  "offRebounding",
  "defRebounding",
  "speed",
  "strength",
  "stamina",
];

const maxCaps = ATTRIBUTE_KEYS.reduce((caps, key) => {
  caps[key] = 99 as PlayerAttributes[typeof key];
  return caps;
}, {} as PlayerAttributes);

const allPresets = (): BuildPreset[] => POSITIONS.flatMap((position) => [...BUILD_PRESETS_BY_POSITION[position]]);

const getPreset = (position: Position, label: string): BuildPreset => {
  const preset = BUILD_PRESETS_BY_POSITION[position].find((candidate) => candidate.label === label);
  if (!preset) {
    throw new Error(`Missing preset ${position} ${label}`);
  }
  return preset;
};

const projectPreset = (preset: BuildPreset) =>
  buildSimProjection({
    attributes: preset.attributes,
    position: preset.position,
    caps: maxCaps,
    height: preset.position === "C" ? { feet: 6, inches: 11 } : preset.position === "PF" ? { feet: 6, inches: 8 } : { feet: 6, inches: 4 },
    weightLbs: preset.position === "C" ? 245 : preset.position === "PF" ? 220 : 195,
  });

describe("builder presets", () => {
  it("defines exactly three complete presets for each position", () => {
    for (const position of POSITIONS) {
      expect(BUILD_PRESETS_BY_POSITION[position]).toHaveLength(3);
      expect(getDefaultBuildPreset(position)).toBe(BUILD_PRESETS_BY_POSITION[position][0]);
    }

    expect(allPresets()).toHaveLength(15);
    expect(new Set(allPresets().map((preset) => preset.id)).size).toBe(15);

    for (const preset of allPresets()) {
      expect(preset.label).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.strengths.length).toBeGreaterThan(0);
      expect(preset.weaknesses.length).toBeGreaterThan(0);
      expect(BUILD_PRESETS_BY_POSITION[preset.position]).toContain(preset);

      for (const key of ATTRIBUTE_KEYS) {
        expect(typeof preset.attributes[key]).toBe("number");
        expect(preset.attributes[key]).toBeGreaterThanOrEqual(0);
        expect(preset.attributes[key]).toBeLessThanOrEqual(99);
      }
    }
  });

  it("projects key preset identities through actual attributes", () => {
    expect(projectPreset(getPreset("PG", "Primary Creator")).tendencies).toMatchObject({
      touches: "High",
      assistRate: "High",
    });
    expect(projectPreset(getPreset("SG", "Movement Shooter")).tendencies.threeAttempts).toBe("High");
    expect(projectPreset(getPreset("SG", "Point-of-Attack Defender")).tendencies.defensiveEvents).toBe("High");
    expect(projectPreset(getPreset("PF", "Glass Defender")).tendencies).toMatchObject({
      reboundInvolvement: "High",
      defensiveEvents: "High",
    });
    expect(projectPreset(getPreset("C", "Stretch Big")).tendencies.threeAttempts).toBe("High");
    expect(projectPreset(getPreset("C", "Paint Beast")).tendencies).toMatchObject({
      rimAttempts: "High",
      reboundInvolvement: "High",
    });
  });

  it("shows plausible badge watch items for every preset", () => {
    for (const preset of allPresets()) {
      const projection = projectPreset(preset);

      expect(projection.badgeWatch.length).toBeGreaterThan(0);
    }
  });
});
