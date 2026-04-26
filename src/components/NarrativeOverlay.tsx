import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, Text, View } from "react-native";
import { InkManager, type InkStoryState, loadNarrativeInkManager } from "../narrative/inkManager";
import { useCareerStore } from "../store/useCareerStore";

const EMPTY_STORY_STATE: InkStoryState = {
  lines: [],
  tags: [],
  choices: [],
  canContinue: false,
};

const hasSceneCompleteTag = (tags: string[]): boolean =>
  tags.some((tag) => tag.trim().toUpperCase() === "SCENE_COMPLETE");

export function NarrativeOverlay() {
  const currentNarrativeFile = useCareerStore((state) => state.currentNarrativeFile);
  const completeNarrativeEvent = useCareerStore((state) => state.completeNarrativeEvent);
  const closeNarrative = useCareerStore((state) => state.closeNarrative);
  const [storyState, setStoryState] = useState<InkStoryState>(EMPTY_STORY_STATE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manager, setManager] = useState<InkManager | null>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const panelTranslateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(panelTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [overlayOpacity, panelTranslateY]);

  useEffect(() => {
    const fileName = currentNarrativeFile.trim();
    if (fileName.length === 0) {
      // Empty file name means the narrative flow is closing/resetting, not an error.
      setManager(null);
      setErrorMessage(null);
      setStoryState(EMPTY_STORY_STATE);
      return;
    }

    try {
      setManager(loadNarrativeInkManager(fileName));
      setErrorMessage(null);
    } catch (error) {
      setManager(null);
      setErrorMessage((error as Error).message);
    }
  }, [currentNarrativeFile]);

  useEffect(() => {
    if (!manager) {
      setStoryState(EMPTY_STORY_STATE);
      return;
    }

    const nextState = manager.continueStory();
    setStoryState(nextState);

    if (hasSceneCompleteTag(nextState.tags)) {
      completeNarrativeEvent();
    }
  }, [completeNarrativeEvent, manager]);

  const handleChoicePress = (choiceIndex: number): void => {
    if (!manager) {
      return;
    }

    const nextState = manager.chooseOption(choiceIndex);
    setStoryState(nextState);

    if (hasSceneCompleteTag(nextState.tags)) {
      completeNarrativeEvent();
    }
  };

  if (errorMessage) {
    return (
      <Animated.View style={{ opacity: overlayOpacity }} className="absolute inset-0 items-center justify-center bg-black/80 px-6">
        <View className="w-full max-w-xl rounded-2xl border border-red-900 bg-red-950/90 p-5">
          <Text className="text-base font-bold text-red-100">Narrative Error</Text>
          <Text className="mt-2 text-sm text-red-200">{errorMessage}</Text>
          <Pressable
            className="mt-4 items-center justify-center rounded-lg border border-red-800 bg-red-900/80 px-4 py-3"
            onPress={closeNarrative}
          >
            <Text className="text-sm font-semibold text-red-100">Close Scene</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity: overlayOpacity }} className="absolute inset-0 items-center justify-center bg-black/75 px-5">
      <Animated.View
        style={{ transform: [{ translateY: panelTranslateY }] }}
        className="w-full max-w-xl rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-5"
      >
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xs font-semibold uppercase tracking-widest text-premium-accent">Narrative</Text>
          <Pressable className="rounded-md border border-premium-surfaceAlt bg-premium-bg px-3 py-2" onPress={closeNarrative}>
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-200">Close</Text>
          </Pressable>
        </View>

        <ScrollView className="max-h-72">
          {storyState.lines.map((line, index) => (
            <Text key={`${line}-${index}`} className="mb-3 text-base leading-6 text-slate-100">
              {line}
            </Text>
          ))}
        </ScrollView>

        <View className="mt-4 gap-3">
          {storyState.choices.map((choice) => (
            <Pressable
              key={`${choice.index}-${choice.text}`}
              className="rounded-xl border border-premium-surfaceAlt bg-premium-bg px-4 py-4"
              onPress={() => handleChoicePress(choice.index)}
            >
              <Text className="text-center text-base font-semibold text-premium-accent">{choice.text}</Text>
            </Pressable>
          ))}

          {storyState.choices.length === 0 ? (
            <Pressable
              className="rounded-xl border border-premium-surfaceAlt bg-premium-bg px-4 py-4"
              onPress={closeNarrative}
            >
              <Text className="text-center text-base font-semibold text-slate-100">Return to Hub</Text>
            </Pressable>
          ) : null}
        </View>
      </Animated.View>
    </Animated.View>
  );
}
