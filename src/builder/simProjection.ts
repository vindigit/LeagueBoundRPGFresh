import type { ExactHeight } from "../types/backstory";
import type { PlayerAttributes, Position } from "../types/player";
import { BUILDER_BADGE_CATALOG, type BuilderBadgeCatalogEntry, type BuilderBadgeTierRule } from "./badges/catalog";
import { resolveBuilderBadges, type ResolvedBuilderBadge } from "./badges/resolve";
import { classifyBuilderBuild, type BuilderClassification } from "./classify";

type TendencyLabel = "Low" | "Medium" | "High";
type AttributeKey = keyof PlayerAttributes;

export interface BuildShotProfileProjection {
  rim: number;
  midrange: number;
  three: number;
}

export interface BuildTendencyProjection {
  touches: TendencyLabel;
  rimAttempts: TendencyLabel;
  threeAttempts: TendencyLabel;
  turnoverRisk: TendencyLabel;
  assistRate: TendencyLabel;
  reboundInvolvement: TendencyLabel;
  defensiveEvents: TendencyLabel;
  fatigueRisk: TendencyLabel;
}

export interface BadgeWatchItem {
  id: string;
  label: string;
  tier: ResolvedBuilderBadge["tier"];
  status: "unlocked" | "nearby";
  summary: string;
}

export interface BuildSimProjection {
  classification: BuilderClassification;
  projectedRole: string;
  identityNote: string;
  tendencies: BuildTendencyProjection;
  shotProfile: BuildShotProfileProjection;
  badges: ResolvedBuilderBadge[];
  badgeWatch: BadgeWatchItem[];
  explanations: string[];
}

export interface BuildSimProjectionInput {
  attributes: PlayerAttributes;
  position: Position;
  caps?: PlayerAttributes;
  height?: ExactHeight;
  weightLbs?: number;
}

const NEAR_BADGE_THRESHOLD_DISTANCE = 5;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const average = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;

const scoreToLabel = (score: number): TendencyLabel => {
  if (score >= 67) {
    return "High";
  }
  if (score >= 47) {
    return "Medium";
  }
  return "Low";
};

const riskToLabel = (risk: number): TendencyLabel => {
  if (risk >= 58) {
    return "High";
  }
  if (risk >= 38) {
    return "Medium";
  }
  return "Low";
};

const normalizePercentages = (raw: Record<keyof BuildShotProfileProjection, number>): BuildShotProfileProjection => {
  const total = raw.rim + raw.midrange + raw.three;
  const rim = Math.round((raw.rim / total) * 100);
  const midrange = Math.round((raw.midrange / total) * 100);
  return {
    rim,
    midrange,
    three: 100 - rim - midrange,
  };
};

const getSizeModifier = (height: ExactHeight | undefined, weightLbs: number | undefined): number => {
  const inches = height ? height.feet * 12 + height.inches : 74;
  const heightModifier = clamp((inches - 74) * 1.2, -8, 10);
  const weightModifier = weightLbs ? clamp((weightLbs - 190) / 12, -6, 7) : 0;
  return heightModifier + weightModifier;
};

const getProjectedRole = (classification: BuilderClassification, tendencies: BuildTendencyProjection): string => {
  if (!classification.taxonomy.hasStandoutStrength) {
    return classification.taxonomy.label;
  }

  const usage = tendencies.touches === "High" ? "High-usage " : tendencies.touches === "Low" ? "Low-usage " : "";
  const style =
    classification.taxonomy.family === "Finishing"
      ? "slashing"
      : classification.taxonomy.family === "Shooting"
        ? "shooting"
        : classification.taxonomy.family === "Creation"
          ? "playmaking"
          : classification.taxonomy.family === "Defense"
            ? "defensive"
            : classification.taxonomy.family === "Rebounding"
              ? "rebounding"
              : "physical";

  return `${usage}${style} ${classification.taxonomy.positionFamily.toLowerCase()}`;
};

const getIdentityNote = (classification: BuilderClassification): string =>
  classification.taxonomy.hasStandoutStrength
    ? `Confidence: ${classification.archetypeConfidence}. The sim will lean into ${classification.taxonomy.family.toLowerCase()} outcomes.`
    : "No standout strengths yet. Raise 2-3 core attributes to define your playstyle.";

const satisfiesThresholds = (
  thresholds: Partial<Record<AttributeKey, number>> | undefined,
  source: PlayerAttributes | undefined,
): boolean => {
  if (!thresholds) {
    return true;
  }
  if (!source) {
    return false;
  }
  return Object.entries(thresholds).every(([key, value]) => source[key as AttributeKey] >= (value ?? 0));
};

const getRuleDistance = (
  rule: BuilderBadgeTierRule,
  attributes: PlayerAttributes,
  caps: PlayerAttributes | undefined,
): number | null => {
  const attrMissing = Object.entries(rule.minAttributes ?? {}).map(([key, value]) =>
    Math.max(0, (value ?? 0) - attributes[key as AttributeKey]),
  );
  const capMissing = Object.entries(rule.minCaps ?? {}).map(([key, value]) =>
    caps ? Math.max(0, (value ?? 0) - caps[key as AttributeKey]) : Number.POSITIVE_INFINITY,
  );
  const missing = [...attrMissing, ...capMissing];
  if (missing.some((value) => !Number.isFinite(value))) {
    return null;
  }
  return missing.reduce((sum, value) => sum + value, 0);
};

