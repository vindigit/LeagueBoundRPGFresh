import { Text, View } from "react-native";
import type { BuildSimProjection, BadgeWatchItem } from "../builder/simProjection";
import { getBackstoryGrowthOutlook } from "../features/backstory/generator";
import type { PlayerDNA } from "../types/backstory";
import type { ResolvedBuilderBadge } from "../builder/badges/resolve";

type StrengthKey = NonNullable<PlayerDNA["builderProfile"]>["classification"]["taxonomy"]["primaryStrength"];

export interface BuilderReviewSummary {
  classification: string;
  archetypeFit: string;
  topStrengths: string[];
  badges: ResolvedBuilderBadge[];
  emptyBadgesLabel: string;
  growthOutlook: string;
  archetypeConfidence: string;
  hasStandoutStrength: boolean;
  legacyArchetype?: string;
  archetypeLabel?: string;
  roleLabel?: string;
  position?: string;
}

const STRENGTH_LABELS: Record<StrengthKey, string> = {
  finishingRating: "Finishing",
  shootingRating: "Shooting",
  playmakingRating: "Playmaking",
  defenseRating: "Defense",
  reboundingRating: "Rebounding",
  physicalRating: "Physical Tools",
};

const EMPTY_BADGES_LABEL = "No badges unlocked at the current thresholds.";
const NO_STANDOUT_LABEL = "No standout strengths yet. Raise 2-3 core attributes to define your playstyle.";

const formatBadgeTier = (tier: ResolvedBuilderBadge["tier"]): string =>
  `${tier.slice(0, 1)}${tier.slice(1).toLowerCase()}`;

export const buildBuilderReviewSummary = (dna: PlayerDNA | null | undefined): BuilderReviewSummary | null => {
  if (!dna?.builderProfile) {
    return null;
  }

  const { classification, badges } = dna.builderProfile;

  return {
    classification: classification.taxonomy.label,
    archetypeFit: classification.legacyArchetype,
    legacyArchetype: classification.legacyArchetype,
    archetypeLabel: undefined,
    roleLabel: undefined,
    topStrengths: classification.taxonomy.hasStandoutStrength
      ? [
          STRENGTH_LABELS[classification.taxonomy.primaryStrength],
          STRENGTH_LABELS[classification.taxonomy.secondaryStrength],
        ]
      : [],
    badges,
    emptyBadgesLabel: EMPTY_BADGES_LABEL,
    growthOutlook: getBackstoryGrowthOutlook(dna.growthCurve),
    archetypeConfidence: classification.archetypeConfidence,
    hasStandoutStrength: classification.taxonomy.hasStandoutStrength,
  };
};

const THEME_BY_VARIANT = {
  premium: {
    borderClassName: "border-premium-surfaceAlt",
    backgroundClassName: "bg-premium-bg",
    headingClassName: "text-premium-muted",
    labelClassName: "text-premium-muted",
    valueClassName: "text-slate-100",
    chipBorderClassName: "border-premium-surfaceAlt",
    chipBackgroundClassName: "bg-premium-surface",
    chipTextClassName: "text-premium-accent",
    badgeBorderClassName: "border-cyan-400/30",
    badgeBackgroundClassName: "bg-cyan-500/10",
    badgeTextClassName: "text-cyan-100",
  },
  slate: {
    borderClassName: "border-slate-700",
    backgroundClassName: "bg-slate-950/60",
    headingClassName: "text-slate-400",
    labelClassName: "text-slate-400",
    valueClassName: "text-slate-100",
    chipBorderClassName: "border-slate-600",
    chipBackgroundClassName: "bg-slate-900",
    chipTextClassName: "text-emerald-200",
    badgeBorderClassName: "border-cyan-400/40",
    badgeBackgroundClassName: "bg-cyan-400/10",
    badgeTextClassName: "text-cyan-100",
  },
} as const;

interface BuilderReviewSectionProps {
  summary: BuilderReviewSummary | null;
  projection?: BuildSimProjection | null;
  variant?: keyof typeof THEME_BY_VARIANT;
  title?: string;
  className?: string;
  showBadges?: boolean;
}

const TENDENCY_LABELS: Record<keyof BuildSimProjection["tendencies"], string> = {
  touches: "Touches",
  rimAttempts: "Rim Attempts",
  threeAttempts: "Three Attempts",
  turnoverRisk: "Turnover Risk",
  assistRate: "Assist Rate",
  reboundInvolvement: "Rebound Involvement",
  defensiveEvents: "Defensive Events",
  fatigueRisk: "Fatigue Risk",
};

const fallbackExpectedGameShape = (projection: BuildSimProjection): string[] =>
  (Object.keys(TENDENCY_LABELS) as Array<keyof BuildSimProjection["tendencies"]>).map(
    (key) => `${projection.tendencies[key]} ${TENDENCY_LABELS[key].toLowerCase()}`,
  );

const formatBadgeWatch = (badge: BadgeWatchItem): string => {
  const tier = formatBadgeTier(badge.tier);
  return badge.status === "unlocked" ? `${badge.label} ${tier}` : `${badge.label}: ${tier} nearby`;
};

