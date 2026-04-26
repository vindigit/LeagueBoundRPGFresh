import { useEffect, useRef } from "react";
import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useMatchLoop } from "../hooks/useMatchLoop";
import { useCareerStore } from "../../../store/useCareerStore";
import type { PlayLog } from "../store/useMatchStore";
import { useMatchEngineStore } from "../store/useMatchEngineStore";
import { useMatchStore } from "../store/useMatchStore";
import { KeyMomentOverlay, type KeyMomentContextSummary } from "../components/KeyMomentOverlay";
import type { KeyMomentPending } from "../../../match/keyMoments/types";
import type { UserMatchState } from "../../../matchEngine";

const AWAY_NAME = "Rivals High";

const formatClock = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

const getPeriodLabel = (quarter: 1 | 2 | 3 | 4, isOvertime: boolean, overtimePeriod: number): string =>
  isOvertime ? `OT${overtimePeriod}` : `Q${quarter}`;

const formatSpeedLabel = (speed: number): string => (Number.isInteger(speed) ? `${speed}x` : `${speed.toFixed(1)}x`);

const toBandLabel = (value: number): string => {
  if (value >= 75) {
    return "High";
  }
  if (value >= 50) {
    return "Medium";
  }
  return "Low";
};

const deriveFatigueLabel = (pending: KeyMomentPending): string => {
  const clock = pending.context.timeRemaining;
  if (clock <= 120) {
    return "High";
  }
  if (clock <= 360) {
    return "Medium";
  }
  return "Low";
};

const buildKeyMomentContextSummary = (args: {
  pending?: KeyMomentPending;
  homeScore: number;
  awayScore: number;
  quarter: 1 | 2 | 3 | 4;
  isOvertime: boolean;
  overtimePeriod: number;
  timeRemaining: number;
  playerPosition: string;
  playerArchetype: string;
  userMatchState?: UserMatchState;
}): KeyMomentContextSummary | undefined => {
  const { pending } = args;
  if (!pending) {
    return undefined;
  }

  const sideLabel = pending.context.offense === pending.context.userTeam ? "On offense" : "On defense";
  const opponentSide = pending.context.offense === pending.context.userTeam ? pending.context.defense : pending.context.offense;
  const workRate = args.userMatchState?.workRate ?? pending.context.workRate;
  const focus = args.userMatchState?.focus ?? pending.context.focus;

  return {
    score: `${args.homeScore} - ${args.awayScore}`,
    period: getPeriodLabel(args.quarter, args.isOvertime, args.overtimePeriod),
    clock: formatClock(args.timeRemaining),
    fatigue: deriveFatigueLabel(pending),
    workRate: `${workRate} (${toBandLabel(workRate)})`,
    focus: `${focus} (${toBandLabel(focus)})`,
    matchup: `${args.playerPosition} ${args.playerArchetype} • ${sideLabel} vs ${opponentSide.toUpperCase()}`,
  };
};

const getLogTextClassName = (item: PlayLog): string => {
  if (item.isUserAction) {
    return "text-yellow-300";
  }

  const { type } = item;
  if (type === "score") {
    return "text-emerald-300";
  }

  if (type === "info") {
    return "text-slate-400";
  }

  if (type === "turnover") {
    return "text-red-300";
  }

  return "text-slate-200";
};

const getLogContainerClassName = (team: PlayLog["team"]): string => {
  if (team === "home") {
    return "border-l-4 border-emerald-500 bg-emerald-950/30";
  }

  return "border-l-4 border-sky-500 bg-sky-950/30";
};

const getLogPeriodLabel = (item: PlayLog): string =>
  item.overtimePeriod && item.overtimePeriod > 0 ? `OT${item.overtimePeriod}` : `Q${item.quarter}`;

const renderLogItem = ({ item }: { item: PlayLog }) => (
  <View className={`mb-2 rounded-xl p-3 ${getLogContainerClassName(item.team)}`}>
    <View className="mb-1 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">{getLogPeriodLabel(item)}</Text>
        {item.isUserAction ? (
          <View className="rounded-full border border-yellow-400/50 bg-yellow-400/15 px-2 py-0.5">
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-yellow-300">You</Text>
          </View>
        ) : null}
      </View>
      <Text className="text-xs font-semibold text-slate-400">{formatClock(item.timeRemaining)}</Text>
    </View>
    <Text className={`text-sm font-medium ${getLogTextClassName(item)}`}>{item.text}</Text>
  </View>
);

