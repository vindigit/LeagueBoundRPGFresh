import type { PublicAttributeKey, PublicAttributes } from "../builder/publicAttributes";
import type { PlayerAttributes } from "../types/player";

type AttributeKey = keyof PlayerAttributes;

const ATTRIBUTE_LABELS: Partial<Record<AttributeKey, string>> = {
  shortRange: "Short Range",
  dunking: "Dunking",
  midrange: "Mid-Range",
  threePoint: "Three-Point",
  handle: "Handle",
  passing: "Passing",
  vision: "Vision",
  perimeterDefense: "Perimeter D",
  interiorDefense: "Interior D",
  stealing: "Stealing",
  blocking: "Blocking",
  offRebounding: "Off. Rebounding",
  defRebounding: "Def. Rebounding",
  speed: "Speed",
  strength: "Strength",
  stamina: "Stamina",
};

const PUBLIC_ATTRIBUTE_LABELS: Record<PublicAttributeKey, string> = {
  shooting: "Shooting",
  finishing: "Finishing",
  playmaking: "Playmaking",
  defending: "Defending",
  rebounding: "Rebounding",
  athleticism: "Athleticism",
  stamina: "Stamina",
};

export interface TopAttribute {
  key: AttributeKey;
  label: string;
  value: number;
}

export interface TopPublicAttribute {
  key: PublicAttributeKey;
  label: string;
  value: number;
}

export const getAllAttributesSorted = (attributes: PlayerAttributes): TopAttribute[] => {
  return (Object.entries(attributes) as Array<[AttributeKey, number]>)
    .map(([key, value], index) => ({ key, value, index }))
    .sort((a, b) => {
      if (b.value !== a.value) {
        return b.value - a.value;
      }
      return a.index - b.index;
    })
    .map(({ key, value }) => ({
      key,
      label: ATTRIBUTE_LABELS[key] ?? key,
      value,
    }));
};

export const getTopAttributes = (attributes: PlayerAttributes): TopAttribute[] => getAllAttributesSorted(attributes).slice(0, 6);

export const getAllPublicAttributesSorted = (attributes: PublicAttributes): TopPublicAttribute[] => {
  return (Object.entries(attributes) as Array<[PublicAttributeKey, number]>)
    .map(([key, value], index) => ({ key, value, index }))
    .sort((a, b) => {
      if (b.value !== a.value) {
        return b.value - a.value;
      }
      return a.index - b.index;
    })
    .map(({ key, value }) => ({
      key,
      label: PUBLIC_ATTRIBUTE_LABELS[key],
      value,
    }));
};