export function BuilderReviewSection({
  summary,
  projection,
  variant = "premium",
  title = "Current-Level Sim Projection",
  className = "",
  showBadges = true,
}: BuilderReviewSectionProps) {
  if (!summary) {
    return null;
  }

  const theme = THEME_BY_VARIANT[variant];
  const archetypeLabel = projection?.selectedArchetypeLabel ?? projection?.archetype ?? summary.archetypeFit;
  const roleLabel = projection?.role ?? summary.classification;
  const roleNote = projection?.currentRoleNote ?? projection?.identityNote ?? (summary.hasStandoutStrength ? `Confidence: ${summary.archetypeConfidence}` : NO_STANDOUT_LABEL);
  const expectedGameShape = projection ? projection.expectedGameShape ?? fallbackExpectedGameShape(projection) : [];
  const strengths = projection?.contractStrengths?.length ? projection.contractStrengths : projection?.strengths?.length ? projection.strengths : summary.topStrengths;
  const tradeoffs = projection?.contractWeaknesses?.length ? projection.contractWeaknesses : projection?.weaknesses ?? [];

  return (
    <View className={`rounded-lg border p-3 ${theme.borderClassName} ${theme.backgroundClassName} ${className}`.trim()}>
      <Text className={`text-xs font-semibold uppercase tracking-wide ${theme.headingClassName}`}>{title}</Text>

      <View className="mt-3 gap-3">
        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Archetype</Text>
          <Text className={`mt-1 text-base font-bold ${theme.valueClassName}`}>{archetypeLabel}</Text>
          {projection?.archetypeIdentitySummary ? (
            <Text className={`mt-1 text-xs ${theme.labelClassName}`}>{projection.archetypeIdentitySummary}</Text>
          ) : null}
        </View>

        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Current Role</Text>
          <Text className={`mt-1 text-sm font-semibold ${theme.valueClassName}`}>{roleLabel}</Text>
          <Text className={`mt-1 text-xs ${theme.labelClassName}`}>{roleNote}</Text>
        </View>

        {projection ? (
          <View>
            <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Expected Game Shape</Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {expectedGameShape.map((shape) => (
                <View key={shape} className={`rounded-lg border px-2 py-1 ${theme.chipBorderClassName} ${theme.chipBackgroundClassName}`}>
                  <Text className={`text-[11px] font-semibold ${theme.chipTextClassName}`}>{shape}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {projection ? (
          <View>
            <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Shot Style</Text>
            {projection.shotStyleNote ? (
              <Text className={`mt-1 text-xs ${theme.labelClassName}`}>{projection.shotStyleNote}</Text>
            ) : null}
            <View className="mt-2 flex-row gap-2">
              {([
                ["Rim", projection.shotProfile.rim],
                ["Midrange", projection.shotProfile.midrange],
                ["Three", projection.shotProfile.three],
              ] as const).map(([label, value]) => (
                <View key={label} className={`flex-1 rounded-lg border px-2 py-2 ${theme.chipBorderClassName} ${theme.chipBackgroundClassName}`}>
                  <Text className={`text-[10px] font-semibold uppercase ${theme.labelClassName}`}>{label}</Text>
                  <Text className={`mt-1 text-sm font-bold ${theme.valueClassName}`}>{value}%</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Strengths</Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {strengths.length > 0 ? (
              strengths.map((strength) => (
                <View key={strength} className={`rounded-full border px-3 py-1 ${theme.chipBorderClassName} ${theme.chipBackgroundClassName}`}>
                  <Text className={`text-xs font-semibold ${theme.chipTextClassName}`}>{strength}</Text>
                </View>
              ))
            ) : (
              <Text className={`text-xs ${theme.valueClassName}`}>No standout strengths yet.</Text>
            )}
          </View>
        </View>

        {tradeoffs.length > 0 ? (
          <View>
            <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Tradeoffs</Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {tradeoffs.map((tradeoff) => (
                <View key={tradeoff} className={`rounded-full border px-3 py-1 ${theme.chipBorderClassName} ${theme.chipBackgroundClassName}`}>
                  <Text className={`text-xs font-semibold ${theme.chipTextClassName}`}>{tradeoff}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {showBadges ? (
          <View>
            <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Badge Watch</Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {projection?.badgeWatch.length ? (
                projection.badgeWatch.map((badge) => (
                  <View key={`${badge.id}-${badge.status}`} className={`rounded-lg border px-3 py-2 ${theme.badgeBorderClassName} ${theme.badgeBackgroundClassName}`}>
                    <Text className={`text-xs font-semibold ${theme.badgeTextClassName}`}>{formatBadgeWatch(badge)}</Text>
                    <Text className={`mt-1 text-[11px] ${theme.valueClassName}`}>{badge.summary}</Text>
                  </View>
                ))
              ) : summary.badges.length > 0 ? (
                summary.badges.map((badge) => (
                  <View key={badge.id} className={`rounded-full border px-3 py-1 ${theme.badgeBorderClassName} ${theme.badgeBackgroundClassName}`}>
                    <Text className={`text-xs font-semibold ${theme.badgeTextClassName}`}>{badge.label} {formatBadgeTier(badge.tier)}</Text>
                  </View>
                ))
              ) : (
                <Text className={`text-xs ${theme.valueClassName}`}>{summary.emptyBadgesLabel}</Text>
              )}
            </View>
          </View>
        ) : null}

        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Growth Outlook</Text>
          <Text className={`mt-1 text-sm font-semibold ${theme.valueClassName}`}>{summary.growthOutlook}</Text>
        </View>
      </View>
    </View>
  );
}
