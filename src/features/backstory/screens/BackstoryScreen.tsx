import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { ARCHETYPE_PROFILES_BY_POSITION, getDefaultArchetypeProfile, type ArchetypeProfile } from "../../../builder/presets";
import { buildSimProjection } from "../../../builder/simProjection";
import { BuilderReviewSection, buildBuilderReviewSummary } from "../../../components/builderReview";
import { useCareerStore } from "../../../store/useCareerStore";
import type { BuildBackstoryInput, BodyFrame, DominantHand, StateOption } from "../../../types/backstory";
import type { PlayerAttributes, Position } from "../../../types/player";
import { clampHeight, clampWeight } from "../constants/bodyMapping";
import { ALL_STATES, getCitiesForState, getDefaultCityForState, getDefaultStateCode } from "../data/hometowns";
import { createBuildBackstorySeed, generateBackstoryFromBuildInput, getDefaultSecondaryPosition } from "../generator";

const POSITIONS: readonly Position[] = ["PG", "SG", "SF", "PF", "C"];
const BODY_FRAMES: readonly BodyFrame[] = ["Lean", "Athletic", "Stocky"];
const DOMINANT_HANDS: readonly DominantHand[] = ["Right", "Left"];
const MAX_HOMETOWN_RESULTS = 24;
const MAX_STATE_RESULTS = 12;
const BUILD_PRESET_SIDE_PADDING = 32;
const BUILD_PRESET_CARD_GAP = 12;
const BUILD_PRESET_PEEK_WIDTH = 36;
const BUILD_PRESET_SWIPE_TRACK_WIDTH = 132;
const BUILD_PRESET_SWIPE_THUMB_WIDTH = 38;
const MAX_BUILD_CAPS: PlayerAttributes = {
  shortRange: 99,
  dunking: 99,
  midrange: 99,
  threePoint: 99,
  handle: 99,
  passing: 99,
  vision: 99,
  perimeterDefense: 99,
  interiorDefense: 99,
  stealing: 99,
  blocking: 99,
  offRebounding: 99,
  defRebounding: 99,
  speed: 99,
  strength: 99,
  stamina: 99,
};

const clampAgeStarted = (value: number): number => Math.min(12, Math.max(4, Math.round(value)));
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

const joinLabels = (values: readonly string[]): string => values.join(", ");

const ArchetypeCard = ({
  preset,
  selected,
  projectionRole,
  onSelect,
  width,
}: {
  preset: ArchetypeProfile;
  selected: boolean;
  projectionRole: string;
  onSelect: () => void;
  width?: number;
}) => (
  <Pressable
    className={`rounded-xl border px-3 py-2.5 ${selected ? "border-emerald-400 bg-emerald-400/15" : "border-slate-700 bg-slate-950"}`}
    onPress={onSelect}
    style={width ? { width } : undefined}
  >
    <View className="flex-row items-start justify-between gap-3">
      <View className="flex-1">
        <Text className={`text-base font-bold ${selected ? "text-emerald-100" : "text-white"}`}>{preset.label}</Text>
        <Text numberOfLines={2} className="mt-1 text-xs text-slate-300">{preset.description}</Text>
      </View>
      {selected ? (
        <View className="rounded-full border border-emerald-300/50 bg-emerald-300/15 px-1 py-0.5">
          <Text className="text-[8px] font-semibold uppercase text-emerald-100">Selected</Text>
        </View>
      ) : null}
    </View>

    <View className="mt-2 gap-1.5">
      <Text className="text-[11px] text-slate-300">
        <Text className="font-semibold text-emerald-200">Strengths: </Text>
        {joinLabels(preset.strengths)}
      </Text>
      <Text className="text-[11px] text-slate-300">
        <Text className="font-semibold text-rose-200">Weaknesses: </Text>
        {joinLabels(preset.weaknesses)}
      </Text>
      <Text className="text-[11px] text-slate-300">
        <Text className="font-semibold text-cyan-200">Role: </Text>
        {projectionRole}
      </Text>
    </View>
  </Pressable>
);

