import { ARCHETYPE_SIM_CONTRACTS_BY_ID, type ArchetypeSimContract, type SimBucket } from "./archetypeSimContracts";
import type { PlayerAttributes, Position } from "../types/player";

export type BuildPresetId =
  | "pg_primary_creator"
  | "pg_shotmaking_guard"
  | "pg_rim_pressure_guard"
  | "sg_movement_shooter"
  | "sg_slashing_scorer"
  | "sg_point_of_attack_defender"
  | "sf_two_way_wing"
  | "sf_scoring_wing"
  | "sf_point_forward"
  | "pf_stretch_four"
  | "pf_athletic_finisher"
  | "pf_glass_defender"
  | "c_paint_beast"
  | "c_rim_protector"
  | "c_stretch_big";

export type BuildTendencyIntent = "Low" | "Medium" | "High";

export interface BuildPreset {
  id: BuildPresetId;
  label: string;
  position: Position;
  validPositions?: Position[];
  description: string;
  defaultRoleLabel?: string;
  roleLabelByPosition?: Partial<Record<Position, string>>;
  strengths: string[];
  weaknesses: string[];
  attributes: PlayerAttributes;
  startingAttributesByPosition?: Partial<Record<Position, PlayerAttributes>>;
  growthWeights?: Partial<Record<keyof PlayerAttributes, number>>;
  roleTendencies?: {
    touchWeight: number;
    shotCreationWeight: number;
    offBallShotWeight: number;
    passCreationWeight: number;
    threeVolumeWeight: number;
    rimPressureWeight: number;
    midrangeWeight: number;
    reboundWeight: number;
    offensiveReboundWeight: number;
    defensiveReboundWeight: number;
    stealWeight: number;
    blockWeight: number;
    contestWeight: number;
    fatigueLoadWeight: number;
  };
  intendedTendencies: {
    touches: BuildTendencyIntent;
    rimAttempts: BuildTendencyIntent;
    threeAttempts: BuildTendencyIntent;
    turnoverRisk: BuildTendencyIntent;
    assistRate: BuildTendencyIntent;
    reboundInvolvement: BuildTendencyIntent;
    defensiveEvents: BuildTendencyIntent;
    fatigueRisk: BuildTendencyIntent;
  };
  badgeHints?: string[];
  tradeoffNote?: string;
}

export type ArchetypeProfile = BuildPreset & {
  defaultRoleLabel: string;
  validPositions: Position[];
  startingAttributesByPosition: Partial<Record<Position, PlayerAttributes>>;
};

type BuildPresetSeed = Pick<BuildPreset, "id" | "position" | "description" | "attributes" | "badgeHints" | "tradeoffNote">;

const growth = (weights: Partial<Record<keyof PlayerAttributes, number>>) => weights;
const attrs = (attributes: PlayerAttributes): PlayerAttributes => attributes;

const contractForPreset = (id: BuildPresetId): ArchetypeSimContract => ARCHETYPE_SIM_CONTRACTS_BY_ID[id];

const bucketToBuildTendencyIntent = (bucket: SimBucket): BuildTendencyIntent => {
  if (bucket === "veryLow" || bucket === "low") {
    return "Low";
  }
  if (bucket === "high" || bucket === "veryHigh") {
    return "High";
  }
  return "Medium";
};

const intendedTendenciesFromContract = (contract: ArchetypeSimContract): BuildPreset["intendedTendencies"] => ({
  touches: bucketToBuildTendencyIntent(contract.statShape.usage),
  rimAttempts: bucketToBuildTendencyIntent(contract.statShape.rimRate),
  threeAttempts: bucketToBuildTendencyIntent(contract.statShape.threeRate),
  turnoverRisk: bucketToBuildTendencyIntent(contract.statShape.turnoverRisk),
  assistRate: bucketToBuildTendencyIntent(contract.statShape.assistRate),
  reboundInvolvement: bucketToBuildTendencyIntent(contract.statShape.reboundRate),
  defensiveEvents: bucketToBuildTendencyIntent(contract.statShape.defensiveActivity),
  fatigueRisk: bucketToBuildTendencyIntent(contract.statShape.fatigueLoad),
});

