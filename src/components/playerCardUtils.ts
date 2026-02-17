import type { PlayerAttributes } from "../types/player";

type AttributeKey = keyof PlayerAttributes;

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  shooting: "Shooting",
  finishing: "Finishing",
  vision: "Vision",
  handle: "Handle",
  athleticism: "Athleticism",
  defense: "Defense",
  rebounding: "Rebounding",
  bbiq: "BBIQ",
  stamina: "Stamina",
};

export interface TopAttribute {
  key: AttributeKey;
  label: string;
  value: number;
}

export const getTopAttributes = (attributes: PlayerAttributes): TopAttribute[] => {
  return (Object.entries(attributes) as Array<[AttributeKey, number]>)
    .map(([key, value], index) => ({ key, value, index }))
    .sort((a, b) => {
      if (b.value !== a.value) {
        return b.value - a.value;
      }
      return a.index - b.index;
    })
    .slice(0, 3)
    .map(({ key, value }) => ({
      key,
      label: ATTRIBUTE_LABELS[key],
      value,
    }));
};
