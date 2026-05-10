import type { MatchScore, MatchContext, MatchFocus, MatchWorkRate, PossessionResult, PossessionState, UserMatchState } from "../../matchEngine";
import type { MatchConsequence } from "../../types/careerProgression";

export type PeriodKey = "Q1" | "Q2" | "Q3" | "Q4" | `OT${number}`;
export type KeyMomentType = "create_shot" | "make_the_read" | "on_ball_stop" | "jump_lane" | "foul_pressure";
export type ActionChallengeKind = "timing" | "aim" | "reaction" | "choice" | "sequence";
export type BasketballChallengeContext =
  | "catch_shoot"
  | "pullup"
  | "free_throw"
  | "drive"
  | "pass_read"
  | "defensive_stop"
  | "steal_lane"
  | "rebound";

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
  coachTrust?: number;
  staminaRating?: number;
  leverage?: "normal" | "high" | "clutch";
}

export interface KeyMomentOption {
  id: string;
  label: string;
  description: string;
  qualityDelta: number;
}

export interface ChallengeForgivenessProfile {
  windowRadiusBonus: number;
  nearMissSoftener: number;
  recoveryBonus: number;
  fatigueResistance: number;
}

export interface ChallengeImpactHooks {
  statImpactKey?: "shooting" | "playmaking" | "defense" | "rebounding";
  ratingImpactKey?: "shooting" | "finishing" | "playmaking" | "defending" | "rebounding" | "athleticism" | "stamina";
  careerImpactKey?: "confidence" | "momentum" | "discipline";
}

export interface TimingChallengeConfig {
  durationMs: number;
  targetCenter: number;
  targetRadius: number;
  markerLabel?: string;
}

export interface AimChallengeConfig {
  durationMs: number;
  targetZones: Array<{ id: string; centerX: number; centerY: number; radius: number }>;
}

export interface ReactionChallengeConfig {
  durationMs: number;
  cueAtProgress: number;
  cueRadius: number;
}

export interface ChoiceChallengeConfig {
  timeLimitMs?: number;
  revealHints?: string[];
}

export interface SequenceChallengeConfig {
  durationMs: number;
  steps: string[];
}

export interface ActionChallengeSpec {
  id: string;
  kind: ActionChallengeKind;
  context: BasketballChallengeContext;
  title: string;
  subtitle: string;
  buttonLabel: string;
  execution:
    | { kind: "timing"; timing: TimingChallengeConfig }
    | { kind: "aim"; aim: AimChallengeConfig }
    | { kind: "reaction"; reaction: ReactionChallengeConfig }
    | { kind: "choice"; choice: ChoiceChallengeConfig }
    | { kind: "sequence"; sequence: SequenceChallengeConfig };
  scoring: {
    successThreshold: number;
    nearMissThreshold: number;
    baselineFloor: number;
    outsideWindowPenalty: number;
    fallbackPenalty: number;
  };
  forgiveness: ChallengeForgivenessProfile;
  hooks?: ChallengeImpactHooks;
}

export interface ChallengeExecutionResult {
  normalizedScore: number;
  source: "minigame" | "sim_it" | "choice";
  detail?: "perfect" | "solid" | "near_miss" | "miss";
}

// Compatibility-only shape for legacy minigame moments. New work should prefer `challenge`.
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
  challenge?: ActionChallengeSpec;
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
  matchTotalSeconds?: number;
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