export function MatchScreen() {
  useMatchLoop();
  const hasAppliedResultRef = useRef(false);
  const playerName = useCareerStore((state) => state.player.name);
  const playerArchetype = useCareerStore((state) => state.player.archetype);
  const playerPosition = useCareerStore((state) => state.player.position);
  const homeDisplayName = playerName.trim().length > 0 ? playerName : "My Player";

  const isPlaying = useMatchStore((state) => state.isPlaying);
  const gameFinished = useMatchStore((state) => state.gameFinished);
  const homeScore = useMatchStore((state) => state.homeScore);
  const awayScore = useMatchStore((state) => state.awayScore);
  const quarter = useMatchStore((state) => state.quarter);
  const isOvertime = useMatchStore((state) => state.isOvertime);
  const overtimePeriod = useMatchStore((state) => state.overtimePeriod);
  const timeRemaining = useMatchStore((state) => state.timeRemaining);
  const logs = useMatchStore((state) => state.logs);
  const matchBoxScore = useMatchStore((state) => state.matchBoxScore);
  const simSpeed = useMatchStore((state) => state.simSpeed);
  const keyMomentPending = useMatchEngineStore((state) => state.snapshot.pendingKeyMoment);
  const userMatchState = useMatchEngineStore((state) => state.snapshot.userMatchState);
  const resolveKeyMoment = useMatchEngineStore((state) => state.resolveKeyMoment);
  const keyMomentFeedback = useMatchStore((state) => state.keyMomentFeedback);
  const initializeMatch = useMatchStore((state) => state.initializeMatch);
  const startMatch = useMatchStore((state) => state.startMatch);
  const pauseMatch = useMatchStore((state) => state.pauseMatch);
  const setSimSpeed = useMatchStore((state) => state.setSimSpeed);
  const clearKeyMomentFeedback = useMatchStore((state) => state.clearKeyMomentFeedback);
  const completeMatch = useCareerStore((state) => state.completeMatch);
  const keyMomentContextSummary = buildKeyMomentContextSummary({
    pending: keyMomentPending,
    homeScore,
    awayScore,
    quarter,
    isOvertime,
    overtimePeriod,
    timeRemaining,
    playerPosition,
    playerArchetype,
    userMatchState,
  });

  useEffect(() => {
    hasAppliedResultRef.current = false;
    initializeMatch(homeDisplayName, AWAY_NAME);
  }, [homeDisplayName, initializeMatch]);

  useEffect(() => {
    if (!gameFinished || hasAppliedResultRef.current) {
      return;
    }

    hasAppliedResultRef.current = true;
    const { homeTotals, awayTotals } = matchBoxScore;
    if (homeTotals.pts !== homeScore || awayTotals.pts !== awayScore) {
      console.warn(
        `[boxscore-integrity] score mismatch at game end: scoreboard ${homeScore}-${awayScore}, boxscore ${homeTotals.pts}-${awayTotals.pts}`,
      );
    }
    completeMatch({ homeScore, awayScore, overtimePeriods: overtimePeriod, boxScore: matchBoxScore });
  }, [awayScore, completeMatch, gameFinished, homeScore, matchBoxScore, overtimePeriod]);

  useEffect(() => {
    if (!keyMomentFeedback) {
      return;
    }

    const timeoutId = setTimeout(() => {
      clearKeyMomentFeedback();
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [clearKeyMomentFeedback, keyMomentFeedback]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
        <View className="bg-slate-900 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-xs uppercase tracking-wider text-slate-400">Home</Text>
              <Text className="mt-1 text-lg font-bold text-white">{homeDisplayName}</Text>
              <Text className="mt-1 text-3xl font-black text-emerald-300">{homeScore}</Text>
            </View>

            <View className="items-center px-2">
              <Text className="text-3xl font-bold text-white">{formatClock(timeRemaining)}</Text>
              <Text className="mt-1 text-sm font-semibold text-slate-300">{getPeriodLabel(quarter, isOvertime, overtimePeriod)}</Text>
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
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sim Speed</Text>
              <Text className="text-sm font-semibold text-white">{formatSpeedLabel(simSpeed)}</Text>
            </View>
            <Slider
              minimumValue={0.5}
              maximumValue={4}
              step={0.5}
              value={simSpeed}
              minimumTrackTintColor="#22d3ee"
              maximumTrackTintColor="#334155"
              thumbTintColor="#f8fafc"
              disabled={gameFinished}
              onValueChange={(value) => {
                setSimSpeed(value);
              }}
            />
          </View>
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
            <View className="items-center justify-center rounded-xl bg-slate-700 py-3">
              <Text className="text-base font-semibold text-white">Building Postgame Summary...</Text>
            </View>
          )}
        </View>
        {keyMomentPending || keyMomentFeedback ? (
          <KeyMomentOverlay
            pending={keyMomentPending}
            feedback={keyMomentFeedback ? { success: keyMomentFeedback.success, text: keyMomentFeedback.text } : undefined}
            contextSummary={keyMomentContextSummary}
            onResolve={(input) => {
              resolveKeyMoment(input);
            }}
          />
        ) : null}
    </SafeAreaView>
  );
}
