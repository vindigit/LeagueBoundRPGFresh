import type { PlayerAttributes } from "../../types/player";
import type { BuilderClassification } from "../classify";

export type BuilderBadgeId =
  | "rim_pressure"
  | "deep_range"
  | "floor_general"
  | "point_of_attack"
  | "anchor"
  | "glass_cleaner"
  | "power_driver";

export type BuilderBadgeTier = "BRONZE" | "SILVER" | "GOLD";

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
    sortOrder: 10,
    classificationFamilies: ["Finishing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { shortRange: 72, dunking: 70 } },
      { tier: "SILVER", minAttributes: { shortRange: 82, dunking: 80 } },
      { tier: "GOLD", minAttributes: { shortRange: 90, dunking: 88 } },
    ],
  },
  {
    id: "deep_range",
    label: "Deep Range",
    description: "Shooting badge for perimeter builds with elite range.",
    sortOrder: 20,
    classificationFamilies: ["Shooting"],
    tiers: [
      { tier: "BRONZE", minAttributes: { threePoint: 78, midrange: 72 } },
      { tier: "SILVER", minAttributes: { threePoint: 86, midrange: 78 } },
      { tier: "GOLD", minAttributes: { threePoint: 92, midrange: 84 } },
    ],
  },
  {
    id: "floor_general",
    label: "Floor General",
    description: "Creation badge for primary initiators and hub creators.",
    sortOrder: 30,
    classificationFamilies: ["Creation"],
    tiers: [
      { tier: "BRONZE", minAttributes: { handle: 76, passing: 74, vision: 70 } },
      { tier: "SILVER", minAttributes: { handle: 84, passing: 82, vision: 78 } },
      { tier: "GOLD", minAttributes: { handle: 92, passing: 90, vision: 86 } },
    ],
  },
  {
    id: "point_of_attack",
    label: "Point of Attack",
    description: "Defense badge for guards and wings that drive perimeter disruption.",
    sortOrder: 40,
    classificationFamilies: ["Defense"],
    positionFamilies: ["Guard", "Wing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { perimeterDefense: 74, stealing: 70 } },
      { tier: "SILVER", minAttributes: { perimeterDefense: 84, stealing: 80 } },
      { tier: "GOLD", minAttributes: { perimeterDefense: 92, stealing: 88 } },
    ],
  },
  {
    id: "anchor",
    label: "Anchor",
    description: "Defense badge for interior-oriented bigs.",
    sortOrder: 50,
    classificationFamilies: ["Defense"],
    positionFamilies: ["Big"],
    tiers: [
      { tier: "BRONZE", minAttributes: { interiorDefense: 76, blocking: 74 } },
      { tier: "SILVER", minAttributes: { interiorDefense: 86, blocking: 84 } },
      { tier: "GOLD", minAttributes: { interiorDefense: 94, blocking: 92 } },
    ],
  },
  {
    id: "glass_cleaner",
    label: "Glass Cleaner",
    description: "Rebounding badge for elite board work.",
    sortOrder: 60,
    classificationFamilies: ["Rebounding"],
    tiers: [
      { tier: "BRONZE", minAttributes: { offRebounding: 68, defRebounding: 76 } },
      { tier: "SILVER", minAttributes: { offRebounding: 76, defRebounding: 84 } },
      { tier: "GOLD", minAttributes: { offRebounding: 84, defRebounding: 92 } },
    ],
  },
  {
    id: "power_driver",
    label: "Power Driver",
    description: "Physical badge for strong downhill builds.",
    sortOrder: 70,
    classificationFamilies: ["Physical", "Finishing"],
    tiers: [
      { tier: "BRONZE", minAttributes: { strength: 72, speed: 68 } },
      { tier: "SILVER", minAttributes: { strength: 82, speed: 76 } },
      { tier: "GOLD", minAttributes: { strength: 90, speed: 84 } },
    ],
  },
];
