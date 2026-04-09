import type { PlayerAttributes } from "../../types/player";
import type { BuilderClassification } from "../classify";
import {
  BUILDER_BADGE_CATALOG,
  type BuilderBadgeCatalogEntry,
  type BuilderBadgeId,
  type BuilderBadgeTier,
  type BuilderBadgeTierRule,
} from "./catalog";

export interface ResolvedBuilderBadge {
  id: BuilderBadgeId;
  label: string;
  tier: BuilderBadgeTier;
  description: string;
}

export interface ResolveBuilderBadgesInput {
  attributes: PlayerAttributes;
  classification: BuilderClassification;
  caps?: PlayerAttributes;
}

const satisfiesThresholds = (
  thresholds: Partial<Record<keyof PlayerAttributes, number>> | undefined,
  source: PlayerAttributes | undefined,
): boolean => {
  if (!thresholds) {
    return true;
  }
  if (!source) {
    return false;
  }

  return Object.entries(thresholds).every(([key, value]) => source[key as keyof PlayerAttributes] >= (value ?? 0));
};

const satisfiesTierRule = (
  rule: BuilderBadgeTierRule,
  attributes: PlayerAttributes,
  caps: PlayerAttributes | undefined,
): boolean => satisfiesThresholds(rule.minAttributes, attributes) && satisfiesThresholds(rule.minCaps, caps);

const isClassificationMatch = (entry: BuilderBadgeCatalogEntry, classification: BuilderClassification): boolean => {
  if (entry.classificationFamilies && !entry.classificationFamilies.includes(classification.taxonomy.family)) {
    return false;
  }

  if (entry.positionFamilies && !entry.positionFamilies.includes(classification.taxonomy.positionFamily)) {
    return false;
  }

  return true;
};

export const resolveBuilderBadges = (input: ResolveBuilderBadgesInput): ResolvedBuilderBadge[] =>
  BUILDER_BADGE_CATALOG
    .filter((entry) => isClassificationMatch(entry, input.classification))
    .map((entry) => {
      const tier = [...entry.tiers]
        .reverse()
        .find((rule) => satisfiesTierRule(rule, input.attributes, input.caps));

      if (!tier) {
        return null;
      }

      return {
        id: entry.id,
        label: entry.label,
        tier: tier.tier,
        description: entry.description,
      } as ResolvedBuilderBadge;
    })
    .filter((entry): entry is ResolvedBuilderBadge => entry !== null)
    .sort((left, right) => {
      const leftOrder = BUILDER_BADGE_CATALOG.find((entry) => entry.id === left.id)?.sortOrder ?? 0;
      const rightOrder = BUILDER_BADGE_CATALOG.find((entry) => entry.id === right.id)?.sortOrder ?? 0;
      return leftOrder - rightOrder;
    });
