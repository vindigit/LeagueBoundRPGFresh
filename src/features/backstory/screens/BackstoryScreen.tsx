import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { Animated, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import {
  BASE_PUBLIC_ATTRIBUTES,
  PUBLIC_ATTRIBUTE_BUDGET,
  PUBLIC_ATTRIBUTE_KEYS,
  PUBLIC_ATTRIBUTE_MAX,
  PUBLIC_ATTRIBUTE_MIN,
  STARTING_ARCHETYPES,
  applyPublicAllocation,
  applyStartingArchetypeBonuses,
  deriveEngineRatings,
  getExpectedKeyMoments,
  getPlaystyleLabel,
  type PublicAttributeKey,
  type PublicAttributes,
  type StartingArchetype,
  type StartingArchetypeId,
} from "../../../builder/publicAttributes";
import { buildSimProjection } from "../../../builder/simProjection";
import { BuilderReviewSection, buildBuilderReviewSummary } from "../../../components/builderReview";
import { useCareerStore } from "../../../store/useCareerStore";
import type { BuildBackstoryInput, BodyFrame, DominantHand, StateOption } from "../../../types/backstory";
import type { Position } from "../../../types/player";
import { clampHeight, clampWeight } from "../constants/bodyMapping";
import { ALL_STATES, getCitiesForState, getDefaultCityForState, getDefaultStateCode } from "../data/hometowns";
import { createBuildBackstorySeed, generateBackstoryFromBuildInput, getDefaultSecondaryPosition } from "../generator";

const POSITIONS: readonly Position[] = ["PG", "SG", "SF", "PF", "C"];
const BODY_FRAMES: readonly BodyFrame[] = ["Lean", "Athletic", "Stocky"];
const DOMINANT_HANDS: readonly DominantHand[] = ["Right", "Left"];
const MAX_HOMETOWN_RESULTS = 16;
const MAX_STATE_RESULTS = 10;

const ATTRIBUTE_LABELS: Record<PublicAttributeKey, string> = {
  shooting: "Shooting",
  finishing: "Finishing",
  playmaking: "Playmaking",
  defending: "Defending",
  rebounding: "Rebounding",
  athleticism: "Athleticism",
  stamina: "Stamina",
};

const ATTRIBUTE_HELP_COPY: Record<PublicAttributeKey, string> = {
  shooting: "Affects jumpers and shot consistency.",
  finishing: "Affects layups, dunks, and scoring through contact.",
  playmaking: "Affects ball handling, passing, and creating looks.",
  defending: "Affects contests, stops, steals, and blocks.",
  rebounding: "Affects securing misses on both ends.",
  athleticism: "Affects burst, movement, and physical tools.",
  stamina: "Affects fatigue and how long you stay effective.",
};

const clampFeet = (value: number): number => Math.min(7, Math.max(5, Math.round(value)));
const clampInches = (value: number): number => Math.min(11, Math.max(0, Math.round(value)));

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

const Stepper = ({
  label,
  value,
  onDec,
  onInc,
}: {
  label: string;
  value: string | number;
  onDec: () => void;
  onInc: () => void;
}) => (
  <View className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3">
    <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</Text>
    <View className="mt-2 flex-row items-center justify-between">
      <Pressable className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2" onPress={onDec}>
        <Text className="text-sm font-semibold text-white">-</Text>
      </Pressable>
      <Text className="text-lg font-bold text-emerald-300">{value}</Text>
      <Pressable className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2" onPress={onInc}>
        <Text className="text-sm font-semibold text-white">+</Text>
      </Pressable>
    </View>
  </View>
);

const ArchetypeCard = ({
  archetype,
  selected,
  onSelect,
}: {
  archetype: StartingArchetype;
  selected: boolean;
  onSelect: () => void;
}) => (
  <Pressable
    className={`rounded-lg border px-3 py-3 ${selected ? "border-emerald-400 bg-emerald-400/15" : "border-slate-700 bg-slate-950"}`}
    onPress={onSelect}
  >
    <View className="flex-row items-start justify-between gap-3">
      <View className="flex-1">
        <Text className={`text-base font-bold ${selected ? "text-emerald-100" : "text-white"}`}>{archetype.label}</Text>
        <Text className="mt-1 text-xs text-slate-300">{archetype.expectations.coach}</Text>
      </View>
      {selected ? (
        <View className="rounded-full border border-emerald-300/50 bg-emerald-300/15 px-2 py-0.5">
          <Text className="text-[9px] font-semibold uppercase text-emerald-100">Selected</Text>
        </View>
      ) : null}
    </View>
    <Text className="mt-2 text-[11px] text-slate-300">
      <Text className="font-semibold text-emerald-200">Focus: </Text>
      {archetype.primaryAttributes.map((key) => ATTRIBUTE_LABELS[key]).join(", ")}
    </Text>
    {archetype.weakAttributes.length > 0 ? (
      <Text className="mt-1 text-[11px] text-slate-300">
        <Text className="font-semibold text-rose-200">Tradeoffs: </Text>
        {archetype.weakAttributes.map((key) => ATTRIBUTE_LABELS[key]).join(", ")}
      </Text>
    ) : null}
  </Pressable>
);

const getSpentPoints = (attributes: PublicAttributes): number =>
  PUBLIC_ATTRIBUTE_KEYS.reduce((sum, key) => sum + Math.max(0, attributes[key] - BASE_PUBLIC_ATTRIBUTES[key]), 0);

export function BackstoryScreen() {
  const initializeCareer = useCareerStore((state) => state.initializeCareer);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [stateQuery, setStateQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [stateCode, setStateCode] = useState<string>(getDefaultStateCode());
  const [citySlug, setCitySlug] = useState<string>(() => getDefaultCityForState(getDefaultStateCode()).slug);
  const [primaryPosition, setPrimaryPosition] = useState<Position>("PG");
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(2);
  const [weightLbs, setWeightLbs] = useState(185);
  const [bodyFrame, setBodyFrame] = useState<BodyFrame>("Athletic");
  const [dominantHand, setDominantHand] = useState<DominantHand>("Right");
  const [startingArchetypeId, setStartingArchetypeId] = useState<StartingArchetypeId>("all_around");
  const [publicAttributes, setPublicAttributes] = useState<PublicAttributes>(BASE_PUBLIC_ATTRIBUTES);
  const [activeAttributeHelp, setActiveAttributeHelp] = useState<PublicAttributeKey | null>(null);
  const stepTransition = useRef(new Animated.Value(1)).current;

  const setClampedHeight = (nextFeet: number, nextInches: number): void => {
    const normalized = clampHeight({ feet: clampFeet(nextFeet), inches: clampInches(nextInches) });
    setHeightFeet(normalized.feet);
    setHeightInches(normalized.inches);
  };

  const availableCities = useMemo(() => getCitiesForState(stateCode), [stateCode]);
  const filteredStates = useMemo((): readonly StateOption[] => {
    const query = stateQuery.trim().toLowerCase();
    if (query.length === 0) {
      return ALL_STATES.slice(0, MAX_STATE_RESULTS);
    }
    const tokens = query.split(/\s+/).filter((token) => token.length > 0);
    return ALL_STATES.filter((state) => {
      const searchable = `${state.name} ${state.code}`.toLowerCase();
      return tokens.every((token) => searchable.includes(token));
    }).slice(0, MAX_STATE_RESULTS);
  }, [stateQuery]);
  const filteredCities = useMemo(() => {
    const query = cityQuery.trim().toLowerCase();
    if (query.length === 0) {
      return availableCities.slice(0, MAX_HOMETOWN_RESULTS);
    }
    const tokens = query.split(/\s+/).filter((token) => token.length > 0);
    return availableCities.filter((city) => {
      const searchable = `${city.city} ${city.state} ${city.slug}`.toLowerCase();
      return tokens.every((token) => searchable.includes(token));
    }).slice(0, MAX_HOMETOWN_RESULTS);
  }, [availableCities, cityQuery]);

  const selectedState = useMemo(() => ALL_STATES.find((state) => state.code === stateCode) ?? ALL_STATES[0], [stateCode]);
  const selectedCity = useMemo(
    () => availableCities.find((city) => city.slug === citySlug) ?? availableCities[0] ?? getDefaultCityForState(getDefaultStateCode()),
    [availableCities, citySlug],
  );
  const normalizedHeight = useMemo(() => clampHeight({ feet: heightFeet, inches: heightInches }), [heightFeet, heightInches]);
  const normalizedWeight = useMemo(() => clampWeight(weightLbs), [weightLbs]);
  const safeSecondaryPosition = getDefaultSecondaryPosition(primaryPosition);
  const previewPublicAttributes = useMemo(
    () => applyStartingArchetypeBonuses(publicAttributes, startingArchetypeId),
    [publicAttributes, startingArchetypeId],
  );
  const engineAttributes = useMemo(
    () =>
      deriveEngineRatings({
        publicAttributes,
        startingArchetypeId,
        position: primaryPosition,
        height: normalizedHeight,
        weightLbs: normalizedWeight,
        bodyFrame,
      }),
    [publicAttributes, startingArchetypeId, primaryPosition, normalizedHeight, normalizedWeight, bodyFrame],
  );
  const playstyle = useMemo(
    () => getPlaystyleLabel(previewPublicAttributes, primaryPosition, startingArchetypeId),
    [previewPublicAttributes, primaryPosition, startingArchetypeId],
  );
  const expectedKeyMoments = useMemo(() => getExpectedKeyMoments(startingArchetypeId), [startingArchetypeId]);
  const spentPoints = useMemo(() => getSpentPoints(publicAttributes), [publicAttributes]);
  const remainingPoints = PUBLIC_ATTRIBUTE_BUDGET - spentPoints;

  const draftInput: BuildBackstoryInput = useMemo(
    () => ({
      firstName,
      lastName,
      stateCode,
      citySlug,
      ageStarted: 8,
      basketballBackground: "BALANCED_PATH",
      bodyFrame,
      dominantHand,
      primaryPosition,
      secondaryPosition: safeSecondaryPosition,
      height: normalizedHeight,
      weightLbs: normalizedWeight,
      publicAttributes,
      buildAttributes: engineAttributes,
      startingArchetypeId,
      archetypeId: startingArchetypeId,
      archetypeLabel: STARTING_ARCHETYPES.find((archetype) => archetype.id === startingArchetypeId)?.label,
      roleLabel: playstyle,
    }),
    [
      firstName,
      lastName,
      stateCode,
      citySlug,
      bodyFrame,
      dominantHand,
      primaryPosition,
      safeSecondaryPosition,
      normalizedHeight,
      normalizedWeight,
      publicAttributes,
      engineAttributes,
      startingArchetypeId,
      playstyle,
    ],
  );

  const previewSeed = useMemo(() => createBuildBackstorySeed(draftInput), [draftInput]);
  const preview = useMemo(() => generateBackstoryFromBuildInput(draftInput, { seedOverride: previewSeed }), [draftInput, previewSeed]);
  const previewBuilderReview = useMemo(() => buildBuilderReviewSummary(preview.dna), [preview.dna]);
  const buildProjection = useMemo(
    () =>
      buildSimProjection({
        attributes: preview.startingAttributes,
        position: primaryPosition,
        caps: preview.dna.caps,
        height: normalizedHeight,
        weightLbs: normalizedWeight,
        badgesEnabled: false,
      }),
    [preview.startingAttributes, preview.dna.caps, primaryPosition, normalizedHeight, normalizedWeight],
  );

  const canAdvanceFromName = firstName.trim().length > 0 && lastName.trim().length > 0 && stateCode.trim().length > 0 && citySlug.trim().length > 0;

  useEffect(() => {
    stepTransition.setValue(0);
    Animated.timing(stepTransition, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [step, stepTransition]);

  useEffect(() => {
    if (step !== 4) {
      setActiveAttributeHelp(null);
    }
  }, [step]);

  const stepCardStyle = {
    opacity: stepTransition,
    transform: [{ translateY: stepTransition.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  };

  const changePublicAttribute = (key: PublicAttributeKey, delta: number): void => {
    const result = applyPublicAllocation(publicAttributes, { [key]: delta }, remainingPoints);
    if (result.success) {
      setPublicAttributes(result.attributes);
    }
  };

  const goNext = (): void => {
    if (step === 1 && !canAdvanceFromName) {
      return;
    }
    setStep((value) => Math.min(5, value + 1));
  };

  const goBack = (): void => setStep((value) => Math.max(1, value - 1));

  const renderStepContent = (): ReactElement | null => {
    if (step === 1) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 1: Name + Hometown</Text>
          <TextInput value={firstName} onChangeText={setFirstName} placeholder="First name" placeholderTextColor="#64748b" className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
          <TextInput value={lastName} onChangeText={setLastName} placeholder="Last name" placeholderTextColor="#64748b" className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
          <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">State</Text>
          <TextInput value={stateQuery} onChangeText={setStateQuery} placeholder="Search state" placeholderTextColor="#64748b" className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
          <View className="mt-3 flex-row flex-wrap gap-2">
            {filteredStates.map((state) => {
              const isSelected = state.code === stateCode;
              return (
                <Pressable key={state.code} className={`rounded-lg border px-3 py-2 ${isSelected ? "border-emerald-400 bg-emerald-400/20" : "border-slate-700 bg-slate-950"}`} onPress={() => {
                  setStateCode(state.code);
                  setCitySlug(getDefaultCityForState(state.code).slug);
                  setCityQuery("");
                }}>
                  <Text className={`text-xs font-semibold ${isSelected ? "text-emerald-200" : "text-slate-200"}`}>{state.name} ({state.code})</Text>
                </Pressable>
              );
            })}
          </View>
          <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">City ({selectedState.code})</Text>
          <TextInput value={cityQuery} onChangeText={setCityQuery} placeholder={`Search ${selectedState.name} cities`} placeholderTextColor="#64748b" className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
          <View className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Selected</Text>
            <Text className="mt-0.5 text-sm font-semibold text-white">{selectedCity.city}, {selectedCity.stateCode}</Text>
          </View>
          <View className="mt-3 flex-row flex-wrap justify-between">
            {filteredCities.map((city) => {
              const isSelected = city.slug === citySlug;
              return (
                <Pressable key={city.slug} className={`mb-2 w-[48%] rounded-md border px-2 py-2 ${isSelected ? "border-emerald-400 bg-emerald-400/20" : "border-slate-700 bg-slate-950"}`} onPress={() => setCitySlug(city.slug)}>
                  <Text numberOfLines={1} className={`text-xs font-semibold ${isSelected ? "text-emerald-200" : "text-slate-200"}`}>{city.city}</Text>
                  <Text className="mt-0.5 text-[10px] text-slate-400">{city.stateCode}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      );
    }

    if (step === 2) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 2: Position + Body</Text>
          <Text className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Position</Text>
          <SelectGroup options={POSITIONS} selected={primaryPosition} onSelect={setPrimaryPosition} />
          <Stepper label="Height - Feet" value={heightFeet} onDec={() => setClampedHeight(heightFeet - 1, heightInches)} onInc={() => setClampedHeight(heightFeet + 1, heightInches)} />
          <Stepper label="Height - Inches" value={heightInches} onDec={() => setClampedHeight(heightFeet, heightInches - 1)} onInc={() => setClampedHeight(heightFeet, heightInches + 1)} />
          <Stepper label="Weight (lbs)" value={weightLbs} onDec={() => setWeightLbs((value) => clampWeight(value - 1))} onInc={() => setWeightLbs((value) => clampWeight(value + 1))} />
          <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Body Frame</Text>
          <SelectGroup options={BODY_FRAMES} selected={bodyFrame} onSelect={setBodyFrame} />
          <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Dominant Hand</Text>
          <SelectGroup options={DOMINANT_HANDS} selected={dominantHand} onSelect={setDominantHand} />
        </Animated.View>
      );
    }

    if (step === 3) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 3: Starting Archetype</Text>
          <View className="mt-3 gap-2">
            {STARTING_ARCHETYPES.map((archetype) => (
              <ArchetypeCard key={archetype.id} archetype={archetype} selected={archetype.id === startingArchetypeId} onSelect={() => setStartingArchetypeId(archetype.id)} />
            ))}
          </View>
        </Animated.View>
      );
    }

    if (step === 4) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 4: Allocate Attributes</Text>
          <Text className="mt-2 text-xs text-slate-400">{remainingPoints} points remaining</Text>
          <View className="mt-4 gap-3">
            {PUBLIC_ATTRIBUTE_KEYS.map((key) => {
              const value = publicAttributes[key];
              const canDecrease = value > PUBLIC_ATTRIBUTE_MIN;
              const canIncrease = value < PUBLIC_ATTRIBUTE_MAX && remainingPoints > 0;
              return (
                <View key={key} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-3">
                  <View className="flex-row items-center justify-between">
                    <View className="mr-3 flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-white">{ATTRIBUTE_LABELS[key]}</Text>
                        <Pressable
                          accessibilityLabel={`Explain ${ATTRIBUTE_LABELS[key]}`}
                          accessibilityRole="button"
                          className="h-6 w-6 items-center justify-center rounded-full border border-slate-600 bg-slate-800"
                          hitSlop={8}
                          onPress={() => setActiveAttributeHelp(key)}
                          testID={`attribute-help-${key}`}
                        >
                          <Text className="text-xs font-bold text-emerald-200">i</Text>
                        </Pressable>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <Pressable disabled={!canDecrease} className={`rounded-md border px-3 py-2 ${canDecrease ? "border-slate-600 bg-slate-800" : "border-slate-800 bg-slate-900"}`} onPress={() => changePublicAttribute(key, -1)}>
                        <Text className="text-sm font-semibold text-white">-</Text>
                      </Pressable>
                      <Text className="w-8 text-center text-lg font-bold text-emerald-300">{previewPublicAttributes[key]}</Text>
                      <Pressable disabled={!canIncrease} className={`rounded-md border px-3 py-2 ${canIncrease ? "border-slate-600 bg-slate-800" : "border-slate-800 bg-slate-900"}`} onPress={() => changePublicAttribute(key, 1)}>
                        <Text className="text-sm font-semibold text-white">+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      );
    }

    if (step === 5) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 5: Preview</Text>
          <Text className="mt-2 text-2xl font-bold text-white">{preview.identity.displayName}</Text>
          <Text className="mt-1 text-sm text-slate-300">{preview.identity.hometown.city}, {preview.identity.hometown.state} | {preview.identity.primaryPosition}</Text>
          <Text className="mt-1 text-sm text-slate-300">{preview.identity.height.feet}'{preview.identity.height.inches}\" • {preview.identity.weightLbs} lbs</Text>
          <View className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-3">
            <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Playstyle</Text>
            <Text className="mt-1 text-lg font-bold text-white">{preview.dna.currentPlaystyle ?? playstyle}</Text>
            <Text className="mt-1 text-sm font-semibold text-slate-100">{preview.dna.fuzzyScoutingSummary}</Text>
          </View>
          <View className="mt-3 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Expected Key Moments</Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {expectedKeyMoments.map((moment) => (
                <View key={moment} className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1">
                  <Text className="text-xs font-semibold text-cyan-100">{moment.replace(/-/g, " ")}</Text>
                </View>
              ))}
            </View>
          </View>
          <BuilderReviewSection summary={previewBuilderReview} projection={buildProjection} variant="slate" className="mt-3" title="Current-Level Sim Projection" showBadges={false} />
          <Pressable className="mt-3 items-center justify-center rounded-xl bg-emerald-500 py-4" onPress={() => initializeCareer({ ...draftInput, generationSeed: previewSeed })}>
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
        <Text className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Player Builder</Text>
        <Text className="mt-2 text-3xl font-bold text-white">Create Your Player</Text>
        <StepPill current={step} total={5} />
        {renderStepContent()}
        <View className="mt-6 flex-row gap-3">
          <Pressable className={`flex-1 items-center justify-center rounded-xl py-3 ${step === 1 ? "bg-slate-800/50" : "bg-slate-700"}`} disabled={step === 1} onPress={goBack}>
            <Text className="text-sm font-semibold text-slate-100">Back</Text>
          </Pressable>
          {step < 5 ? (
            <Pressable className={`flex-1 items-center justify-center rounded-xl py-3 ${step === 1 && !canAdvanceFromName ? "bg-slate-700/40" : "bg-emerald-500"}`} onPress={goNext} disabled={step === 1 && !canAdvanceFromName}>
              <Text className={`text-sm font-semibold ${step === 1 && !canAdvanceFromName ? "text-slate-400" : "text-black"}`}>Next</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
      <Modal
        transparent
        visible={activeAttributeHelp !== null}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setActiveAttributeHelp(null)}
        testID="attribute-help-modal"
      >
        <Pressable className="flex-1 items-center justify-center bg-black/80 px-6" onPress={() => setActiveAttributeHelp(null)}>
          <Pressable
            accessibilityViewIsModal
            className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5"
            onPress={(event) => event.stopPropagation()}
          >
            {activeAttributeHelp ? (
              <>
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Attribute Info</Text>
                    <Text className="mt-2 text-lg font-bold text-white">{ATTRIBUTE_LABELS[activeAttributeHelp]}</Text>
                  </View>
                  <Pressable
                    accessibilityLabel="Close attribute explanation"
                    accessibilityRole="button"
                    className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1"
                    onPress={() => setActiveAttributeHelp(null)}
                  >
                    <Text className="text-sm font-semibold text-white">Close</Text>
                  </Pressable>
                </View>
                <Text className="mt-3 text-sm leading-5 text-slate-200">{ATTRIBUTE_HELP_COPY[activeAttributeHelp]}</Text>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
