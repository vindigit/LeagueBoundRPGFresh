import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { createPostgameNewsItem } from "../../backstory/news";
import { useCareerStore } from "../../../store/useCareerStore";
import type { PlayerBoxScoreLine, TeamBoxScoreTotals } from "../store/useMatchStore";

const PLAYER_TABLE_MIN_WIDTH = 620;

const formatCurrencyDelta = (amount: number): string => {
  const prefix = amount >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(amount).toLocaleString("en-US")}`;
};

const formatMoraleDelta = (amount: number): string => `${amount >= 0 ? "+" : ""}${amount}`;
const formatFg = (fgm: number, fga: number): string => `${fgm}-${fga}`;

const renderTeamTotals = (label: string, totals: TeamBoxScoreTotals) => (
  <View className="mt-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
    <Text className="text-sm font-semibold text-white">{label}</Text>
    <Text className="mt-2 text-xs text-slate-300">
      PTS {totals.pts} | REB {totals.reb} | AST {totals.ast} | STL {totals.stl} | BLK {totals.blk} | TO {totals.to} | FG{" "}
      {formatFg(totals.fgm, totals.fga)}
    </Text>
  </View>
);

const renderPlayerRow = (player: PlayerBoxScoreLine, isHighlighted: boolean) => (
  <View key={player.id} className="mt-2 flex-row items-center justify-between rounded-lg bg-slate-950/40 px-3 py-2">
    <View className="w-28 flex-row items-center gap-1">
      <Text className={`text-xs font-semibold ${isHighlighted ? "text-yellow-300" : "text-slate-200"}`} numberOfLines={1}>
        {player.name}
      </Text>
      {isHighlighted ? (
        <View className="rounded-full border border-yellow-300/80 bg-yellow-300/20 px-2 py-0.5">
          <Text className="text-[10px] font-bold uppercase tracking-wide text-yellow-200">YOU</Text>
        </View>
      ) : null}
    </View>
    <Text className="w-8 text-right text-xs text-slate-300">{player.pts}</Text>
    <Text className="w-8 text-right text-xs text-slate-300">{player.reb}</Text>
    <Text className="w-8 text-right text-xs text-slate-300">{player.ast}</Text>
    <Text className="w-8 text-right text-xs text-slate-300">{player.stl}</Text>
    <Text className="w-8 text-right text-xs text-slate-300">{player.blk}</Text>
    <Text className="w-8 text-right text-xs text-slate-300">{player.to}</Text>
    <Text className="w-14 text-right text-xs text-slate-300">{formatFg(player.fgm, player.fga)}</Text>
  </View>
);

export function PostgameScreen() {
  const result = useCareerStore((state) => state.lastMatchResult);
  const playerIdentity = useCareerStore((state) => state.player.identity);
  const resolvePostgameAndAdvanceWeek = useCareerStore((state) => state.resolvePostgameAndAdvanceWeek);
  const localHeadline = result && playerIdentity ? createPostgameNewsItem(playerIdentity, result).headline : undefined;
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");

  if (!result) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Text className="text-lg font-semibold text-white">No recent match result.</Text>
        <Pressable className="mt-4 items-center justify-center rounded-xl bg-slate-700 px-4 py-3" onPress={resolvePostgameAndAdvanceWeek}>
          <Text className="text-base font-semibold text-white">Return to Hub</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isHomeSelected = selectedTeam === "home";
  const selectedLabel = isHomeSelected ? "My Player (Home)" : "Rivals High (Away)";
  const selectedPlayers = isHomeSelected ? result.boxScore.homePlayers : result.boxScore.awayPlayers;
  const selectedTotals = isHomeSelected ? result.boxScore.homeTotals : result.boxScore.awayTotals;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView contentContainerClassName="px-5 pb-8 pt-8">
        <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400">Postgame Report</Text>
        <Text className="mt-2 text-3xl font-bold text-white">{result.didWin ? "Victory" : "Defeat"}</Text>

        <View className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Final Score</Text>
          <Text className="mt-2 text-2xl font-bold text-white">
            {result.homeScore} - {result.awayScore}
          </Text>
          {result.overtimePeriods > 0 ? (
            <Text className="mt-1 text-sm font-medium text-amber-300">Went to OT ({result.overtimePeriods})</Text>
          ) : null}
        </View>

        <View className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Box Score</Text>

          <View className="mt-3 flex-row rounded-xl border border-slate-800 bg-slate-950/40 p-1">
            <Pressable
              className={`flex-1 items-center rounded-lg px-3 py-2 ${isHomeSelected ? "bg-slate-800" : "bg-transparent"}`}
              onPress={() => setSelectedTeam("home")}
            >
              <Text className={`text-sm font-semibold ${isHomeSelected ? "text-white" : "text-slate-400"}`}>My Player</Text>
            </Pressable>
            <Pressable
              className={`flex-1 items-center rounded-lg px-3 py-2 ${!isHomeSelected ? "bg-slate-800" : "bg-transparent"}`}
              onPress={() => setSelectedTeam("away")}
            >
              <Text className={`text-sm font-semibold ${!isHomeSelected ? "text-white" : "text-slate-400"}`}>Rivals High</Text>
            </Pressable>
          </View>

          {renderTeamTotals(selectedLabel, selectedTotals)}

          <View className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <Text className="text-sm font-semibold text-white">{selectedLabel} Players</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingRight: 12 }}>
              <View className="mt-2" style={{ minWidth: PLAYER_TABLE_MIN_WIDTH }}>
                <View className="flex-row items-center justify-between px-3">
                  <Text className="w-28 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Name</Text>
                  <Text className="w-8 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">PTS</Text>
                  <Text className="w-8 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">REB</Text>
                  <Text className="w-8 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">AST</Text>
                  <Text className="w-8 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">STL</Text>
                  <Text className="w-8 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">BLK</Text>
                  <Text className="w-8 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">TO</Text>
                  <Text className="w-14 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">FG</Text>
                </View>
                {selectedPlayers.map((player) => renderPlayerRow(player, isHomeSelected && player.id === "home-0"))}
              </View>
            </ScrollView>
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Career Updates</Text>

          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-sm text-slate-300">Bank Change</Text>
            <Text className={`text-sm font-semibold ${result.bankDelta >= 0 ? "text-emerald-300" : "text-red-300"}`}>
              {formatCurrencyDelta(result.bankDelta)}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-sm text-slate-300">Morale Change</Text>
            <Text className={`text-sm font-semibold ${result.moraleDelta >= 0 ? "text-emerald-300" : "text-red-300"}`}>
              {formatMoraleDelta(result.moraleDelta)}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-sm text-slate-300">Next Week</Text>
            <Text className="text-sm font-semibold text-white">{result.weekAfter}</Text>
          </View>

          {localHeadline ? (
            <View className="mt-3 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hometown Buzz</Text>
              <Text className="mt-1 text-sm text-slate-100">{localHeadline}</Text>
            </View>
          ) : null}
        </View>

        <Pressable className="mt-6 items-center justify-center rounded-xl bg-emerald-500 py-4" onPress={resolvePostgameAndAdvanceWeek}>
          <Text className="text-base font-semibold text-black">Advance Week</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