const isClassificationMatch = (entry: BuilderBadgeCatalogEntry, classification: BuilderClassification): boolean => {
  if (entry.classificationFamilies && !entry.classificationFamilies.includes(classification.taxonomy.family)) {
    return false;
  }
  if (entry.positionFamilies && !entry.positionFamilies.includes(classification.taxonomy.positionFamily)) {
    return false;
  }
  return true;
};

const buildBadgeWatch = (
  attributes: PlayerAttributes,
  classification: BuilderClassification,
  caps: PlayerAttributes | undefined,
  badges: ResolvedBuilderBadge[],
): BadgeWatchItem[] => {
  const unlockedIds = new Set(badges.map((badge) => badge.id));
  const unlocked = badges.map((badge) => {
    const catalogEntry = BUILDER_BADGE_CATALOG.find((entry) => entry.id === badge.id);
    return {
      id: badge.id,
      label: badge.label,
      tier: badge.tier,
      status: "unlocked" as const,
      summary: catalogEntry?.hookSummary ?? badge.description,
    };
  });

  const nearby = BUILDER_BADGE_CATALOG
    .filter((entry) => !unlockedIds.has(entry.id) && isClassificationMatch(entry, classification))
    .map((entry) => {
      const candidate = entry.tiers
        .filter((rule) => satisfiesThresholds(rule.minCaps, caps))
        .map((rule) => ({ rule, distance: getRuleDistance(rule, attributes, caps) }))
        .filter((candidate): candidate is { rule: BuilderBadgeTierRule; distance: number } => candidate.distance !== null && candidate.distance > 0)
        .sort((left, right) => left.distance - right.distance)[0];

      if (!candidate || candidate.distance > NEAR_BADGE_THRESHOLD_DISTANCE) {
        return null;
      }

      return {
        id: entry.id,
        label: entry.label,
        tier: candidate.rule.tier,
        status: "nearby" as const,
        summary: entry.hookSummary,
      };
    })
    .filter((entry): entry is BadgeWatchItem => entry !== null)
    .slice(0, 3);

  return [...unlocked, ...nearby].slice(0, 6);
};

export const buildSimProjection = (input: BuildSimProjectionInput): BuildSimProjection => {
  const { attributes, position, caps, height, weightLbs } = input;
  const classification = classifyBuilderBuild(attributes, position);
  const badges = resolveBuilderBadges({ attributes, caps, classification });
  const badgeIds = new Set(badges.map((badge) => badge.id));
  const sizeModifier = getSizeModifier(height, weightLbs);

  const creation = attributes.handle * 0.45 + attributes.vision * 0.3 + attributes.passing * 0.25;
  const rimPressure = attributes.shortRange * 0.38 + attributes.dunking * 0.28 + attributes.speed * 0.22 + attributes.strength * 0.12;
  const shooting = attributes.threePoint * 0.68 + attributes.midrange * 0.22 + attributes.vision * 0.1;
  const playmaking = attributes.vision * 0.42 + attributes.passing * 0.38 + attributes.handle * 0.2;
  const defense = attributes.perimeterDefense * 0.28 + attributes.interiorDefense * 0.22 + attributes.stealing * 0.25 + attributes.blocking * 0.25;
  const rebounding = attributes.offRebounding * 0.42 + attributes.defRebounding * 0.48 + attributes.strength * 0.1 + sizeModifier;
  const ballSecurity = attributes.handle * 0.52 + attributes.vision * 0.28 + attributes.passing * 0.2;

  const threeBadgeBoost = badgeIds.has("deep_range") ? 8 : 0;
  const rimBadgeBoost = badgeIds.has("quick_first_step") ? 7 : badgeIds.has("rim_pressure") ? 5 : 0;
  const rawShotProfile = {
    rim: 28 + (rimPressure - 60) * 0.75 + rimBadgeBoost,
    midrange: 24 + (attributes.midrange - 60) * 0.45 + (attributes.shortRange - attributes.threePoint) * 0.08,
    three: 24 + (attributes.threePoint - 60) * 0.95 + threeBadgeBoost,
  };
  const shotProfile = normalizePercentages({
    rim: clamp(rawShotProfile.rim, 8, 70),
    midrange: clamp(rawShotProfile.midrange, 8, 55),
    three: attributes.threePoint < 62 ? clamp(rawShotProfile.three * 0.55, 5, 40) : clamp(rawShotProfile.three, 8, 65),
  });

  const tendencies: BuildTendencyProjection = {
    touches: scoreToLabel(creation),
    rimAttempts: scoreToLabel(rimPressure),
    threeAttempts: scoreToLabel(shooting),
    turnoverRisk: riskToLabel(78 - ballSecurity * 0.75 - (badgeIds.has("floor_general") ? 7 : 0) - (badgeIds.has("needle_threader") ? 5 : 0)),
    assistRate: scoreToLabel(playmaking),
    reboundInvolvement: scoreToLabel(rebounding),
    defensiveEvents: scoreToLabel(defense),
    fatigueRisk: riskToLabel(92 - attributes.stamina * 0.8 + (creation > 72 ? 8 : 0)),
  };

  return {
    classification,
    projectedRole: getProjectedRole(classification, tendencies),
    identityNote: getIdentityNote(classification),
    tendencies,
    shotProfile,
    badges,
    badgeWatch: buildBadgeWatch(attributes, classification, caps, badges),
    explanations: [
      `Three point drives projected three volume to ${shotProfile.three}%.`,
      `Handle, vision, and passing set ball security and assist chances.`,
      `Speed, finishing, and strength set rim pressure and contact finishing.`,
      `Stamina controls fatigue risk across a full game.`,
    ],
  };
};
