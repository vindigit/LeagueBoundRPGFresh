import type { PlayerArchetype, PlayerAttributes, Position } from "../types/player";
import { computeDerivedRatings, type DerivedRatings } from "./derivedRatings";

type DerivedRatingKey = Exclude<keyof DerivedRatings, "ovr">;
type PositionFamily = "Guard" | "Wing" | "Big";
type TaxonomyFamily = "Finishing" | "Shooting" | "Creation" | "Defense" | "Rebounding" | "Physical";

export interface BuilderTaxonomy {
  family: TaxonomyFamily;
  positionFamily: PositionFamily;
  label: string;
  primaryStrength: DerivedRatingKey;
  secondaryStrength: DerivedRatingKey;
}

export interface BuilderClassification {
  taxonomy: BuilderTaxonomy;
  legacyArchetype: PlayerArchetype;
  derivedRatings: DerivedRatings;
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

  return {
    taxonomy: {
      family,
      positionFamily,
      label: LABELS_BY_STRENGTH[family][positionFamily],
      primaryStrength,
      secondaryStrength,
    },
    legacyArchetype: mapToLegacyArchetype(positionFamily, strengthOrder, attributes),
    derivedRatings,
  };
};
