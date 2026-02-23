import { Text, View } from "react-native";
import { useCareerStore } from "../store/useCareerStore";
import { getTopAttributes } from "./playerCardUtils";
import { getBackstoryGrowthOutlook } from "../features/backstory/generator";

export function PlayerCard() {
  const { name, archetype, attributes, identity, dna } = useCareerStore((state) => state.player);
  const topAttributes = getTopAttributes(attributes);
  const hometownLabel = identity ? `${identity.hometown.city}, ${identity.hometown.state}` : "Unknown hometown";
  const growthOutlook = dna ? getBackstoryGrowthOutlook(dna.growthCurve) : "Unavailable";
  const buildLabel =
    identity
      ? `${identity.primaryPosition}/${identity.secondaryPosition} | ${identity.height.feet}'${identity.height.inches}" | ${identity.weightLbs} lbs`
      : "Build not set";
  const potentialTierLabel = dna ? `Potential Tier: ${dna.potentialTier}` : null;

  return (
    <View className="rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-5">
      <Text className="text-xs font-semibold uppercase tracking-widest text-premium-accent">Player Card</Text>
      <Text className="mt-2 text-2xl font-bold text-white">{name || "Unnamed Prospect"}</Text>
      <Text className="mt-1 text-sm font-medium text-premium-muted">{archetype}</Text>
      <Text className="mt-1 text-xs font-medium text-slate-300">{hometownLabel}</Text>
      <Text className="mt-1 text-xs font-medium text-slate-300">{buildLabel}</Text>

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

      <View className="mt-3 rounded-lg border border-premium-surfaceAlt bg-premium-bg px-3 py-2">
        <Text className="text-[11px] font-semibold uppercase tracking-wider text-premium-muted">Growth Outlook</Text>
        <Text className="mt-1 text-sm font-semibold text-slate-100">{growthOutlook}</Text>
      </View>

      <View className="mt-5 gap-3">
        {topAttributes.map((attribute) => (
          <View
            key={attribute.key}
            className="flex-row items-center justify-between rounded-lg border border-premium-surfaceAlt bg-premium-bg px-3 py-2"
          >
            <Text className="text-sm text-slate-200">{attribute.label}</Text>
            <Text className="text-base font-semibold text-premium-accent">{attribute.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
