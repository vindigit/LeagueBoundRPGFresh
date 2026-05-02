import type { PlayerArchetype, PlayerAttributes, Position } from "../types/player";
import { computeDerivedRatings, type DerivedRatings } from "./derivedRatings";

type DerivedRatingKey = Exclude<keyof DerivedRatings, "ovr">;
type PositionFamily = "Guard" | "Wing" | "Big";
type TaxonomyFamily = "Finishing" | "Shooting" | "Creation" | "Defense" | "Rebounding" | "Physical";
type ClassificationConfidence = "low" | "medium" | "high";

export interface BuilderTaxonomy {
  family: TaxonomyFamily;
  positionFamily: PositionFamily;
  label: string;
  primaryStrength: DerivedRatingKey;
  secondaryStrength: DerivedRatingKey;
  hasStandoutStrength: boolean;
}

export interface BuilderClassification {
  taxonomy: BuilderTaxonomy;
  legacyArchetype: PlayerArchetype;
  derivedRatings: DerivedRatings;
  archetypeConfidence: ClassificationConfidence;
}

const POSITION_FAMILY_BY_POSITION: Record<Position, PositionFamily> = {
  PG: "Guard",
  SG: "Guard",
  SF: "Wing",
  PF: "Big",
  C: "Big",
};

const RATING_LABELS: Record<DerivedRatingKey, TaxonomyFamily> = {
  finishingRating: "Finishing",
  shootingRating: "Shooting",
  playmakingRating: "Creation",
  defenseRating: "Defense",
  reboundingRating: "Rebounding",
  physicalRating: "Physical",
};

const LABELS_BY_STRENGTH: Record<TaxonomyFamily, Record<PositionFamily, string>> = {
  Finishing: {
    Guard: "Rim Pressure Guard",
    Wing: "Slashing Wing",
    Big: "Interior Finisher",
  },
  Shooting: {
    Guard: "Shotmaking Guard",
    Wing: "Scoring Wing",
    Big: "Stretch Interior",
  },
  Creation: {
    Guard: "Primary Creator",
    Wing: "Point Forward",
    Big: "Hub Big",
  },
  Defense: {
    Guard: "Point-of-Attack Stopper",
    Wing: "Two-Way Wing",
    Big: "Anchor Big",
  },
  Rebounding: {
    Guard: "Rebounding Guard",
    Wing: "Glass Wing",
    Big: "Glass Cleaner",
  },
  Physical: {
    Guard: "Power Guard",
    Wing: "Power Wing",
    Big: "Power Big",
  },
};

const BALANCED_LABELS: Record<PositionFamily, string> = {
  Guard: "Balanced Guard",
  Wing: "Balanced Wing",
  Big: "Balanced Big",
};

const STANDOUT_MIN_RATING = 68;
const STANDOUT_SPREAD = 7;
const HIGH_CONFIDENCE_SPREAD = 14;

const getStrengthOrder = (derivedRatings: DerivedRatings): DerivedRatingKey[] =>
  (Object.entries(derivedRatings) as Array<[keyof DerivedRatings, number]>)
    .filter(([key]) => key !== "ovr")
    .sort((left, right) => right[1] - left[1])
    .map(([key]) => key as DerivedRatingKey);

const mapToLegacyArchetype = (
  positionFamily: PositionFamily,
  strengths: DerivedRatingKey[],
  attributes: PlayerAttributes,
): PlayerArchetype => {
  const [primaryStrength, secondaryStrength] = strengths;

  if (primaryStrength === "playmakingRating") {
    return "Playmaker";
  }

  if (primaryStrength === "shootingRating") {
    return positionFamily === "Big" ? "Stretch Big" : "Sharpshooter";
  }

  if (primaryStrength === "defenseRating") {
    if (positionFamily === "Big" && attributes.interiorDefense >= attributes.perimeterDefense) {
      return "Paint Beast";
    }
    return "Lockdown Defender";
  }

  if (primaryStrength === "reboundingRating") {
    return attributes.threePoint >= 80 ? "Stretch Big" : "Paint Beast";
  }

  if (primaryStrength === "physicalRating") {
    if (positionFamily === "Big") {
      return "Paint Beast";
    }
    return secondaryStrength === "defenseRating" ? "Lockdown Defender" : "Slasher";
  }

  if (primaryStrength === "finishingRating") {
    return positionFamily === "Big" ? "Paint Beast" : "Slasher";
  }

  return "Slasher";
};

export const classifyBuilderBuild = (attributes: PlayerAttributes, position: Position): BuilderClassification => {
  const derivedRatings = computeDerivedRatings(attributes, position);
  const strengthOrder = getStrengthOrder(derivedRatings);
  const [primaryStrength, secondaryStrength] = strengthOrder;
  const positionFamily = POSITION_FAMILY_BY_POSITION[position];
  const family = RATING_LABELS[primaryStrength];
  const primaryValue = derivedRatings[primaryStrength];
  const secondaryValue = derivedRatings[secondaryStrength];
  const spread = primaryValue - secondaryValue;
  const otherAverage =
    strengthOrder.slice(1).reduce((sum, key) => sum + derivedRatings[key], 0) / Math.max(1, strengthOrder.length - 1);
  const hasStandoutStrength =
    primaryValue >= STANDOUT_MIN_RATING &&
    (spread >= STANDOUT_SPREAD || (primaryValue >= 82 && primaryValue - otherAverage >= STANDOUT_SPREAD));
  const archetypeConfidence: ClassificationConfidence = hasStandoutStrength
    ? spread >= HIGH_CONFIDENCE_SPREAD
      ? "high"
      : "medium"
    : "low";

  return {
    taxonomy: {
      family,
      positionFamily,
      label: hasStandoutStrength ? LABELS_BY_STRENGTH[family][positionFamily] : BALANCED_LABELS[positionFamily],
      primaryStrength,
      secondaryStrength,
      hasStandoutStrength,
    },
    legacyArchetype: mapToLegacyArchetype(positionFamily, strengthOrder, attributes),
    derivedRatings,
    archetypeConfidence,
  };
};
