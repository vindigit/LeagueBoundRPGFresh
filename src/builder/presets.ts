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
  description: string;
  strengths: string[];
  weaknesses: string[];
  attributes: PlayerAttributes;
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
        shortRange: 66, dunking: 50, midrange: 68, threePoint: 70, handle: 84, passing: 82, vision: 80,
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
        shortRange: 62, dunking: 46, midrange: 80, threePoint: 84, handle: 78, passing: 64, vision: 66,
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
        perimeterDefense: 62, interiorDefense: 68, stealing: 58, blocking: 68, offRebounding: 66, defRebounding: 70,
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
        perimeterDefense: 68, interiorDefense: 82, stealing: 64, blocking: 82, offRebounding: 82, defRebounding: 84,
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

export const getDefaultBuildPreset = (position: Position): BuildPreset => BUILD_PRESETS_BY_POSITION[position][0];
