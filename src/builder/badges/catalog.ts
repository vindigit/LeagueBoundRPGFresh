import type { PlayerAttributes } from "../../types/player";
import type { BuilderClassification } from "../classify";

export type BuilderBadgeId =
  | "rim_pressure"
  | "slithery"
  | "posterizer"
  | "deep_range"
  | "mid_range_magician"
  | "catch_and_shoot"
  | "floor_general"
  | "needle_threader"
  | "quick_first_step"
  | "point_of_attack"
  | "pickpocket"
  | "help_defender"
  | "anchor"
  | "chase_down"
  | "glass_cleaner"
  | "box_out_beast"
  | "putback_boss"
  | "power_driver";

export type BuilderBadgeTier = "BRONZE" | "SILVER" | "GOLD";

export type BadgeHookTag =
  | "shot_selection"
  | "shot_make"
  | "assist"
  | "turnover"
  | "steal"
  | "contest"
  | "block"
  | "rebound"
  | "putback"
  | "dunk";

type AttributeThresholds = Partial<Record<keyof PlayerAttributes, number>>;

export interface BuilderBadgeTierRule {
  tier: BuilderBadgeTier;
  minAttributes?: AttributeThresholds;
  minCaps?: AttributeThresholds;
}

export interface BuilderBadgeCatalogEntry {
  id: BuilderBadgeId;
  label: string;
  description: string;
  hookSummary: string;
  hookTags: readonly BadgeHookTag[];
  sortOrder: number;
  classificationFamilies?: BuilderClassification["taxonomy"]["family"][];
  positionFamilies?: BuilderClassification["taxonomy"]["positionFamily"][];
  tiers: readonly BuilderBadgeTierRule[];
}

