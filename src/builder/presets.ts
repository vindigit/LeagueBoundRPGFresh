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

const growth = (weights: Partial<Record<keyof PlayerAttributes, number>>) => weights;
const role = (roleTendencies: NonNullable<BuildPreset["roleTendencies"]>) => roleTendencies;

const attrs = (attributes: PlayerAttributes): PlayerAttributes => attributes;

export const BUILD_PRESETS_BY_POSITION: Record<Position, readonly BuildPreset[]> = {
  PG: [
    {
      id: "pg_primary_creator",
      label: "Primary Creator",
      position: "PG",
      description: "Lead guard who runs offense, creates shots for others, and controls possessions.",
      strengths: ["Handle", "Passing", "Vision", "Stamina", "Ball security"],
      weaknesses: ["Rebounding", "Strength", "Interior defense", "Shooting efficiency needs investment"],
      attributes: attrs({
        shortRange: 66, dunking: 50, midrange: 68, threePoint: 70, handle: 84, passing: 90, vision: 90,
        perimeterDefense: 66, interiorDefense: 46, stealing: 64, blocking: 38, offRebounding: 40, defRebounding: 48,
        speed: 78, strength: 52, stamina: 82,
      }),
      intendedTendencies: {
        touches: "High", rimAttempts: "Medium", threeAttempts: "Medium", turnoverRisk: "Low",
        assistRate: "High", reboundInvolvement: "Low", defensiveEvents: "Medium", fatigueRisk: "Medium",
      },
      badgeHints: ["Floor General", "Needle Threader"],
      tradeoffNote: "Controls the offense early, but needs shooting growth to stay efficient against better defenses.",
    },
    {
      id: "pg_shotmaking_guard",
      label: "Shotmaking Guard",
      position: "PG",
      description: "Scoring PG who bends defense with pull-ups, threes, and late-clock scoring.",
      strengths: ["Three point", "Midrange", "Handle", "Stamina"],
      weaknesses: ["Lower assist rate", "Average rim pressure", "Defense depends on investment"],
      attributes: attrs({
        shortRange: 62, dunking: 46, midrange: 80, threePoint: 84, handle: 78, passing: 58, vision: 60,
        perimeterDefense: 60, interiorDefense: 44, stealing: 58, blocking: 36, offRebounding: 38, defRebounding: 46,
        speed: 74, strength: 50, stamina: 78,
      }),
      intendedTendencies: {
        touches: "High", rimAttempts: "Medium", threeAttempts: "High", turnoverRisk: "Medium",
        assistRate: "Medium", reboundInvolvement: "Low", defensiveEvents: "Low", fatigueRisk: "Medium",
      },
      badgeHints: ["Deep Range", "Mid-Range Magician"],
      tradeoffNote: "Creates pressure from jumpers, but playmaking and defense are secondary unless developed.",
    },
    {
      id: "pg_rim_pressure_guard",
      label: "Rim Pressure Guard",
      position: "PG",
      description: "Downhill guard who collapses defenses with speed, finishing, and contact pressure.",
      strengths: ["Speed", "Short range", "Dunking", "Handle", "Finishing pressure"],
      weaknesses: ["Shaky shooting", "Turnover risk if passing lags", "Higher fatigue risk"],
      attributes: attrs({
        shortRange: 80, dunking: 76, midrange: 56, threePoint: 50, handle: 78, passing: 62, vision: 60,
        perimeterDefense: 66, interiorDefense: 48, stealing: 64, blocking: 42, offRebounding: 44, defRebounding: 50,
        speed: 84, strength: 66, stamina: 68,
      }),
      intendedTendencies: {
        touches: "High", rimAttempts: "High", threeAttempts: "Low", turnoverRisk: "Medium",
        assistRate: "Medium", reboundInvolvement: "Low", defensiveEvents: "Medium", fatigueRisk: "High",
      },
      badgeHints: ["Quick First Step", "Slithery", "Rim Pressure"],
      tradeoffNote: "Gets downhill fast, but spacing and late-game stamina need attention.",
    },
  ],
  SG: [
    {
      id: "sg_movement_shooter",
      label: "Movement Shooter",
      position: "SG",
      description: "Off-ball shooter who scores through spacing, relocation, catch-and-shoot looks, and quick decisions.",
      strengths: ["Three point", "Midrange", "Stamina", "Off-ball scoring"],
      weaknesses: ["Lower touches", "Limited rim pressure", "Limited playmaking", "Needs creators"],
      attributes: attrs({
        shortRange: 58, dunking: 48, midrange: 80, threePoint: 84, handle: 64, passing: 58, vision: 68,
        perimeterDefense: 62, interiorDefense: 44, stealing: 58, blocking: 38, offRebounding: 42, defRebounding: 48,
        speed: 72, strength: 50, stamina: 80,
      }),
      intendedTendencies: {
        touches: "Medium", rimAttempts: "Low", threeAttempts: "High", turnoverRisk: "Low",
        assistRate: "Medium", reboundInvolvement: "Low", defensiveEvents: "Low", fatigueRisk: "Medium",
      },
      badgeHints: ["Catch and Shoot", "Deep Range"],
      tradeoffNote: "Elite spacing early, but games can pass by without a table-setter.",
    },
    {
      id: "sg_slashing_scorer",
      label: "Slashing Scorer",
      position: "SG",
      description: "Two guard who attacks closeouts, finishes at the rim, and scores in transition.",
      strengths: ["Short range", "Dunking", "Speed", "Scoring pressure"],
      weaknesses: ["Passing is secondary", "Jumper may be inconsistent", "Handle limits tough drives"],
      attributes: attrs({
        shortRange: 80, dunking: 78, midrange: 62, threePoint: 56, handle: 68, passing: 56, vision: 56,
        perimeterDefense: 64, interiorDefense: 50, stealing: 62, blocking: 44, offRebounding: 46, defRebounding: 52,
        speed: 82, strength: 66, stamina: 72,
      }),
      intendedTendencies: {
        touches: "Medium", rimAttempts: "High", threeAttempts: "Medium", turnoverRisk: "Medium",
        assistRate: "Low", reboundInvolvement: "Low", defensiveEvents: "Medium", fatigueRisk: "High",
      },
      badgeHints: ["Rim Pressure", "Posterizer"],
      tradeoffNote: "Scores in motion and transition, but half-court spacing is not a given.",
    },
    {
      id: "sg_point_of_attack_defender",
      label: "Point-of-Attack Defender",
      position: "SG",
      description: "Defensive guard who pressures ball handlers, creates steals, and guards top perimeter threats.",
      strengths: ["Perimeter defense", "Stealing", "Speed", "Stamina"],
      weaknesses: ["Lower shot creation", "Lower scoring ceiling", "Low rebounding"],
      attributes: attrs({
        shortRange: 60, dunking: 58, midrange: 58, threePoint: 60, handle: 62, passing: 58, vision: 62,
        perimeterDefense: 88, interiorDefense: 68, stealing: 86, blocking: 72, offRebounding: 42, defRebounding: 48,
        speed: 78, strength: 58, stamina: 72,
      }),
      intendedTendencies: {
        touches: "Medium", rimAttempts: "Medium", threeAttempts: "Medium", turnoverRisk: "Low",
        assistRate: "Low", reboundInvolvement: "Low", defensiveEvents: "High", fatigueRisk: "Medium",
      },
      badgeHints: ["Point of Attack", "Pickpocket"],
      tradeoffNote: "Defense travels immediately, but offensive growth decides the ceiling.",
    },
  ],
  SF: [
    {
      id: "sf_two_way_wing",
      label: "Two-Way Wing",
      position: "SF",
      description: "Balanced wing who scores enough, defends multiple positions, and fits almost any lineup.",
      strengths: ["Perimeter defense", "Physical tools", "Balanced scoring", "Versatility"],
      weaknesses: ["No elite offensive skill early", "Less flashy", "Spread-out badge path"],
      attributes: attrs({
        shortRange: 68, dunking: 66, midrange: 68, threePoint: 68, handle: 66, passing: 64, vision: 64,
        perimeterDefense: 80, interiorDefense: 70, stealing: 74, blocking: 70, offRebounding: 58, defRebounding: 64,
        speed: 74, strength: 66, stamina: 74,
      }),
      intendedTendencies: {
        touches: "Medium", rimAttempts: "Medium", threeAttempts: "Medium", turnoverRisk: "Low",
        assistRate: "Medium", reboundInvolvement: "Medium", defensiveEvents: "High", fatigueRisk: "Medium",
      },
      badgeHints: ["Point of Attack", "Help Defender"],
      tradeoffNote: "Fits quickly, but needs a chosen offensive lane to become a star.",
    },
    {
      id: "sf_scoring_wing",
      label: "Scoring Wing",
      position: "SF",
      description: "Bigger scorer who can shoot, attack midrange, and finish over smaller defenders.",
      strengths: ["Midrange", "Three point", "Short range", "Size-based scoring"],
      weaknesses: ["Playmaking secondary", "Defense needs investment", "Average rebounding"],
      attributes: attrs({
        shortRange: 74, dunking: 66, midrange: 80, threePoint: 78, handle: 68, passing: 58, vision: 60,
        perimeterDefense: 62, interiorDefense: 56, stealing: 58, blocking: 52, offRebounding: 52, defRebounding: 58,
        speed: 70, strength: 64, stamina: 74,
      }),
      intendedTendencies: {
        touches: "High", rimAttempts: "Medium", threeAttempts: "High", turnoverRisk: "Medium",
        assistRate: "Low", reboundInvolvement: "Medium", defensiveEvents: "Medium", fatigueRisk: "Medium",
      },
      badgeHints: ["Deep Range", "Mid-Range Magician"],
      tradeoffNote: "Can score early, but defensive consistency and passing are the tradeoffs.",
    },
    {
      id: "sf_point_forward",
      label: "Point Forward",
      position: "SF",
      description: "Wing-sized creator who passes, handles, and initiates offense from the frontcourt.",
      strengths: ["Passing", "Vision", "Handle", "Size", "Lineup flexibility"],
      weaknesses: ["Shooting may be secondary", "Turnover risk if handle stalls", "Defense/rebounding can lag"],
      attributes: attrs({
        shortRange: 66, dunking: 60, midrange: 64, threePoint: 60, handle: 80, passing: 82, vision: 80,
        perimeterDefense: 66, interiorDefense: 58, stealing: 64, blocking: 54, offRebounding: 54, defRebounding: 60,
        speed: 72, strength: 64, stamina: 72,
      }),
      intendedTendencies: {
        touches: "High", rimAttempts: "Medium", threeAttempts: "Medium", turnoverRisk: "Medium",
        assistRate: "High", reboundInvolvement: "Medium", defensiveEvents: "Medium", fatigueRisk: "High",
      },
      badgeHints: ["Floor General", "Needle Threader"],
      tradeoffNote: "Creates lineup flexibility, but shooting and defensive impact need deliberate development.",
    },
  ],
  PF: [
    {
      id: "pf_stretch_four",
      label: "Stretch Four",
      position: "PF",
      description: "Shooting forward who spaces the floor and pulls big defenders away from the paint.",
      strengths: ["Three point", "Midrange", "Off-ball spacing", "Pick-and-pop identity"],
      weaknesses: ["Average interior defense", "Weaker rebounding", "Low rim pressure"],
      attributes: attrs({
        shortRange: 58, dunking: 54, midrange: 78, threePoint: 82, handle: 58, passing: 62, vision: 66,
        perimeterDefense: 58, interiorDefense: 62, stealing: 54, blocking: 58, offRebounding: 54, defRebounding: 60,
        speed: 64, strength: 62, stamina: 74,
      }),
      intendedTendencies: {
        touches: "Medium", rimAttempts: "Medium", threeAttempts: "High", turnoverRisk: "Low",
        assistRate: "Medium", reboundInvolvement: "Medium", defensiveEvents: "Medium", fatigueRisk: "Medium",
      },
      badgeHints: ["Catch and Shoot", "Deep Range"],
      tradeoffNote: "Creates spacing at PF, but gives up some paint force and board control.",
    },
    {
      id: "pf_athletic_finisher",
      label: "Athletic Finisher",
      position: "PF",
      description: "Vertical forward who runs, cuts, finishes, and pressures the rim.",
      strengths: ["Dunking", "Short range", "Speed", "Strength", "Rim pressure"],
      weaknesses: ["Limited shooting", "Limited creation", "Spacing-negative without growth"],
      attributes: attrs({
        shortRange: 80, dunking: 82, midrange: 54, threePoint: 46, handle: 54, passing: 52, vision: 54,
        perimeterDefense: 62, interiorDefense: 68, stealing: 58, blocking: 68, offRebounding: 60, defRebounding: 64,
        speed: 76, strength: 78, stamina: 72,
      }),
      intendedTendencies: {
        touches: "Medium", rimAttempts: "High", threeAttempts: "Low", turnoverRisk: "Low",
        assistRate: "Low", reboundInvolvement: "High", defensiveEvents: "Medium", fatigueRisk: "Medium",
      },
      badgeHints: ["Posterizer", "Power Driver"],
      tradeoffNote: "Lives above the rim, but shooting development determines spacing value.",
    },
    {
      id: "pf_glass_defender",
      label: "Glass Defender",
      position: "PF",
      description: "Defense/rebounding PF who controls possessions without needing touches.",
      strengths: ["Rebounding", "Interior defense", "Blocking", "Strength"],
      weaknesses: ["Limited shooting", "Limited shot creation", "Lower scoring ceiling"],
      attributes: attrs({
        shortRange: 66, dunking: 68, midrange: 48, threePoint: 40, handle: 48, passing: 50, vision: 54,
        perimeterDefense: 68, interiorDefense: 84, stealing: 64, blocking: 84, offRebounding: 88, defRebounding: 90,
        speed: 66, strength: 82, stamina: 74,
      }),
      intendedTendencies: {
        touches: "Low", rimAttempts: "Medium", threeAttempts: "Low", turnoverRisk: "Low",
        assistRate: "Low", reboundInvolvement: "High", defensiveEvents: "High", fatigueRisk: "Medium",
      },
      badgeHints: ["Glass Cleaner", "Box Out Beast", "Anchor"],
      tradeoffNote: "Controls defensive possessions, but offensive impact has to show up in screens and putbacks.",
    },
  ],
  C: [
    {
      id: "c_paint_beast",
      label: "Paint Beast",
      position: "C",
      description: "Low-post/interior center who finishes through contact, rebounds, and punishes smaller lineups.",
      strengths: ["Short range", "Dunking", "Strength", "Offensive/defensive rebounding"],
      weaknesses: ["No spacing", "Low perimeter value", "Low playmaking", "Vulnerable to stretch matchups"],
      attributes: attrs({
        shortRange: 84, dunking: 82, midrange: 42, threePoint: 32, handle: 40, passing: 48, vision: 50,
        perimeterDefense: 48, interiorDefense: 78, stealing: 50, blocking: 74, offRebounding: 82, defRebounding: 84,
        speed: 58, strength: 84, stamina: 72,
      }),
      intendedTendencies: {
        touches: "Medium", rimAttempts: "High", threeAttempts: "Low", turnoverRisk: "Low",
        assistRate: "Low", reboundInvolvement: "High", defensiveEvents: "High", fatigueRisk: "Medium",
      },
      badgeHints: ["Rim Pressure", "Putback Boss", "Box Out Beast"],
      tradeoffNote: "Dominates inside, but lineups must cover the lack of spacing.",
    },
    {
      id: "c_rim_protector",
      label: "Rim Protector",
      position: "C",
      description: "Defense-first center who blocks shots, anchors the paint, and controls defensive possessions.",
      strengths: ["Interior defense", "Blocking", "Defensive rebounding", "Strength"],
      weaknesses: ["Limited scoring package", "Limited shooting", "Lower offensive touches"],
      attributes: attrs({
        shortRange: 68, dunking: 70, midrange: 44, threePoint: 34, handle: 38, passing: 48, vision: 54,
        perimeterDefense: 54, interiorDefense: 84, stealing: 58, blocking: 86, offRebounding: 70, defRebounding: 84,
        speed: 60, strength: 82, stamina: 74,
      }),
      intendedTendencies: {
        touches: "Low", rimAttempts: "Medium", threeAttempts: "Low", turnoverRisk: "Low",
        assistRate: "Low", reboundInvolvement: "High", defensiveEvents: "High", fatigueRisk: "Medium",
      },
      badgeHints: ["Anchor", "Chase Down", "Box Out Beast"],
      tradeoffNote: "Anchors the paint immediately, but offense is cleanup-heavy unless developed.",
    },
    {
      id: "c_stretch_big",
      label: "Stretch Big",
      position: "C",
      description: "Center who spaces the floor while still providing size.",
      strengths: ["Three point", "Midrange", "Spacing", "Pick-and-pop offense"],
      weaknesses: ["Lower interior dominance", "Rebounding/strength tradeoff", "Defensive impact may lag"],
      attributes: attrs({
        shortRange: 56, dunking: 50, midrange: 80, threePoint: 84, handle: 52, passing: 60, vision: 66,
        perimeterDefense: 52, interiorDefense: 62, stealing: 50, blocking: 58, offRebounding: 56, defRebounding: 66,
        speed: 58, strength: 62, stamina: 74,
      }),
      intendedTendencies: {
        touches: "Medium", rimAttempts: "Medium", threeAttempts: "High", turnoverRisk: "Low",
        assistRate: "Medium", reboundInvolvement: "Medium", defensiveEvents: "Medium", fatigueRisk: "Medium",
      },
      badgeHints: ["Catch and Shoot", "Deep Range"],
      tradeoffNote: "Spaces from center, but sacrifices some early paint control.",
    },
  ],
};

