import { useEffect } from "react";
import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { useMatchLoop } from "../hooks/useMatchLoop";
import type { PlayLog } from "../store/useMatchStore";
import { useMatchStore } from "../store/useMatchStore";

const HOME_NAME = "My Player";
const AWAY_NAME = "Rivals High";

const formatClock = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

const getLogTextClassName = (type: PlayLog["type"]): string => {
  if (type === "score") {
    return "text-emerald-300";
  }

  if (type === "info") {
    return "text-slate-400";
  }

  if (type === "turnover") {
    return "text-amber-300";
  }

  return "text-slate-200";
};

const getLogContainerClassName = (team: PlayLog["team"]): string => {
  if (team === "home") {
    return "border-l-4 border-emerald-500 bg-emerald-950/30";
  }

  return "border-l-4 border-sky-500 bg-sky-950/30";
};

const renderLogItem = ({ item }: { item: PlayLog }) => (
  <View className={`mb-2 rounded-xl p-3 ${getLogContainerClassName(item.team)}`}>
    <View className="mb-1 flex-row items-center justify-between">
      <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">Q{item.quarter}</Text>
      <Text className="text-xs font-semibold text-slate-400">{formatClock(item.timeRemaining)}</Text>
    </View>
    <Text className={`text-sm font-medium ${getLogTextClassName(item.type)}`}>{item.text}</Text>
  </View>
);

export function MatchScreen() {
  useMatchLoop();

  const isPlaying = useMatchStore((state) => state.isPlaying);
  const gameFinished = useMatchStore((state) => state.gameFinished);
  const homeScore = useMatchStore((state) => state.homeScore);
  const awayScore = useMatchStore((state) => state.awayScore);
  const quarter = useMatchStore((state) => state.quarter);
  const timeRemaining = useMatchStore((state) => state.timeRemaining);
  const logs = useMatchStore((state) => state.logs);
  const initializeMatch = useMatchStore((state) => state.initializeMatch);
  const startMatch = useMatchStore((state) => state.startMatch);
  const pauseMatch = useMatchStore((state) => state.pauseMatch);

  useEffect(() => {
    initializeMatch(HOME_NAME, AWAY_NAME);
  }, [initializeMatch]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
        <View className="bg-slate-900 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-xs uppercase tracking-wider text-slate-400">Home</Text>
              <Text className="mt-1 text-lg font-bold text-white">{HOME_NAME}</Text>
              <Text className="mt-1 text-3xl font-black text-emerald-300">{homeScore}</Text>
            </View>

            <View className="items-center px-2">
              <Text className="text-3xl font-bold text-white">{formatClock(timeRemaining)}</Text>
              <Text className="mt-1 text-sm font-semibold text-slate-300">Q{quarter}</Text>
            </View>

            <View className="flex-1 items-end pl-3">
              <Text className="text-xs uppercase tracking-wider text-slate-400">Away</Text>
              <Text className="mt-1 text-lg font-bold text-white">{AWAY_NAME}</Text>
              <Text className="mt-1 text-3xl font-black text-sky-300">{awayScore}</Text>
            </View>
          </View>
        </View>

        <View className="flex-1 px-4 pb-4 pt-3">
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            renderItem={renderLogItem}
            contentContainerClassName="pb-4"
            ListEmptyComponent={
              <View className="mt-8 items-center">
                <Text className="text-sm text-slate-500">Match log will appear here.</Text>
              </View>
            }
          />
        </View>

        <View className="border-t border-slate-800 bg-slate-900 px-4 py-4">
          {!gameFinished ? (
            isPlaying ? (
              <Pressable className="items-center justify-center rounded-xl bg-amber-500 py-3" onPress={pauseMatch}>
                <Text className="text-base font-semibold text-black">Pause</Text>
              </Pressable>
            ) : (
              <Pressable className="items-center justify-center rounded-xl bg-emerald-500 py-3" onPress={startMatch}>
                <Text className="text-base font-semibold text-black">Start Game</Text>
              </Pressable>
            )
          ) : (
            <Pressable className="items-center justify-center rounded-xl bg-slate-700 py-3" onPress={() => {}}>
              <Text className="text-base font-semibold text-white">Post Game</Text>
            </Pressable>
          )}
        </View>
    </SafeAreaView>
  );
}
