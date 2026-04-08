import type { LeagueLevel } from "./career";
import type { PlayerArchetype, PlayerAttributes, Position } from "./player";
import type { BuilderClassification } from "../builder/classify";
import type { ResolvedBuilderBadge } from "../builder/badges/resolve";

export type BodyFrame = "Lean" | "Athletic" | "Stocky";
export type DominantHand = "Left" | "Right";
export type AgeStartedBand = "EARLY" | "STANDARD" | "LATE";
export type GrowthCurve = "EARLY_STARTER" | "STEADY" | "LATE_BLOOMER";
export type AttributeGainSource = "NARRATIVE" | "MATCH_REWARD" | "TRAINING" | "SYSTEM";
export type HeightPreset = "5_8_5_10" | "5_11_6_1" | "6_2_6_4" | "6_5_6_7" | "6_8_6_10" | "6_11_7_1";
export type WeightPreset = "150_165" | "166_180" | "181_200" | "201_220" | "221_245" | "246_270";
export type PotentialTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface ExactHeight {
  feet: number;
  inches: number;
}

export interface Hometown {
  slug: string;
  city: string;
  stateCode: string;
  state: string;
}

export interface StateOption {
  code: string;
  name: string;
}

export interface CityOption {
  slug: string;
  city: string;
  stateCode: string;
  state: string;
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
  primaryPosition: Position;
  secondaryPosition: Position;
  height: ExactHeight;
  weightLbs: number;
}

export interface PlayerDNA {
  potential: number;
  potentialTier: PotentialTier;
  growthCurve: GrowthCurve;
  generationSeed: number;
  growthByLeague: Record<LeagueLevel, number>;
  caps: PlayerAttributes;
  growthResidue: Partial<Record<keyof PlayerAttributes, number>>;
  publicTraits: string[];
  builderProfile?: GeneratedBadgeProfile;
}

export interface BackstoryInput {
  firstName: string;
  lastName: string;
  stateCode: string;
  citySlug: string;
  archetype: PlayerArchetype;
  ageStarted: number;
  bodyFrame: BodyFrame;
  dominantHand: DominantHand;
  primaryPosition: Position;
  secondaryPosition: Position;
  height: ExactHeight;
  weightLbs: number;
  generationSeed?: number;
}

export interface BuildBackstoryInput {
  firstName: string;
  lastName: string;
  stateCode: string;
  citySlug: string;
  ageStarted: number;
  bodyFrame: BodyFrame;
  dominantHand: DominantHand;
  primaryPosition: Position;
  secondaryPosition: Position;
  height: ExactHeight;
  weightLbs: number;
  buildAttributes: PlayerAttributes;
  generationSeed?: number;
}

export interface GeneratedBadgeProfile {
  classification: BuilderClassification;
  badges: ResolvedBuilderBadge[];
}

export interface CareerNewsItem {
  id: string;
  createdAt: number;
  week: number;
  category: "LOCAL_BUZZ" | "POSTGAME_RECAP";
  headline: string;
  subhead?: string;
}
