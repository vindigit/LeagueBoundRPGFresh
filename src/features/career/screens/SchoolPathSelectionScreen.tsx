import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { SCHOOL_PATH_PROFILES, type SchoolPathProfile } from "../../../constants/schoolPaths";
import { useCareerStore } from "../../../store/useCareerStore";
import type { SchoolPath } from "../../../types/careerProgression";

const PATH_ORDER: readonly SchoolPath[] = ["LOCAL_3A", "STATE_5A", "PREP"];

const PathCard = ({
  profile,
  onSelect,
  badge,
  tournamentNotes,
}: {
  profile: SchoolPathProfile;
  onSelect: (path: SchoolPath) => void;
  badge: string | null;
  tournamentNotes: string;
}) => (
  <Pressable className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5" onPress={() => onSelect(profile.key)}>
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-bold text-white">{profile.label}</Text>
      <View className="items-end gap-2">
        <View className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1">
          <Text className="text-xs font-semibold text-emerald-200">{profile.shortLabel}</Text>
        </View>
        {badge ? (
          <View className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1">
            <Text className="text-[11px] font-semibold text-sky-200">{badge}</Text>
          </View>
        ) : null}
      </View>
    </View>

    <Text className="mt-3 text-sm leading-6 text-slate-300">{profile.summary}</Text>
    <Text className="mt-3 text-xs font-medium uppercase tracking-wide text-amber-200">{tournamentNotes}</Text>

    <View className="mt-4 gap-2 rounded-xl bg-slate-950/50 p-3">
      <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Exposure</Text>
      <Text className="text-sm font-medium text-white">{profile.exposureLabel}</Text>

      <Text className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Difficulty</Text>
      <Text className="text-sm font-medium text-white">{profile.difficultyLabel}</Text>

      <Text className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Playing Time</Text>
      <Text className="text-sm font-medium text-white">{profile.playingTimeLabel}</Text>

      <Text className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Locality</Text>
      <Text className="text-sm font-medium text-white">{profile.localityLabel}</Text>
    </View>

    <View className="mt-4 items-center justify-center rounded-xl bg-emerald-500 py-3">
      <Text className="text-base font-semibold text-black">Choose {profile.shortLabel}</Text>
    </View>
  </Pressable>
);

export function SchoolPathSelectionScreen() {
  const selectSchoolPath = useCareerStore((state) => state.selectSchoolPath);
  const identity = useCareerStore((state) => state.player.identity);
  const tournament = useCareerStore((state) => state.middleSchoolTournament);
  const hometown = identity ? `${identity.hometown.city}, ${identity.hometown.state}` : "your hometown";
  const recommendation = tournament?.schoolPathRecommendations[0] ?? "STATE_5A";
  const getBadge = (path: SchoolPath): string | null => {
    if (!tournament) {
      return null;
    }
    if (recommendation === path) {
      return "Recommended";
    }
    if (path === "LOCAL_3A" && tournament.localBuzz >= tournament.scoutBuzz) {
      return "Local buzz strongest";
    }
    if (path === "PREP" && tournament.scoutBuzz >= 20) {
      return "Scouts noticed upside";
    }
    if (path === "STATE_5A") {
      return "Best fit for current run";
    }
    return null;
  };
  const getTournamentNotes = (path: SchoolPath): string => {
    if (!tournament) {
      return "Tournament notes unavailable.";
    }
    if (path === "LOCAL_3A") {
      return `Local buzz ${tournament.localBuzz} points toward a hometown-heavy start.`;
    }
    if (path === "PREP") {
      return `Scout buzz ${tournament.scoutBuzz} frames the upside play.`;
    }
    return `Pressure score ${tournament.pressureScore} and all-around feedback support a balanced jump.`;
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView contentContainerClassName="px-5 pb-8 pt-8">
        <Text className="text-xs font-semibold uppercase tracking-widest text-emerald-300">High School Path</Text>
        <Text className="mt-2 text-3xl font-bold text-white">Choose Your Next Stage</Text>
        <Text className="mt-3 text-sm leading-6 text-slate-300">
          The tutorial year is behind you. Pick the lane that shapes your high school climb, from local stardom in {hometown}
          to the national prep circuit.
        </Text>
        {tournament ? (
          <View className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">{tournament.eventName}</Text>
            <Text className="mt-2 text-base font-semibold text-white">Recommended route: {SCHOOL_PATH_PROFILES[recommendation].label}</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-300">
              Local buzz {tournament.localBuzz} • Scout buzz {tournament.scoutBuzz} • Potential read {tournament.fuzzyPotentialSeed}
            </Text>
          </View>
        ) : null}

        {PATH_ORDER.map((path) => (
          <PathCard
            key={path}
            profile={SCHOOL_PATH_PROFILES[path]}
            onSelect={selectSchoolPath}
            badge={getBadge(path)}
            tournamentNotes={getTournamentNotes(path)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
