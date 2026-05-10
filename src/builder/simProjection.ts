import type { ExactHeight } from "../types/backstory";
import type { PlayerAttributes, Position } from "../types/player";
import { LeagueLevel } from "../types/career";
import { getArchetypeSimContract } from "./archetypeSimContracts";
import { BUILDER_BADGE_CATALOG, type BuilderBadgeCatalogEntry, type BuilderBadgeTierRule } from "./badges/catalog";
import { resolveBuilderBadges, type ResolvedBuilderBadge } from "./badges/resolve";
import { classifyBuilderBuild, type BuilderClassification } from "./classify";
import { derivePlayerRoleTendencies, toShotProfile, toTendencyLabels, type TendencyLabel } from "./roleTendencies";
import type { ArchetypeProfile } from "./presets";

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
  archetype: string;
  role: string;
  projectedRole: string;
  identityNote: string;
  strengths: string[];
  weaknesses: string[];
  developmentPath: string;
  selectedArchetypeLabel?: string;
  selectedRoleLabel?: string;
  archetypeIdentitySummary?: string;
  currentRoleNote?: string;
  expectedGameShape?: string[];
  shotStyleNote?: string;
  contractStrengths?: string[];
  contractWeaknesses?: string[];
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
  leagueLevel?: LeagueLevel;
  archetypeProfile?: ArchetypeProfile;
  badgesEnabled?: boolean;
}

const NEAR_BADGE_THRESHOLD_DISTANCE = 5;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

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

const tendencyText = (label: TendencyLabel, noun: string): string => `${label} ${noun}`;

const getExpectedGameShape = (tendencies: BuildTendencyProjection): string[] => [
  tendencyText(tendencies.touches, "touches"),
  tendencyText(tendencies.rimAttempts, "rim pressure"),
  tendencyText(tendencies.threeAttempts, "three volume"),
  tendencyText(tendencies.assistRate, "assists"),
  tendencyText(tendencies.reboundInvolvement, "rebounding"),
  tendencyText(tendencies.defensiveEvents, "defensive activity"),
  tendencyText(tendencies.fatigueRisk, "fatigue load"),
];

const getShotStyleNote = (shotProfile: BuildShotProfileProjection): string => {
  const primary =
    shotProfile.rim >= shotProfile.midrange && shotProfile.rim >= shotProfile.three
      ? "rim pressure"
      : shotProfile.three >= shotProfile.midrange
        ? "three-point spacing"
        : "midrange scoring";
  return `Style mix leans toward ${primary}; percentages describe shot diet, not guaranteed box-score output.`;
};

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

const attributesMatchProfile = (
  attributes: PlayerAttributes,
  position: Position,
  archetypeProfile: ArchetypeProfile | undefined,
): boolean => {
  const startingAttributes = archetypeProfile?.startingAttributesByPosition[position] ?? archetypeProfile?.attributes;
  if (!startingAttributes) {
    return false;
  }
  return (Object.keys(attributes) as Array<keyof PlayerAttributes>).every((key) => attributes[key] === startingAttributes[key]);
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
    .filter((entry): entry is {
      id: BuilderBadgeCatalogEntry["id"];
      label: string;
      tier: ResolvedBuilderBadge["tier"];
      status: "nearby";
      summary: string;
    } => entry !== null)
    .slice(0, 3);

  return [...unlocked, ...nearby].slice(0, 6);
};

export const buildSimProjection = (input: BuildSimProjectionInput): BuildSimProjection => {
  const { attributes, position, caps, height, weightLbs, leagueLevel = LeagueLevel.MIDDLE_SCHOOL } = input;
  const classification = classifyBuilderBuild(attributes, position);
  const badges = input.badgesEnabled === false ? [] : resolveBuilderBadges({ attributes, caps, classification });
  const roleTendencies = derivePlayerRoleTendencies({
    attributes,
    position,
    height,
    weightLbs,
    badges,
    leagueLevel,
    archetypeProfile: input.archetypeProfile,
  });
  const tendencies = toTendencyLabels(roleTendencies);
  const shotProfile = toShotProfile(roleTendencies);

  const selectedRole = input.archetypeProfile?.roleLabelByPosition?.[position] ?? input.archetypeProfile?.defaultRoleLabel;
  const role =
    input.archetypeProfile && !attributesMatchProfile(attributes, position, input.archetypeProfile)
      ? getProjectedRole(classification, tendencies)
      : selectedRole ?? getProjectedRole(classification, tendencies);
  const archetype = input.archetypeProfile?.label ?? classification.legacyArchetype;
  const contract = input.archetypeProfile ? getArchetypeSimContract(input.archetypeProfile.id) : undefined;
  const currentRoleNote =
    input.archetypeProfile && selectedRole
      ? role === selectedRole
        ? "Your current attributes still match this archetype identity."
        : `Your attributes are pulling this build toward ${role}.`
      : undefined;

  return {
    classification,
    archetype,
    role,
    projectedRole: role,
    identityNote: input.archetypeProfile
      ? `Current ${leagueLevel.toLowerCase().replace("_", " ")} role reflects your attributes and selected archetype.`
      : getIdentityNote(classification),
    strengths: input.archetypeProfile?.strengths ?? [],
    weaknesses: input.archetypeProfile?.weaknesses ?? [],
    developmentPath: input.archetypeProfile?.tradeoffNote ?? "Training can shift your current role as attributes change.",
    selectedArchetypeLabel: input.archetypeProfile?.label,
    selectedRoleLabel: selectedRole,
    archetypeIdentitySummary: contract?.identitySummary,
    currentRoleNote,
    expectedGameShape: input.archetypeProfile ? getExpectedGameShape(tendencies) : undefined,
    shotStyleNote: input.archetypeProfile ? getShotStyleNote(shotProfile) : undefined,
    contractStrengths: input.archetypeProfile?.strengths,
    contractWeaknesses: input.archetypeProfile?.weaknesses,
    tendencies,
    shotProfile,
    badges,
    badgeWatch: input.badgesEnabled === false ? [] : buildBadgeWatch(attributes, classification, caps, badges),
    explanations: [
      `Current ${leagueLevel.toLowerCase().replace("_", " ")} role tendencies project three volume to ${shotProfile.three}%.`,
      `Handle, vision, and passing drive touches, creation, ball security, and assist chances.`,
      `Position, size, finishing, and strength drive rim pressure and rebounding involvement.`,
      `Badges and stamina tilt possession choices without fixing stat lines.`,
    ],
  };
};
