import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { KeyMomentPending, KeyMomentResolutionInput } from "../../../match/keyMoments/types";

interface KeyMomentOverlayProps {
  pending?: KeyMomentPending;
  feedback?: { success: boolean; text: string };
  onResolve: (input: KeyMomentResolutionInput) => void;
}

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const getAimQuality = (cursor: number, center: number, radius: number): number => {
  const distance = Math.abs(cursor - center);
  if (distance >= radius) {
    return 0;
  }
  return clamp01(1 - distance / radius);
};

export const KeyMomentOverlay = ({ pending, feedback, onResolve }: KeyMomentOverlayProps) => {
  const barWidth = 280;
  const [submitting, setSubmitting] = useState(false);
  const [cursor, setCursor] = useState(0);
  const startedAtRef = useRef<number>(Date.now());
  const resolvedRef = useRef(false);
  const minigame = pending?.minigame;
  const durationMs = minigame?.durationMs ?? 2800;
  const center = minigame?.targetCenter ?? 0.5;
  const radius = minigame?.targetRadius ?? 0.12;
  const leadingFlex = useMemo(() => Math.max(0, center - radius), [center, radius]);
  const targetFlex = useMemo(() => Math.max(0.01, radius * 2), [radius]);
  const trailingFlex = useMemo(() => Math.max(0, 1 - (center + radius)), [center, radius]);

  useEffect(() => {
    setSubmitting(false);
    setCursor(0);
    startedAtRef.current = Date.now();
    resolvedRef.current = false;
  }, [pending?.id]);

  useEffect(() => {
    if (!pending || pending.mode !== "minigame" || submitting) {
      return;
    }

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      const progress = (elapsed % durationMs) / durationMs;
      const saw = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
      setCursor(clamp01(saw));

      if (elapsed >= durationMs) {
        if (resolvedRef.current) {
          return;
        }
        resolvedRef.current = true;
        setSubmitting(true);
        onResolve({ pendingId: pending.id, minigameQuality: 0 });
      }
    }, 33);

    return () => clearInterval(intervalId);
  }, [durationMs, onResolve, pending, submitting]);

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

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/80 px-5">
      <View className="w-full max-w-md rounded-2xl border border-amber-400/40 bg-slate-900 p-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-amber-300">Key Moment</Text>
        <Text className="mt-2 text-base font-semibold text-white">{pending.promptText}</Text>

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
          </View>
        ) : (
          <View className="mt-4">
            <Text className="text-xs text-slate-300">Tap while the marker is inside the target.</Text>
            <View className="mt-3 h-6 overflow-hidden rounded-full bg-slate-800" style={{ width: barWidth }}>
              <View className="absolute inset-0 flex-row">
                <View style={{ flex: leadingFlex }} />
                <View className="bg-emerald-500/40" style={{ flex: targetFlex }} />
                <View style={{ flex: trailingFlex }} />
              </View>
              <View
                className="absolute bottom-0 top-0 w-1 bg-white"
                style={{ transform: [{ translateX: cursor * (barWidth - 2) }] }}
              />
            </View>
            <Pressable
              disabled={submitting}
              className={`mt-4 items-center justify-center rounded-xl py-3 ${submitting ? "bg-slate-700" : "bg-amber-400"}`}
              onPress={() => {
                if (submitting || resolvedRef.current) {
                  return;
                }
                resolvedRef.current = true;
                setSubmitting(true);
                onResolve({
                  pendingId: pending.id,
                  minigameQuality: getAimQuality(cursor, center, radius),
                });
              }}
            >
              <Text className={`text-sm font-semibold ${submitting ? "text-slate-300" : "text-black"}`}>
                {submitting ? "Locked" : "Shoot"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};
