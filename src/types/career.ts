import type { Player, PlayerAttributes } from "./player";
import type { MatchBoxScore } from "../features/match/store/useMatchStore";
import type { AttributeGainSource, BackstoryInput, BuildBackstoryInput, CareerNewsItem } from "./backstory";
import type {
  ActiveInjury,
  CareerPhase,
  EligibilityState,
  ExileMode,
  ExileState,
  FinanceLedgerEntry,
  FinanceState,
  LegacyPerk,
  MatchConsequence,
  Offer,
  RecordFinanceTransactionInput,
  RelationshipState,
  SchoolPath,
  SeasonSchedule,
  StarRating,
} from "./careerProgression";

export enum LeagueLevel {
  MIDDLE_SCHOOL = "MIDDLE_SCHOOL",
  HIGH_SCHOOL = "HIGH_SCHOOL",
  COLLEGE = "COLLEGE",
  PRO = "PRO",
}

export enum CareerStatus {
  ACTIVE = "ACTIVE",
  INJURED = "INJURED",
  RETIRED = "RETIRED",
  AMATEUR_LOCKED = "AMATEUR_LOCKED",
}

export type ExileStatus = Exclude<ExileMode, "NONE">;

export type CareerView = "BACKSTORY" | "HUB" | "NARRATIVE" | "MATCH" | "POSTGAME" | "SCHOOL_PATH_SELECT";

export interface LastMatchResult {
  homeScore: number;
  awayScore: number;
  didWin: boolean;
  bankDelta: number;
  moraleDelta: number;
  weekAfter: number;
  overtimePeriods: number;
  boxScore: MatchBoxScore;
  consequences: MatchConsequence[];
  matchRating: number;
  ratingDelta: number;
  meterDeltas: {
    coachTrust: number;
    fans: number;
    teammates: number;
    energy: number;
    condition: number;
  };
}

export type WeeklyActionDefinitionId =
  | "TRAIN_SHOOTING"
  | "TRAIN_FINISHING"
  | "TRAIN_PLAYMAKING"
  | "TRAIN_DEFENSE"
  | "STUDY"
  | "REST_RECOVERY"
  | "TEAM_BONDING"
  | "SOCIAL_FANS"
  | "FILM_COACH_TRUST"
  | "NIL_APPEARANCE";

export interface WeeklyActionEntry {
  id: WeeklyActionDefinitionId;
  label: string;
  energyDelta: number;
  conditionDelta: number;
  coachTrustDelta?: number;
  fansDelta?: number;
  teammatesDelta?: number;
  gpaDelta?: number;
  moneyDelta?: number;
  scoutVisibilityDelta?: number;
  narrativeFile?: string;
}

export interface WeeklyActionState {
  slotsTotal: number;
  slotsRemaining: number;
  actionsTaken: WeeklyActionEntry[];
  availableActionIds: WeeklyActionDefinitionId[];
  optionalNarrativeActionId: WeeklyActionDefinitionId | null;
  matchUnlocked: boolean;
  postgamePending: boolean;
  tutorialWeek: boolean;
  tutorialActionSet: boolean;
  academicWarningShown: boolean;
  pendingNarrativeActionId: WeeklyActionDefinitionId | null;
}

export interface CareerState {
  player: Player;
  leagueLevel: LeagueLevel;
  careerPhase: CareerPhase;
  status: CareerStatus;
  starRating: StarRating;
  scoutVisibility: number;
  coachTrust: number;
  fans: number;
  teammates: number;
  energy: number;
  condition: number;
  recentRatingTrend: number;
  gpa: number;
  currentYear: number;
  seasonNumber: number;
  currentWeek: number;
  teamId: string | null;
  teamInterestById: Record<string, number>;
  schoolPath: SchoolPath;
  pendingSchoolPathSelection: boolean;
  offers: Offer[];
  seasonSchedule: SeasonSchedule;
  relationships: Record<string, RelationshipState>;
  eligibility: EligibilityState;
  injury: ActiveInjury | null;
  wearTear: number;
  financeState: FinanceState;
  financeLedger: FinanceLedgerEntry[];
  legacyPerks: LegacyPerk[];
  isGoatPath: boolean;
  view: CareerView;
  currentNarrativeFile: string;
  lastMatchResult: LastMatchResult | null;
  newsFeed: CareerNewsItem[];
  weeklyActionState: WeeklyActionState;
  ovrBudget: number;
  exile: ExileStatus | null;
  exileState: ExileState;
}

export interface CareerActions {
  initializeCareer(input: BackstoryInput | BuildBackstoryInput): void;
  applyAttributeGain(attr: keyof PlayerAttributes, amount: number, source?: AttributeGainSource): void;
  updateAttribute(attr: keyof PlayerAttributes, amount: number): void;
  recordFinanceTransaction(input: RecordFinanceTransactionInput): void;
  updateBankBalance(amount: number): void;
  adjustGpa(delta: number, source?: "STUDY" | "NARRATIVE" | "SYSTEM"): void;
  advanceWeek(): void;
  advanceSeason(): void;
  updateLeagueLevel(level: LeagueLevel): void;
  updateStatus(status: CareerStatus): void;
  setCurrentWeek(week: number): void;
  setTeam(teamId: string | null): void;
  applyTeamInterestDelta(targetId: string, amount: number): void;
  respondToOffer(offerId: string, decision: "ACCEPT" | "DECLINE"): void;
  selectSchoolPath(path: SchoolPath): void;
  setGoatPath(isGoatPath: boolean): void;
  setCurrentYear(year: number): void;
  startWeek(): void;
  takeWeeklyAction(actionId: WeeklyActionDefinitionId): void;
  unlockMatchIfReady(): void;
  startNarrative(fileName: string): void;
  completeStudyActivity(): void;
  completeNarrativeEvent(): void;
  completeOptionalNarrativeAction(): void;
  closeNarrative(): void;
  navigateToMatch(): void;
  navigateToHub(): void;
  applyMatchConsequences(consequences: MatchConsequence[]): void;
  completeMatch(result: {
    homeScore: number;
    awayScore: number;
    overtimePeriods?: number;
    boxScore: MatchBoxScore;
    consequences?: MatchConsequence[];
  }): void;
  resolvePostgameAndAdvanceWeek(): void;
  hydrateCareer(state: CareerState): void;
  resetCareer(state: CareerState): void;
}
