import {
  ARCHETYPE_SIM_CONTRACTS,
  ARCHETYPE_SIM_CONTRACTS_BY_ID,
  getArchetypeSimContract,
  type ArchetypeTendencyTargets,
} from "../src/builder/archetypeSimContracts";
import { BUILD_PRESETS_BY_POSITION, type BuildPreset, type BuildPresetId } from "../src/builder/presets";
import type { Position } from "../src/types/player";

const POSITIONS: readonly Position[] = ["PG", "SG", "SF", "PF", "C"];

const allPresets = (): BuildPreset[] => POSITIONS.flatMap((position) => [...BUILD_PRESETS_BY_POSITION[position]]);

const tendencyKeys: Array<keyof ArchetypeTendencyTargets> = [
  "touchWeight",
  "shotCreationWeight",
  "offBallShotWeight",
  "passCreationWeight",
  "threeVolumeWeight",
  "rimPressureWeight",
  "midrangeWeight",
  "reboundWeight",
  "offensiveReboundWeight",
  "defensiveReboundWeight",
  "stealWeight",
  "blockWeight",
  "contestWeight",
  "fatigueLoadWeight",
];

describe("archetype sim contracts", () => {
  it("defines exactly one contract for every build preset id", () => {
    const presetIds = allPresets().map((preset) => preset.id).sort();
    const contractIds = ARCHETYPE_SIM_CONTRACTS.map((contract) => contract.id).sort();

    expect(contractIds).toEqual(presetIds);
    expect(new Set(contractIds).size).toBe(contractIds.length);
  });

  it("keeps ids, positions, and required copy aligned with presets", () => {
    for (const preset of allPresets()) {
      const contract = getArchetypeSimContract(preset.id);

      expect(ARCHETYPE_SIM_CONTRACTS_BY_ID[preset.id]).toBe(contract);
      expect(contract.id).toBe(preset.id);
      expect(contract.position).toBe(preset.position);
      expect(contract.archetypeLabel).toBeTruthy();
      expect(contract.roleLabel).toBeTruthy();
      expect(contract.identitySummary).toBeTruthy();
      expect(contract.testExpectations.length).toBeGreaterThan(0);
      expect(contract.strengthTags.length).toBeGreaterThan(0);
      expect(contract.weaknessTags.length).toBeGreaterThan(0);
    }
  });

  it("normalizes all tendency targets from 0 to 1", () => {
    for (const contract of ARCHETYPE_SIM_CONTRACTS) {
      for (const key of tendencyKeys) {
        const value = contract.tendencyTargets[key];

        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });

  it("does not assign high touches to defensive and rebounding specialists", () => {
    const lowUsageIds: BuildPresetId[] = ["sg_point_of_attack_defender", "pf_glass_defender", "c_rim_protector"];

    for (const id of lowUsageIds) {
      expect(getArchetypeSimContract(id).tendencyTargets.touchWeight).toBeLessThan(0.5);
    }
  });

  it("keeps stretch frontcourt contracts above paint bigs in three volume", () => {
    expect(getArchetypeSimContract("pf_stretch_four").tendencyTargets.threeVolumeWeight).toBeGreaterThan(
      getArchetypeSimContract("pf_glass_defender").tendencyTargets.threeVolumeWeight,
    );
    expect(getArchetypeSimContract("c_stretch_big").tendencyTargets.threeVolumeWeight).toBeGreaterThan(
      getArchetypeSimContract("c_paint_beast").tendencyTargets.threeVolumeWeight,
    );
    expect(getArchetypeSimContract("c_stretch_big").tendencyTargets.threeVolumeWeight).toBeGreaterThan(
      getArchetypeSimContract("c_rim_protector").tendencyTargets.threeVolumeWeight,
    );
  });

  it("keeps slasher and rim-pressure contracts above nearby shooter contracts in rim pressure", () => {
    expect(getArchetypeSimContract("pg_rim_pressure_guard").tendencyTargets.rimPressureWeight).toBeGreaterThan(
      getArchetypeSimContract("pg_shotmaking_guard").tendencyTargets.rimPressureWeight,
    );
    expect(getArchetypeSimContract("sg_slashing_scorer").tendencyTargets.rimPressureWeight).toBeGreaterThan(
      getArchetypeSimContract("sg_movement_shooter").tendencyTargets.rimPressureWeight,
    );
    expect(getArchetypeSimContract("pf_athletic_finisher").tendencyTargets.rimPressureWeight).toBeGreaterThan(
      getArchetypeSimContract("pf_stretch_four").tendencyTargets.rimPressureWeight,
    );
  });
});
