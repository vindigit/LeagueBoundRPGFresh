import { useEffect, useRef } from "react";
import { FlatList, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useMatchLoop } from "../hooks/useMatchLoop";
import { useCareerStore } from "../../../store/useCareerStore";
import type { MatchMomentSummary, PlayLog, PlayerBoxScoreLine, TeamBoxScoreTotals } from "../store/useMatchStore";
import { useMatchEngineStore } from "../store/useMatchEngineStore";
import { useMatchStore } from "../store/useMatchStore";
import { KeyMomentOverlay, type KeyMomentContextSummary } from "../components/KeyMomentOverlay";
import type { KeyMomentPending } from "../../../match/keyMoments/types";
import type { MatchFocus, MatchWorkRate, UserMatchState } from "../../../matchEngine";

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

const toWorkRateLabel = (value: MatchWorkRate): string => {
  if (value === "high") {
    return "High";
  }
  if (value === "low") {
    return "Low";
  }
  return "Normal";
};

const toFocusLabel = (value: MatchFocus): string => {
  if (value === "offense") {
    return "Offense";
  }
  if (value === "defense") {
    return "Defense";
  }
  return "Balanced";
};

const deriveFatigueLabel = (fatigue: number): string => {
  if (fatigue >= 0.7) {
    return "High";
  }
  if (fatigue >= 0.35) {
    return "Medium";
  }
  return "Low";
};

const describeScoreSituation = (homeScore: number, awayScore: number): string => {
  const margin = homeScore - awayScore;
  if (margin === 0) {
    return "Tied game";
  }
  if (margin > 0) {
    return `Up ${margin}`;
  }
  return `Down ${Math.abs(margin)}`;
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
  const fatigue = args.userMatchState?.fatigue ?? pending.context.fatigue;

  return {
    score: `${args.homeScore} - ${args.awayScore}`,
    period: getPeriodLabel(args.quarter, args.isOvertime, args.overtimePeriod),
    clock: formatClock(args.timeRemaining),
    situation: describeScoreSituation(args.homeScore, args.awayScore),
    fatigue: deriveFatigueLabel(fatigue),
    workRate: toWorkRateLabel(workRate),
    focus: toFocusLabel(focus),
    matchup: `${args.playerPosition} ${args.playerArchetype} | ${sideLabel} vs ${opponentSide.toUpperCase()}`,
  };
};

