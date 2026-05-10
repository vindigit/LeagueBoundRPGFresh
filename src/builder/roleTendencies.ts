import { LEAGUE_MODIFIERS } from "../constants/leagueScaling";
import { LeagueLevel } from "../types/career";
import type { BodyFrame, ExactHeight } from "../types/backstory";
import type { PlayerAttributes, Position } from "../types/player";
import type { ResolvedBuilderBadge } from "./badges/resolve";
import type { ArchetypeProfile } from "./presets";

export type TendencyLabel = "Low" | "Medium" | "High";

export interface PlayerRoleTendencies {
  touchWeight: number;
  passCreationWeight: number;
  selfCreationWeight: number;
  offBallShotWeight: number;
  rimPressureWeight: number;
  threeVolumeWeight: number;
  midrangeVolumeWeight: number;
  turnoverRiskWeight: number;
  assistCreationWeight: number;
  reboundWeight: number;
  offensiveReboundWeight: number;
  defensiveReboundWeight: number;
  stealEventWeight: number;
  blockEventWeight: number;
  contestWeight: number;
  fatigueLoadWeight: number;
}

export interface BuildRoleTendencyInput {
  attributes: PlayerAttributes;
  position: Position;
  archetypeProfile?: ArchetypeProfile;
  height?: ExactHeight;
  weightLbs?: number;
  bodyFrame?: BodyFrame;
  badges?: ResolvedBuilderBadge[];
  leagueLevel?: LeagueLevel;
  teamContext?: {
    averageThreePoint?: number;
    averageCreation?: number;
    averageRebounding?: number;
    averageDefense?: number;
  };
}

export interface RoleTendencyLabels {
  touches: TendencyLabel;
  rimAttempts: TendencyLabel;
  threeAttempts: TendencyLabel;
  turnoverRisk: TendencyLabel;
  assistRate: TendencyLabel;
  reboundInvolvement: TendencyLabel;
  defensiveEvents: TendencyLabel;
  fatigueRisk: TendencyLabel;
}

