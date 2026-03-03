import type { MatchScore, MatchContext, PossessionResult } from "../../matchEngine";

export type PeriodKey = "Q1" | "Q2" | "Q3" | "Q4" | `OT${number}`;

export interface KeyMomentContext {
  id: string;
  periodKey: PeriodKey;
  quarter: 1 | 2 | 3 | 4;
  overtimePeriod?: number;
  timeRemaining: number;
  offense: "home" | "away";
  defense: "home" | "away";
  userTeam: "home" | "away";
  userPlayerIndex: number;
  possessionIndex: number;
  score: MatchScore;
}

export interface KeyMomentOption {
  id: string;
  label: string;
  description: string;
  qualityDelta: number;
}

export interface MinigameSpec {
  type: "aim_shot_placement" | "timing_release";
  durationMs: number;
  targetCenter: number;
  targetRadius: number;
}

export interface KeyMomentPending {
  id: string;
  context: KeyMomentContext;
  scenario: "offense_shot" | "offense_choice" | "defense_choice";
  promptText: string;
  mode: "choice" | "minigame";
  options?: KeyMomentOption[];
  minigame?: MinigameSpec;
  simBaselineQuality: number;
  autoResolveAt?: number;
}

export interface KeyMomentResolutionInput {
  pendingId: string;
  choiceId?: string;
  minigameQuality?: number;
  usedFallbackBaseline?: boolean;
}

export interface KeyMomentResolutionOutput {
  quality: number;
  success: boolean;
  resultSummaryText: string;
  result: PossessionResult;
  outcomeText?: string;
  isUserAction: true;
}

export interface KeyMomentSchedulerInput {
  context: KeyMomentContext;
  periodTotalSeconds: number;
}

export interface KeyMomentSchedulerOutput {
  trigger: boolean;
  pending?: KeyMomentPending;
}

export interface KeyMomentScheduler {
  reset(): void;
  onPossessionBoundary(input: KeyMomentSchedulerInput): KeyMomentSchedulerOutput;
}

export interface KeyMomentTemplate {
  id: string;
  scenario: KeyMomentPending["scenario"];
  mode: KeyMomentPending["mode"];
  promptText: string;
  options?: KeyMomentOption[];
  minigame?: MinigameSpec;
}

export interface KeyMomentResolveArgs {
  pending: KeyMomentPending;
  input: KeyMomentResolutionInput;
  context: MatchContext;
  possessionState: {
    offenseKey: "home" | "away";
    defenseKey: "home" | "away";
    secondsRemaining: number;
    possessionIndex: number;
    score: MatchScore;
    homeStreak: number;
    awayStreak: number;
  };
}
