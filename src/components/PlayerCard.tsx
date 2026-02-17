import { Text, View } from "react-native";
import { useCareerStore } from "../store/useCareerStore";
import { getTopAttributes } from "./playerCardUtils";

export function PlayerCard() {
  const { name, archetype, attributes } = useCareerStore((state) => state.player);
  const topAttributes = getTopAttributes(attributes);

  return (
    <View className="rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-5">
      <Text className="text-xs font-semibold uppercase tracking-widest text-premium-accent">Player Card</Text>
      <Text className="mt-2 text-2xl font-bold text-white">{name || "Unnamed Prospect"}</Text>
      <Text className="mt-1 text-sm font-medium text-premium-muted">{archetype}</Text>

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
