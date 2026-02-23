import type { PotentialTier } from "../../../types/backstory";

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
