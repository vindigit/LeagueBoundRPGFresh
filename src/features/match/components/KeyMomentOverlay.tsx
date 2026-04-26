import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { KeyMomentPending, KeyMomentResolutionInput, MinigameSpec } from "../../../match/keyMoments/types";

export interface KeyMomentContextSummary {
  score: string;
  period: string;
  clock: string;
  fatigue: string;
  workRate: string;
  focus: string;
  matchup?: string;
}

interface KeyMomentOverlayProps {
  pending?: KeyMomentPending;
  feedback?: { success: boolean; text: string };
  contextSummary?: KeyMomentContextSummary;
  onResolve: (input: KeyMomentResolutionInput) => void;
}

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const MINIGAME_TICK_MS = 16;

export const scoreTimingRelease = (progress: number, minigame: MinigameSpec): number => {
  if (minigame.type !== "timing_release") {
    return 0;
  }

  const safeProgress = clamp01(progress);
  const distance = Math.abs(safeProgress - minigame.targetCenter);
  const normalizedDistance = distance / Math.max(minigame.targetRadius, 0.001);

  if (normalizedDistance <= 1) {
    return clamp01(0.72 + (1 - normalizedDistance) * 0.27);
  }

  return clamp01(0.72 - (normalizedDistance - 1) * 0.5);
};

const ContextChip = ({ label, value }: { label: string; value: string }) => (
  <View className="min-w-[46%] rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2">
    <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-white">{value}</Text>
  </View>
);