const ROLE_LABEL_BY_PRESET_ID: Record<BuildPresetId, string> = {
  pg_primary_creator: "Lead creator",
  pg_shotmaking_guard: "Pull-up scorer",
  pg_rim_pressure_guard: "Downhill attacker",
  sg_movement_shooter: "Off-ball scorer",
  sg_slashing_scorer: "Rim-pressure scorer",
  sg_point_of_attack_defender: "Point-of-attack stopper",
  sf_two_way_wing: "Versatile wing",
  sf_scoring_wing: "Scoring wing",
  sf_point_forward: "Frontcourt creator",
  pf_stretch_four: "Stretch forward",
  pf_athletic_finisher: "Athletic finisher",
  pf_glass_defender: "Glass cleaner",
  c_paint_beast: "Interior finisher",
  c_rim_protector: "Defensive anchor",
  c_stretch_big: "Stretch big",
};

const ARCHETYPE_LABEL_BY_PRESET_ID: Record<BuildPresetId, string> = {
  pg_primary_creator: "Playmaker",
  pg_shotmaking_guard: "Sharpshooter",
  pg_rim_pressure_guard: "Slasher",
  sg_movement_shooter: "Sharpshooter",
  sg_slashing_scorer: "Slasher",
  sg_point_of_attack_defender: "Lockdown Defender",
  sf_two_way_wing: "Swingman",
  sf_scoring_wing: "Sharpshooter",
  sf_point_forward: "Point Forward",
  pf_stretch_four: "Stretch Forward",
  pf_athletic_finisher: "Slasher",
  pf_glass_defender: "Rebounder",
  c_paint_beast: "Paint Beast",
  c_rim_protector: "Rim Protector",
  c_stretch_big: "Stretch Big",
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

const ROLE_TENDENCIES_BY_LABEL: Record<string, NonNullable<BuildPreset["roleTendencies"]>> = {
  Playmaker: role({ touchWeight: 0.84, shotCreationWeight: 0.64, offBallShotWeight: 0.42, passCreationWeight: 0.9, threeVolumeWeight: 0.48, rimPressureWeight: 0.52, midrangeWeight: 0.46, reboundWeight: 0.18, offensiveReboundWeight: 0.12, defensiveReboundWeight: 0.22, stealWeight: 0.44, blockWeight: 0.12, contestWeight: 0.42, fatigueLoadWeight: 0.58 }),
  Sharpshooter: role({ touchWeight: 0.56, shotCreationWeight: 0.52, offBallShotWeight: 0.9, passCreationWeight: 0.38, threeVolumeWeight: 0.92, rimPressureWeight: 0.22, midrangeWeight: 0.72, reboundWeight: 0.28, offensiveReboundWeight: 0.18, defensiveReboundWeight: 0.28, stealWeight: 0.28, blockWeight: 0.18, contestWeight: 0.34, fatigueLoadWeight: 0.5 }),
  Slasher: role({ touchWeight: 0.66, shotCreationWeight: 0.66, offBallShotWeight: 0.42, passCreationWeight: 0.36, threeVolumeWeight: 0.22, rimPressureWeight: 0.9, midrangeWeight: 0.32, reboundWeight: 0.42, offensiveReboundWeight: 0.42, defensiveReboundWeight: 0.38, stealWeight: 0.38, blockWeight: 0.34, contestWeight: 0.42, fatigueLoadWeight: 0.8 }),
  "Lockdown Defender": role({ touchWeight: 0.38, shotCreationWeight: 0.28, offBallShotWeight: 0.38, passCreationWeight: 0.32, threeVolumeWeight: 0.36, rimPressureWeight: 0.42, midrangeWeight: 0.3, reboundWeight: 0.36, offensiveReboundWeight: 0.28, defensiveReboundWeight: 0.42, stealWeight: 0.9, blockWeight: 0.62, contestWeight: 0.92, fatigueLoadWeight: 0.58 }),
  Swingman: role({ touchWeight: 0.58, shotCreationWeight: 0.58, offBallShotWeight: 0.58, passCreationWeight: 0.42, threeVolumeWeight: 0.55, rimPressureWeight: 0.58, midrangeWeight: 0.5, reboundWeight: 0.5, offensiveReboundWeight: 0.42, defensiveReboundWeight: 0.52, stealWeight: 0.5, blockWeight: 0.45, contestWeight: 0.56, fatigueLoadWeight: 0.52 }),
  "Point Forward": role({ touchWeight: 0.78, shotCreationWeight: 0.58, offBallShotWeight: 0.42, passCreationWeight: 0.86, threeVolumeWeight: 0.36, rimPressureWeight: 0.48, midrangeWeight: 0.42, reboundWeight: 0.5, offensiveReboundWeight: 0.38, defensiveReboundWeight: 0.55, stealWeight: 0.42, blockWeight: 0.38, contestWeight: 0.48, fatigueLoadWeight: 0.66 }),
  Rebounder: role({ touchWeight: 0.28, shotCreationWeight: 0.22, offBallShotWeight: 0.24, passCreationWeight: 0.24, threeVolumeWeight: 0.12, rimPressureWeight: 0.48, midrangeWeight: 0.18, reboundWeight: 0.94, offensiveReboundWeight: 0.92, defensiveReboundWeight: 0.96, stealWeight: 0.36, blockWeight: 0.62, contestWeight: 0.72, fatigueLoadWeight: 0.46 }),
  "Rim Protector": role({ touchWeight: 0.24, shotCreationWeight: 0.2, offBallShotWeight: 0.18, passCreationWeight: 0.24, threeVolumeWeight: 0.1, rimPressureWeight: 0.44, midrangeWeight: 0.16, reboundWeight: 0.82, offensiveReboundWeight: 0.62, defensiveReboundWeight: 0.88, stealWeight: 0.36, blockWeight: 0.96, contestWeight: 0.94, fatigueLoadWeight: 0.48 }),
  "Paint Beast": role({ touchWeight: 0.48, shotCreationWeight: 0.36, offBallShotWeight: 0.22, passCreationWeight: 0.22, threeVolumeWeight: 0.06, rimPressureWeight: 0.9, midrangeWeight: 0.12, reboundWeight: 0.86, offensiveReboundWeight: 0.86, defensiveReboundWeight: 0.82, stealWeight: 0.28, blockWeight: 0.72, contestWeight: 0.76, fatigueLoadWeight: 0.62 }),
  "Stretch Big": role({ touchWeight: 0.46, shotCreationWeight: 0.36, offBallShotWeight: 0.76, passCreationWeight: 0.36, threeVolumeWeight: 0.86, rimPressureWeight: 0.2, midrangeWeight: 0.72, reboundWeight: 0.52, offensiveReboundWeight: 0.36, defensiveReboundWeight: 0.58, stealWeight: 0.22, blockWeight: 0.38, contestWeight: 0.48, fatigueLoadWeight: 0.44 }),
  "Stretch Forward": role({ touchWeight: 0.5, shotCreationWeight: 0.38, offBallShotWeight: 0.82, passCreationWeight: 0.38, threeVolumeWeight: 0.88, rimPressureWeight: 0.24, midrangeWeight: 0.72, reboundWeight: 0.46, offensiveReboundWeight: 0.32, defensiveReboundWeight: 0.5, stealWeight: 0.28, blockWeight: 0.34, contestWeight: 0.44, fatigueLoadWeight: 0.46 }),
  "Post Scorer": role({ touchWeight: 0.56, shotCreationWeight: 0.44, offBallShotWeight: 0.2, passCreationWeight: 0.26, threeVolumeWeight: 0.08, rimPressureWeight: 0.82, midrangeWeight: 0.34, reboundWeight: 0.68, offensiveReboundWeight: 0.66, defensiveReboundWeight: 0.66, stealWeight: 0.24, blockWeight: 0.54, contestWeight: 0.6, fatigueLoadWeight: 0.58 }),
};

const toArchetypeProfile = (preset: BuildPreset): ArchetypeProfile => ({
  ...preset,
  label: ARCHETYPE_LABEL_BY_PRESET_ID[preset.id],
  validPositions: [preset.position],
  defaultRoleLabel: ROLE_LABEL_BY_PRESET_ID[preset.id],
  roleLabelByPosition: { [preset.position]: ROLE_LABEL_BY_PRESET_ID[preset.id] },
  startingAttributesByPosition: { [preset.position]: preset.attributes },
  growthWeights: GROWTH_WEIGHTS_BY_LABEL[ARCHETYPE_LABEL_BY_PRESET_ID[preset.id]] ?? {},
  roleTendencies: ROLE_TENDENCIES_BY_LABEL[ARCHETYPE_LABEL_BY_PRESET_ID[preset.id]] ?? ROLE_TENDENCIES_BY_LABEL.Swingman,
});

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
