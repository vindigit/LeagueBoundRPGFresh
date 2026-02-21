import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { getBackstoryGrowthOutlook, generateBackstoryFromInput } from "../generator";
import { CURATED_HOMETOWNS, DEFAULT_HOMETOWN } from "../data/hometowns";
import type { BackstoryInput, BodyFrame, DominantHand } from "../../../types/backstory";
import type { PlayerArchetype } from "../../../types/player";
import { useCareerStore } from "../../../store/useCareerStore";

const ARCHETYPES: readonly PlayerArchetype[] = [
  "Slasher",
  "Sharpshooter",
  "Playmaker",
  "Lockdown Defender",
  "Paint Beast",
  "Stretch Big",
];
const BODY_FRAMES: readonly BodyFrame[] = ["Lean", "Athletic", "Stocky"];
const DOMINANT_HANDS: readonly DominantHand[] = ["Right", "Left"];
const MAX_HOMETOWN_RESULTS = 24;

const clampAgeStarted = (value: number): number => Math.min(14, Math.max(4, Math.round(value)));

const StepPill = ({ current, total }: { current: number; total: number }) => (
  <View className="mt-3 flex-row gap-2">
    {Array.from({ length: total }, (_, index) => {
      const isActive = index + 1 === current;
      return <View key={index} className={`h-1.5 flex-1 rounded-full ${isActive ? "bg-emerald-400" : "bg-slate-700"}`} />;
    })}
  </View>
);

