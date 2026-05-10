import type { BuildPresetId } from "./presets";
import type { Position } from "../types/player";

export type SimBucket = "veryLow" | "low" | "medium" | "high" | "veryHigh";

export interface ArchetypeStatShape {
  usage: SimBucket;
  shotVolume: SimBucket;
  rimRate: SimBucket;
  midrangeRate: SimBucket;
  threeRate: SimBucket;
  assistRate: SimBucket;
  reboundRate: SimBucket;
  offensiveReboundRate: SimBucket;
  defensiveReboundRate: SimBucket;
  stealRate: SimBucket;
  blockRate: SimBucket;
  defensiveActivity: SimBucket;
  turnoverRisk: SimBucket;
  fatigueLoad: SimBucket;
}

export interface ArchetypeTendencyTargets {
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
}

export interface ArchetypeTestExpectation {
  metric:
    | "touches"
    | "fga"
    | "rimRate"
    | "threeRate"
    | "assistRate"
    | "reboundRate"
    | "defensiveEvents"
    | "blocks"
    | "steals"
    | "fatigueLoad";
  bucket: SimBucket;
  notes?: string;
}

export interface ArchetypeSimContract {
  id: BuildPresetId;
  position: Position;
  archetypeLabel: string;
  roleLabel: string;
  identitySummary: string;
  statShape: ArchetypeStatShape;
  tendencyTargets: ArchetypeTendencyTargets;
  testExpectations: ArchetypeTestExpectation[];
  strengthTags: string[];
  weaknessTags: string[];
}

