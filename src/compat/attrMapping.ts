// Temporary bridge: maps old 9-attr players to new 16-attr shape
// DELETE THIS FILE after Sprint 2

import type { OldPlayerAttributes, PlayerAttributes, Rating0To99 } from "../types/player";

const clampRating = (n: number): Rating0To99 =>
  Math.max(0, Math.min(99, Math.round(n))) as Rating0To99;

export const expandAttributes = (old: OldPlayerAttributes): PlayerAttributes => ({
  shortRange: old.finishing,
  dunking: clampRating(old.finishing * 0.8 + old.athleticism * 0.2),
  midrange: clampRating(old.shooting * 0.9),
  threePoint: old.shooting,
  handle: old.handle,
  passing: clampRating(old.vision * 0.6 + old.handle * 0.4),
  vision: old.bbiq,
  perimeterDefense: old.defense,
  interiorDefense: clampRating(old.defense * 0.7 + old.rebounding * 0.3),
  stealing: clampRating(old.defense * 0.6 + old.athleticism * 0.4),
  blocking: clampRating(old.defense * 0.5 + old.athleticism * 0.5),
  offRebounding: clampRating(old.rebounding * 0.8),
  defRebounding: old.rebounding,
  speed: old.athleticism,
  strength: clampRating(old.athleticism * 0.5 + old.finishing * 0.5),
  stamina: old.stamina,
});