function SelectGroup<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: readonly T[];
  selected: T;
  onSelect: (next: T) => void;
}) {
  return (
    <View className="mt-3 flex-row flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <Pressable
            key={option}
            className={`rounded-lg border px-3 py-2 ${isSelected ? "border-emerald-400 bg-emerald-400/20" : "border-slate-700 bg-slate-900"}`}
            onPress={() => onSelect(option)}
          >
            <Text className={`text-sm font-semibold ${isSelected ? "text-emerald-200" : "text-slate-200"}`}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function BackstoryScreen() {
  const initializeCareer = useCareerStore((state) => state.initializeCareer);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hometownQuery, setHometownQuery] = useState("");
  const [hometownSlug, setHometownSlug] = useState(DEFAULT_HOMETOWN.slug);
  const [archetype, setArchetype] = useState<PlayerArchetype>("Slasher");
  const [bodyFrame, setBodyFrame] = useState<BodyFrame>("Athletic");
  const [dominantHand, setDominantHand] = useState<DominantHand>("Right");
  const [ageStarted, setAgeStarted] = useState(8);
  const [generationSeed, setGenerationSeed] = useState(() => Date.now());
  const stepTransition = useRef(new Animated.Value(1)).current;

  const filteredHometowns = useMemo(() => {
    const query = hometownQuery.trim().toLowerCase();
    if (query.length === 0) {
      return CURATED_HOMETOWNS.slice(0, MAX_HOMETOWN_RESULTS);
    }

    const tokens = query.split(/\s+/).filter((token) => token.length > 0);
    return CURATED_HOMETOWNS.filter((hometown) => {
      const searchable = `${hometown.city} ${hometown.state} ${hometown.slug}`.toLowerCase();
      return tokens.every((token) => searchable.includes(token));
    }).slice(0, MAX_HOMETOWN_RESULTS);
  }, [hometownQuery]);

  const selectedHometown = useMemo(
    () => CURATED_HOMETOWNS.find((hometown) => hometown.slug === hometownSlug) ?? DEFAULT_HOMETOWN,
    [hometownSlug],
  );

  const draftInput: BackstoryInput = useMemo(
    () => ({
      firstName,
      lastName,
      hometownSlug,
      archetype,
      ageStarted,
      bodyFrame,
      dominantHand,
      generationSeed,
    }),
    [ageStarted, archetype, bodyFrame, dominantHand, firstName, generationSeed, hometownSlug, lastName],
  );

  const preview = useMemo(
    () => generateBackstoryFromInput(draftInput, { seedOverride: generationSeed }),
    [draftInput, generationSeed],
  );

  const canAdvanceFromName = firstName.trim().length > 0 && lastName.trim().length > 0;

  useEffect(() => {
    stepTransition.setValue(0);
    Animated.timing(stepTransition, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [step, stepTransition]);

  const stepCardStyle = {
    opacity: stepTransition,
    transform: [
      {
        translateY: stepTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  const goNext = (): void => {
    if (step === 1 && !canAdvanceFromName) {
      return;
    }
    setStep((value) => Math.min(5, value + 1));
  };

  const goBack = (): void => {
    setStep((value) => Math.max(1, value - 1));
  };

  const renderStepContent = (): JSX.Element | null => {
    if (step === 1) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 1: Player Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor="#64748b"
            className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor="#64748b"
            className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
        </Animated.View>
      );
    }

    if (step === 2) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 2: Hometown</Text>
          <TextInput
            value={hometownQuery}
            onChangeText={setHometownQuery}
            placeholder="Search city/state (e.g. tx, lewisville)"
            placeholderTextColor="#64748b"
            className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />

          <View className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Selected</Text>
            <Text className="mt-0.5 text-sm font-semibold text-white">
              {selectedHometown.city}, {selectedHometown.state} (Prestige {selectedHometown.prestige}/5)
            </Text>
          </View>

          {filteredHometowns.length > 0 ? (
            <View className="mt-3 flex-row flex-wrap justify-between">
              {filteredHometowns.map((hometown) => {
                const isSelected = hometown.slug === hometownSlug;
                return (
                  <Pressable
                    key={hometown.slug}
                    className={`mb-2 w-[48%] rounded-md border px-2 py-2 ${
                      isSelected ? "border-emerald-400 bg-emerald-400/20" : "border-slate-700 bg-slate-950"
                    }`}
                    onPress={() => setHometownSlug(hometown.slug)}
                  >
                    <Text
                      numberOfLines={1}
                      className={`text-xs font-semibold ${isSelected ? "text-emerald-200" : "text-slate-200"}`}
                    >
                      {hometown.city}, {hometown.state}
                    </Text>
                    <Text className="mt-0.5 text-[10px] text-slate-400">Prestige {hometown.prestige}/5</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3">
              <Text className="text-xs text-slate-300">No hometown matches. Try a broader query like a state abbreviation.</Text>
            </View>
          )}
        </Animated.View>
      );
    }

    if (step === 3) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 3: Build Profile</Text>
          <Text className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Archetype</Text>
          <SelectGroup options={ARCHETYPES} selected={archetype} onSelect={setArchetype} />

          <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Body Frame</Text>
          <SelectGroup options={BODY_FRAMES} selected={bodyFrame} onSelect={setBodyFrame} />

          <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Dominant Hand</Text>
          <SelectGroup options={DOMINANT_HANDS} selected={dominantHand} onSelect={setDominantHand} />
        </Animated.View>
      );
    }

    if (step === 4) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 4: Age You Started Playing</Text>
          <Text className="mt-2 text-xs text-slate-400">This determines growth curve and early starting profile.</Text>
          <View className="mt-4 flex-row items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-3 py-3">
            <Pressable
              className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2"
              onPress={() => setAgeStarted((value) => clampAgeStarted(value - 1))}
            >
              <Text className="text-sm font-semibold text-white">-</Text>
            </Pressable>
            <Text className="text-lg font-bold text-emerald-300">{ageStarted}</Text>
            <Pressable
              className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2"
              onPress={() => setAgeStarted((value) => clampAgeStarted(value + 1))}
            >
              <Text className="text-sm font-semibold text-white">+</Text>
            </Pressable>
          </View>
        </Animated.View>
      );
    }

    if (step === 5) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 5: Preview</Text>
          <Text className="mt-2 text-2xl font-bold text-white">{preview.identity.displayName}</Text>
          <Text className="mt-1 text-sm text-slate-300">
            {preview.identity.hometown.city}, {preview.identity.hometown.state} | {preview.identity.archetype}
          </Text>

          <View className="mt-4 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Traits</Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {preview.dna.publicTraits.map((trait) => (
                <View key={trait} className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1">
                  <Text className="text-xs font-semibold text-emerald-200">{trait}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-3 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Growth Range</Text>
            <Text className="mt-1 text-sm font-semibold text-slate-100">{getBackstoryGrowthOutlook(preview.dna.growthCurve)}</Text>
          </View>

          <Pressable
            className="mt-4 items-center justify-center rounded-xl border border-amber-400/70 bg-amber-400/20 py-3"
            onPress={() => setGenerationSeed(Date.now())}
          >
            <Text className="text-sm font-semibold text-amber-200">Reroll Hidden Traits</Text>
          </Pressable>

          <Pressable
            className="mt-3 items-center justify-center rounded-xl bg-emerald-500 py-4"
            onPress={() => initializeCareer({ ...draftInput, generationSeed })}
          >
            <Text className="text-base font-semibold text-black">Start Career</Text>
          </Pressable>
        </Animated.View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView contentContainerClassName="px-5 pb-8 pt-8">
        <Text className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Backstory Generator</Text>
        <Text className="mt-2 text-3xl font-bold text-white">Build Your Prospect DNA</Text>
        <StepPill current={step} total={5} />

        {renderStepContent()}

        <View className="mt-6 flex-row gap-3">
          <Pressable
            className={`flex-1 items-center justify-center rounded-xl py-3 ${step === 1 ? "bg-slate-800/50" : "bg-slate-700"}`}
            disabled={step === 1}
            onPress={goBack}
          >
            <Text className="text-sm font-semibold text-slate-100">Back</Text>
          </Pressable>
          {step < 5 ? (
            <Pressable
              className={`flex-1 items-center justify-center rounded-xl py-3 ${step === 1 && !canAdvanceFromName ? "bg-slate-700/40" : "bg-emerald-500"}`}
              onPress={goNext}
              disabled={step === 1 && !canAdvanceFromName}
            >
              <Text className={`text-sm font-semibold ${step === 1 && !canAdvanceFromName ? "text-slate-400" : "text-black"}`}>Next</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