export const BUILDER_BADGE_CATALOG: readonly BuilderBadgeCatalogEntry[] = [
  {
    id: "rim_pressure",
    label: "Rim Pressure",
    description: "Finishing-based badge for downhill slashers and interior finishers.",
    hookSummary: "Improves rim finishing and cleanup touch around the basket.",
    hookTags: ["shot_make", "putback"],
    sortOrder: 10,
    classificationFamilies: ["Finishing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { shortRange: 72, dunking: 70 } },
      { tier: "SILVER", minAttributes: { shortRange: 82, dunking: 80 } },
      { tier: "GOLD", minAttributes: { shortRange: 90, dunking: 88 } },
    ],
  },
  {
    id: "slithery",
    label: "Slithery",
    description: "Craft-finishing badge for guards and wings who avoid direct contact at the rim.",
    hookSummary: "Cuts down rim-drive turnovers and boosts layup conversion.",
    hookTags: ["turnover", "shot_make"],
    sortOrder: 20,
    classificationFamilies: ["Finishing", "Creation"],
    positionFamilies: ["Guard", "Wing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { shortRange: 74, handle: 72, speed: 74 } },
      { tier: "SILVER", minAttributes: { shortRange: 84, handle: 80, speed: 82 } },
      { tier: "GOLD", minAttributes: { shortRange: 90, handle: 88, speed: 88 } },
    ],
  },
  {
    id: "posterizer",
    label: "Posterizer",
    description: "Explosive finishing badge for above-the-rim slashers.",
    hookSummary: "Creates more dunk attempts and converts through rim contests.",
    hookTags: ["dunk", "shot_make", "block"],
    sortOrder: 30,
    classificationFamilies: ["Finishing", "Physical"],
    tiers: [
      { tier: "BRONZE", minAttributes: { dunking: 78, strength: 74, speed: 68 } },
      { tier: "SILVER", minAttributes: { dunking: 86, strength: 82, speed: 76 } },
      { tier: "GOLD", minAttributes: { dunking: 94, strength: 90, speed: 84 } },
    ],
  },
  {
    id: "deep_range",
    label: "Deep Range",
    description: "Shooting badge for perimeter builds with elite range.",
    hookSummary: "Increases three-point volume and make rate from deep.",
    hookTags: ["shot_selection", "shot_make"],
    sortOrder: 40,
    classificationFamilies: ["Shooting"],
    tiers: [
      { tier: "BRONZE", minAttributes: { threePoint: 78, midrange: 72 } },
      { tier: "SILVER", minAttributes: { threePoint: 86, midrange: 78 } },
      { tier: "GOLD", minAttributes: { threePoint: 92, midrange: 84 } },
    ],
  },
  {
    id: "mid_range_magician",
    label: "Mid-Range Magician",
    description: "Shotmaking badge for players who live in the in-between game.",
    hookSummary: "Raises midrange shot selection and conversion.",
    hookTags: ["shot_selection", "shot_make"],
    sortOrder: 50,
    classificationFamilies: ["Shooting", "Finishing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { midrange: 78, shortRange: 72 } },
      { tier: "SILVER", minAttributes: { midrange: 86, shortRange: 80 } },
      { tier: "GOLD", minAttributes: { midrange: 94, shortRange: 88 } },
    ],
  },
  {
    id: "catch_and_shoot",
    label: "Catch and Shoot",
    description: "Shooting badge for off-ball marksmen who punish kick-outs.",
    hookSummary: "Boosts assisted jumper efficiency without changing self-creation much.",
    hookTags: ["shot_make", "assist"],
    sortOrder: 60,
    classificationFamilies: ["Shooting"],
    tiers: [
      { tier: "BRONZE", minAttributes: { threePoint: 76, midrange: 72, vision: 68 } },
      { tier: "SILVER", minAttributes: { threePoint: 84, midrange: 80, vision: 76 } },
      { tier: "GOLD", minAttributes: { threePoint: 90, midrange: 86, vision: 82 } },
    ],
  },
  {
    id: "floor_general",
    label: "Floor General",
    description: "Creation badge for primary initiators and hub creators.",
    hookSummary: "Improves offensive orchestration by lowering mistakes and creating cleaner assists.",
    hookTags: ["turnover", "assist"],
    sortOrder: 70,
    classificationFamilies: ["Creation"],
    tiers: [
      { tier: "BRONZE", minAttributes: { handle: 76, passing: 74, vision: 70 } },
      { tier: "SILVER", minAttributes: { handle: 84, passing: 82, vision: 78 } },
      { tier: "GOLD", minAttributes: { handle: 92, passing: 90, vision: 86 } },
    ],
  },
  {
    id: "needle_threader",
    label: "Needle Threader",
    description: "Playmaking badge for precision passers who break pressure windows.",
    hookSummary: "Protects pass-heavy possessions and improves assist generation.",
    hookTags: ["turnover", "assist"],
    sortOrder: 80,
    classificationFamilies: ["Creation"],
    tiers: [
      { tier: "BRONZE", minAttributes: { passing: 78, vision: 76, handle: 72 } },
      { tier: "SILVER", minAttributes: { passing: 86, vision: 84, handle: 80 } },
      { tier: "GOLD", minAttributes: { passing: 92, vision: 90, handle: 88 } },
    ],
  },
  {
    id: "quick_first_step",
    label: "Quick First Step",
    description: "Burst-creation badge for guards and wings who win the first move.",
    hookSummary: "Tilts shot selection toward the rim and reduces downhill ball pressure.",
    hookTags: ["shot_selection", "turnover"],
    sortOrder: 90,
    classificationFamilies: ["Creation", "Physical"],
    positionFamilies: ["Guard", "Wing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { handle: 78, speed: 76, shortRange: 72 } },
      { tier: "SILVER", minAttributes: { handle: 86, speed: 84, shortRange: 80 } },
      { tier: "GOLD", minAttributes: { handle: 92, speed: 90, shortRange: 86 } },
    ],
  },
  {
    id: "point_of_attack",
    label: "Point of Attack",
    description: "Defense badge for guards and wings that drive perimeter disruption.",
    hookSummary: "Raises on-ball pressure, steals, and perimeter contest quality.",
    hookTags: ["turnover", "steal", "contest"],
    sortOrder: 100,
    classificationFamilies: ["Defense"],
    positionFamilies: ["Guard", "Wing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { perimeterDefense: 74, stealing: 70 } },
      { tier: "SILVER", minAttributes: { perimeterDefense: 84, stealing: 80 } },
      { tier: "GOLD", minAttributes: { perimeterDefense: 92, stealing: 88 } },
    ],
  },
  {
    id: "pickpocket",
    label: "Pickpocket",
    description: "Disruption badge for defenders with elite hands and anticipation.",
    hookSummary: "Improves steal chance and amplifies turnover pressure.",
    hookTags: ["turnover", "steal"],
    sortOrder: 110,
    classificationFamilies: ["Defense"],
    positionFamilies: ["Guard", "Wing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { stealing: 78, perimeterDefense: 74, speed: 72 } },
      { tier: "SILVER", minAttributes: { stealing: 86, perimeterDefense: 82, speed: 80 } },
      { tier: "GOLD", minAttributes: { stealing: 92, perimeterDefense: 90, speed: 86 } },
    ],
  },
  {
    id: "help_defender",
    label: "Help Defender",
    description: "Rotational defense badge for players who read the paint early.",
    hookSummary: "Adds rim contest value and stronger weak-side shot protection.",
    hookTags: ["contest", "block"],
    sortOrder: 120,
    classificationFamilies: ["Defense"],
    tiers: [
      { tier: "BRONZE", minAttributes: { perimeterDefense: 74, interiorDefense: 72, vision: 68 } },
      { tier: "SILVER", minAttributes: { perimeterDefense: 82, interiorDefense: 80, vision: 76 } },
      { tier: "GOLD", minAttributes: { perimeterDefense: 90, interiorDefense: 88, vision: 84 } },
    ],
  },
  {
    id: "anchor",
    label: "Anchor",
    description: "Defense badge for interior-oriented bigs.",
    hookSummary: "Suppresses opponent rim and putback efficiency while raising rim protection.",
    hookTags: ["contest", "block", "putback"],
    sortOrder: 130,
    classificationFamilies: ["Defense"],
    positionFamilies: ["Big"],
    tiers: [
      { tier: "BRONZE", minAttributes: { interiorDefense: 76, blocking: 74 } },
      { tier: "SILVER", minAttributes: { interiorDefense: 86, blocking: 84 } },
      { tier: "GOLD", minAttributes: { interiorDefense: 94, blocking: 92 } },
    ],
  },
  {
    id: "chase_down",
    label: "Chase Down",
    description: "Recovery-rim badge for athletes who erase plays from behind.",
    hookSummary: "Adds rim blocks and second-jump putback denials.",
    hookTags: ["block", "putback"],
    sortOrder: 140,
    classificationFamilies: ["Defense", "Physical"],
    tiers: [
      { tier: "BRONZE", minAttributes: { blocking: 76, speed: 70, interiorDefense: 74 } },
      { tier: "SILVER", minAttributes: { blocking: 84, speed: 78, interiorDefense: 82 } },
      { tier: "GOLD", minAttributes: { blocking: 92, speed: 84, interiorDefense: 90 } },
    ],
  },
  {
    id: "glass_cleaner",
    label: "Glass Cleaner",
    description: "Rebounding badge for elite board work.",
    hookSummary: "Improves board control and quick putback touch after securing position.",
    hookTags: ["rebound", "putback"],
    sortOrder: 150,
    classificationFamilies: ["Rebounding"],
    tiers: [
      { tier: "BRONZE", minAttributes: { offRebounding: 68, defRebounding: 76 } },
      { tier: "SILVER", minAttributes: { offRebounding: 76, defRebounding: 84 } },
      { tier: "GOLD", minAttributes: { offRebounding: 84, defRebounding: 92 } },
    ],
  },
  {
    id: "box_out_beast",
    label: "Box Out Beast",
    description: "Rebounding badge for physical bigs who end possessions with leverage.",
    hookSummary: "Raises defensive rebound control and suppresses second chances.",
    hookTags: ["rebound"],
    sortOrder: 160,
    classificationFamilies: ["Rebounding", "Physical"],
    positionFamilies: ["Big"],
    tiers: [
      { tier: "BRONZE", minAttributes: { defRebounding: 78, strength: 74, interiorDefense: 72 } },
      { tier: "SILVER", minAttributes: { defRebounding: 86, strength: 82, interiorDefense: 80 } },
      { tier: "GOLD", minAttributes: { defRebounding: 92, strength: 90, interiorDefense: 88 } },
    ],
  },
  {
    id: "putback_boss",
    label: "Putback Boss",
    description: "Second-chance badge for rebounders who turn boards into points fast.",
    hookSummary: "Improves offensive rebound conversion and immediate putback scoring.",
    hookTags: ["rebound", "putback"],
    sortOrder: 170,
    classificationFamilies: ["Rebounding", "Finishing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { offRebounding: 72, shortRange: 74, strength: 72 } },
      { tier: "SILVER", minAttributes: { offRebounding: 80, shortRange: 82, strength: 80 } },
      { tier: "GOLD", minAttributes: { offRebounding: 88, shortRange: 90, strength: 88 } },
    ],
  },
  {
    id: "power_driver",
    label: "Power Driver",
    description: "Physical badge for strong downhill builds.",
    hookSummary: "Converts strength and burst into cleaner rim pressure and fewer strips.",
    hookTags: ["turnover", "shot_make"],
    sortOrder: 180,
    classificationFamilies: ["Physical", "Finishing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { strength: 72, speed: 68 } },
      { tier: "SILVER", minAttributes: { strength: 82, speed: 76 } },
      { tier: "GOLD", minAttributes: { strength: 90, speed: 84 } },
    ],
  },
];