export const ARCHETYPE_SIM_CONTRACTS_BY_ID: Record<BuildPresetId, ArchetypeSimContract> = {
  pg_primary_creator: {
    id: "pg_primary_creator",
    position: "PG",
    archetypeLabel: "Playmaker",
    roleLabel: "Lead creator",
    identitySummary: "High-touch lead guard who organizes offense, creates assists, and applies balanced rim and jumper pressure without rebounding volume.",
    statShape: { usage: "high", shotVolume: "medium", rimRate: "medium", midrangeRate: "medium", threeRate: "medium", assistRate: "veryHigh", reboundRate: "low", offensiveReboundRate: "veryLow", defensiveReboundRate: "low", stealRate: "medium", blockRate: "veryLow", defensiveActivity: "medium", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.84, shotCreationWeight: 0.64, offBallShotWeight: 0.42, passCreationWeight: 0.9, threeVolumeWeight: 0.48, rimPressureWeight: 0.52, midrangeWeight: 0.46, reboundWeight: 0.18, offensiveReboundWeight: 0.12, defensiveReboundWeight: 0.22, stealWeight: 0.44, blockWeight: 0.12, contestWeight: 0.42, fatigueLoadWeight: 0.58 },
    testExpectations: [{ metric: "touches", bucket: "high" }, { metric: "assistRate", bucket: "veryHigh" }, { metric: "reboundRate", bucket: "low" }],
    strengthTags: ["primary-creation", "passing", "ball-security", "pace-control"],
    weaknessTags: ["rebounding", "interior-defense", "off-ball-scoring"],
  },
  pg_shotmaking_guard: {
    id: "pg_shotmaking_guard",
    position: "PG",
    archetypeLabel: "Sharpshooter",
    roleLabel: "Pull-up scorer",
    identitySummary: "High-touch scoring guard who bends defenses with pull-up threes, midrange scoring, and late-clock self creation.",
    statShape: { usage: "high", shotVolume: "high", rimRate: "medium", midrangeRate: "high", threeRate: "high", assistRate: "medium", reboundRate: "low", offensiveReboundRate: "veryLow", defensiveReboundRate: "low", stealRate: "low", blockRate: "veryLow", defensiveActivity: "low", turnoverRisk: "medium", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.72, shotCreationWeight: 0.72, offBallShotWeight: 0.62, passCreationWeight: 0.44, threeVolumeWeight: 0.82, rimPressureWeight: 0.38, midrangeWeight: 0.78, reboundWeight: 0.18, offensiveReboundWeight: 0.12, defensiveReboundWeight: 0.22, stealWeight: 0.3, blockWeight: 0.1, contestWeight: 0.32, fatigueLoadWeight: 0.58 },
    testExpectations: [{ metric: "touches", bucket: "high" }, { metric: "threeRate", bucket: "high" }, { metric: "assistRate", bucket: "medium" }],
    strengthTags: ["pull-up-shooting", "three-volume", "midrange-scoring", "late-clock-scoring"],
    weaknessTags: ["rebounding", "defensive-events", "paint-pressure"],
  },
  pg_rim_pressure_guard: {
    id: "pg_rim_pressure_guard",
    position: "PG",
    archetypeLabel: "Slasher",
    roleLabel: "Downhill attacker",
    identitySummary: "Downhill lead guard who collapses the paint with speed, contact pressure, and very high rim attempts while carrying higher fatigue.",
    statShape: { usage: "high", shotVolume: "high", rimRate: "veryHigh", midrangeRate: "low", threeRate: "low", assistRate: "medium", reboundRate: "low", offensiveReboundRate: "low", defensiveReboundRate: "low", stealRate: "medium", blockRate: "low", defensiveActivity: "medium", turnoverRisk: "medium", fatigueLoad: "high" },
    tendencyTargets: { touchWeight: 0.72, shotCreationWeight: 0.7, offBallShotWeight: 0.38, passCreationWeight: 0.44, threeVolumeWeight: 0.18, rimPressureWeight: 0.92, midrangeWeight: 0.28, reboundWeight: 0.26, offensiveReboundWeight: 0.22, defensiveReboundWeight: 0.28, stealWeight: 0.42, blockWeight: 0.18, contestWeight: 0.42, fatigueLoadWeight: 0.82 },
    testExpectations: [{ metric: "rimRate", bucket: "veryHigh" }, { metric: "threeRate", bucket: "low" }, { metric: "fatigueLoad", bucket: "high" }],
    strengthTags: ["rim-pressure", "transition-scoring", "speed", "contact-finishing"],
    weaknessTags: ["three-volume", "spacing", "fatigue-risk"],
  },
  sg_movement_shooter: {
    id: "sg_movement_shooter",
    position: "SG",
    archetypeLabel: "Sharpshooter",
    roleLabel: "Off-ball scorer",
    identitySummary: "Medium-touch off-ball scorer who creates spacing through relocation, catch-and-shoot volume, and quick jumper decisions.",
    statShape: { usage: "medium", shotVolume: "medium", rimRate: "low", midrangeRate: "high", threeRate: "veryHigh", assistRate: "medium", reboundRate: "low", offensiveReboundRate: "low", defensiveReboundRate: "low", stealRate: "low", blockRate: "veryLow", defensiveActivity: "low", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.5, shotCreationWeight: 0.42, offBallShotWeight: 0.92, passCreationWeight: 0.36, threeVolumeWeight: 0.94, rimPressureWeight: 0.2, midrangeWeight: 0.72, reboundWeight: 0.22, offensiveReboundWeight: 0.16, defensiveReboundWeight: 0.24, stealWeight: 0.28, blockWeight: 0.12, contestWeight: 0.32, fatigueLoadWeight: 0.52 },
    testExpectations: [{ metric: "threeRate", bucket: "veryHigh" }, { metric: "rimRate", bucket: "low" }, { metric: "touches", bucket: "medium" }],
    strengthTags: ["movement-shooting", "spacing", "catch-and-shoot", "quick-decisions"],
    weaknessTags: ["rim-pressure", "self-creation", "rebounding"],
  },
  sg_slashing_scorer: {
    id: "sg_slashing_scorer",
    position: "SG",
    archetypeLabel: "Slasher",
    roleLabel: "Rim-pressure scorer",
    identitySummary: "Medium-touch scoring guard who attacks closeouts, runs in transition, and creates high rim pressure with limited playmaking.",
    statShape: { usage: "medium", shotVolume: "high", rimRate: "high", midrangeRate: "medium", threeRate: "medium", assistRate: "low", reboundRate: "low", offensiveReboundRate: "low", defensiveReboundRate: "low", stealRate: "medium", blockRate: "low", defensiveActivity: "medium", turnoverRisk: "medium", fatigueLoad: "high" },
    tendencyTargets: { touchWeight: 0.62, shotCreationWeight: 0.64, offBallShotWeight: 0.42, passCreationWeight: 0.28, threeVolumeWeight: 0.28, rimPressureWeight: 0.9, midrangeWeight: 0.34, reboundWeight: 0.3, offensiveReboundWeight: 0.3, defensiveReboundWeight: 0.3, stealWeight: 0.38, blockWeight: 0.22, contestWeight: 0.42, fatigueLoadWeight: 0.78 },
    testExpectations: [{ metric: "rimRate", bucket: "high" }, { metric: "assistRate", bucket: "low" }, { metric: "fatigueLoad", bucket: "high" }],
    strengthTags: ["rim-pressure", "transition-scoring", "closeout-attacks", "finishing"],
    weaknessTags: ["passing", "jumper-consistency", "rebounding"],
  },
  sg_point_of_attack_defender: {
    id: "sg_point_of_attack_defender",
    position: "SG",
    archetypeLabel: "Lockdown Defender",
    roleLabel: "Point-of-attack stopper",
    identitySummary: "Low-medium usage defensive guard who pressures ball handlers, creates steals, and contests perimeter threats without star touches.",
    statShape: { usage: "low", shotVolume: "low", rimRate: "medium", midrangeRate: "low", threeRate: "medium", assistRate: "low", reboundRate: "low", offensiveReboundRate: "low", defensiveReboundRate: "low", stealRate: "veryHigh", blockRate: "medium", defensiveActivity: "veryHigh", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.38, shotCreationWeight: 0.28, offBallShotWeight: 0.38, passCreationWeight: 0.32, threeVolumeWeight: 0.36, rimPressureWeight: 0.42, midrangeWeight: 0.3, reboundWeight: 0.36, offensiveReboundWeight: 0.28, defensiveReboundWeight: 0.42, stealWeight: 0.9, blockWeight: 0.62, contestWeight: 0.92, fatigueLoadWeight: 0.58 },
    testExpectations: [{ metric: "touches", bucket: "low" }, { metric: "steals", bucket: "veryHigh" }, { metric: "defensiveEvents", bucket: "veryHigh" }],
    strengthTags: ["point-of-attack-defense", "steals", "contests", "perimeter-pressure"],
    weaknessTags: ["shot-creation", "scoring-volume", "rebounding"],
  },
  sf_two_way_wing: {
    id: "sf_two_way_wing",
    position: "SF",
    archetypeLabel: "Swingman",
    roleLabel: "Versatile wing",
    identitySummary: "Balanced wing who scores enough, rebounds enough, and defends multiple matchups without requiring star-level usage.",
    statShape: { usage: "medium", shotVolume: "medium", rimRate: "medium", midrangeRate: "medium", threeRate: "medium", assistRate: "medium", reboundRate: "medium", offensiveReboundRate: "medium", defensiveReboundRate: "medium", stealRate: "medium", blockRate: "medium", defensiveActivity: "high", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.58, shotCreationWeight: 0.58, offBallShotWeight: 0.58, passCreationWeight: 0.42, threeVolumeWeight: 0.55, rimPressureWeight: 0.58, midrangeWeight: 0.5, reboundWeight: 0.5, offensiveReboundWeight: 0.42, defensiveReboundWeight: 0.52, stealWeight: 0.5, blockWeight: 0.45, contestWeight: 0.56, fatigueLoadWeight: 0.52 },
    testExpectations: [{ metric: "touches", bucket: "medium" }, { metric: "reboundRate", bucket: "medium" }, { metric: "defensiveEvents", bucket: "high" }],
    strengthTags: ["versatility", "multi-position-defense", "balanced-scoring", "lineup-fit"],
    weaknessTags: ["elite-creation", "specialist-volume", "focused-badge-path"],
  },
  sf_scoring_wing: {
    id: "sf_scoring_wing",
    position: "SF",
    archetypeLabel: "Sharpshooter",
    roleLabel: "Scoring wing",
    identitySummary: "High-touch wing scorer who generates jumper volume, attacks smaller defenders, and trades playmaking for shot volume.",
    statShape: { usage: "high", shotVolume: "high", rimRate: "medium", midrangeRate: "high", threeRate: "high", assistRate: "low", reboundRate: "medium", offensiveReboundRate: "medium", defensiveReboundRate: "medium", stealRate: "low", blockRate: "low", defensiveActivity: "medium", turnoverRisk: "medium", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.68, shotCreationWeight: 0.66, offBallShotWeight: 0.62, passCreationWeight: 0.3, threeVolumeWeight: 0.78, rimPressureWeight: 0.48, midrangeWeight: 0.76, reboundWeight: 0.42, offensiveReboundWeight: 0.34, defensiveReboundWeight: 0.46, stealWeight: 0.32, blockWeight: 0.28, contestWeight: 0.42, fatigueLoadWeight: 0.58 },
    testExpectations: [{ metric: "fga", bucket: "high" }, { metric: "threeRate", bucket: "high" }, { metric: "assistRate", bucket: "low" }],
    strengthTags: ["wing-scoring", "three-volume", "midrange-scoring", "size-scoring"],
    weaknessTags: ["playmaking", "defensive-consistency", "rebounding-ceiling"],
  },
  sf_point_forward: {
    id: "sf_point_forward",
    position: "SF",
    archetypeLabel: "Point Forward",
    roleLabel: "Frontcourt creator",
    identitySummary: "High-touch wing-sized initiator who creates assists from the frontcourt while carrying medium scoring and rebounding involvement.",
    statShape: { usage: "high", shotVolume: "medium", rimRate: "medium", midrangeRate: "medium", threeRate: "medium", assistRate: "high", reboundRate: "medium", offensiveReboundRate: "medium", defensiveReboundRate: "medium", stealRate: "medium", blockRate: "medium", defensiveActivity: "medium", turnoverRisk: "medium", fatigueLoad: "high" },
    tendencyTargets: { touchWeight: 0.78, shotCreationWeight: 0.58, offBallShotWeight: 0.42, passCreationWeight: 0.86, threeVolumeWeight: 0.36, rimPressureWeight: 0.48, midrangeWeight: 0.42, reboundWeight: 0.5, offensiveReboundWeight: 0.38, defensiveReboundWeight: 0.55, stealWeight: 0.42, blockWeight: 0.38, contestWeight: 0.48, fatigueLoadWeight: 0.66 },
    testExpectations: [{ metric: "touches", bucket: "high" }, { metric: "assistRate", bucket: "high" }, { metric: "fatigueLoad", bucket: "high" }],
    strengthTags: ["frontcourt-creation", "passing", "vision", "lineup-flexibility"],
    weaknessTags: ["shooting-volume", "turnover-risk", "defensive-impact"],
  },
  pf_stretch_four: {
    id: "pf_stretch_four",
    position: "PF",
    archetypeLabel: "Stretch Forward",
    roleLabel: "Stretch forward",
    identitySummary: "Medium-touch spacing forward who pulls big defenders from the paint with threes and pick-and-pop midrange value.",
    statShape: { usage: "medium", shotVolume: "medium", rimRate: "low", midrangeRate: "high", threeRate: "high", assistRate: "medium", reboundRate: "medium", offensiveReboundRate: "low", defensiveReboundRate: "medium", stealRate: "low", blockRate: "low", defensiveActivity: "medium", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.5, shotCreationWeight: 0.38, offBallShotWeight: 0.82, passCreationWeight: 0.38, threeVolumeWeight: 0.88, rimPressureWeight: 0.24, midrangeWeight: 0.72, reboundWeight: 0.46, offensiveReboundWeight: 0.32, defensiveReboundWeight: 0.5, stealWeight: 0.28, blockWeight: 0.34, contestWeight: 0.44, fatigueLoadWeight: 0.46 },
    testExpectations: [{ metric: "threeRate", bucket: "high" }, { metric: "rimRate", bucket: "low" }, { metric: "reboundRate", bucket: "medium" }],
    strengthTags: ["frontcourt-spacing", "pick-and-pop", "three-volume", "midrange-touch"],
    weaknessTags: ["paint-force", "offensive-rebounding", "rim-protection"],
  },
  pf_athletic_finisher: {
    id: "pf_athletic_finisher",
    position: "PF",
    archetypeLabel: "Slasher",
    roleLabel: "Athletic finisher",
    identitySummary: "Rim-running forward who cuts, runs, finishes vertically, and contributes high rebounding without needing creator touches.",
    statShape: { usage: "medium", shotVolume: "medium", rimRate: "high", midrangeRate: "low", threeRate: "low", assistRate: "low", reboundRate: "high", offensiveReboundRate: "medium", defensiveReboundRate: "high", stealRate: "medium", blockRate: "medium", defensiveActivity: "medium", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.48, shotCreationWeight: 0.34, offBallShotWeight: 0.28, passCreationWeight: 0.24, threeVolumeWeight: 0.12, rimPressureWeight: 0.86, midrangeWeight: 0.18, reboundWeight: 0.68, offensiveReboundWeight: 0.62, defensiveReboundWeight: 0.72, stealWeight: 0.34, blockWeight: 0.54, contestWeight: 0.58, fatigueLoadWeight: 0.56 },
    testExpectations: [{ metric: "rimRate", bucket: "high" }, { metric: "reboundRate", bucket: "high" }, { metric: "threeRate", bucket: "low" }],
    strengthTags: ["vertical-finishing", "rim-running", "transition-big", "rebounding"],
    weaknessTags: ["shooting", "self-creation", "spacing"],
  },
  pf_glass_defender: {
    id: "pf_glass_defender",
    position: "PF",
    archetypeLabel: "Rebounder",
    roleLabel: "Glass cleaner",
    identitySummary: "Low-touch defense and rebounding forward who controls possessions through boards, blocks, contests, and putbacks.",
    statShape: { usage: "low", shotVolume: "low", rimRate: "medium", midrangeRate: "veryLow", threeRate: "veryLow", assistRate: "low", reboundRate: "veryHigh", offensiveReboundRate: "veryHigh", defensiveReboundRate: "veryHigh", stealRate: "medium", blockRate: "high", defensiveActivity: "high", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.28, shotCreationWeight: 0.22, offBallShotWeight: 0.24, passCreationWeight: 0.24, threeVolumeWeight: 0.12, rimPressureWeight: 0.48, midrangeWeight: 0.18, reboundWeight: 0.94, offensiveReboundWeight: 0.92, defensiveReboundWeight: 0.96, stealWeight: 0.36, blockWeight: 0.62, contestWeight: 0.72, fatigueLoadWeight: 0.46 },
    testExpectations: [{ metric: "touches", bucket: "low" }, { metric: "reboundRate", bucket: "veryHigh" }, { metric: "defensiveEvents", bucket: "high" }],
    strengthTags: ["rebounding", "offensive-glass", "defensive-glass", "interior-defense"],
    weaknessTags: ["shooting", "shot-creation", "scoring-volume"],
  },
  c_paint_beast: {
    id: "c_paint_beast",
    position: "C",
    archetypeLabel: "Paint Beast",
    roleLabel: "Interior finisher",
    identitySummary: "Interior center who finishes through contact, lives near the rim, rebounds heavily, and supplies paint defense without spacing.",
    statShape: { usage: "medium", shotVolume: "medium", rimRate: "high", midrangeRate: "veryLow", threeRate: "veryLow", assistRate: "low", reboundRate: "high", offensiveReboundRate: "high", defensiveReboundRate: "high", stealRate: "low", blockRate: "high", defensiveActivity: "high", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.48, shotCreationWeight: 0.36, offBallShotWeight: 0.22, passCreationWeight: 0.22, threeVolumeWeight: 0.06, rimPressureWeight: 0.9, midrangeWeight: 0.12, reboundWeight: 0.86, offensiveReboundWeight: 0.86, defensiveReboundWeight: 0.82, stealWeight: 0.28, blockWeight: 0.72, contestWeight: 0.76, fatigueLoadWeight: 0.62 },
    testExpectations: [{ metric: "rimRate", bucket: "high" }, { metric: "reboundRate", bucket: "high" }, { metric: "threeRate", bucket: "veryLow" }],
    strengthTags: ["interior-finishing", "paint-pressure", "offensive-glass", "defensive-glass"],
    weaknessTags: ["spacing", "perimeter-value", "playmaking"],
  },
  c_rim_protector: {
    id: "c_rim_protector",
    position: "C",
    archetypeLabel: "Rim Protector",
    roleLabel: "Defensive anchor",
    identitySummary: "Low-usage defensive anchor who prioritizes blocks, contests, defensive rebounding, and cleanup offense over shot volume.",
    statShape: { usage: "low", shotVolume: "low", rimRate: "medium", midrangeRate: "veryLow", threeRate: "veryLow", assistRate: "low", reboundRate: "high", offensiveReboundRate: "medium", defensiveReboundRate: "high", stealRate: "medium", blockRate: "veryHigh", defensiveActivity: "veryHigh", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.24, shotCreationWeight: 0.2, offBallShotWeight: 0.18, passCreationWeight: 0.24, threeVolumeWeight: 0.1, rimPressureWeight: 0.44, midrangeWeight: 0.16, reboundWeight: 0.82, offensiveReboundWeight: 0.62, defensiveReboundWeight: 0.88, stealWeight: 0.36, blockWeight: 0.96, contestWeight: 0.94, fatigueLoadWeight: 0.48 },
    testExpectations: [{ metric: "touches", bucket: "low" }, { metric: "blocks", bucket: "veryHigh" }, { metric: "defensiveEvents", bucket: "veryHigh" }],
    strengthTags: ["rim-protection", "shot-blocking", "paint-contests", "defensive-rebounding"],
    weaknessTags: ["offensive-usage", "shooting", "self-creation"],
  },
  c_stretch_big: {
    id: "c_stretch_big",
    position: "C",
    archetypeLabel: "Stretch Big",
    roleLabel: "Stretch big",
    identitySummary: "Medium-touch spacing center who takes more threes than other bigs while remaining a size piece, not a guard-level creator.",
    statShape: { usage: "medium", shotVolume: "medium", rimRate: "low", midrangeRate: "high", threeRate: "high", assistRate: "medium", reboundRate: "medium", offensiveReboundRate: "low", defensiveReboundRate: "medium", stealRate: "low", blockRate: "medium", defensiveActivity: "medium", turnoverRisk: "low", fatigueLoad: "medium" },
    tendencyTargets: { touchWeight: 0.46, shotCreationWeight: 0.36, offBallShotWeight: 0.76, passCreationWeight: 0.36, threeVolumeWeight: 0.86, rimPressureWeight: 0.2, midrangeWeight: 0.72, reboundWeight: 0.52, offensiveReboundWeight: 0.36, defensiveReboundWeight: 0.58, stealWeight: 0.22, blockWeight: 0.38, contestWeight: 0.48, fatigueLoadWeight: 0.44 },
    testExpectations: [{ metric: "threeRate", bucket: "high" }, { metric: "rimRate", bucket: "low" }, { metric: "reboundRate", bucket: "medium" }],
    strengthTags: ["center-spacing", "pick-and-pop", "three-volume", "midrange-touch"],
    weaknessTags: ["paint-dominance", "offensive-rebounding", "rim-protection"],
  },
};

export const ARCHETYPE_SIM_CONTRACTS: readonly ArchetypeSimContract[] = Object.values(ARCHETYPE_SIM_CONTRACTS_BY_ID);

export const getArchetypeSimContract = (id: BuildPresetId): ArchetypeSimContract => ARCHETYPE_SIM_CONTRACTS_BY_ID[id];
