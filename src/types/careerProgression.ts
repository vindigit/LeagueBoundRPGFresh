export type CareerPhase = "MIDDLE_SCHOOL_AAU" | "HIGH_SCHOOL" | "COLLEGE" | "PRO";
export type StarRating = 1 | 2 | 3 | 4 | 5;
export type SchoolPath = "LOCAL_3A" | "STATE_5A" | "PREP";

export type OfferType = "AAU_INVITE" | "SCHOLARSHIP" | "WALK_ON" | "TRANSFER" | "NIL" | "PRO_CONTRACT";
export type OfferStatus = "AVAILABLE" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "WITHDRAWN";
export type ProjectedRole = "BENCH" | "ROTATION" | "SIXTH_MAN" | "STARTER" | "STAR";

export interface OfferValueRange {
  min: number;
  max: number;
}

export interface Offer {
  id: string;
  sourceTeamId: string;
  sourceLabel: string;
  exposureTier: string;
  type: OfferType;
  phases: CareerPhase[];
  projectedRole: ProjectedRole;
  scholarshipPercent?: number;
  nilValueRange?: OfferValueRange;
  interestLevel: number;
  status: OfferStatus;
  createdWeek: number;
  expiresWeek: number;
  notes?: string;
  tags: string[];
}

export type ScheduleWindowType =
  | "REGULAR_SEASON"
  | "PLAYOFFS"
  | "TOURNAMENT"
  | "RECRUITING"
  | "TRANSFER_PORTAL"
  | "OFFSEASON"
  | "SHOWCASE";

export interface ScheduleWindow {
  id: string;
  type: ScheduleWindowType;
  label: string;
  startWeek: number;
  endWeek: number;
  isActive: boolean;
}

export interface ScheduleMatchSlot {
  id: string;
  label: string;
  opponentTeamId?: string;
  opponentLabel?: string;
  isConference?: boolean;
  isTournament?: boolean;
  completed: boolean;
}

export interface SeasonWeek {
  id: string;
  weekNumber: number;
  label: string;
  phase: CareerPhase;
  windows: ScheduleWindow[];
  matchups: ScheduleMatchSlot[];
  notes: string[];
}

export interface SeasonSchedule {
  seasonId: string;
  seasonLabel: string;
  phase: CareerPhase;
  currentWeekId: string;
  weeks: SeasonWeek[];
}

export type RelationshipType = "COACH" | "TEAMMATE" | "RIVAL" | "SCOUT" | "FAMILY" | "SPONSOR" | "FANBASE";

export interface RelationshipState {
  id: string;
  type: RelationshipType;
  label: string;
  linkedTeamId?: string;
  affinity: number;
  trust: number;
  influence: number;
  lastInteractionWeek?: number;
  tags: string[];
}

export type EligibilityStatus = "ELIGIBLE" | "WARNING" | "PROBATION" | "SUSPENDED" | "INELIGIBLE";

export interface EligibilityState {
  status: EligibilityStatus;
  amateurStanding: boolean;
  academicRisk: number;
  complianceRisk: number;
  suspendedGamesRemaining: number;
  probationEndsWeek?: number;
  seasonsRemaining: number;
  yearsRemaining: number;
  notes: string[];
}

export type ActiveInjuryType = "ankle_sprain";
export type ActiveInjurySeverity = "minor";

export interface ActiveInjury {
  id: string;
  type: ActiveInjuryType;
  severity: ActiveInjurySeverity;
  createdWeek: number;
  weeksRemaining: number;
  performanceMultiplier: number;
  canPlayThrough: boolean;
}

export interface InjuryMatchConsequence {
  kind: "injury";
  injuryType: ActiveInjuryType;
  severity: ActiveInjurySeverity;
  weeksRemaining: number;
  performanceMultiplier: number;
  canPlayThrough: boolean;
  wearTearDelta: number;
}

export interface WearTearMatchConsequence {
  kind: "wear_tear";
  wearTearDelta: number;
}

export type MatchConsequence = InjuryMatchConsequence | WearTearMatchConsequence;

export interface FinanceLedgerTotals {
  nilEarnings: number;
  salaryEarnings: number;
  bonuses: number;
  fines: number;
  recurringExpenses: number;
  debt: number;
}

export interface FinanceState {
  ledger: FinanceLedgerTotals;
  recurringObligations: Array<{ id: string; label: string; amount: number; dueWeekInterval: number }>;
  lastNilWeek?: number;
  lastUpdatedAt: number;
}

export type FinanceLedgerEntryType = "income" | "expense";

export interface FinanceLedgerEntry {
  id: string;
  week: number;
  type: FinanceLedgerEntryType;
  category: string;
  amount: number;
  description: string;
  source: string;
}

export interface RecordFinanceTransactionInput {
  type: FinanceLedgerEntryType;
  category: string;
  amount: number;
  description: string;
  source: string;
  week?: number;
}

export type LegacyPerkType = "TRAINING" | "SOCIAL" | "RECRUITING" | "RECOVERY" | "FINANCIAL" | "STORY";

export interface LegacyPerk {
  id: string;
  type: LegacyPerkType;
  label: string;
  source: string;
  active: boolean;
  magnitude?: number;
  metadata?: Record<string, string | number | boolean>;
}

export type ExileMode = "NONE" | "G_LEAGUE" | "OVERSEAS" | "RETIRED";
export type ExileTriggerReason = "NONE" | "PERFORMANCE" | "DISCIPLINE" | "INJURY" | "CAP_CRUNCH" | "LEGACY_MIGRATION";

export interface ExileState {
  currentMode: ExileMode;
  triggerReason: ExileTriggerReason;
  enteredAtPhase?: CareerPhase;
  enteredAtWeek?: number;
  minimumDurationWeeks: number;
  returnEligibleWeek?: number;
  appealUsed: boolean;
  failedReturnAttempts: number;
  blockedDestinationIds: string[];
  notes: string[];
}