const TacticButton = ({
  label,
  active,
  disabled,
  onPress,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    disabled={disabled}
    className={`flex-1 rounded-lg border px-2 py-2 ${active ? "border-cyan-300 bg-cyan-400/20" : "border-slate-700 bg-slate-800"} ${disabled ? "opacity-50" : ""}`}
    onPress={onPress}
  >
    <Text className={`text-center text-xs font-semibold ${active ? "text-cyan-100" : "text-slate-200"}`}>{label}</Text>
  </Pressable>
);

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

const MatchTabButton = ({
  label,
  active,
  disabled,
  onPress,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    disabled={disabled}
    className={`flex-1 rounded-lg border px-3 py-2 ${active ? "border-cyan-300 bg-cyan-400/20" : "border-slate-700 bg-slate-900"} ${disabled ? "opacity-50" : ""}`}
    onPress={onPress}
  >
    <Text className={`text-center text-xs font-semibold uppercase tracking-wide ${active ? "text-cyan-100" : "text-slate-300"}`}>{label}</Text>
  </Pressable>
);

const renderTeamTotals = (label: string, totals: TeamBoxScoreTotals) => (
  <View className="mt-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
    <Text className="text-sm font-semibold text-white">{label}</Text>
    <Text className="mt-2 text-xs text-slate-300">
      PTS {totals.pts} | REB {totals.reb} | AST {totals.ast} | STL {totals.stl} | BLK {totals.blk} | TO {totals.to} | 3PT {totals.tpm ?? 0}-{totals.tpa ?? 0} | FT {totals.ftm}-{totals.fta} | FG {totals.fgm}-{totals.fga}
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
    <Text className="w-14 text-right text-xs text-slate-300">{player.tpm ?? 0}-{player.tpa ?? 0}</Text>
    <Text className="w-14 text-right text-xs text-slate-300">{player.ftm}-{player.fta}</Text>
    <Text className="w-14 text-right text-xs text-slate-300">{player.fgm}-{player.fga}</Text>
  </View>
);

const renderMomentSummaryCard = (item: MatchMomentSummary) => (
  <View key={item.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <View className="flex-row items-center justify-between">
      <Text className="text-xs font-semibold uppercase tracking-wider text-amber-300">Key Moment</Text>
      <Text className="text-[11px] font-semibold text-slate-400">
        Q{item.quarter} {formatClock(item.timeRemaining)}
      </Text>
    </View>
    <Text className="mt-2 text-sm font-semibold text-white">{item.promptText}</Text>
    <Text className="mt-2 text-sm text-slate-300">{item.resultText}</Text>
    <Text className={`mt-3 text-xs font-semibold uppercase tracking-wide ${item.success ? "text-emerald-300" : "text-red-300"}`}>
      {item.success ? "Success" : "Fail"}
    </Text>
  </View>
);

const BoxScoreHeader = () => (
  <View className="mt-2 flex-row items-center justify-between px-3">
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
);

export function MatchScreen() {
  useMatchLoop();
  const activeSessionIdRef = useRef<number | null>(null);
  const playerName = useCareerStore((state) => state.player.name);
  const playerArchetype = useCareerStore((state) => state.player.archetype);
  const playerPosition = useCareerStore((state) => state.player.position);
  const homeDisplayName = playerName.trim().length > 0 ? playerName : "My Player";

  const isPlaying = useMatchStore((state) => state.isPlaying);
  const gameFinished = useMatchStore((state) => state.gameFinished);
  const sessionId = useMatchStore((state) => state.sessionId);
  const resultRecordedSessionId = useMatchStore((state) => state.resultRecordedSessionId);
  const homeScore = useMatchStore((state) => state.homeScore);
  const awayScore = useMatchStore((state) => state.awayScore);
  const quarter = useMatchStore((state) => state.quarter);
  const isOvertime = useMatchStore((state) => state.isOvertime);
  const overtimePeriod = useMatchStore((state) => state.overtimePeriod);
  const timeRemaining = useMatchStore((state) => state.timeRemaining);
  const logs = useMatchStore((state) => state.logs);
  const matchBoxScore = useMatchStore((state) => state.matchBoxScore);
  const matchConsequences = useMatchStore((state) => state.matchConsequences);
  const simSpeed = useMatchStore((state) => state.simSpeed);
  const presentationMode = useMatchStore((state) => state.presentationMode);
  const activeTab = useMatchStore((state) => state.activeTab);
  const momentPhase = useMatchStore((state) => state.momentPhase);
  const momentHistory = useMatchStore((state) => state.momentHistory);
  const latestMomentSummary = useMatchStore((state) => state.latestMomentSummary);
  const keyMomentPending = useMatchEngineStore((state) => state.snapshot.pendingKeyMoment);
  const userMatchState = useMatchEngineStore((state) => state.snapshot.userMatchState);
  const setWorkRate = useMatchEngineStore((state) => state.setWorkRate);
  const setFocus = useMatchEngineStore((state) => state.setFocus);
  const resolveKeyMoment = useMatchEngineStore((state) => state.resolveKeyMoment);
  const keyMomentFeedback = useMatchStore((state) => state.keyMomentFeedback);
  const resetForNewSession = useMatchStore((state) => state.resetForNewSession);
  const startMatch = useMatchStore((state) => state.startMatch);
  const pauseMatch = useMatchStore((state) => state.pauseMatch);
  const setSimSpeed = useMatchStore((state) => state.setSimSpeed);
  const setPresentationMode = useMatchStore((state) => state.setPresentationMode);
  const setActiveTab = useMatchStore((state) => state.setActiveTab);
  const clearKeyMomentFeedback = useMatchStore((state) => state.clearKeyMomentFeedback);
  const markResultRecorded = useMatchStore((state) => state.markResultRecorded);
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
  const overlayActive = Boolean(keyMomentPending || keyMomentFeedback);
  const showBroadcastControls = presentationMode === "broadcast" || activeTab === "log";
  const workRate = userMatchState?.workRate ?? "normal";
  const focus = userMatchState?.focus ?? "balanced";
  const userLine = matchBoxScore.homePlayers[0];

  useEffect(() => {
    activeSessionIdRef.current = resetForNewSession(homeDisplayName, AWAY_NAME);
  }, [homeDisplayName, resetForNewSession]);

  useEffect(() => {
    if (!gameFinished || resultRecordedSessionId === sessionId || activeSessionIdRef.current !== sessionId) {
      return;
    }

    markResultRecorded(sessionId);
    const { homeTotals, awayTotals } = matchBoxScore;
    if (homeTotals.pts !== homeScore || awayTotals.pts !== awayScore) {
      console.warn(
        `[boxscore-integrity] score mismatch at game end: scoreboard ${homeScore}-${awayScore}, boxscore ${homeTotals.pts}-${awayTotals.pts}`,
      );
    }
    completeMatch({ homeScore, awayScore, overtimePeriods: overtimePeriod, boxScore: matchBoxScore, consequences: matchConsequences });
  }, [awayScore, completeMatch, gameFinished, homeScore, markResultRecorded, matchBoxScore, matchConsequences, overtimePeriod, resultRecordedSessionId, sessionId]);

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

      <View className="border-b border-slate-800 bg-slate-925 px-4 py-3">
        <View className="flex-row gap-2">
          <MatchTabButton label="Moment" active={activeTab === "moment"} onPress={() => { setPresentationMode("moment"); setActiveTab("moment"); }} />
          <MatchTabButton label="Log" active={activeTab === "log"} onPress={() => { setPresentationMode("broadcast"); setActiveTab("log"); }} />
          <MatchTabButton label="Box Score" active={activeTab === "box_score"} onPress={() => { setPresentationMode("broadcast"); setActiveTab("box_score"); }} />
          <MatchTabButton label="Shot Chart" active={activeTab === "shot_chart"} disabled onPress={() => undefined} />
        </View>
      </View>

      <View className="flex-1 px-4 pb-4 pt-3">
        {activeTab === "moment" ? (
          <ScrollView contentContainerClassName="gap-3 pb-4">
            <View className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {momentPhase === "pregame" ? "Moment Mode" : momentPhase === "postgame" ? "Match Complete" : keyMomentPending ? "Moment Live" : "Waiting For Next Moment"}
              </Text>
              <Text className="mt-1 text-sm font-semibold text-white">{userLine ? `${userLine.pts} PTS | ${userLine.ast} AST | ${userLine.reb} REB` : "No stats yet"}</Text>
            </View>

            {keyMomentFeedback && !keyMomentPending ? (
              <View className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <Text className={`text-xs font-semibold uppercase tracking-wide ${keyMomentFeedback.success ? "text-emerald-300" : "text-red-300"}`}>
                  {keyMomentFeedback.success ? "Success" : "Fail"}
                </Text>
                <Text className="mt-2 text-sm text-white">{keyMomentFeedback.text}</Text>
              </View>
            ) : null}

            {momentHistory.length > 0 ? momentHistory.slice().reverse().map(renderMomentSummaryCard) : (
              <View className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <Text className="text-sm text-slate-300">Your key moments will stack here once the game starts.</Text>
              </View>
            )}
          </ScrollView>
        ) : activeTab === "log" ? (
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
        ) : activeTab === "box_score" ? (
          <ScrollView contentContainerClassName="pb-4">
            {renderTeamTotals(homeDisplayName, matchBoxScore.homeTotals)}
            {renderTeamTotals(AWAY_NAME, matchBoxScore.awayTotals)}
            <View className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
              <Text className="text-sm font-semibold text-white">Home Players</Text>
              <BoxScoreHeader />
              {matchBoxScore.homePlayers.map((player) => renderPlayerRow(player, player.id === "home-0"))}
            </View>
            <View className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
              <Text className="text-sm font-semibold text-white">Away Players</Text>
              <BoxScoreHeader />
              {matchBoxScore.awayPlayers.map((player) => renderPlayerRow(player, false))}
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6">
            <Text className="text-base font-semibold text-white">Shot Chart Coming Later</Text>
            <Text className="mt-2 text-center text-sm text-slate-400">The session model supports this tab, but the live shot chart is still a future phase.</Text>
          </View>
        )}
      </View>

      <View className="border-t border-slate-800 bg-slate-900 px-4 py-4">
        <View className="mb-4 gap-3">
          <View>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Work Rate</Text>
            <View className="flex-row gap-2">
              <TacticButton label="Low" active={workRate === "low"} disabled={overlayActive || gameFinished} onPress={() => setWorkRate("low")} />
              <TacticButton label="Normal" active={workRate === "normal"} disabled={overlayActive || gameFinished} onPress={() => setWorkRate("normal")} />
              <TacticButton label="High" active={workRate === "high"} disabled={overlayActive || gameFinished} onPress={() => setWorkRate("high")} />
            </View>
          </View>
          <View>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Focus</Text>
            <View className="flex-row gap-2">
              <TacticButton label="Defense" active={focus === "defense"} disabled={overlayActive || gameFinished} onPress={() => setFocus("defense")} />
              <TacticButton label="Balanced" active={focus === "balanced"} disabled={overlayActive || gameFinished} onPress={() => setFocus("balanced")} />
              <TacticButton label="Offense" active={focus === "offense"} disabled={overlayActive || gameFinished} onPress={() => setFocus("offense")} />
            </View>
          </View>
        </View>

        {showBroadcastControls ? (
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
              disabled={gameFinished || overlayActive}
              onValueChange={(value) => {
                setSimSpeed(value);
              }}
            />
          </View>
        ) : (
          <View className="mb-4 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-3">
            <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">Moment Mode</Text>
            <Text className="mt-1 text-sm text-slate-300">Broadcast speed stays available when you open the live log or box score tabs.</Text>
          </View>
        )}
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