export interface RoleShotProfile {
  rim: number;
  midrange: number;
  three: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const average = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const score01 = (value: number): number => clamp(value / 99, 0, 1);
const scaled = (value: number, leagueLevel: LeagueLevel): number => clamp(value * LEAGUE_MODIFIERS[leagueLevel], 0, 99);

const POSITION_SIZE_FALLBACK: Record<Position, number> = {
  PG: -0.2,
  SG: -0.14,
  SF: 0.02,
  PF: 0.18,
  C: 0.28,
};

const POSITION_REBOUND_MULTIPLIER: Record<Position, number> = {
  PG: 0.5,
  SG: 0.58,
  SF: 0.82,
  PF: 1.22,
  C: 1.36,
};

const POSITION_BLOCK_MULTIPLIER: Record<Position, number> = {
  PG: 0.58,
  SG: 0.68,
  SF: 0.9,
  PF: 1.2,
  C: 1.38,
};

const sizeScore = (height: ExactHeight | undefined, weightLbs: number | undefined, position: Position): number => {
  const heightInches = height ? height.feet * 12 + height.inches : 74 + POSITION_SIZE_FALLBACK[position] * 18;
  const heightScore = clamp((heightInches - 68) / 17, 0, 1);
  const weightScore = weightLbs ? clamp((weightLbs - 155) / 115, 0, 1) : clamp(0.48 + POSITION_SIZE_FALLBACK[position], 0, 1);
  return clamp(heightScore * 0.62 + weightScore * 0.38, 0, 1);
};

const hasBadge = (badges: ResolvedBuilderBadge[] | undefined, id: string): boolean =>
  Boolean(badges?.some((badge) => badge.id === id));

const label = (value: number): TendencyLabel => {
  if (value >= 0.62) {
    return "High";
  }
  if (value >= 0.43) {
    return "Medium";
  }
  return "Low";
};

const riskLabel = (value: number): TendencyLabel => {
  if (value >= 0.58) {
    return "High";
  }
  if (value >= 0.36) {
    return "Medium";
  }
  return "Low";
};

export const derivePlayerRoleTendencies = (input: BuildRoleTendencyInput): PlayerRoleTendencies => {
  const leagueLevel = input.leagueLevel ?? LeagueLevel.MIDDLE_SCHOOL;
  const a = input.attributes;
  const leaguePreservation = 0.72;
  const effective = (value: number): number => value * leaguePreservation + scaled(value, leagueLevel) * (1 - leaguePreservation);
  const creation = average([effective(a.handle) * 0.42, effective(a.passing) * 0.28, effective(a.vision) * 0.3]) * 3;
  const passCreation = effective(a.vision) * 0.42 + effective(a.passing) * 0.38 + effective(a.handle) * 0.2;
  const selfCreation = effective(a.handle) * 0.42 + effective(a.speed) * 0.22 + effective(a.midrange) * 0.18 + effective(a.shortRange) * 0.18;
  const shooting = effective(a.threePoint) * 0.7 + effective(a.midrange) * 0.22 + effective(a.vision) * 0.08;
  const threeRelative = input.teamContext?.averageThreePoint === undefined ? 0 : clamp((a.threePoint - input.teamContext.averageThreePoint) / 35, -0.25, 0.28);
  const rim = effective(a.shortRange) * 0.36 + effective(a.dunking) * 0.27 + effective(a.speed) * 0.24 + effective(a.strength) * 0.13;
  const defense = effective(a.perimeterDefense) * 0.28 + effective(a.interiorDefense) * 0.22 + effective(a.stealing) * 0.25 + effective(a.blocking) * 0.25;
  const size = sizeScore(input.height, input.weightLbs, input.position);
  const reboundBase = (effective(a.offRebounding) * 0.43 + effective(a.defRebounding) * 0.47 + effective(a.strength) * 0.1) / 99;
  const reboundPosition = POSITION_REBOUND_MULTIPLIER[input.position];
  const ballSecurity = effective(a.handle) * 0.5 + effective(a.vision) * 0.28 + effective(a.passing) * 0.22;
  const floorGeneral = hasBadge(input.badges, "floor_general");
  const needleThreader = hasBadge(input.badges, "needle_threader");
  const deepRange = hasBadge(input.badges, "deep_range");
  const catchAndShoot = hasBadge(input.badges, "catch_and_shoot");
  const quickFirstStep = hasBadge(input.badges, "quick_first_step");
  const rimPressure = hasBadge(input.badges, "rim_pressure");
  const pointOfAttack = hasBadge(input.badges, "point_of_attack");
  const pickpocket = hasBadge(input.badges, "pickpocket");
  const anchor = hasBadge(input.badges, "anchor");
  const glass = hasBadge(input.badges, "glass_cleaner") || hasBadge(input.badges, "box_out_beast");

  const archetype = input.archetypeProfile?.roleTendencies;
  const blend = (attributeValue: number, archetypeValue: number | undefined, weight = 0.22): number =>
    archetypeValue === undefined ? attributeValue : clamp(attributeValue * (1 - weight) + archetypeValue * weight, 0.01, 1);

  return {
    touchWeight: blend(clamp(score01(creation) * 0.78 + score01(passCreation) * 0.22, 0.05, 1), archetype?.touchWeight),
    passCreationWeight: blend(clamp(score01(passCreation) + (floorGeneral ? 0.08 : 0) + (needleThreader ? 0.06 : 0), 0.05, 1), archetype?.passCreationWeight),
    selfCreationWeight: blend(clamp(score01(selfCreation), 0.05, 1), archetype?.shotCreationWeight),
    offBallShotWeight: blend(clamp(score01(shooting) * 0.88 + score01(a.stamina) * 0.12 + (catchAndShoot ? 0.08 : 0), 0.05, 1), archetype?.offBallShotWeight),
    rimPressureWeight: blend(clamp(score01(rim) + (quickFirstStep ? 0.07 : 0) + (rimPressure ? 0.05 : 0), 0.05, 1), archetype?.rimPressureWeight),
    threeVolumeWeight: blend(clamp(score01(shooting) + threeRelative + (deepRange ? 0.08 : 0) + (catchAndShoot ? 0.05 : 0), 0.03, 1), archetype?.threeVolumeWeight),
    midrangeVolumeWeight: blend(clamp(score01(effective(a.midrange) * 0.72 + effective(a.shortRange) * 0.15 + effective(a.handle) * 0.13), 0.05, 1), archetype?.midrangeWeight),
    turnoverRiskWeight: clamp(1 - score01(ballSecurity) + (rim > 72 ? 0.06 : 0) - (floorGeneral ? 0.07 : 0) - (needleThreader ? 0.05 : 0), 0.04, 0.96),
    assistCreationWeight: clamp(score01(passCreation) + (floorGeneral ? 0.09 : 0) + (needleThreader ? 0.08 : 0), 0.04, 1),
    reboundWeight: blend(clamp(reboundBase * reboundPosition * (0.72 + size * 0.55) + (glass ? 0.08 : 0), 0.03, 1), archetype?.reboundWeight),
    offensiveReboundWeight: blend(clamp(score01(effective(a.offRebounding) * 0.74 + effective(a.strength) * 0.26) * reboundPosition * (0.68 + size * 0.5), 0.03, 1), archetype?.offensiveReboundWeight),
    defensiveReboundWeight: blend(clamp((score01(effective(a.defRebounding) * 0.78 + effective(a.strength) * 0.22) * reboundPosition * (0.72 + size * 0.58)) + (glass ? 0.08 : 0), 0.03, 1), archetype?.defensiveReboundWeight),
    stealEventWeight: blend(clamp(score01(effective(a.stealing) * 0.5 + effective(a.perimeterDefense) * 0.28 + effective(a.speed) * 0.22) + (pointOfAttack ? 0.1 : 0) + (pickpocket ? 0.09 : 0), 0.03, 1), archetype?.stealWeight),
    blockEventWeight: blend(clamp(score01(effective(a.blocking) * 0.55 + effective(a.interiorDefense) * 0.28 + effective(a.strength) * 0.17) * POSITION_BLOCK_MULTIPLIER[input.position] * (0.68 + size * 0.46) + (anchor ? 0.1 : 0), 0.01, 1), archetype?.blockWeight),
    contestWeight: blend(clamp(score01(defense) + (pointOfAttack ? 0.05 : 0) + (anchor ? 0.06 : 0), 0.05, 1), archetype?.contestWeight),
    fatigueLoadWeight: blend(clamp(score01(creation) * 0.18 + score01(rim) * 0.14 + (1 - score01(effective(a.stamina))) * 0.58 + score01(selfCreation) * 0.1, 0.05, 1), archetype?.fatigueLoadWeight),
  };
};

export const toTendencyLabels = (t: PlayerRoleTendencies): RoleTendencyLabels => ({
  touches: label(t.touchWeight),
  rimAttempts: label(t.rimPressureWeight),
  threeAttempts: label(t.threeVolumeWeight),
  turnoverRisk: riskLabel(t.turnoverRiskWeight),
  assistRate: label(t.assistCreationWeight),
  reboundInvolvement: label(t.reboundWeight),
  defensiveEvents: label(t.stealEventWeight * 0.34 + t.blockEventWeight * 0.28 + t.contestWeight * 0.38),
  fatigueRisk: riskLabel(t.fatigueLoadWeight),
});

export const toShotProfile = (t: PlayerRoleTendencies): RoleShotProfile => {
  const rimRaw = 18 + t.rimPressureWeight * 56;
  const midRaw = 14 + t.midrangeVolumeWeight * 38;
  const threeRaw = 12 + t.threeVolumeWeight * 58;
  const total = rimRaw + midRaw + threeRaw;
  const rim = Math.round((rimRaw / total) * 100);
  const midrange = Math.round((midRaw / total) * 100);
  return {
    rim,
    midrange,
    three: 100 - rim - midrange,
  };
};
