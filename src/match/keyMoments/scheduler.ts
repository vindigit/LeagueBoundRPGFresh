import { KEY_MOMENT_BASELINE_QUALITY, KEY_MOMENT_TEMPLATES } from "./catalog";
import type {
  KeyMomentPending,
  KeyMomentScheduler,
  KeyMomentSchedulerInput,
  KeyMomentSchedulerOutput,
  KeyMomentTemplate,
  PeriodKey,
} from "./types";

interface SchedulerState {
  triggeredCount: number;
  lastTriggeredPossessionIndex: number;
  windowIndexReached: number;
}

export interface KeyMomentSchedulerConfig {
  targetPerPeriod?: number;
  cooldownPossessions?: number;
}

const DEFAULT_TARGET_PER_PERIOD = 6;
const DEFAULT_COOLDOWN_POSSESSIONS = 1;

const createPending = (template: KeyMomentTemplate, input: KeyMomentSchedulerInput): KeyMomentPending => ({
  id: `${template.id}-${input.context.periodKey}-${input.context.possessionIndex}`,
  context: input.context,
  scenario: template.scenario,
  promptText: template.promptText,
  mode: template.mode,
  options: template.options,
  minigame: template.minigame,
  simBaselineQuality: KEY_MOMENT_BASELINE_QUALITY,
});

const getCurrentWindow = (
  contextSecondsRemaining: number,
  periodTotalSeconds: number,
  targetPerPeriod: number,
): number => {
  const elapsed = Math.max(0, periodTotalSeconds - contextSecondsRemaining);
  const windowSize = periodTotalSeconds / targetPerPeriod;
  const window = Math.floor(elapsed / Math.max(1, windowSize));
  return Math.min(targetPerPeriod - 1, Math.max(0, window));
};

const getPeriodState = (
  store: Map<PeriodKey, SchedulerState>,
  periodKey: PeriodKey,
): SchedulerState => {
  const existing = store.get(periodKey);
  if (existing) {
    return existing;
  }
  const next: SchedulerState = {
    triggeredCount: 0,
    lastTriggeredPossessionIndex: -999,
    windowIndexReached: -1,
  };
  store.set(periodKey, next);
  return next;
};

export const createKeyMomentScheduler = (config: KeyMomentSchedulerConfig = {}): KeyMomentScheduler => {
  const periodState = new Map<PeriodKey, SchedulerState>();
  const targetPerPeriod = config.targetPerPeriod ?? DEFAULT_TARGET_PER_PERIOD;
  const cooldownPossessions = config.cooldownPossessions ?? DEFAULT_COOLDOWN_POSSESSIONS;

  const pickContextualTemplate = (input: KeyMomentSchedulerInput, currentWindow: number): KeyMomentTemplate => {
    const eligibleTemplates =
      input.context.offense === "home"
        ? KEY_MOMENT_TEMPLATES.filter((template) => template.scenario === "offense_shot" || template.scenario === "offense_choice")
        : KEY_MOMENT_TEMPLATES.filter((template) => template.scenario === "defense_choice");
    const pool = eligibleTemplates.length > 0 ? eligibleTemplates : KEY_MOMENT_TEMPLATES;
    const index = Math.abs(Math.floor(input.context.possessionIndex + currentWindow)) % pool.length;
    return pool[index];
  };

  const onPossessionBoundary = (input: KeyMomentSchedulerInput): KeyMomentSchedulerOutput => {
    const state = getPeriodState(periodState, input.context.periodKey);
    if (state.triggeredCount >= targetPerPeriod) {
      return { trigger: false };
    }

    const currentWindow = getCurrentWindow(
      input.context.timeRemaining,
      input.periodTotalSeconds,
      targetPerPeriod,
    );
    state.windowIndexReached = Math.max(state.windowIndexReached, currentWindow);

    const possessionsSinceLast = input.context.possessionIndex - state.lastTriggeredPossessionIndex;
    const cooldownPassed = possessionsSinceLast > cooldownPossessions;
    const shouldPaceTrigger = cooldownPassed && currentWindow >= state.triggeredCount;

    const remainingBudget = targetPerPeriod - state.triggeredCount;
    const remainingWindows = targetPerPeriod - (currentWindow + 1);
    const mustTriggerToGuarantee = cooldownPassed && remainingWindows < remainingBudget;

    if (!shouldPaceTrigger && !mustTriggerToGuarantee) {
      return { trigger: false };
    }

    state.triggeredCount += 1;
    state.lastTriggeredPossessionIndex = input.context.possessionIndex;

    const template = pickContextualTemplate(input, currentWindow);
    const pending = createPending(template, input);
    return { trigger: true, pending };
  };

  return {
    reset: () => {
      periodState.clear();
    },
    onPossessionBoundary,
  };
};
