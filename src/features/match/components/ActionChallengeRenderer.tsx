import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { scoreReactionChallenge, scoreTimingChallenge } from "../../../match/keyMoments/actionChallenges";
import type { ActionChallengeSpec, KeyMomentPending, KeyMomentResolutionInput } from "../../../match/keyMoments/types";

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

interface ActionChallengeRendererProps {
  pending: KeyMomentPending;
  challenge: ActionChallengeSpec;
  progress: number;
  submitting: boolean;
  onResolve: (input: KeyMomentResolutionInput) => void;
  onLock: () => void;
}

const ChallengeTrack = ({
  markerId,
  targetId,
  progress,
  targetCenter,
  targetRadius,
  targetColorClassName,
}: {
  markerId: string;
  targetId: string;
  progress: number;
  targetCenter: number;
  targetRadius: number;
  targetColorClassName: string;
}) => (
  <View className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-4">
    <View className="h-4 rounded-full bg-slate-700" testID="timing-release-lane">
      <View
        testID={targetId}
        className={`absolute h-4 rounded-full ${targetColorClassName}`}
        style={{
          left: `${clamp01(targetCenter - targetRadius) * 100}%`,
          width: `${Math.min(100, targetRadius * 200)}%`,
        }}
      />
      <View
        testID={markerId}
        className="absolute -top-1 h-6 w-2 rounded-full bg-cyan-300"
        style={{ left: `${progress * 100}%` }}
      />
    </View>
    <Text className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      Meter {Math.round(progress * 100)}%
    </Text>
  </View>
);

const ChallengeCard = ({
  title,
  subtitle,
  buttonLabel,
  buttonId,
  submitting,
  onSubmit,
  children,
}: {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonId: string;
  submitting: boolean;
  onSubmit: () => void;
  children: ReactNode;
}) => (
  <View className="mt-4 rounded-xl border border-emerald-400/30 bg-slate-800/70 px-4 py-5">
    <Text className="text-sm font-semibold text-white">{title}</Text>
    <Text className="mt-2 text-xs text-slate-300">{subtitle}</Text>
    {children}
    <Pressable
      testID={buttonId}
      disabled={submitting}
      className={`mt-4 items-center justify-center rounded-xl border py-3 ${
        submitting ? "border-slate-700 bg-slate-800" : "border-emerald-400/40 bg-emerald-400/10"
      }`}
      onPress={onSubmit}
    >
      <Text className={`text-sm font-semibold ${submitting ? "text-slate-300" : "text-emerald-200"}`}>
        {submitting ? "Locked" : buttonLabel}
      </Text>
    </Pressable>
  </View>
);

export const ActionChallengeRenderer = ({
  pending,
  challenge,
  progress,
  submitting,
  onResolve,
  onLock,
}: ActionChallengeRendererProps) => {
  if (challenge.execution.kind === "timing") {
    const timing = challenge.execution.timing;
    return (
      <ChallengeCard
        title={challenge.title}
        subtitle={challenge.subtitle}
        buttonLabel={challenge.buttonLabel}
        buttonId="timing-release-button"
        submitting={submitting}
        onSubmit={() => {
          onLock();
          onResolve({
            pendingId: pending.id,
            executionQuality: scoreTimingChallenge(progress, challenge),
          });
        }}
      >
        <ChallengeTrack
          markerId="timing-release-marker"
          targetId="timing-release-target"
          progress={progress}
          targetCenter={timing.targetCenter}
          targetRadius={Math.max(0.01, timing.targetRadius + challenge.forgiveness.windowRadiusBonus + challenge.forgiveness.fatigueResistance)}
          targetColorClassName="bg-amber-400/80"
        />
      </ChallengeCard>
    );
  }

  if (challenge.execution.kind === "reaction") {
    const reaction = challenge.execution.reaction;
    return (
      <ChallengeCard
        title={challenge.title}
        subtitle={challenge.subtitle}
        buttonLabel={challenge.buttonLabel}
        buttonId="steal-reaction-button"
        submitting={submitting}
        onSubmit={() => {
          onLock();
          onResolve({
            pendingId: pending.id,
            executionQuality: scoreReactionChallenge(progress, challenge),
          });
        }}
      >
        <ChallengeTrack
          markerId="steal-reaction-marker"
          targetId="timing-release-target"
          progress={progress}
          targetCenter={reaction.cueAtProgress}
          targetRadius={reaction.cueRadius}
          targetColorClassName="bg-red-400/80"
        />
      </ChallengeCard>
    );
  }

  return null;
};
