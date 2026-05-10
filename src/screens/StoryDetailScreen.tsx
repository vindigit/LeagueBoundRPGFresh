import { useRef, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useCareerStore } from "../store/useCareerStore";
import type { StoryTabId } from "../types/backstory";
import type { PlayerBoxScoreLine, TeamBoxScoreTotals } from "../features/match/store/useMatchStore";

const PLAYER_TABLE_MIN_WIDTH = 620;
const TABS: StoryTabId[] = ["RECAP", "BOX_SCORE", "BUZZ"];

const tabLabel: Record<StoryTabId, string> = {
  RECAP: "Recap",
  BOX_SCORE: "Box Score",
  BUZZ: "Buzz",
};

const formatFg = (fgm: number, fga: number): string => `${fgm}-${fga}`;
const formatThree = (tpm: number, tpa: number): string => `${tpm}-${tpa}`;
const formatDelta = (value: number): string => `${value >= 0 ? "+" : ""}${value}`;

const renderTeamTotals = (label: string, totals: TeamBoxScoreTotals) => (
  <View className="mt-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
    <Text className="text-sm font-semibold text-white">{label}</Text>
    <Text className="mt-2 text-xs text-slate-300">
      PTS {totals.pts} | REB {totals.reb} | AST {totals.ast} | STL {totals.stl} | BLK {totals.blk} | TO {totals.to} | 3PT{" "}
      {formatThree(totals.tpm ?? 0, totals.tpa ?? 0)} | FT {formatFg(totals.ftm, totals.fta)} | FG {formatFg(totals.fgm, totals.fga)}
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
    <Text className="w-14 text-right text-xs text-slate-300">{formatThree(player.tpm ?? 0, player.tpa ?? 0)}</Text>
    <Text className="w-14 text-right text-xs text-slate-300">{formatFg(player.ftm, player.fta)}</Text>
    <Text className="w-14 text-right text-xs text-slate-300">{formatFg(player.fgm, player.fga)}</Text>
  </View>
);

