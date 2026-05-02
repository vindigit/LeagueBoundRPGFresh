import type { MatchScore, MatchContext, MatchFocus, MatchWorkRate, PossessionResult, PossessionState, UserMatchState } from "../../matchEngine";
import type { MatchConsequence } from "../../types/careerProgression";

export type PeriodKey = "Q1" | "Q2" | "Q3" | "Q4" | `OT${number}`;
export type KeyMomentType = "create_shot" | "make_the_read" | "on_ball_stop" | "jump_lane" | "foul_pressure";

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
  workRate: MatchWorkRate;
  focus: MatchFocus;
  fatigue: number;
}

export interface KeyMomentOption {
  id: string;
  label: string;
  description: string;
  qualityDelta: number;
}

export interface MinigameSpec {
  type: "aim_shot_placement" | "timing_release" | "steal_reaction";
  durationMs: number;
  targetCenter: number;
  targetRadius: number;
}

export interface KeyMomentExecutionQuality {
  normalizedScore: number;
  source: "minigame" | "sim_it" | "choice";
}

export interface KeyMomentPending {
  id: string;
  type: KeyMomentType;
  context: KeyMomentContext;
  promptText: string;
  mode: "choice" | "minigame";
  options: KeyMomentOption[];
  minigame?: MinigameSpec;
  foulType?: "shooting" | "bonus";
  freeThrowMode?: "one_and_one" | "two_shots";
  defenderTeamFoulsInSegment?: number;
  simBaselineQuality: number;
  seedValue?: number;
  autoResolveAt?: number;
}

export interface KeyMomentResolutionInput {
  pendingId: string;
  choiceId?: string;
  executionQuality?: KeyMomentExecutionQuality;
  minigameQuality?: number;
  usedFallbackBaseline?: boolean;
}

export interface KeyMomentResolutionOutput {
  quality: number;
  success: boolean;
  resultSummaryText: string;
  result: PossessionResult;
  outcomeText?: string;
  consequences?: MatchConsequence[];
  isUserAction: true;
}

export interface KeyMomentBuildArgs {
  id: string;
  context: KeyMomentContext;
  matchContext?: MatchContext;
  possessionState: PossessionState;
  userMatchState?: UserMatchState;
  seedValue: number;
  defenderTeamFoulsInSegment?: number;
}

export interface KeyMomentSchedulerInput {
  context: KeyMomentContext;
  periodTotalSeconds: number;
  matchContext?: MatchContext;
  possessionState?: PossessionState;
  userMatchState?: UserMatchState;
  defenderTeamFoulsInSegment?: number;
  forceTrigger?: boolean;
  pendingId?: string;
}

export interface KeyMomentSchedulerOutput {
  trigger: boolean;
  pending?: KeyMomentPending;
}

export interface KeyMomentScheduler {
  reset(): void;
  onPossessionBoundary(input: KeyMomentSchedulerInput): KeyMomentSchedulerOutput;
}

export interface KeyMomentResolveArgs {
  pending: KeyMomentPending;
  input: KeyMomentResolutionInput;
  context: MatchContext;
  possessionState: PossessionState;
}