export function BackstoryScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const initializeCareer = useCareerStore((state) => state.initializeCareer);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [stateQuery, setStateQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [stateCode, setStateCode] = useState<string>(getDefaultStateCode());
  const [citySlug, setCitySlug] = useState<string>(() => getDefaultCityForState(getDefaultStateCode()).slug);
  const [primaryPosition, setPrimaryPosition] = useState<Position>("PG");
  const [selectedPresetId, setSelectedPresetId] = useState(getDefaultArchetypeProfile("PG").id);
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(2);
  const [weightLbs, setWeightLbs] = useState(185);
  const [bodyFrame, setBodyFrame] = useState<BodyFrame>("Athletic");
  const [dominantHand, setDominantHand] = useState<DominantHand>("Right");
  const [ageStarted, setAgeStarted] = useState(8);
  const [buildAttributes, setBuildAttributes] = useState<PlayerAttributes>(getDefaultArchetypeProfile("PG").attributes);
  const stepTransition = useRef(new Animated.Value(1)).current;
  const buildPresetCardWidth = Math.max(260, Math.min(460, windowWidth - BUILD_PRESET_SIDE_PADDING * 2 - BUILD_PRESET_PEEK_WIDTH));
  const buildPresetSnapInterval = buildPresetCardWidth + BUILD_PRESET_CARD_GAP;

  const setClampedHeight = (nextFeet: number, nextInches: number): void => {
    const normalized = clampHeight({
      feet: clampFeet(nextFeet),
      inches: clampInches(nextInches),
    });
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

  const selectedState = useMemo(
    () => ALL_STATES.find((state) => state.code === stateCode) ?? ALL_STATES[0],
    [stateCode],
  );
  const selectedCity = useMemo(
    () => availableCities.find((city) => city.slug === citySlug) ?? availableCities[0] ?? getDefaultCityForState(getDefaultStateCode()),
    [availableCities, citySlug],
  );

  const normalizedHeight = useMemo(() => clampHeight({ feet: heightFeet, inches: heightInches }), [heightFeet, heightInches]);
  const normalizedWeight = useMemo(() => clampWeight(weightLbs), [weightLbs]);
  const selectedPreset = useMemo(
    () => ARCHETYPE_PROFILES_BY_POSITION[primaryPosition].find((preset) => preset.id === selectedPresetId) ?? getDefaultArchetypeProfile(primaryPosition),
    [primaryPosition, selectedPresetId],
  );
  const selectedBuildPresetIndex = Math.max(
    0,
    ARCHETYPE_PROFILES_BY_POSITION[primaryPosition].findIndex((preset) => preset.id === selectedPreset.id),
  );
  const buildPresetSwipeThumbOffset =
    ARCHETYPE_PROFILES_BY_POSITION[primaryPosition].length > 1
      ? (selectedBuildPresetIndex / (ARCHETYPE_PROFILES_BY_POSITION[primaryPosition].length - 1)) *
        (BUILD_PRESET_SWIPE_TRACK_WIDTH - BUILD_PRESET_SWIPE_THUMB_WIDTH)
      : 0;
  const safeSecondaryPosition = getDefaultSecondaryPosition(primaryPosition);
  const selectedRoleLabel = selectedPreset.roleLabelByPosition?.[primaryPosition] ?? selectedPreset.defaultRoleLabel;

  const selectPrimaryPosition = (position: Position): void => {
    const preset = getDefaultArchetypeProfile(position);
    setPrimaryPosition(position);
    setSelectedPresetId(preset.id);
    setBuildAttributes(preset.attributes);
  };

  const selectBuildPreset = (preset: ArchetypeProfile): void => {
    setSelectedPresetId(preset.id);
    setBuildAttributes(preset.attributes);
  };

  const selectVisibleBuildPreset = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const presets = ARCHETYPE_PROFILES_BY_POSITION[primaryPosition];
    const nextIndex = Math.min(
      presets.length - 1,
      Math.max(0, Math.round(event.nativeEvent.contentOffset.x / buildPresetSnapInterval)),
    );
    const nextPreset = presets[nextIndex];
    if (nextPreset && nextPreset.id !== selectedPresetId) {
      selectBuildPreset(nextPreset);
    }
  };

  const draftInput: BuildBackstoryInput = useMemo(
    () => ({
      firstName,
      lastName,
      stateCode,
      citySlug,
      ageStarted,
      bodyFrame,
      dominantHand,
      primaryPosition,
      secondaryPosition: safeSecondaryPosition,
      height: normalizedHeight,
      weightLbs: normalizedWeight,
      buildAttributes,
      archetypeId: selectedPreset.id,
      archetypeLabel: selectedPreset.label,
      roleLabel: selectedRoleLabel,
    }),
    [
      firstName,
      lastName,
      stateCode,
      citySlug,
      ageStarted,
      bodyFrame,
      dominantHand,
      primaryPosition,
      safeSecondaryPosition,
      normalizedHeight,
      normalizedWeight,
      buildAttributes,
      selectedPreset.id,
      selectedPreset.label,
      selectedRoleLabel,
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
        archetypeProfile: selectedPreset,
        badgesEnabled: false,
      }),
    [preview.startingAttributes, preview.dna.caps, primaryPosition, normalizedHeight, normalizedWeight, selectedPreset],
  );

  const canAdvanceFromName = firstName.trim().length > 0 && lastName.trim().length > 0;
  const canAdvanceFromLocation = stateCode.trim().length > 0 && citySlug.trim().length > 0;
  const canAdvanceFromBuild = Boolean(selectedPreset);

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
    if (step === 2 && !canAdvanceFromLocation) {
      return;
    }
    if (step === 3 && !canAdvanceFromBuild) {
      return;
    }
    setStep((value) => Math.min(5, value + 1));
  };

  const goBack = (): void => {
    setStep((value) => Math.max(1, value - 1));
  };

  const renderStepContent = (): ReactElement | null => {
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
          <Text className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">State</Text>
          <TextInput
            value={stateQuery}
            onChangeText={setStateQuery}
            placeholder="Search state (e.g. Texas or TX)"
            placeholderTextColor="#64748b"
            className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />
          <View className="mt-3 flex-row flex-wrap gap-2">
            {filteredStates.map((state) => {
              const isSelected = state.code === stateCode;
              return (
                <Pressable
                  key={state.code}
                  className={`rounded-lg border px-3 py-2 ${isSelected ? "border-emerald-400 bg-emerald-400/20" : "border-slate-700 bg-slate-950"}`}
                  onPress={() => {
                    setStateCode(state.code);
                    setCitySlug(getDefaultCityForState(state.code).slug);
                    setCityQuery("");
                  }}
                >
                  <Text className={`text-xs font-semibold ${isSelected ? "text-emerald-200" : "text-slate-200"}`}>
                    {state.name} ({state.code})
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">City ({selectedState.code})</Text>
          <TextInput
            value={cityQuery}
            onChangeText={setCityQuery}
            placeholder={`Search ${selectedState.name} cities`}
            placeholderTextColor="#64748b"
            className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white"
          />

          <View className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Selected</Text>
            <Text className="mt-0.5 text-sm font-semibold text-white">
              {selectedCity.city}, {selectedCity.stateCode}
            </Text>
          </View>

          {filteredCities.length > 0 ? (
            <View className="mt-3 flex-row flex-wrap justify-between">
              {filteredCities.map((city) => {
                const isSelected = city.slug === citySlug;
                return (
                  <Pressable
                    key={city.slug}
                    className={`mb-2 w-[48%] rounded-md border px-2 py-2 ${
                      isSelected ? "border-emerald-400 bg-emerald-400/20" : "border-slate-700 bg-slate-950"
                    }`}
                    onPress={() => setCitySlug(city.slug)}
                  >
                    <Text numberOfLines={1} className={`text-xs font-semibold ${isSelected ? "text-emerald-200" : "text-slate-200"}`}>
                      {city.city}
                    </Text>
                    <Text className="mt-0.5 text-[10px] text-slate-400">{city.stateCode}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View className="mt-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3">
              <Text className="text-xs text-slate-300">No city matches in {selectedState.name}. Try a broader query.</Text>
            </View>
          )}
        </Animated.View>
      );
    }

    if (step === 3) {
      return (
        <Animated.View style={stepCardStyle} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-sm font-semibold text-white">Step 3: Archetype</Text>
          <Text className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Primary Position</Text>
          <SelectGroup options={POSITIONS} selected={primaryPosition} onSelect={selectPrimaryPosition} />

          <View className="mt-4 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-3">
            <Text className="text-xs font-semibold text-cyan-100">Choose an archetype. Your current role still comes from the attributes you take into your career.</Text>
          </View>

          <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Archetype</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={buildPresetSnapInterval}
            snapToAlignment="start"
            onMomentumScrollEnd={selectVisibleBuildPreset}
            contentContainerStyle={{ gap: BUILD_PRESET_CARD_GAP, paddingRight: BUILD_PRESET_SIDE_PADDING }}
            className="mt-3 -mr-4"
          >
            {ARCHETYPE_PROFILES_BY_POSITION[primaryPosition].map((preset) => {
              const projection = buildSimProjection({
                attributes: preset.attributes,
                position: preset.position,
                caps: MAX_BUILD_CAPS,
                height: normalizedHeight,
                weightLbs: normalizedWeight,
                archetypeProfile: preset,
                badgesEnabled: false,
              });
              return (
                <ArchetypeCard
                  key={preset.id}
                  preset={preset}
                  selected={preset.id === selectedPreset.id}
                  projectionRole={projection.projectedRole}
                  onSelect={() => selectBuildPreset(preset)}
                  width={buildPresetCardWidth}
                />
              );
            })}
          </ScrollView>
          <View className="mt-2 flex-row items-center justify-center gap-3">
            <Text className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Swipe</Text>
            <View
              className="h-1.5 rounded-full bg-slate-700"
              style={{ width: BUILD_PRESET_SWIPE_TRACK_WIDTH }}
            >
              <View
                className="h-1.5 rounded-full bg-emerald-400"
                style={{
                  width: BUILD_PRESET_SWIPE_THUMB_WIDTH,
                  transform: [{ translateX: buildPresetSwipeThumbOffset }],
                }}
              />
            </View>
          </View>

          <Stepper
            label="Height - Feet"
            value={heightFeet}
            onDec={() => setClampedHeight(heightFeet - 1, heightInches)}
            onInc={() => setClampedHeight(heightFeet + 1, heightInches)}
          />
          <Stepper
            label="Height - Inches"
            value={heightInches}
            onDec={() => setClampedHeight(heightFeet, heightInches - 1)}
            onInc={() => setClampedHeight(heightFeet, heightInches + 1)}
          />
          <Stepper
            label="Weight (lbs)"
            value={weightLbs}
            onDec={() => setWeightLbs((value) => clampWeight(value - 1))}
            onInc={() => setWeightLbs((value) => clampWeight(value + 1))}
          />
          <Text className="mt-2 text-[11px] text-slate-400">Height range: 5'4\" to 7'1\"</Text>
          <Text className="mt-1 text-[11px] text-slate-400">Weight range: 120 to 270 lbs</Text>

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
          <Text className="text-sm font-semibold text-white">Step 4: Review Prospect Profile</Text>
          <Text className="mt-2 text-xs text-slate-400">Review your position, archetype, role, and current-level projection.</Text>
          <View className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Archetype</Text>
            <Text className="mt-1 text-lg font-bold text-white">{selectedPreset.label}</Text>
            <Text className="mt-1 text-xs text-slate-200">{selectedPreset.tradeoffNote}</Text>
          </View>

          <BuilderReviewSection
            summary={previewBuilderReview}
            projection={buildProjection}
            variant="slate"
            className="mt-4"
            title="Current-Level Sim Projection"
            showBadges={false}
          />

          <Text className="mt-4 text-xs text-slate-400">Age started determines growth curve and early starting profile. Range: 4 to 12.</Text>
          <View className="mt-4 flex-row items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-3 py-3">
            <Pressable className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2" onPress={() => setAgeStarted((value) => clampAgeStarted(value - 1))}>
              <Text className="text-sm font-semibold text-white">-</Text>
            </Pressable>
            <Text className="text-lg font-bold text-emerald-300">{ageStarted}</Text>
            <Pressable className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2" onPress={() => setAgeStarted((value) => clampAgeStarted(value + 1))}>
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
            {preview.identity.hometown.city}, {preview.identity.hometown.state} | {preview.identity.primaryPosition}
          </Text>
          <Text className="mt-1 text-sm text-slate-300">
            {preview.identity.height.feet}'{preview.identity.height.inches}\" • {preview.identity.weightLbs} lbs
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

          <BuilderReviewSection
            summary={previewBuilderReview}
            projection={buildProjection}
            variant="slate"
            className="mt-3"
            title="Current-Level Sim Projection"
            showBadges={false}
          />

          <Pressable
            className="mt-3 items-center justify-center rounded-xl bg-emerald-500 py-4"
            onPress={() => initializeCareer({ ...draftInput, generationSeed: previewSeed })}
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
        <Text className="mt-2 text-3xl font-bold text-white">Create Your Prospect DNA</Text>
        <StepPill current={step} total={5} />

        {renderStepContent()}

        <View className="mt-6 flex-row gap-3">
          <Pressable className={`flex-1 items-center justify-center rounded-xl py-3 ${step === 1 ? "bg-slate-800/50" : "bg-slate-700"}`} disabled={step === 1} onPress={goBack}>
            <Text className="text-sm font-semibold text-slate-100">Back</Text>
          </Pressable>
          {step < 5 ? (
            <Pressable
              className={`flex-1 items-center justify-center rounded-xl py-3 ${(step === 1 && !canAdvanceFromName) || (step === 2 && !canAdvanceFromLocation) || (step === 3 && !canAdvanceFromBuild) ? "bg-slate-700/40" : "bg-emerald-500"}`}
              onPress={goNext}
              disabled={(step === 1 && !canAdvanceFromName) || (step === 2 && !canAdvanceFromLocation) || (step === 3 && !canAdvanceFromBuild)}
            >
              <Text className={`text-sm font-semibold ${(step === 1 && !canAdvanceFromName) || (step === 2 && !canAdvanceFromLocation) || (step === 3 && !canAdvanceFromBuild) ? "text-slate-400" : "text-black"}`}>Next</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
