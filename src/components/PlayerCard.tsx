import { ScrollView, Text, View } from "react-native";
import { inferPublicAttributesFromEngine } from "../builder/publicAttributes";
import { getBackstoryGrowthOutlook } from "../features/backstory/generator";
import { useCareerStore } from "../store/useCareerStore";
import { getAllPublicAttributesSorted } from "./playerCardUtils";
import { BuilderReviewSection, buildBuilderReviewSummary } from "./builderReview";
import { isBadgeSystemAvailable } from "../builder/badges/availability";

const formatInjuryLabel = (weeksRemaining: number): string => `${weeksRemaining} ${weeksRemaining === 1 ? "week" : "weeks"} remaining`;

export function PlayerCard() {
  const { name, archetype, attributes, identity, dna } = useCareerStore((state) => state.player);
  const injury = useCareerStore((state) => state.injury);
  const leagueLevel = useCareerStore((state) => state.leagueLevel);
  const seasonNumber = useCareerStore((state) => state.seasonNumber);
  const publicAttributes = dna?.publicAttributes ?? identity?.publicAttributes ?? inferPublicAttributesFromEngine(attributes);
  const allAttributes = getAllPublicAttributesSorted(publicAttributes);
  const hometownLabel = identity ? `${identity.hometown.city}, ${identity.hometown.state}` : "Unknown hometown";
  const builderReviewSummary = buildBuilderReviewSummary(dna);
  const fallbackGrowthOutlook = !builderReviewSummary && dna ? getBackstoryGrowthOutlook(dna.growthCurve) : null;
  const profileLabel =
    identity
      ? `${identity.primaryPosition} | ${identity.height.feet}'${identity.height.inches}" | ${identity.weightLbs} lbs`
      : "Profile not set";
  const potentialTierLabel = dna ? `Potential Tier: ${dna.potentialTier}` : null;

  return (
    <View className="rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-5">
      <Text className="text-xs font-semibold uppercase tracking-widest text-premium-accent">Player Card</Text>
      <Text className="mt-2 text-2xl font-bold text-white">{name || "Unnamed Prospect"}</Text>
      <Text className="mt-1 text-sm font-medium text-premium-muted">
        Archetype: {identity?.archetypeLabel ?? archetype}{identity?.roleLabel ? ` | Role: ${identity.roleLabel}` : ""}
      </Text>
      <Text className="mt-1 text-xs font-medium text-slate-300">{hometownLabel}</Text>
      <Text className="mt-1 text-xs font-medium text-slate-300">{profileLabel}</Text>

      {injury ? (
        <View className="mt-3 rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 self-start">
          <Text className="text-[11px] font-semibold text-amber-200">
            Minor ankle sprain • {formatInjuryLabel(injury.weeksRemaining)}
          </Text>
        </View>
      ) : null}

      {dna?.publicTraits?.length ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {potentialTierLabel ? (
            <View className="rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1">
              <Text className="text-[11px] font-semibold text-amber-200">{potentialTierLabel}</Text>
            </View>
          ) : null}
          {dna.publicTraits
            .filter((trait) => !trait.startsWith("Potential Tier:"))
            .map((trait) => (
            <View key={trait} className="rounded-full border border-premium-surfaceAlt bg-premium-bg px-3 py-1">
              <Text className="text-[11px] font-semibold text-premium-accent">{trait}</Text>
            </View>
            ))}
        </View>
      ) : null}

      <BuilderReviewSection
        summary={builderReviewSummary}
        className="mt-3"
        showBadges={isBadgeSystemAvailable(leagueLevel, seasonNumber)}
      />
      {fallbackGrowthOutlook ? (
        <View className="mt-3 rounded-lg border border-premium-surfaceAlt bg-premium-bg px-3 py-2">
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-premium-muted">Growth Outlook</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-100">{fallbackGrowthOutlook}</Text>
        </View>
      ) : null}

      <ScrollView className="mt-5" contentContainerStyle={{ gap: 12, paddingBottom: 4 }} style={{ maxHeight: 320 }} nestedScrollEnabled>
        {allAttributes.map((attribute) => (
          <View
            key={attribute.key}
            className="flex-row items-center justify-between rounded-lg border border-premium-surfaceAlt bg-premium-bg px-3 py-2"
          >
            <Text className="text-sm text-slate-200">{attribute.label}</Text>
            <Text className="text-base font-semibold text-premium-accent">{attribute.value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
