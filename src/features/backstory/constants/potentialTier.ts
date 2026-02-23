import type { PotentialTier } from "../../../types/backstory";

/**
 * Maps a hidden potential roll (55-97 in current generator rules) into a public tier label.
 *
 * The tier is safe to expose in UI/traits while the exact potential number remains hidden.
 * It is used for preview chips, player-card trait badges, and narrative copy that references upside.
 *
 * @param potential Hidden potential ceiling value.
 * @returns Public-facing potential tier.
 */
export const getPotentialTier = (potential: number): PotentialTier => {
  if (potential >= 90) {
    return "Platinum";
  }
  if (potential >= 80) {
    return "Gold";
  }
  if (potential >= 65) {
    return "Silver";
  }
  return "Bronze";
};