export const KeyMomentOverlay = ({ pending, feedback, contextSummary, onResolve }: KeyMomentOverlayProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [timingProgress, setTimingProgress] = useState(0);
  const startedAtRef = useRef<number>(Date.now());
  const resolvedRef = useRef(false);
  const showMinigamePlaceholder = useMemo(() => Boolean(pending), [pending]);

  useEffect(() => {
    setSubmitting(false);
    setTimingProgress(0);
    startedAtRef.current = Date.now();
    resolvedRef.current = false;
  }, [pending?.id]);

  useEffect(() => {
    if (!pending?.minigame || pending.minigame.type !== "timing_release" || submitting || resolvedRef.current) {
      return;
    }

    const updateProgress = () => {
      const elapsed = Date.now() - startedAtRef.current;
      const duration = Math.max(pending.minigame?.durationMs ?? 1, 1);
      setTimingProgress(clamp01(elapsed / duration));
    };

    updateProgress();
    const intervalId = setInterval(updateProgress, MINIGAME_TICK_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [pending?.id, pending?.minigame, submitting]);

  if (feedback && !pending) {
    return (
      <View className="absolute inset-0 items-center justify-center bg-black/65 px-5">
        <View className="w-full max-w-md rounded-2xl border border-amber-400/40 bg-slate-900 p-5">
          <Text className="text-xs font-semibold uppercase tracking-wider text-amber-300">Key Moment</Text>
          <Text className={`mt-2 text-lg font-bold ${feedback.success ? "text-emerald-300" : "text-red-300"}`}>
            {feedback.success ? "Success" : "Failed"}
          </Text>
          <Text className="mt-2 text-base font-medium text-white">{feedback.text}</Text>
        </View>
      </View>
    );
  }

  if (!pending) {
    return null;
  }

  const getLiveTimingProgress = (): number => {
    if (!pending.minigame || pending.minigame.type !== "timing_release") {
      return timingProgress;
    }

    const duration = Math.max(pending.minigame.durationMs, 1);
    return clamp01((Date.now() - startedAtRef.current) / duration);
  };

  const submitTimingRelease = () => {
    if (
      submitting ||
      resolvedRef.current ||
      !pending.minigame ||
      pending.minigame.type !== "timing_release"
    ) {
      return;
    }

    const liveProgress = getLiveTimingProgress();
    resolvedRef.current = true;
    setSubmitting(true);
    setTimingProgress(liveProgress);
    onResolve({
      pendingId: pending.id,
      executionQuality: {
        normalizedScore: scoreTimingRelease(liveProgress, pending.minigame),
        source: "minigame",
      },
    });
  };

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/80 px-5">
      <View className="w-full max-w-md rounded-2xl border border-amber-400/40 bg-slate-900 p-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-amber-300">Key Moment</Text>
        <Text className="mt-2 text-base font-semibold text-white">{pending.promptText}</Text>
        {contextSummary ? (
          <View className="mt-4 gap-2">
            <View className="flex-row flex-wrap justify-between gap-2">
              <ContextChip label="Score" value={contextSummary.score} />
              <ContextChip label="Period" value={contextSummary.period} />
              <ContextChip label="Clock" value={contextSummary.clock} />
              <ContextChip label="Fatigue" value={contextSummary.fatigue} />
              <ContextChip label="Work Rate" value={contextSummary.workRate} />
              <ContextChip label="Focus" value={contextSummary.focus} />
            </View>
            {contextSummary.matchup ? (
              <View className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Matchup</Text>
                <Text className="mt-1 text-sm font-semibold text-white">{contextSummary.matchup}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {pending.mode === "choice" ? (
          <View className="mt-4 gap-2">
            {pending.options?.map((option) => (
              <Pressable
                key={option.id}
                disabled={submitting}
                className={`rounded-lg border px-3 py-3 ${submitting ? "border-slate-700 bg-slate-800" : "border-cyan-500/40 bg-cyan-500/10"}`}
                onPress={() => {
                  if (submitting || resolvedRef.current) {
                    return;
                  }
                  resolvedRef.current = true;
                  setSubmitting(true);
                  onResolve({ pendingId: pending.id, choiceId: option.id });
                }}
              >
                <Text className="text-sm font-semibold text-cyan-200">{option.label}</Text>
                <Text className="mt-1 text-xs text-slate-300">{option.description}</Text>
              </Pressable>
            ))}
            <Pressable
              disabled={submitting}
              className={`mt-2 items-center justify-center rounded-xl border py-3 ${submitting ? "border-slate-700 bg-slate-800" : "border-amber-400/50 bg-amber-400/15"}`}
              onPress={() => {
                if (submitting || resolvedRef.current) {
                  return;
                }
                resolvedRef.current = true;
                setSubmitting(true);
                onResolve({ pendingId: pending.id, usedFallbackBaseline: true });
              }}
            >
              <Text className={`text-sm font-semibold ${submitting ? "text-slate-300" : "text-amber-200"}`}>
                {submitting ? "Sim Locked" : "Sim It"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="mt-4 rounded-xl border border-emerald-400/30 bg-slate-800/70 px-4 py-5">
            <Text className="text-sm font-semibold text-white">Timing Release</Text>
            <Text className="mt-2 text-xs text-slate-300">Tap when the marker hits the window.</Text>
            {pending.minigame?.type === "timing_release" ? (
              <>
                <View className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-4">
                  <View className="h-4 rounded-full bg-slate-700" testID="timing-release-lane">
                    <View
                      testID="timing-release-target"
                      className="absolute h-4 rounded-full bg-amber-400/80"
                      style={{
                        left: `${clamp01(pending.minigame.targetCenter - pending.minigame.targetRadius) * 100}%`,
                        width: `${Math.min(100, pending.minigame.targetRadius * 200)}%`,
                      }}
                    />
                    <View
                      testID="timing-release-marker"
                      className="absolute -top-1 h-6 w-2 rounded-full bg-cyan-300"
                      style={{ left: `${timingProgress * 100}%` }}
                    />
                  </View>
                  <Text className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Meter {Math.round(timingProgress * 100)}%
                  </Text>
                </View>
                <Pressable
                  testID="timing-release-button"
                  disabled={submitting}
                  className={`mt-4 items-center justify-center rounded-xl border py-3 ${
                    submitting ? "border-slate-700 bg-slate-800" : "border-emerald-400/40 bg-emerald-400/10"
                  }`}
                  onPress={submitTimingRelease}
                >
                  <Text className={`text-sm font-semibold ${submitting ? "text-slate-300" : "text-emerald-200"}`}>
                    {submitting ? "Release Locked" : "Tap to Release"}
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text className="mt-3 text-xs text-slate-300">This minigame type is not available yet.</Text>
            )}
            <Pressable
              disabled={submitting}
              className={`mt-4 items-center justify-center rounded-xl py-3 ${submitting ? "bg-slate-700" : "bg-amber-400"}`}
              onPress={() => {
                if (submitting || resolvedRef.current) {
                  return;
                }
                resolvedRef.current = true;
                setSubmitting(true);
                onResolve({ pendingId: pending.id, usedFallbackBaseline: true });
              }}
            >
              <Text className={`text-sm font-semibold ${submitting ? "text-slate-300" : "text-black"}`}>
                {submitting ? "Locked" : "Sim It"}
              </Text>
            </Pressable>
          </View>
        )}
        {showMinigamePlaceholder && pending.mode === "choice" ? (
          <View className="mt-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/60 px-3 py-3">
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Future Minigame</Text>
            <Text className="mt-1 text-xs text-slate-300">A dedicated minigame shell will replace this placeholder in a later pass.</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};
