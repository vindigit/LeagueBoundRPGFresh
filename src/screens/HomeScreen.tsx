import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { NarrativeOverlay } from "../components/NarrativeOverlay";
import { PlayerCard } from "../components/PlayerCard";
import { BackstoryScreen } from "../features/backstory/screens/BackstoryScreen";
import { MatchScreen } from "../features/match/screens/MatchScreen";
import { PostgameScreen } from "../features/match/screens/PostgameScreen";
import { useCareerStore } from "../store/useCareerStore";

const formatLeagueLevel = (value: string): string =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export function HomeScreen() {
  const view = useCareerStore((state) => state.view);
  const leagueLevel = useCareerStore((state) => state.leagueLevel);
  const currentYear = useCareerStore((state) => state.currentYear);
  const bankBalance = useCareerStore((state) => state.player.bankBalance);
  const newsFeed = useCareerStore((state) => state.newsFeed);
  const startNarrative = useCareerStore((state) => state.startNarrative);
  const navigateToMatch = useCareerStore((state) => state.navigateToMatch);

  return (
    <SafeAreaView className="relative flex-1 bg-premium-bg">
      {view === "HUB" ? (
        <ScrollView contentContainerClassName="px-4 pb-8 pt-6">
          <Text className="text-xs font-semibold uppercase tracking-widest text-premium-accent">Career Hub</Text>
          <Text className="mt-1 text-3xl font-bold text-white">Between Games</Text>

          <View className="mt-5">
            <PlayerCard />
          </View>

          <View className="mt-5 rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-4">
            <Text className="text-xs font-semibold uppercase tracking-wider text-premium-muted">Hometown Feed</Text>
            {newsFeed.length > 0 ? (
              <View className="mt-3 gap-2">
                {newsFeed.slice(0, 4).map((item) => (
                  <View key={item.id} className="rounded-lg bg-premium-bg px-3 py-2">
                    <Text className="text-sm font-semibold text-white">{item.headline}</Text>
                    {item.subhead ? <Text className="mt-1 text-xs text-premium-muted">{item.subhead}</Text> : null}
                  </View>
                ))}
              </View>
            ) : (
              <Text className="mt-3 text-sm text-premium-muted">Local coverage will appear after your first game.</Text>
            )}
          </View>

          <View className="mt-5 rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-4">
            <Text className="text-xs font-semibold uppercase tracking-wider text-premium-muted">Status</Text>

            <View className="mt-3 flex-row flex-wrap gap-3">
              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">League</Text>
                <Text className="mt-1 text-base font-semibold text-white">{formatLeagueLevel(leagueLevel)}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Year</Text>
                <Text className="mt-1 text-base font-semibold text-white">{currentYear}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Bank</Text>
                <Text className="mt-1 text-base font-semibold text-premium-accent">{formatCurrency(bankBalance)}</Text>
              </View>
            </View>
          </View>

          <Pressable
            className="mt-6 items-center justify-center rounded-xl bg-sky-600 px-4 py-4"
            onPress={navigateToMatch}
          >
            <Text className="text-base font-semibold text-white">Play Match</Text>
          </Pressable>

          <Pressable
            className="mt-3 items-center justify-center rounded-xl bg-premium-accent px-4 py-4"
            onPress={() => {
              startNarrative("practice_coach.ink");
            }}
          >
            <Text className="text-base font-semibold text-black">Next Event</Text>
          </Pressable>
        </ScrollView>
      ) : null}

      {view === "NARRATIVE" ? <NarrativeOverlay /> : null}

      {view === "MATCH" ? <MatchScreen /> : null}

      {view === "POSTGAME" ? <PostgameScreen /> : null}

      {view === "BACKSTORY" ? <BackstoryScreen /> : null}
    </SafeAreaView>
  );
}