export function StoryDetailScreen() {
  const storyId = useCareerStore((state) => state.selectedStoryId);
  const story = useCareerStore((state) => (storyId ? state.storiesById[storyId] : undefined));
  const closeStoryDetail = useCareerStore((state) => state.closeStoryDetail);
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<StoryTabId>("RECAP");
  const pagerRef = useRef<ScrollView>(null);

  if (!story) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Text className="text-lg font-semibold text-white">Story unavailable.</Text>
        <Pressable className="mt-4 rounded-xl bg-slate-700 px-4 py-3" onPress={closeStoryDetail}>
          <Text className="text-base font-semibold text-white">Back to Hub</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const goToTab = (tab: StoryTabId) => {
    const index = TABS.indexOf(tab);
    setActiveTab(tab);
    pagerRef.current?.scrollTo({ x: width * index, animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="border-b border-slate-800 px-5 pb-4 pt-6">
        <Pressable onPress={closeStoryDetail}>
          <Text className="text-sm font-semibold text-sky-300">Back</Text>
        </Pressable>
        <Text className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Hometown Feed</Text>
        <Text className="mt-2 text-3xl font-bold text-white">{story.headline}</Text>
        {story.subhead ? <Text className="mt-2 text-base text-slate-300">{story.subhead}</Text> : null}
        <View className="mt-3 flex-row items-center gap-3">
          <View className={`rounded-full px-2 py-1 ${story.context.didWin ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
            <Text className={`text-xs font-bold ${story.context.didWin ? "text-emerald-300" : "text-rose-300"}`}>
              {story.context.didWin ? "W" : "L"}
            </Text>
          </View>
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Week {story.context.week} | Final: {story.context.homeScore}-{story.context.awayScore}
            {story.context.overtimePeriods > 0 ? ` | OT ${story.context.overtimePeriods}` : ""}
          </Text>
        </View>
        <View className="mt-4 flex-row rounded-xl border border-slate-800 bg-slate-900 p-1">
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              className={`flex-1 rounded-lg px-3 py-2 ${activeTab === tab ? "bg-slate-800" : "bg-transparent"}`}
              onPress={() => goToTab(tab)}
            >
              <Text className={`text-center text-sm font-semibold ${activeTab === tab ? "text-white" : "text-slate-400"}`}>
                {tabLabel[tab]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / Math.max(width, 1));
          setActiveTab(TABS[index] ?? "RECAP");
        }}
      >
        <ScrollView contentContainerClassName="px-5 pb-8 pt-6" style={{ width }}>
          <Text className="text-base leading-7 text-slate-100">{story.recap.body}</Text>

          <View className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Key Performance</Text>
            <Text className="mt-3 text-sm font-medium text-white">
              {story.recap.keyPerformance.points} PTS | {story.recap.keyPerformance.rebounds} REB | {story.recap.keyPerformance.assists} AST
            </Text>
            <Text className="mt-1 text-xs text-slate-400">
              FG {formatFg(story.recap.keyPerformance.fieldGoalsMade, story.recap.keyPerformance.fieldGoalsAttempted)} | 3PT{" "}
              {formatThree(story.recap.keyPerformance.threePointsMade, story.recap.keyPerformance.threePointsAttempted)}
            </Text>
          </View>

          <View className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Game Impact</Text>
            <Text className="mt-3 text-sm text-white">Fans {formatDelta(story.recap.impact.fansDelta)}</Text>
            <Text className="mt-1 text-sm text-white">Coach Trust {formatDelta(story.recap.impact.coachTrustDelta)}</Text>
            {typeof story.recap.impact.teammatesDelta === "number" ? (
              <Text className="mt-1 text-sm text-white">Teammates {formatDelta(story.recap.impact.teammatesDelta)}</Text>
            ) : null}
          </View>

          {story.recap.momentOfTheNight ? (
            <View className="mt-4 rounded-2xl border border-sky-800/70 bg-sky-950/40 p-4">
              <Text className="text-xs font-semibold uppercase tracking-wide text-sky-300">Moment of the Night</Text>
              <Text className="mt-2 text-sm leading-6 text-slate-100">{story.recap.momentOfTheNight}</Text>
            </View>
          ) : null}
        </ScrollView>

        <ScrollView contentContainerClassName="px-5 pb-8 pt-6" style={{ width }}>
          <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Final Score</Text>
            <Text className="mt-2 text-3xl font-bold text-white">
              {story.boxScore.summary.homeScore} - {story.boxScore.summary.awayScore}
            </Text>
            {story.boxScore.summary.overtimePeriods > 0 ? (
              <Text className="mt-1 text-sm font-medium text-amber-300">Went to OT ({story.boxScore.summary.overtimePeriods})</Text>
            ) : null}
          </View>

          {renderTeamTotals(story.boxScore.homeTeam.label, story.boxScore.homeTeam.totals)}
          <View className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <Text className="text-sm font-semibold text-white">{story.boxScore.homeTeam.label} Players</Text>
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
                  <Text className="w-14 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">3PT</Text>
                  <Text className="w-14 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">FT</Text>
                  <Text className="w-14 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">FG</Text>
                </View>
                {story.boxScore.homeTeam.players.map((player) => renderPlayerRow(player, player.id === story.boxScore.highlightPlayerId))}
              </View>
            </ScrollView>
          </View>

          {renderTeamTotals(story.boxScore.awayTeam.label, story.boxScore.awayTeam.totals)}
          <View className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <Text className="text-sm font-semibold text-white">{story.boxScore.awayTeam.label} Players</Text>
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
                  <Text className="w-14 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">3PT</Text>
                  <Text className="w-14 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">FT</Text>
                  <Text className="w-14 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">FG</Text>
                </View>
                {story.boxScore.awayTeam.players.map((player) => renderPlayerRow(player, false))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>

        <ScrollView contentContainerClassName="px-5 pb-8 pt-6" style={{ width }}>
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">{story.buzz.intro}</Text>
          {story.buzz.posts.map((post, index) => (
            <View
              key={post.id}
              className={`mt-4 rounded-2xl border p-4 ${index === 0 ? "border-sky-700 bg-sky-950/30" : "border-slate-800 bg-slate-900"}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-white">{post.authorName}</Text>
                <Text className="text-xs uppercase tracking-wide text-slate-400">{post.authorType.replaceAll("_", " ")}</Text>
              </View>
              <Text className="mt-3 text-sm leading-6 text-slate-100">{post.text}</Text>
              <Text className="mt-3 text-xs text-slate-400">
                {post.likes} likes | {post.reposts} reposts | {post.timestampLabel}
              </Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
