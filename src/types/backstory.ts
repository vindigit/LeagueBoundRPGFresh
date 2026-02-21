import type { LeagueLevel } from "./career";
import type { PlayerArchetype, PlayerAttributes } from "./player";

export type BodyFrame = "Lean" | "Athletic" | "Stocky";
export type DominantHand = "Left" | "Right";
export type AgeStartedBand = "EARLY" | "STANDARD" | "LATE";
export type GrowthCurve = "EARLY_STARTER" | "STEADY" | "LATE_BLOOMER";
export type AttributeGainSource = "NARRATIVE" | "MATCH_REWARD" | "TRAINING" | "SYSTEM";

export interface Hometown {
  slug: string;
  city: string;
  state: string;
  prestige: 1 | 2 | 3 | 4 | 5;
}

export interface PlayerIdentity {
  firstName: string;
  lastName: string;
  displayName: string;
  hometown: Hometown;
  ageStarted: number;
  ageStartedBand: AgeStartedBand;
  bodyFrame: BodyFrame;
  dominantHand: DominantHand;
  archetype: PlayerArchetype;
}

export interface PlayerDNA {
  potential: number;
  growthCurve: GrowthCurve;
  generationSeed: number;
  growthByLeague: Record<LeagueLevel, number>;
  caps: PlayerAttributes;
  publicTraits: string[];
}

export interface BackstoryInput {
  firstName: string;
  lastName: string;
  hometownSlug: string;
  archetype: PlayerArchetype;
  ageStarted: number;
  bodyFrame: BodyFrame;
  dominantHand: DominantHand;
  generationSeed?: number;
}

export interface CareerNewsItem {
  id: string;
  createdAt: number;
  week: number;
  category: "LOCAL_BUZZ" | "POSTGAME_RECAP";
  headline: string;
  subhead?: string;
}
