import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { SCHOOL_PATH_PROFILES, type SchoolPathProfile } from "../../../constants/schoolPaths";
import { useCareerStore } from "../../../store/useCareerStore";
import type { SchoolPath } from "../../../types/careerProgression";

const PATH_ORDER: readonly SchoolPath[] = ["LOCAL_3A", "STATE_5A", "PREP"];

const PathCard = ({
  profile,
  onSelect,
}: {
  profile: SchoolPathProfile;
  onSelect: (path: SchoolPath) => void;
}) => (
  <Pressable className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5" onPress={() => onSelect(profile.key)}>
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-bold text-white">{profile.label}</Text>
      <View className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1">
        <Text className="text-xs font-semibold text-emerald-200">{profile.shortLabel}</Text>
      </View>
    </View>

    <Text className="mt-3 text-sm leading-6 text-slate-300">{profile.summary}</Text>

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
  const hometown = identity ? `${identity.hometown.city}, ${identity.hometown.state}` : "your hometown";

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView contentContainerClassName="px-5 pb-8 pt-8">
        <Text className="text-xs font-semibold uppercase tracking-widest text-emerald-300">High School Path</Text>
        <Text className="mt-2 text-3xl font-bold text-white">Choose Your Next Stage</Text>
        <Text className="mt-3 text-sm leading-6 text-slate-300">
          The tutorial year is behind you. Pick the lane that shapes your high school climb, from local stardom in {hometown}
          to the national prep circuit.
        </Text>

        {PATH_ORDER.map((path) => (
          <PathCard key={path} profile={SCHOOL_PATH_PROFILES[path]} onSelect={selectSchoolPath} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