export const tagToDisplayLabel = (tag: string): string => {
  const label = tag.replace(/-/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const toBuildPreset = (seed: BuildPresetSeed): BuildPreset => {
  const contract = contractForPreset(seed.id);

  return {
    ...seed,
    label: contract.archetypeLabel,
    strengths: contract.strengthTags.map(tagToDisplayLabel),
    weaknesses: contract.weaknessTags.map(tagToDisplayLabel),
    roleTendencies: contract.tendencyTargets,
    intendedTendencies: intendedTendenciesFromContract(contract),
  };
};

const BUILD_PRESET_SEEDS_BY_POSITION: Record<Position, readonly BuildPresetSeed[]> = {
  PG: [
    {
      id: "pg_primary_creator",
      position: "PG",
      description: "Lead guard who runs offense, creates shots for others, and controls possessions.",
      attributes: attrs({
        shortRange: 66, dunking: 50, midrange: 68, threePoint: 70, handle: 84, passing: 90, vision: 90,
        perimeterDefense: 66, interiorDefense: 46, stealing: 64, blocking: 38, offRebounding: 40, defRebounding: 48,
        speed: 78, strength: 52, stamina: 82,
      }),
      badgeHints: ["Floor General", "Needle Threader"],
      tradeoffNote: "Controls the offense early, but needs shooting growth to stay efficient against better defenses.",
    },
    {
      id: "pg_shotmaking_guard",
      position: "PG",
      description: "Scoring PG who bends defense with pull-ups, threes, and late-clock scoring.",
      attributes: attrs({
        shortRange: 62, dunking: 46, midrange: 80, threePoint: 84, handle: 78, passing: 58, vision: 60,
        perimeterDefense: 60, interiorDefense: 44, stealing: 58, blocking: 36, offRebounding: 38, defRebounding: 46,
        speed: 74, strength: 50, stamina: 78,
      }),
      badgeHints: ["Deep Range", "Mid-Range Magician"],
      tradeoffNote: "Creates pressure from jumpers, but playmaking and defense are secondary unless developed.",
    },
    {
      id: "pg_rim_pressure_guard",
      position: "PG",
      description: "Downhill guard who collapses defenses with speed, finishing, and contact pressure.",
      attributes: attrs({
        shortRange: 80, dunking: 76, midrange: 56, threePoint: 50, handle: 78, passing: 62, vision: 60,
        perimeterDefense: 66, interiorDefense: 48, stealing: 64, blocking: 42, offRebounding: 44, defRebounding: 50,
        speed: 84, strength: 66, stamina: 68,
      }),
      badgeHints: ["Quick First Step", "Slithery", "Rim Pressure"],
      tradeoffNote: "Gets downhill fast, but spacing and late-game stamina need attention.",
    },
  ],
  SG: [
    {
      id: "sg_movement_shooter",
      position: "SG",
      description: "Off-ball shooter who scores through spacing, relocation, catch-and-shoot looks, and quick decisions.",
      attributes: attrs({
        shortRange: 58, dunking: 48, midrange: 80, threePoint: 84, handle: 64, passing: 58, vision: 68,
        perimeterDefense: 62, interiorDefense: 44, stealing: 58, blocking: 38, offRebounding: 42, defRebounding: 48,
        speed: 72, strength: 50, stamina: 80,
      }),
      badgeHints: ["Catch and Shoot", "Deep Range"],
      tradeoffNote: "Elite spacing early, but games can pass by without a table-setter.",
    },
    {
      id: "sg_slashing_scorer",
      position: "SG",
      description: "Two guard who attacks closeouts, finishes at the rim, and scores in transition.",
      attributes: attrs({
        shortRange: 80, dunking: 78, midrange: 62, threePoint: 56, handle: 68, passing: 56, vision: 56,
        perimeterDefense: 64, interiorDefense: 50, stealing: 62, blocking: 44, offRebounding: 46, defRebounding: 52,
        speed: 82, strength: 66, stamina: 72,
      }),
      badgeHints: ["Rim Pressure", "Posterizer"],
      tradeoffNote: "Scores in motion and transition, but half-court spacing is not a given.",
    },
    {
      id: "sg_point_of_attack_defender",
      position: "SG",
      description: "Defensive guard who pressures ball handlers, creates steals, and guards top perimeter threats.",
      attributes: attrs({
        shortRange: 60, dunking: 58, midrange: 58, threePoint: 60, handle: 62, passing: 58, vision: 62,
        perimeterDefense: 88, interiorDefense: 68, stealing: 86, blocking: 72, offRebounding: 42, defRebounding: 48,
        speed: 78, strength: 58, stamina: 72,
      }),
      badgeHints: ["Point of Attack", "Pickpocket"],
      tradeoffNote: "Defense travels immediately, but offensive growth decides the ceiling.",
    },
  ],
  SF: [
    {
      id: "sf_two_way_wing",
      position: "SF",
      description: "Balanced wing who scores enough, defends multiple positions, and fits almost any lineup.",
      attributes: attrs({
        shortRange: 68, dunking: 66, midrange: 68, threePoint: 68, handle: 66, passing: 64, vision: 64,
        perimeterDefense: 80, interiorDefense: 70, stealing: 74, blocking: 70, offRebounding: 58, defRebounding: 64,
        speed: 74, strength: 66, stamina: 74,
      }),
      badgeHints: ["Point of Attack", "Help Defender"],
      tradeoffNote: "Fits quickly, but needs a chosen offensive lane to become a star.",
    },
    {
      id: "sf_scoring_wing",
      position: "SF",
      description: "Bigger scorer who can shoot, attack midrange, and finish over smaller defenders.",
      attributes: attrs({
        shortRange: 74, dunking: 66, midrange: 80, threePoint: 78, handle: 68, passing: 58, vision: 60,
        perimeterDefense: 62, interiorDefense: 56, stealing: 58, blocking: 52, offRebounding: 52, defRebounding: 58,
        speed: 70, strength: 64, stamina: 74,
      }),
      badgeHints: ["Deep Range", "Mid-Range Magician"],
      tradeoffNote: "Can score early, but defensive consistency and passing are the tradeoffs.",
    },
    {
      id: "sf_point_forward",
      position: "SF",
      description: "Wing-sized creator who passes, handles, and initiates offense from the frontcourt.",
      attributes: attrs({
        shortRange: 66, dunking: 60, midrange: 64, threePoint: 60, handle: 80, passing: 82, vision: 80,
        perimeterDefense: 66, interiorDefense: 58, stealing: 64, blocking: 54, offRebounding: 54, defRebounding: 60,
        speed: 72, strength: 64, stamina: 72,
      }),
      badgeHints: ["Floor General", "Needle Threader"],
      tradeoffNote: "Creates lineup flexibility, but shooting and defensive impact need deliberate development.",
    },
  ],
  PF: [
    {
      id: "pf_stretch_four",
      position: "PF",
      description: "Shooting forward who spaces the floor and pulls big defenders away from the paint.",
      attributes: attrs({
        shortRange: 58, dunking: 54, midrange: 78, threePoint: 82, handle: 58, passing: 62, vision: 66,
        perimeterDefense: 58, interiorDefense: 62, stealing: 54, blocking: 58, offRebounding: 54, defRebounding: 60,
        speed: 64, strength: 62, stamina: 74,
      }),
      badgeHints: ["Catch and Shoot", "Deep Range"],
      tradeoffNote: "Creates spacing at PF, but gives up some paint force and board control.",
    },
    {
      id: "pf_athletic_finisher",
      position: "PF",
      description: "Vertical forward who runs, cuts, finishes, and pressures the rim.",
      attributes: attrs({
        shortRange: 80, dunking: 82, midrange: 54, threePoint: 46, handle: 54, passing: 52, vision: 54,
        perimeterDefense: 62, interiorDefense: 68, stealing: 58, blocking: 68, offRebounding: 60, defRebounding: 64,
        speed: 76, strength: 78, stamina: 72,
      }),
      badgeHints: ["Posterizer", "Power Driver"],
      tradeoffNote: "Lives above the rim, but shooting development determines spacing value.",
    },
    {
      id: "pf_glass_defender",
      position: "PF",
      description: "Defense/rebounding PF who controls possessions without needing touches.",
      attributes: attrs({
        shortRange: 66, dunking: 68, midrange: 48, threePoint: 40, handle: 48, passing: 50, vision: 54,
        perimeterDefense: 68, interiorDefense: 84, stealing: 64, blocking: 84, offRebounding: 88, defRebounding: 90,
        speed: 66, strength: 82, stamina: 74,
      }),
      badgeHints: ["Glass Cleaner", "Box Out Beast", "Anchor"],
      tradeoffNote: "Controls defensive possessions, but offensive impact has to show up in screens and putbacks.",
    },
  ],
  C: [
    {
      id: "c_paint_beast",
      position: "C",
      description: "Low-post/interior center who finishes through contact, rebounds, and punishes smaller lineups.",
      attributes: attrs({
        shortRange: 84, dunking: 82, midrange: 42, threePoint: 32, handle: 40, passing: 48, vision: 50,
        perimeterDefense: 48, interiorDefense: 78, stealing: 50, blocking: 74, offRebounding: 82, defRebounding: 84,
        speed: 58, strength: 84, stamina: 72,
      }),
      badgeHints: ["Rim Pressure", "Putback Boss", "Box Out Beast"],
      tradeoffNote: "Dominates inside, but lineups must cover the lack of spacing.",
    },
    {
      id: "c_rim_protector",
      position: "C",
      description: "Defense-first center who blocks shots, anchors the paint, and controls defensive possessions.",
      attributes: attrs({
        shortRange: 68, dunking: 70, midrange: 44, threePoint: 34, handle: 38, passing: 48, vision: 54,
        perimeterDefense: 54, interiorDefense: 84, stealing: 58, blocking: 86, offRebounding: 70, defRebounding: 84,
        speed: 60, strength: 82, stamina: 74,
      }),
      badgeHints: ["Anchor", "Chase Down", "Box Out Beast"],
      tradeoffNote: "Anchors the paint immediately, but offense is cleanup-heavy unless developed.",
    },
    {
      id: "c_stretch_big",
      position: "C",
      description: "Center who spaces the floor while still providing size.",
      attributes: attrs({
        shortRange: 56, dunking: 50, midrange: 80, threePoint: 84, handle: 52, passing: 60, vision: 66,
        perimeterDefense: 52, interiorDefense: 62, stealing: 50, blocking: 58, offRebounding: 56, defRebounding: 66,
        speed: 58, strength: 62, stamina: 74,
      }),
      badgeHints: ["Catch and Shoot", "Deep Range"],
      tradeoffNote: "Spaces from center, but sacrifices some early paint control.",
    },
  ],
};

const GROWTH_WEIGHTS_BY_LABEL: Record<string, Partial<Record<keyof PlayerAttributes, number>>> = {
  Playmaker: growth({ handle: 1.2, passing: 1.25, vision: 1.2, stamina: 0.8 }),
  Sharpshooter: growth({ threePoint: 1.3, midrange: 1.05, stamina: 0.85, vision: 0.55 }),
  Slasher: growth({ shortRange: 1.1, dunking: 1.25, speed: 1.15, handle: 0.75, stamina: 0.75 }),
  "Lockdown Defender": growth({ perimeterDefense: 1.25, stealing: 1.1, stamina: 0.95, speed: 0.8 }),
  Swingman: growth({ perimeterDefense: 0.9, shortRange: 0.85, threePoint: 0.85, speed: 0.75 }),
  "Point Forward": growth({ passing: 1.2, vision: 1.2, handle: 1, strength: 0.65 }),
  "Stretch Forward": growth({ threePoint: 1.2, midrange: 1, defRebounding: 0.65, stamina: 0.75 }),
  Rebounder: growth({ offRebounding: 1.25, defRebounding: 1.3, strength: 1, interiorDefense: 0.75 }),
  "Post Scorer": growth({ shortRange: 1.25, strength: 1, dunking: 0.8, passing: 0.45 }),
  "Rim Protector": growth({ blocking: 1.3, interiorDefense: 1.25, defRebounding: 0.9, strength: 0.8 }),
  "Paint Beast": growth({ shortRange: 1.15, dunking: 1.15, offRebounding: 1, strength: 1.05 }),
  "Stretch Big": growth({ threePoint: 1.2, midrange: 1, defRebounding: 0.65, blocking: 0.55 }),
};

const toArchetypeProfile = (preset: BuildPreset): ArchetypeProfile => {
  const contract = contractForPreset(preset.id);

  return {
    ...preset,
    label: contract.archetypeLabel,
    validPositions: [preset.position],
    defaultRoleLabel: contract.roleLabel,
    roleLabelByPosition: { [preset.position]: contract.roleLabel },
    startingAttributesByPosition: { [preset.position]: preset.attributes },
    growthWeights: GROWTH_WEIGHTS_BY_LABEL[contract.archetypeLabel] ?? {},
    roleTendencies: contract.tendencyTargets,
    intendedTendencies: intendedTendenciesFromContract(contract),
    strengths: contract.strengthTags.map(tagToDisplayLabel),
    weaknesses: contract.weaknessTags.map(tagToDisplayLabel),
  };
};

export const BUILD_PRESETS_BY_POSITION: Record<Position, readonly BuildPreset[]> = {
  PG: BUILD_PRESET_SEEDS_BY_POSITION.PG.map(toBuildPreset),
  SG: BUILD_PRESET_SEEDS_BY_POSITION.SG.map(toBuildPreset),
  SF: BUILD_PRESET_SEEDS_BY_POSITION.SF.map(toBuildPreset),
  PF: BUILD_PRESET_SEEDS_BY_POSITION.PF.map(toBuildPreset),
  C: BUILD_PRESET_SEEDS_BY_POSITION.C.map(toBuildPreset),
};

export const ARCHETYPE_PROFILES_BY_POSITION: Record<Position, readonly ArchetypeProfile[]> = {
  PG: BUILD_PRESETS_BY_POSITION.PG.map(toArchetypeProfile),
  SG: BUILD_PRESETS_BY_POSITION.SG.map(toArchetypeProfile),
  SF: BUILD_PRESETS_BY_POSITION.SF.map(toArchetypeProfile),
  PF: BUILD_PRESETS_BY_POSITION.PF.map(toArchetypeProfile),
  C: BUILD_PRESETS_BY_POSITION.C.map(toArchetypeProfile),
};

export const getDefaultArchetypeProfile = (position: Position): ArchetypeProfile => ARCHETYPE_PROFILES_BY_POSITION[position][0];

export const getArchetypeProfileById = (position: Position, id: string): ArchetypeProfile =>
  ARCHETYPE_PROFILES_BY_POSITION[position].find((profile) => profile.id === id) ?? getDefaultArchetypeProfile(position);

export const getDefaultBuildPreset = (position: Position): BuildPreset => BUILD_PRESETS_BY_POSITION[position][0];
