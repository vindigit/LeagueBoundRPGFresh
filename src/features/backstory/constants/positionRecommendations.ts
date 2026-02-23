import type { PlayerArchetype, Position } from "../../../types/player";

export const POSITION_RECOMMENDATIONS: Record<Position, readonly PlayerArchetype[]> = {
  PG: ["Playmaker", "Sharpshooter", "Slasher"],
  SG: ["Sharpshooter", "Slasher", "Lockdown Defender"],
  SF: ["Slasher", "Lockdown Defender", "Stretch Big"],
  PF: ["Stretch Big", "Paint Beast", "Lockdown Defender"],
  C: ["Paint Beast", "Stretch Big", "Lockdown Defender"],
};
