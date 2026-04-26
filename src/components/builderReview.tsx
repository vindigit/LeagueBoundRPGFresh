import { Text, View } from "react-native";
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
}

const STRENGTH_LABELS: Record<StrengthKey, string> = {
  finishingRating: "Finishing",
  shootingRating: "Shooting",
  playmakingRating: "Playmaking",
  defenseRating: "Defense",
  reboundingRating: "Rebounding",
  physicalRating: "Physical Tools",
};

const EMPTY_BADGES_LABEL = "No badges unlocked at the current build thresholds.";

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
    topStrengths: [
      STRENGTH_LABELS[classification.taxonomy.primaryStrength],
      STRENGTH_LABELS[classification.taxonomy.secondaryStrength],
    ],
    badges,
    emptyBadgesLabel: EMPTY_BADGES_LABEL,
    growthOutlook: getBackstoryGrowthOutlook(dna.growthCurve),
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
  variant?: keyof typeof THEME_BY_VARIANT;
  title?: string;
  className?: string;
}

export function BuilderReviewSection({
  summary,
  variant = "premium",
  title = "Builder Review",
  className = "",
}: BuilderReviewSectionProps) {
  if (!summary) {
    return null;
  }

  const theme = THEME_BY_VARIANT[variant];

  return (
    <View className={`rounded-lg border p-3 ${theme.borderClassName} ${theme.backgroundClassName} ${className}`.trim()}>
      <Text className={`text-xs font-semibold uppercase tracking-wide ${theme.headingClassName}`}>{title}</Text>

      <View className="mt-3 gap-3">
        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Classification</Text>
          <Text className={`mt-1 text-sm font-semibold ${theme.valueClassName}`}>{summary.classification}</Text>
        </View>

        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Archetype Fit</Text>
          <Text className={`mt-1 text-sm font-semibold ${theme.valueClassName}`}>{summary.archetypeFit}</Text>
        </View>

        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Top Strengths</Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {summary.topStrengths.map((strength) => (
              <View key={strength} className={`rounded-full border px-3 py-1 ${theme.chipBorderClassName} ${theme.chipBackgroundClassName}`}>
                <Text className={`text-xs font-semibold ${theme.chipTextClassName}`}>{strength}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Badges</Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {summary.badges.length > 0 ? (
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

        <View>
          <Text className={`text-[11px] font-semibold uppercase tracking-wide ${theme.labelClassName}`}>Growth Outlook</Text>
          <Text className={`mt-1 text-sm font-semibold ${theme.valueClassName}`}>{summary.growthOutlook}</Text>
        </View>
      </View>
    </View>
  );
}
