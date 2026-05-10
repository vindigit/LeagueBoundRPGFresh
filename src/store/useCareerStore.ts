import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSchoolPathFanbaseRelationship, getSchoolPathProfile } from "../constants/schoolPaths";
import {
  applyInterestDelta,
  buildInterestDeltaFromMatch,
  generateHighSchoolOffers,
  HIGH_SCHOOL_RECRUITING_PROGRAMS,
  seedHighSchoolTeamInterest,
} from "../features/career/recruiting";
import {
  getWeeklyActionDefinition,
  getWeeklyActionIdsForLeagueLevel,
} from "../features/career/weeklyActions";
import { calculatePersonalMatchRating, type CareerMeterDeltas } from "../features/career/matchRating";
import { heightFromPresetMidpoint, weightFromPresetMidpoint } from "../features/backstory/constants/bodyMapping";
import { BACKSTORY_V1_ENABLED } from "../features/backstory/constants/flags";
import { getPotentialTier } from "../features/backstory/constants/potentialTier";
import { calculateAttributeGain } from "../features/backstory/progression/calculateAttributeGain";
import { findCityByLegacySlug, getDefaultCityForState, getDefaultStateCode, resolveHometown } from "../features/backstory/data/hometowns";
import {
  createBackstorySeed,
  createBuildBackstorySeed,
  deriveGeneratedBadgeProfile,
  enforceCapsAtLeastCurrent,
  generateBackstoryFromBuildInput,
  generateBackstoryFromInput,
  getDefaultSecondaryPosition,
  synthesizeBackstoryInputFromLegacy,
} from "../features/backstory/generator";
import {
  createCareerCreationNewsItem,
  createPostgameNewsItem,
  createSchoolPathCommitmentNewsItem,
} from "../features/backstory/news";
import { computeOverall } from "../builder/derivedRatings";
import {
  getFuzzyScoutingSummary,
  getPlaystyleLabel,
  inferPublicAttributesFromEngine,
  type StartingArchetypeId,
} from "../builder/publicAttributes";
import {
  CareerStatus,
  LeagueLevel,
  type CareerActions,
  type CareerState,
  type ExileStatus,
  type WeeklyActionDefinitionId,
  type WeeklyActionEntry,
  type WeeklyActionResult,
  type WeeklyActionState,
} from "../types/career";
import type {
  ActiveInjury,
  CareerPhase,
  EligibilityState,
  ExileState,
  FinanceLedgerEntry,
  FinanceState,
  MatchConsequence,
  Offer,
  RecordFinanceTransactionInput,
  SchoolPath,
  SeasonSchedule,
  StarRating,
} from "../types/careerProgression";
import { normalizePlayerStateForInk, type LegacyPlayerStateInput, type Player, type PlayerAttributes } from "../types/player";
import type { BackstoryInput, BuildBackstoryInput, GeneratedBadgeProfile, HeightPreset, WeightPreset } from "../types/backstory";
import type { MatchBoxScore } from "../features/match/store/useMatchStore";

type CareerStore = CareerState & CareerActions;

interface LegacyPersistedInjuryState {
  status?: string;
  severity?: string;
  diagnosis?: string;
  recoveryWeeksRemaining?: number;
}

const NEWS_FEED_LIMIT = 100;
const clampAttribute = (value: number): number => Math.min(99, Math.max(0, value));
const clampMorale = (value: number): number => Math.min(100, Math.max(0, value));
const clampVisibility = (value: number): number => Math.min(100, Math.max(0, Math.round(value)));
const clampGpa = (value: number): number => Math.round(Math.min(4, Math.max(0, value)) * 10) / 10;
const clampMeter = (value: number): number => Math.min(100, Math.max(0, Math.round(value)));
const clampRecentRatingTrend = (value: number): number => Math.min(3, Math.max(-3, Math.round(value)));

const isAcademicPhase = (leagueLevel: LeagueLevel): boolean => leagueLevel !== LeagueLevel.PRO;

const isAcademicallyEligible = (gpa: number, leagueLevel: LeagueLevel): boolean =>
  !isAcademicPhase(leagueLevel) || clampGpa(gpa) >= 2;

const getWeeklySlotsForLeagueLevel = (leagueLevel: LeagueLevel): number =>
  leagueLevel === LeagueLevel.MIDDLE_SCHOOL ? 2 : 3;

const defaultPlayer: Player = {
  id: "",
  name: "",
  age: 0,
  bankBalance: 0,
  morale: 50,
  position: "PG",
  secondaryPosition: "SG",
  archetype: "Slasher",
  identity: null,
  dna: null,
  attributes: {
    shortRange: 0,
    dunking: 0,
    midrange: 0,
    threePoint: 0,
    handle: 0,
    passing: 0,
    vision: 0,
    perimeterDefense: 0,
    interiorDefense: 0,
    stealing: 0,
    blocking: 0,
    offRebounding: 0,
    defRebounding: 0,
    speed: 0,
    strength: 0,
    stamina: 0,
  } as any,
  gameStats: {
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0,
    fga: 0,
    fgm: 0,
  },
};

const getInitialCareerView = (): CareerState["view"] => (BACKSTORY_V1_ENABLED ? "BACKSTORY" : "HUB");

const careerPhaseFromLeagueLevel = (leagueLevel: LeagueLevel): CareerPhase => {
  switch (leagueLevel) {
    case LeagueLevel.MIDDLE_SCHOOL:
      return "MIDDLE_SCHOOL_AAU";
    case LeagueLevel.HIGH_SCHOOL:
      return "HIGH_SCHOOL";
    case LeagueLevel.COLLEGE:
      return "COLLEGE";
    case LeagueLevel.PRO:
    default:
      return "PRO";
  }
};

const leagueLevelFromCareerPhase = (careerPhase: CareerPhase): LeagueLevel => {
  switch (careerPhase) {
    case "MIDDLE_SCHOOL_AAU":
      return LeagueLevel.MIDDLE_SCHOOL;
    case "HIGH_SCHOOL":
      return LeagueLevel.HIGH_SCHOOL;
    case "COLLEGE":
      return LeagueLevel.COLLEGE;
    case "PRO":
    default:
      return LeagueLevel.PRO;
  }
};

const deriveLegacyExile = (exileState: ExileState): ExileStatus | null =>
  exileState.currentMode === "NONE" ? null : exileState.currentMode;

const defaultSchoolPathForPhase = (careerPhase: CareerPhase): SchoolPath =>
  careerPhase === "HIGH_SCHOOL" ? "STATE_5A" : "LOCAL_3A";

const defaultScoutVisibilityForPhase = (careerPhase: CareerPhase): number => {
  switch (careerPhase) {
    case "MIDDLE_SCHOOL_AAU":
      return 20;
    case "HIGH_SCHOOL":
      return 45;
    case "COLLEGE":
      return 70;
    case "PRO":
    default:
      return 90;
  }
};

const deriveStarRating = (player: Player): StarRating => {
  const overall = computeOverall(player.attributes, player.position);
  const potential = player.dna?.potential ?? overall;
  const composite = Math.round(overall * 0.7 + potential * 0.3);
  if (composite >= 88) {
    return 5;
  }
  if (composite >= 78) {
    return 4;
  }
  if (composite >= 68) {
    return 3;
  }
  if (composite >= 58) {
    return 2;
  }
  return 1;
};

const createDefaultEligibilityState = (careerPhase: CareerPhase, gpa = 2.5): EligibilityState => ({
  status: isAcademicallyEligible(gpa, leagueLevelFromCareerPhase(careerPhase)) ? "ELIGIBLE" : "INELIGIBLE",
  amateurStanding: careerPhase !== "PRO",
  academicRisk: 0,
  complianceRisk: 0,
  suspendedGamesRemaining: 0,
  probationEndsWeek: undefined,
  seasonsRemaining: careerPhase === "PRO" ? 99 : careerPhase === "COLLEGE" ? 4 : 4,
  yearsRemaining: careerPhase === "PRO" ? 99 : careerPhase === "COLLEGE" ? 4 : careerPhase === "HIGH_SCHOOL" ? 4 : 1,
  notes: [],
});

const syncEligibilityState = (
  eligibility: EligibilityState,
  careerPhase: CareerPhase,
  gpa: number,
): EligibilityState => ({
  ...eligibility,
  status: createDefaultEligibilityState(careerPhase, gpa).status,
});

const createDefaultFinanceState = (): FinanceState => ({
  ledger: {
    nilEarnings: 0,
    salaryEarnings: 0,
    bonuses: 0,
    fines: 0,
    recurringExpenses: 0,
    debt: 0,
  },
  recurringObligations: [],
  lastNilWeek: undefined,
  lastUpdatedAt: Date.now(),
});

const createDefaultCareerMeterState = () => ({
  coachTrust: 50,
  fans: 50,
  teammates: 50,
  energy: 100,
  condition: 100,
  recentRatingTrend: 0,
});

const createDefaultMeterDeltas = (): CareerMeterDeltas => ({
  coachTrust: 0,
  fans: 0,
  teammates: 0,
  energy: 0,
  condition: 0,
});

const applyCareerMeterDeltas = (
  state: Pick<CareerState, "coachTrust" | "fans" | "teammates" | "energy" | "condition">,
  deltas: CareerMeterDeltas,
) => ({
  coachTrust: clampMeter(state.coachTrust + deltas.coachTrust),
  fans: clampMeter(state.fans + deltas.fans),
  teammates: clampMeter(state.teammates + deltas.teammates),
  energy: clampMeter(state.energy + deltas.energy),
  condition: clampMeter(state.condition + deltas.condition),
});

const buildFinanceTransactionFromDelta = (
  amount: number,
  metadata: Omit<RecordFinanceTransactionInput, "type" | "amount">,
): RecordFinanceTransactionInput | null => {
  if (amount === 0) {
    return null;
  }

  return {
    type: amount > 0 ? "income" : "expense",
    amount: Math.abs(amount),
    ...metadata,
  };
};

const createFinanceLedgerEntryId = (week: number): string =>
  `finance-${week}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const buildFinanceTransactionState = (
  state: Pick<CareerState, "currentWeek" | "player" | "financeLedger" | "financeState">,
  input: RecordFinanceTransactionInput,
): Pick<CareerState, "player" | "financeLedger" | "financeState"> | null => {
  const normalizedAmount = Math.abs(input.amount);
  if (normalizedAmount === 0) {
    return null;
  }

  const week = input.week ?? state.currentWeek;
  const signedAmount = input.type === "income" ? normalizedAmount : -normalizedAmount;
  const entry: FinanceLedgerEntry = {
    id: createFinanceLedgerEntryId(week),
    week,
    type: input.type,
    category: input.category,
    amount: normalizedAmount,
    description: input.description,
    source: input.source,
  };

  return {
    player: {
      ...state.player,
      bankBalance: state.player.bankBalance + signedAmount,
    },
    financeLedger: [...state.financeLedger, entry],
    financeState: {
      ...state.financeState,
      lastUpdatedAt: Date.now(),
    },
  };
};

const createDefaultExileState = (input: {
  currentMode?: ExileState["currentMode"];
  triggerReason?: ExileState["triggerReason"];
  enteredAtPhase?: CareerPhase;
  enteredAtWeek?: number;
  minimumDurationWeeks?: number;
  returnEligibleWeek?: number;
} = {}): ExileState => ({
  currentMode: input.currentMode ?? "NONE",
  triggerReason: input.triggerReason ?? "NONE",
  enteredAtPhase: input.enteredAtPhase,
  enteredAtWeek: input.enteredAtWeek,
  minimumDurationWeeks: input.minimumDurationWeeks ?? 0,
  returnEligibleWeek: input.returnEligibleWeek,
  appealUsed: false,
  failedReturnAttempts: 0,
  blockedDestinationIds: [],
  notes: [],
});

const createDefaultSeasonSchedule = (
  currentYear: number,
  seasonNumber: number,
  careerPhase: CareerPhase,
  currentWeek: number,
): SeasonSchedule => {
  const seasonId = `${careerPhase}-${currentYear}-${seasonNumber}`;
  const weeks: SeasonSchedule["weeks"] = [
    {
      id: `${seasonId}-week-1`,
      weekNumber: 1,
      label: "Opening Week",
      phase: careerPhase,
      windows: [
        { id: `${seasonId}-opening`, type: "REGULAR_SEASON", label: "Regular Season Opens", startWeek: 1, endWeek: 1, isActive: currentWeek === 1 },
      ],
      matchups: [],
      notes: [],
    },
    {
      id: `${seasonId}-week-2`,
      weekNumber: 2,
      label: "Recruiting Watch",
      phase: careerPhase,
      windows: [
        { id: `${seasonId}-recruiting`, type: "RECRUITING", label: "Recruiting Window", startWeek: 2, endWeek: 2, isActive: currentWeek === 2 },
      ],
      matchups: [],
      notes: [],
    },
    {
      id: `${seasonId}-week-3`,
      weekNumber: 3,
      label: "Showcase Circuit",
      phase: careerPhase,
      windows: [
        { id: `${seasonId}-showcase`, type: "SHOWCASE", label: "Showcase Events", startWeek: 3, endWeek: 3, isActive: currentWeek === 3 },
      ],
      matchups: [],
      notes: [],
    },
    {
      id: `${seasonId}-week-4`,
      weekNumber: 4,
      label: "Offseason Setup",
      phase: careerPhase,
      windows: [
        { id: `${seasonId}-offseason`, type: "OFFSEASON", label: "Offseason Planning", startWeek: 4, endWeek: 4, isActive: currentWeek >= 4 },
        {
          id: `${seasonId}-portal`,
          type: "TRANSFER_PORTAL",
          label: "Transfer Portal",
          startWeek: 4,
          endWeek: 4,
          isActive: currentWeek >= 4 && (careerPhase === "COLLEGE" || careerPhase === "PRO"),
        },
      ],
      matchups: [],
      notes: [],
    },
  ];

  const currentWeekId = weeks.find((week) => week.weekNumber === currentWeek)?.id ?? weeks[0].id;
  return {
    seasonId,
    seasonLabel: `${currentYear} Season ${seasonNumber}`,
    phase: careerPhase,
    currentWeekId,
    weeks,
  };
};

const createCareerProgressionState = (input: {
  player: Player;
  leagueLevel: LeagueLevel;
  gpa: number;
  currentYear: number;
  seasonNumber: number;
  currentWeek: number;
  exile?: ExileStatus | null;
}) => {
  const careerPhase = careerPhaseFromLeagueLevel(input.leagueLevel);
  const exileState =
    input.exile == null
      ? createDefaultExileState()
      : createDefaultExileState({
          currentMode: input.exile,
          triggerReason: "LEGACY_MIGRATION",
          enteredAtPhase: careerPhase,
          enteredAtWeek: input.currentWeek,
          minimumDurationWeeks: 4,
          returnEligibleWeek: input.currentWeek + 4,
        });

  return {
    careerPhase,
    starRating: deriveStarRating(input.player),
    scoutVisibility: defaultScoutVisibilityForPhase(careerPhase),
    ...createDefaultCareerMeterState(),
    teamInterestById: {},
    schoolPath: defaultSchoolPathForPhase(careerPhase),
    offers: [],
    seasonSchedule: createDefaultSeasonSchedule(input.currentYear, input.seasonNumber, careerPhase, input.currentWeek),
    relationships: {},
    eligibility: createDefaultEligibilityState(careerPhase, input.gpa),
    injury: null,
    wearTear: 0,
    financeState: createDefaultFinanceState(),
    legacyPerks: [],
    exileState,
    exile: deriveLegacyExile(exileState),
  };
};

const syncSeasonScheduleWeek = (seasonSchedule: SeasonSchedule, currentWeek: number): SeasonSchedule => ({
  ...seasonSchedule,
  currentWeekId: seasonSchedule.weeks.find((week) => week.weekNumber === currentWeek)?.id ?? seasonSchedule.currentWeekId,
  weeks: seasonSchedule.weeks.map((week) => ({
    ...week,
    windows: week.windows.map((window) => ({
      ...window,
      isActive: currentWeek >= window.startWeek && currentWeek <= window.endWeek,
    })),
  })),
});

const createDefaultWeeklyActionState = (
  leagueLevel: LeagueLevel,
  input: Partial<WeeklyActionState> = {},
): WeeklyActionState => {
  const slotsTotal = input.slotsTotal ?? getWeeklySlotsForLeagueLevel(leagueLevel);
  const availableActionIds = input.availableActionIds ?? getWeeklyActionIdsForLeagueLevel(leagueLevel);

  return {
    slotsTotal,
    slotsRemaining: input.slotsRemaining ?? slotsTotal,
    actionsTaken: input.actionsTaken ?? [],
    availableActionIds,
    optionalNarrativeActionId:
      input.optionalNarrativeActionId ?? (availableActionIds.includes("FILM_COACH_TRUST") ? "FILM_COACH_TRUST" : null),
    matchUnlocked: input.matchUnlocked ?? false,
    postgamePending: input.postgamePending ?? false,
    tutorialWeek: input.tutorialWeek ?? leagueLevel === LeagueLevel.MIDDLE_SCHOOL,
    tutorialActionSet: input.tutorialActionSet ?? leagueLevel === LeagueLevel.MIDDLE_SCHOOL,
    academicWarningShown: input.academicWarningShown ?? false,
    pendingNarrativeActionId: input.pendingNarrativeActionId ?? null,
  };
};

const buildActiveInjury = (
  consequence: Extract<MatchConsequence, { kind: "injury" }>,
  currentWeek: number,
): ActiveInjury => ({
  id: `injury-${consequence.injuryType}-${currentWeek}-${Date.now()}`,
  type: consequence.injuryType,
  severity: consequence.severity,
  createdWeek: currentWeek,
  weeksRemaining: consequence.weeksRemaining,
  performanceMultiplier: consequence.performanceMultiplier,
  canPlayThrough: consequence.canPlayThrough,
});

const applyMatchConsequencesToHealth = (input: {
  injury: CareerState["injury"];
  wearTear: number;
  currentWeek: number;
  consequences: MatchConsequence[];
}): Pick<CareerState, "injury" | "wearTear"> => {
  let nextInjury = input.injury;
  let nextWearTear = input.wearTear;

  for (const consequence of input.consequences) {
    nextWearTear += consequence.wearTearDelta;

    if (consequence.kind !== "injury") {
      continue;
    }

    if (nextInjury?.type === consequence.injuryType && nextInjury.severity === consequence.severity) {
      nextInjury = {
        ...nextInjury,
        weeksRemaining: Math.max(nextInjury.weeksRemaining, consequence.weeksRemaining),
        performanceMultiplier: consequence.performanceMultiplier,
        canPlayThrough: consequence.canPlayThrough,
      };
      continue;
    }

    nextInjury = buildActiveInjury(consequence, input.currentWeek);
  }

  return {
    injury: nextInjury,
    wearTear: Math.max(0, nextWearTear),
  };
};

const advanceHealthState = (
  input: Pick<CareerState, "injury" | "wearTear" | "currentWeek">,
): Pick<CareerState, "injury" | "wearTear"> => {
  const shouldReduceWeeksRemaining = Boolean(input.injury && input.injury.createdWeek < input.currentWeek);
  const nextWeeksRemaining = input.injury
    ? input.injury.weeksRemaining - (shouldReduceWeeksRemaining ? 1 : 0)
    : 0;

  return {
    injury:
      input.injury && nextWeeksRemaining > 0
        ? {
            ...input.injury,
            weeksRemaining: nextWeeksRemaining,
          }
        : null,
    wearTear: Math.max(0, input.wearTear - 5),
  };
};

const migrateLegacyInjuryState = (
  legacyInjuryState: LegacyPersistedInjuryState | undefined,
  currentWeek: number,
): CareerState["injury"] => {
  if (!legacyInjuryState || legacyInjuryState.status === "HEALTHY" || (legacyInjuryState.recoveryWeeksRemaining ?? 0) <= 0) {
    return null;
  }

  return {
    id: `legacy-ankle-sprain-${currentWeek}`,
    type: "ankle_sprain",
    severity: "minor",
    createdWeek: currentWeek,
    weeksRemaining: legacyInjuryState.recoveryWeeksRemaining ?? 1,
    performanceMultiplier: 0.88,
    canPlayThrough: legacyInjuryState.status !== "OUT",
  };
};

const recruitingProgramById = new Map(HIGH_SCHOOL_RECRUITING_PROGRAMS.map((program) => [program.id, program] as const));

const normalizeOfferExposureTier = (offer: Offer): Offer => ({
  ...offer,
  exposureTier: offer.exposureTier ?? recruitingProgramById.get(offer.sourceTeamId)?.exposureTier ?? "Regional",
});

const shouldPromptForSchoolPathSelection = (
  state: Pick<CareerState, "leagueLevel" | "currentWeek" | "pendingSchoolPathSelection">,
): boolean => state.leagueLevel === LeagueLevel.MIDDLE_SCHOOL && state.currentWeek >= 2 && state.pendingSchoolPathSelection;

const hasTakenWeeklyAction = (weeklyActionState: WeeklyActionState, actionId: WeeklyActionDefinitionId): boolean =>
  weeklyActionState.actionsTaken.some((action) => action.id === actionId);

const canAffordWeeklyAction = (
  state: Pick<CareerState, "player" | "leagueLevel">,
  actionId: WeeklyActionDefinitionId,
): boolean => {
  const entry = getWeeklyActionDefinition(actionId).buildEntry({ leagueLevel: state.leagueLevel });
  return state.player.bankBalance + (entry.moneyDelta ?? 0) >= 0;
};

const canTakeWeeklyAction = (
  state: Pick<CareerState, "weeklyActionState" | "player" | "leagueLevel">,
  actionId: WeeklyActionDefinitionId,
): boolean =>
  !state.weeklyActionState.postgamePending &&
  !state.weeklyActionState.matchUnlocked &&
  state.weeklyActionState.slotsRemaining > 0 &&
  state.weeklyActionState.availableActionIds.includes(actionId) &&
  !hasTakenWeeklyAction(state.weeklyActionState, actionId) &&
  canAffordWeeklyAction(state, actionId);

const canStartNarrative = (state: Pick<CareerState, "weeklyActionState">): boolean =>
  !state.weeklyActionState.postgamePending && state.weeklyActionState.pendingNarrativeActionId !== null;

const canCompleteStudy = (state: Pick<CareerState, "weeklyActionState" | "player" | "leagueLevel">): boolean =>
  canTakeWeeklyAction(state, "STUDY");

const canUnlockMatch = (weeklyActionState: WeeklyActionState): boolean =>
  !weeklyActionState.postgamePending && weeklyActionState.slotsRemaining <= 0;

const canStartMatch = (state: Pick<CareerState, "weeklyActionState" | "gpa" | "leagueLevel">): boolean =>
  state.weeklyActionState.matchUnlocked &&
  !state.weeklyActionState.postgamePending &&
  isAcademicallyEligible(state.gpa, state.leagueLevel);

const resolveWeekAdvance = (input: {
  currentWeek: number;
  currentYear: number;
  seasonNumber: number;
  careerPhase: CareerPhase;
  seasonSchedule: SeasonSchedule;
}) => {
  const totalWeeks = input.seasonSchedule.weeks.length;
  if (input.currentWeek >= totalWeeks) {
    return {
      currentWeek: 1,
      currentYear: input.currentYear,
      seasonNumber: input.seasonNumber + 1,
      seasonSchedule: createDefaultSeasonSchedule(input.currentYear, input.seasonNumber + 1, input.careerPhase, 1),
    };
  }

  const nextWeek = input.currentWeek + 1;
  return {
    currentWeek: nextWeek,
    currentYear: input.currentYear,
    seasonNumber: input.seasonNumber,
    seasonSchedule: syncSeasonScheduleWeek(input.seasonSchedule, nextWeek),
  };
};

const buildWeeklyActionResult = (entry: WeeklyActionEntry): WeeklyActionResult => {
  const definition = getWeeklyActionDefinition(entry.id);
  return {
    actionId: entry.id,
    actionLabel: entry.label,
    title: definition.resultTitle ?? entry.label,
    tagline: definition.tagline,
    description: definition.resultDescription ?? definition.description,
    energyDelta: entry.energyDelta,
    conditionDelta: entry.conditionDelta,
    coachTrustDelta: entry.coachTrustDelta,
    fansDelta: entry.fansDelta,
    teammatesDelta: entry.teammatesDelta,
    gpaDelta: entry.gpaDelta,
    moneyDelta: entry.moneyDelta,
    scoutVisibilityDelta: entry.scoutVisibilityDelta,
  };
};

const applyWeeklyActionToState = (state: CareerState, entry: WeeklyActionEntry): CareerState => {
  let nextState: CareerState = {
    ...state,
    coachTrust: clampMeter(state.coachTrust + (entry.coachTrustDelta ?? 0)),
    fans: clampMeter(state.fans + (entry.fansDelta ?? 0)),
    teammates: clampMeter(state.teammates + (entry.teammatesDelta ?? 0)),
    energy: clampMeter(state.energy + entry.energyDelta),
    condition: clampMeter(state.condition + entry.conditionDelta),
    scoutVisibility: clampVisibility(state.scoutVisibility + (entry.scoutVisibilityDelta ?? 0)),
    gpa: clampGpa(state.gpa + (entry.gpaDelta ?? 0)),
    wearTear: entry.id === "REST_RECOVERY" ? Math.max(0, state.wearTear - 8) : state.wearTear,
    weeklyActionState: {
      ...state.weeklyActionState,
      slotsRemaining: Math.max(0, state.weeklyActionState.slotsRemaining - 1),
      actionsTaken: [...state.weeklyActionState.actionsTaken, entry],
      pendingNarrativeActionId: null,
      academicWarningShown:
        state.weeklyActionState.academicWarningShown ||
        (!isAcademicallyEligible(state.gpa + (entry.gpaDelta ?? 0), state.leagueLevel) &&
          state.leagueLevel === LeagueLevel.HIGH_SCHOOL),
    },
  };

  nextState = {
    ...nextState,
    eligibility: syncEligibilityState(nextState.eligibility, nextState.careerPhase, nextState.gpa),
  };

  for (const gain of getWeeklyActionDefinition(entry.id).attributeGains ?? []) {
    const currentValue = nextState.player.attributes[gain.attr];
    const cap = nextState.player.dna?.caps[gain.attr] ?? 99;
    const growthByLeague = nextState.player.dna?.growthByLeague ?? {
      [LeagueLevel.MIDDLE_SCHOOL]: 1,
      [LeagueLevel.HIGH_SCHOOL]: 1,
      [LeagueLevel.COLLEGE]: 1,
      [LeagueLevel.PRO]: 1,
    };
    const residue = nextState.player.dna?.growthResidue?.[gain.attr] ?? 0;
    const result = calculateAttributeGain({
      attribute: gain.attr,
      amount: gain.amount,
      currentValue,
      cap,
      source: "TRAINING",
      leagueLevel: nextState.leagueLevel,
      growthByLeague,
      archetype: nextState.player.archetype,
      residue,
    });
    nextState = {
      ...nextState,
      player: {
        ...nextState.player,
        attributes: {
          ...nextState.player.attributes,
          [gain.attr]: clampAttribute(result.nextValue) as PlayerAttributes[typeof gain.attr],
        },
        dna: nextState.player.dna
          ? {
              ...nextState.player.dna,
              growthResidue: {
                ...nextState.player.dna.growthResidue,
                [gain.attr]: result.nextResidue,
              },
            }
          : null,
      },
    };
  }

  if ((entry.moneyDelta ?? 0) !== 0) {
    const transaction = buildFinanceTransactionFromDelta(entry.moneyDelta!, {
      category: entry.id === "FILM_COACH_TRUST" ? "film_stipend" : "misc",
      description:
        entry.id === "FILM_COACH_TRUST" ? "Film room stipend" : entry.id === "COURTFUEL" ? "CourtFuel purchase" : `${entry.label} payout`,
      source: entry.id === "FILM_COACH_TRUST" ? "narrative" : "weekly_action",
    });
    if (transaction) {
      const financeUpdate = buildFinanceTransactionState(nextState, transaction);
      if (financeUpdate) {
        nextState = {
          ...nextState,
          ...financeUpdate,
        };
      }
    }
  }

  const matchUnlocked = canUnlockMatch(nextState.weeklyActionState);
  return {
    ...nextState,
    lastWeeklyActionResult: buildWeeklyActionResult(entry),
    weeklyActionState: {
      ...nextState.weeklyActionState,
      matchUnlocked,
    },
  };
};

const deriveMigratedWeeklyActionState = (input: {
  persistedWeeklyLoop?: Partial<{
    eventCompleted: boolean;
    matchCompleted: boolean;
    postgamePending: boolean;
    studyCompleted: boolean;
  }>;
  view?: CareerState["view"];
  lastMatchResult?: CareerState["lastMatchResult"];
  initializedPlayer: boolean;
  leagueLevel: LeagueLevel;
}): WeeklyActionState => {
  const fallback = (() => {
    if (!input.initializedPlayer || input.view === "BACKSTORY") {
      return createDefaultWeeklyActionState(input.leagueLevel);
    }
    if (input.view === "POSTGAME" && input.lastMatchResult) {
      return createDefaultWeeklyActionState(input.leagueLevel, {
        slotsRemaining: 0,
        matchUnlocked: true,
        postgamePending: true,
      });
    }
    if (input.view === "NARRATIVE") {
      return createDefaultWeeklyActionState(input.leagueLevel, {
        pendingNarrativeActionId: "FILM_COACH_TRUST",
      });
    }
    if (input.view === "HUB" || input.view === "MATCH") {
      return createDefaultWeeklyActionState(input.leagueLevel, {
        slotsRemaining: 0,
        matchUnlocked: true,
      });
    }
    return createDefaultWeeklyActionState(input.leagueLevel);
  })();

  if (!input.persistedWeeklyLoop) {
    return fallback;
  }

  const actionsTaken: WeeklyActionEntry[] = input.persistedWeeklyLoop.studyCompleted
    ? [getWeeklyActionDefinition("STUDY").buildEntry({ leagueLevel: input.leagueLevel })]
    : [];

  if (input.persistedWeeklyLoop.postgamePending || input.persistedWeeklyLoop.matchCompleted) {
    return createDefaultWeeklyActionState(input.leagueLevel, {
      slotsRemaining: 0,
      actionsTaken,
      matchUnlocked: true,
      postgamePending: Boolean(input.persistedWeeklyLoop.postgamePending || input.persistedWeeklyLoop.matchCompleted),
    });
  }

  if (input.persistedWeeklyLoop.eventCompleted) {
    return createDefaultWeeklyActionState(input.leagueLevel, {
      slotsRemaining: 0,
      actionsTaken,
      matchUnlocked: true,
    });
  }

  return createDefaultWeeklyActionState(input.leagueLevel, {
    actionsTaken,
  });
};

const initialCareerState: CareerState = {
  player: defaultPlayer,
  leagueLevel: LeagueLevel.MIDDLE_SCHOOL,
  careerPhase: "MIDDLE_SCHOOL_AAU",
  status: CareerStatus.ACTIVE,
  starRating: 1,
  scoutVisibility: 20,
  coachTrust: 50,
  fans: 50,
  teammates: 50,
  energy: 100,
  condition: 100,
  recentRatingTrend: 0,
  gpa: 2.5,
  currentYear: 2026,
  seasonNumber: 1,
  currentWeek: 1,
  teamId: null,
  teamInterestById: {},
  schoolPath: "LOCAL_3A",
  pendingSchoolPathSelection: false,
  offers: [],
  seasonSchedule: createDefaultSeasonSchedule(2026, 1, "MIDDLE_SCHOOL_AAU", 1),
  relationships: {},
  eligibility: createDefaultEligibilityState("MIDDLE_SCHOOL_AAU", 2.5),
  injury: null,
  wearTear: 0,
  financeState: createDefaultFinanceState(),
  financeLedger: [],
  legacyPerks: [],
  isGoatPath: false,
  view: getInitialCareerView(),
  currentNarrativeFile: "",
  lastMatchResult: null,
  lastWeeklyActionResult: null,
  newsFeed: [],
  weeklyActionState: createDefaultWeeklyActionState(LeagueLevel.MIDDLE_SCHOOL),
  ovrBudget: 60,
  exile: null,
  exileState: createDefaultExileState(),
};

const emptyBoxScore = (): MatchBoxScore => ({
  homePlayers: [],
  awayPlayers: [],
  homeTotals: {
    pts: 0,
    reb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    to: 0,
    fgm: 0,
    fga: 0,
    ftm: 0,
    fta: 0,
    pf: 0,
  },
  awayTotals: {
    pts: 0,
    reb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    to: 0,
    fgm: 0,
    fga: 0,
    ftm: 0,
    fta: 0,
    pf: 0,
  },
});

const normalizeLastMatchResult = (
  result: CareerState["lastMatchResult"] | null | undefined,
): CareerState["lastMatchResult"] | null =>
  result
    ? {
        ...result,
        boxScore: result.boxScore ?? emptyBoxScore(),
        consequences: result.consequences ?? [],
        matchRating: typeof result.matchRating === "number" ? result.matchRating : 5,
        ratingDelta: typeof result.ratingDelta === "number" ? result.ratingDelta : 0,
        meterDeltas: {
          ...createDefaultMeterDeltas(),
          ...(result.meterDeltas ?? {}),
        },
      }
    : null;

const normalizePersistedPlayer = (player: LegacyPlayerStateInput): Player => normalizePlayerStateForInk(player);

const isBuildBackstoryInput = (input: BackstoryInput | BuildBackstoryInput): input is BuildBackstoryInput =>
  "buildAttributes" in input;

const isInitializedPlayer = (player: Player): boolean =>
  player.id.trim().length > 0 && player.name.trim().length > 0 && Boolean(player.identity) && Boolean(player.dna);

const appendNewsItem = (existingNews: CareerState["newsFeed"], item: CareerState["newsFeed"][number]): CareerState["newsFeed"] =>
  [item, ...existingNews].slice(0, NEWS_FEED_LIMIT);

const seedHighSchoolRecruitingState = (
  state: Pick<CareerState, "player" | "scoutVisibility" | "starRating" | "currentWeek">,
  schoolPath: SchoolPath,
) => {
  const profile = getSchoolPathProfile(schoolPath);
  const teamInterestById = seedHighSchoolTeamInterest({
    programs: HIGH_SCHOOL_RECRUITING_PROGRAMS,
    player: state.player,
    scoutVisibility: state.scoutVisibility,
    starRating: state.starRating,
    schoolPathExposureBoost: profile.immediateExposureBoost,
  });

  return {
    teamInterestById,
    offers: generateHighSchoolOffers({
      currentOffers: [],
      interestById: teamInterestById,
      programs: HIGH_SCHOOL_RECRUITING_PROGRAMS,
      currentWeek: state.currentWeek,
    }),
  };
};

const resolveInterestAndOffers = (input: {
  state: Pick<CareerState, "offers" | "currentWeek">;
  teamInterestById: Record<string, number>;
}) => ({
  teamInterestById: input.teamInterestById,
  offers: generateHighSchoolOffers({
    currentOffers: input.state.offers,
    interestById: input.teamInterestById,
    programs: HIGH_SCHOOL_RECRUITING_PROGRAMS,
    currentWeek: input.state.currentWeek,
  }),
});

const isRespondableHighSchoolOffer = (offer: Offer): boolean =>
  offer.phases.includes("HIGH_SCHOOL") && (offer.type === "SCHOLARSHIP" || offer.type === "WALK_ON");


const normalizePlayerIdentityHometown = (player: Player): Player => {
  if (!player.identity) {
    return player;
  }

  const defaultStateCode = getDefaultStateCode();
  type IdentityHometown = NonNullable<Player["identity"]>["hometown"];
  const rawHometown = player.identity.hometown as Partial<IdentityHometown> & { stateCode?: string };
  const legacyBySlug = rawHometown.slug ? findCityByLegacySlug(rawHometown.slug) : undefined;
  const normalizedStateCode = rawHometown.stateCode?.trim() || legacyBySlug?.stateCode || defaultStateCode;
  const fallbackCitySlug = getDefaultCityForState(normalizedStateCode).slug;
  const normalizedCitySlug = rawHometown.slug || legacyBySlug?.slug || fallbackCitySlug;
  const normalizedHometown = resolveHometown(normalizedStateCode, normalizedCitySlug);

  const primaryPosition = player.identity.primaryPosition ?? player.position;
  const secondaryPosition =
    player.identity.secondaryPosition ??
    player.secondaryPosition ??
    getDefaultSecondaryPosition(primaryPosition);

  return {
    ...player,
    secondaryPosition: player.secondaryPosition ?? secondaryPosition,
    identity: {
      ...player.identity,
      hometown: normalizedHometown,
      primaryPosition,
      secondaryPosition,
      height:
        player.identity.height ??
        heightFromPresetMidpoint((player.identity as { heightPreset?: HeightPreset }).heightPreset ?? "6_2_6_4"),
      weightLbs:
        player.identity.weightLbs ??
        weightFromPresetMidpoint((player.identity as { weightPreset?: WeightPreset }).weightPreset ?? "181_200"),
    },
  };
};

const buildPlayerBuilderProfile = (player: Player): GeneratedBadgeProfile | undefined => {
  if (!player.dna) {
    return undefined;
  }

  const caps = enforceCapsAtLeastCurrent(player.dna.caps, player.attributes);
  return deriveGeneratedBadgeProfile(player.attributes, caps, player.position);
};

const backfillPublicBuilderMetadata = (player: Player): Player => {
  if (!player.identity || !player.dna) {
    return player;
  }

  const publicAttributes = player.dna.publicAttributes ?? player.identity.publicAttributes ?? inferPublicAttributesFromEngine(player.attributes);
  const startingArchetypeId =
    player.dna.startingArchetypeId ??
    player.identity.startingArchetypeId ??
    ((player.identity.archetypeId as StartingArchetypeId | undefined) ?? "all_around");
  const currentPlaystyle =
    player.dna.currentPlaystyle ??
    player.identity.currentPlaystyle ??
    player.identity.roleLabel ??
    getPlaystyleLabel(publicAttributes, player.position, startingArchetypeId);
  const fuzzyScoutingSummary =
    player.dna.fuzzyScoutingSummary ??
    player.identity.fuzzyScoutingSummary ??
    getFuzzyScoutingSummary(player.dna.potential, player.dna.growthCurve, publicAttributes);

  return {
    ...player,
    identity: {
      ...player.identity,
      startingArchetypeId,
      currentPlaystyle,
      publicAttributes,
      fuzzyScoutingSummary,
    },
    dna: {
      ...player.dna,
      startingArchetypeId,
      currentPlaystyle,
      publicAttributes,
      hiddenEngineAttributes: player.dna.hiddenEngineAttributes ?? player.attributes,
      fuzzyScoutingSummary,
      publicTraits: (player.dna.publicTraits ?? []).map((trait) =>
        trait.startsWith("Potential Tier:") ? fuzzyScoutingSummary : trait,
      ),
    },
  };
};

const migratePlayerWithBackstory = (player: Player): Player => {
  let migratedPlayer = normalizePlayerIdentityHometown({ ...player });
  if (!migratedPlayer.identity || !migratedPlayer.dna) {
    const backstoryInput = synthesizeBackstoryInputFromLegacy(migratedPlayer as LegacyPlayerStateInput);
    const seed = createBackstorySeed(backstoryInput);
    const generated = generateBackstoryFromInput(backstoryInput, { seedOverride: seed });
      migratedPlayer = {
        ...migratedPlayer,
        name: generated.identity.displayName,
        archetype: generated.identity.archetype,
        identity: generated.identity,
        dna: {
          ...generated.dna,
          caps: enforceCapsAtLeastCurrent(generated.dna.caps, migratedPlayer.attributes),
          growthResidue: generated.dna.growthResidue ?? {},
          builderProfile: generated.dna.builderProfile ?? generated.builderProfile,
        },
      };
    } else {
      const builderProfile = migratedPlayer.dna.builderProfile ?? buildPlayerBuilderProfile(migratedPlayer);
      migratedPlayer = {
        ...migratedPlayer,
      secondaryPosition:
        migratedPlayer.secondaryPosition ??
        migratedPlayer.identity?.secondaryPosition ??
        getDefaultSecondaryPosition(migratedPlayer.position),
        dna: {
          ...migratedPlayer.dna,
          potentialTier: migratedPlayer.dna.potentialTier ?? getPotentialTier(migratedPlayer.dna.potential),
          caps: enforceCapsAtLeastCurrent(migratedPlayer.dna.caps, migratedPlayer.attributes),
          growthResidue: migratedPlayer.dna.growthResidue ?? {},
          builderProfile,
        },
      };
    }
  return backfillPublicBuilderMetadata(migratedPlayer);
};

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      ...initialCareerState,
      initializeCareer: (input: BackstoryInput | BuildBackstoryInput) => {
        const seed =
          input.generationSeed ??
          (isBuildBackstoryInput(input) ? createBuildBackstorySeed(input) : createBackstorySeed(input));
        const generated = isBuildBackstoryInput(input)
          ? generateBackstoryFromBuildInput(input, { seedOverride: seed })
          : generateBackstoryFromInput(input, { seedOverride: seed });
        const creationNews = createCareerCreationNewsItem(generated.identity, initialCareerState.currentWeek);
        const initializedPlayer: Player = {
          ...initialCareerState.player,
          id: seed.toString(),
          name: generated.identity.displayName,
          age: 13,
          position: generated.identity.primaryPosition,
          secondaryPosition: generated.identity.secondaryPosition,
          archetype: generated.identity.archetype,
          identity: generated.identity,
          dna: {
            ...generated.dna,
            builderProfile: generated.dna.builderProfile ?? generated.builderProfile,
          },
          attributes: generated.startingAttributes,
        };
        const progressionState = createCareerProgressionState({
          player: initializedPlayer,
          leagueLevel: initialCareerState.leagueLevel,
          gpa: initialCareerState.gpa,
          currentYear: initialCareerState.currentYear,
          seasonNumber: initialCareerState.seasonNumber,
          currentWeek: initialCareerState.currentWeek,
          exile: null,
        });

        set(() => ({
          ...initialCareerState,
          ...progressionState,
          player: initializedPlayer,
          view: "HUB",
          pendingSchoolPathSelection: false,
          newsFeed: [creationNews],
          weeklyActionState: createDefaultWeeklyActionState(initialCareerState.leagueLevel),
        }));
      },
      applyAttributeGain: (attr, amount, source = "SYSTEM") => {
        set((state) => {
          const currentValue = state.player.attributes[attr];
          const cap = state.player.dna?.caps[attr] ?? 99;
          const growthByLeague = state.player.dna?.growthByLeague ?? {
            [LeagueLevel.MIDDLE_SCHOOL]: 1,
            [LeagueLevel.HIGH_SCHOOL]: 1,
            [LeagueLevel.COLLEGE]: 1,
            [LeagueLevel.PRO]: 1,
          };
          const residue = state.player.dna?.growthResidue?.[attr] ?? 0;
          const result = calculateAttributeGain({
            attribute: attr,
            amount,
            currentValue,
            cap,
            source,
            leagueLevel: state.leagueLevel,
            growthByLeague,
            archetype: state.player.archetype,
            residue,
          });
          const cappedValue = clampAttribute(result.nextValue) as PlayerAttributes[typeof attr];
          const nextGrowthResidue = state.player.dna
            ? {
                ...state.player.dna.growthResidue,
                [attr]: result.nextResidue,
              }
            : undefined;

          return {
            player: {
              ...state.player,
              attributes: {
                ...state.player.attributes,
                [attr]: cappedValue,
              },
              dna: state.player.dna
                ? {
                    ...state.player.dna,
                    growthResidue: nextGrowthResidue ?? state.player.dna.growthResidue,
                  }
                : null,
            },
          };
        });
      },
      updateAttribute: (attr, amount) => {
        get().applyAttributeGain(attr, amount, "SYSTEM");
      },
      recordFinanceTransaction: (input) => {
        set((state) => buildFinanceTransactionState(state, input) ?? state);
      },
      updateBankBalance: (amount) => {
        const transaction = buildFinanceTransactionFromDelta(amount, {
          category: "misc",
          description: "Balance update",
          source: "system",
        });
        if (!transaction) {
          return;
        }

        get().recordFinanceTransaction(transaction);
      },
      adjustGpa: (delta) => {
        set((state) => {
          const nextGpa = clampGpa(state.gpa + delta);
          return {
            gpa: nextGpa,
            eligibility: syncEligibilityState(state.eligibility, state.careerPhase, nextGpa),
          };
        });
      },
      advanceWeek: () => {
        set((state) => {
          const nextState = resolveWeekAdvance({
            currentWeek: state.currentWeek,
            currentYear: state.currentYear,
            seasonNumber: state.seasonNumber,
            careerPhase: state.careerPhase,
            seasonSchedule: state.seasonSchedule,
          });
          const nextHealthState = advanceHealthState({
            injury: state.injury,
            wearTear: state.wearTear,
            currentWeek: state.currentWeek,
          });
          return {
            currentWeek: nextState.currentWeek,
            currentYear: nextState.currentYear,
            seasonNumber: nextState.seasonNumber,
            seasonSchedule: nextState.seasonSchedule,
            ...nextHealthState,
          };
        });
      },
      advanceSeason: () => {
        set((state) => ({
          seasonNumber: state.seasonNumber + 1,
          currentWeek: 1,
          seasonSchedule: createDefaultSeasonSchedule(
            state.currentYear,
            state.seasonNumber + 1,
            state.careerPhase,
            1,
          ),
        }));
      },
      updateLeagueLevel: (level) => {
        set((state) => {
          const careerPhase = careerPhaseFromLeagueLevel(level);
          return {
            leagueLevel: level,
            careerPhase,
            scoutVisibility: defaultScoutVisibilityForPhase(careerPhase),
            seasonSchedule: createDefaultSeasonSchedule(
              state.currentYear,
              state.seasonNumber,
              careerPhase,
              state.currentWeek,
            ),
            eligibility: syncEligibilityState(state.eligibility, careerPhase, state.gpa),
            weeklyActionState: createDefaultWeeklyActionState(level),
            pendingSchoolPathSelection:
              level === LeagueLevel.HIGH_SCHOOL ? false : state.pendingSchoolPathSelection,
            exileState: state.exileState.enteredAtPhase ? { ...state.exileState, enteredAtPhase: careerPhase } : state.exileState,
          };
        });
      },
      updateStatus: (status) => {
        set(() => ({ status }));
      },
      setCurrentWeek: (week) => {
        set(() => ({ currentWeek: week }));
      },
      setTeam: (teamId) => {
        set(() => ({ teamId }));
      },
      applyTeamInterestDelta: (targetId, amount) => {
        set((state) => {
          if (state.leagueLevel !== LeagueLevel.HIGH_SCHOOL || Object.keys(state.teamInterestById).length === 0) {
            return state;
          }

          const nextInterestById = applyInterestDelta(state.teamInterestById, targetId, amount);
          return {
            ...resolveInterestAndOffers({
              state,
              teamInterestById: nextInterestById,
            }),
          };
        });
      },
      respondToOffer: (offerId, decision) => {
        set((state) => {
          if (state.leagueLevel !== LeagueLevel.HIGH_SCHOOL) {
            return state;
          }

          const targetOffer = state.offers.find((offer) => offer.id === offerId);
          if (!targetOffer || targetOffer.status !== "AVAILABLE" || !isRespondableHighSchoolOffer(targetOffer)) {
            return state;
          }

          return {
            offers: state.offers.map((offer) => {
              if (!isRespondableHighSchoolOffer(offer) || offer.status !== "AVAILABLE") {
                return offer;
              }

              if (offer.id === offerId) {
                return {
                  ...offer,
                  status: decision === "ACCEPT" ? "ACCEPTED" : "DECLINED",
                };
              }

              if (decision === "ACCEPT") {
                return {
                  ...offer,
                  status: "DECLINED",
                };
              }

              return offer;
            }),
          };
        });
      },
      selectSchoolPath: (path) => {
        set((state) => {
          if (!state.pendingSchoolPathSelection || !state.player.identity) {
            return state;
          }

          const profile = getSchoolPathProfile(path);
          const careerPhase = careerPhaseFromLeagueLevel(LeagueLevel.HIGH_SCHOOL);
          const recruitingState = seedHighSchoolRecruitingState(
            {
              player: state.player,
              scoutVisibility: Math.max(state.scoutVisibility, defaultScoutVisibilityForPhase(careerPhase)) + profile.immediateExposureBoost,
              starRating: state.starRating,
              currentWeek: state.currentWeek,
            },
            path,
          );

          return {
            leagueLevel: LeagueLevel.HIGH_SCHOOL,
            careerPhase,
            schoolPath: path,
            pendingSchoolPathSelection: false,
            scoutVisibility: clampVisibility(
              Math.max(state.scoutVisibility, defaultScoutVisibilityForPhase(careerPhase)) + profile.immediateExposureBoost,
            ),
            seasonSchedule: createDefaultSeasonSchedule(
              state.currentYear,
              state.seasonNumber,
              careerPhase,
              state.currentWeek,
            ),
            eligibility: syncEligibilityState(state.eligibility, careerPhase, state.gpa),
            relationships: {
              ...state.relationships,
              "fanbase-hometown": createSchoolPathFanbaseRelationship(path, state.player.identity.hometown.city),
            },
            teamInterestById: recruitingState.teamInterestById,
            offers: recruitingState.offers,
            newsFeed: appendNewsItem(
              state.newsFeed,
              createSchoolPathCommitmentNewsItem(state.player.identity, path, state.currentWeek),
            ),
            view: "HUB",
            weeklyActionState: createDefaultWeeklyActionState(LeagueLevel.HIGH_SCHOOL),
          };
        });
      },
      setGoatPath: (isGoatPath) => {
        set(() => ({ isGoatPath }));
      },
      setCurrentYear: (year) => {
        set(() => ({ currentYear: year }));
      },
      startWeek: () => {
        set((state) => ({
          weeklyActionState: createDefaultWeeklyActionState(state.leagueLevel),
          lastWeeklyActionResult: null,
        }));
      },
      dismissWeeklyActionResult: () => {
        set(() => ({ lastWeeklyActionResult: null }));
      },
      takeWeeklyAction: (actionId) => {
        set((state) => {
          if (!canTakeWeeklyAction(state, actionId)) {
            return state;
          }

          const definition = getWeeklyActionDefinition(actionId);
          if (definition.isNarrative && definition.narrativeFile) {
            return {
              view: "NARRATIVE",
              currentNarrativeFile: definition.narrativeFile,
              weeklyActionState: {
                ...state.weeklyActionState,
                pendingNarrativeActionId: actionId,
              },
            };
          }

          const entry = definition.buildEntry({ leagueLevel: state.leagueLevel });
          return applyWeeklyActionToState(state, entry);
        });
      },
      unlockMatchIfReady: () => {
        set((state) => ({
          weeklyActionState: {
            ...state.weeklyActionState,
            matchUnlocked: canUnlockMatch(state.weeklyActionState),
          },
        }));
      },
      startNarrative: (fileName) => {
        set((state) => {
          if (!canStartNarrative(state)) {
            return state;
          }

          return {
            view: "NARRATIVE",
            currentNarrativeFile: fileName,
          };
        });
      },
      completeStudyActivity: () => {
        get().takeWeeklyAction("STUDY");
      },
      completeNarrativeEvent: () => {
        get().completeOptionalNarrativeAction();
      },
      completeOptionalNarrativeAction: () => {
        set((state) => {
          const pendingActionId = state.weeklyActionState.pendingNarrativeActionId;
          if (!pendingActionId) {
            return {
              view: "HUB",
              currentNarrativeFile: "",
            };
          }

          const entry = getWeeklyActionDefinition(pendingActionId).buildEntry({ leagueLevel: state.leagueLevel });
          return {
            ...applyWeeklyActionToState(state, entry),
            view: "HUB",
            currentNarrativeFile: "",
          };
        });
      },
      closeNarrative: () => {
        set((state) => ({
          view: "HUB",
          currentNarrativeFile: "",
          weeklyActionState: {
            ...state.weeklyActionState,
            pendingNarrativeActionId: null,
          },
        }));
      },
      navigateToMatch: () => {
        set((state) => {
          if (!canStartMatch(state)) {
            return state;
          }

          return {
            view: "MATCH",
            lastMatchResult: null,
            lastWeeklyActionResult: null,
          };
        });
      },
      navigateToHub: () => {
        set(() => ({
          view: "HUB",
          lastMatchResult: null,
          lastWeeklyActionResult: null,
        }));
      },
      applyMatchConsequences: (consequences) => {
        if (consequences.length === 0) {
          return;
        }

        set((state) => applyMatchConsequencesToHealth({
          injury: state.injury,
          wearTear: state.wearTear,
          currentWeek: state.currentWeek,
          consequences,
        }));
      },
      completeMatch: ({ homeScore, awayScore, overtimePeriods, boxScore, consequences = [] }) => {
        set((state) => {
          const didWin = homeScore > awayScore;
          const schoolPathProfile = state.leagueLevel === LeagueLevel.HIGH_SCHOOL ? getSchoolPathProfile(state.schoolPath) : null;
          const bankDelta = (didWin ? 500 : 300) + (schoolPathProfile?.bankRewardBonus ?? 0);
          const moraleDelta = (didWin ? 5 : -3) + (schoolPathProfile?.moraleRewardBonus ?? 0);
          const ratingOutcome = calculatePersonalMatchRating({
            boxScore,
            didWin,
            consequences,
          });
          const priorMatchRating = state.lastMatchResult?.matchRating;
          const ratingDelta =
            typeof priorMatchRating === "number" ? Math.round((ratingOutcome.matchRating - priorMatchRating) * 10) / 10 : 0;
          const nextState = resolveWeekAdvance({
            currentWeek: state.currentWeek,
            currentYear: state.currentYear,
            seasonNumber: state.seasonNumber,
            careerPhase: state.careerPhase,
            seasonSchedule: state.seasonSchedule,
          });
          const lastMatchResult = {
            homeScore,
            awayScore,
            didWin,
            bankDelta,
            moraleDelta,
            weekAfter: nextState.currentWeek,
            overtimePeriods: overtimePeriods ?? 0,
            boxScore,
            consequences,
            matchRating: ratingOutcome.matchRating,
            ratingDelta,
            meterDeltas: ratingOutcome.meterDeltas,
          };
          const nextHealthState = applyMatchConsequencesToHealth({
            injury: state.injury,
            wearTear: state.wearTear,
            currentWeek: state.currentWeek,
            consequences,
          });

          return {
            view: "POSTGAME",
            ...nextHealthState,
            lastMatchResult,
            weeklyActionState: {
              ...state.weeklyActionState,
              matchUnlocked: true,
              postgamePending: true,
            },
          };
        });
      },
      resolvePostgameAndAdvanceWeek: () => {
        set((state) => {
          if (!state.lastMatchResult) {
            const nextHealthState = advanceHealthState({
              injury: state.injury,
              wearTear: state.wearTear,
              currentWeek: state.currentWeek,
            });
            return {
              view: shouldPromptForSchoolPathSelection(state) ? "SCHOOL_PATH_SELECT" : "HUB",
              ...nextHealthState,
              weeklyActionState: createDefaultWeeklyActionState(state.leagueLevel),
              lastWeeklyActionResult: null,
            };
          }

          const nextState = resolveWeekAdvance({
            currentWeek: state.currentWeek,
            currentYear: state.currentYear,
            seasonNumber: state.seasonNumber,
            careerPhase: state.careerPhase,
            seasonSchedule: state.seasonSchedule,
          });
          const nextMorale = clampMorale(state.player.morale + state.lastMatchResult.moraleDelta);
          const visibilityGain =
            state.leagueLevel === LeagueLevel.HIGH_SCHOOL
              ? getSchoolPathProfile(state.schoolPath).weeklyExposureGain + (state.lastMatchResult.didWin ? 2 : 1)
              : 0;
          const nextScoutVisibility = clampVisibility(state.scoutVisibility + visibilityGain);
          const newsFeed =
            state.player.identity
              ? appendNewsItem(state.newsFeed, createPostgameNewsItem(state.player.identity, state.lastMatchResult))
              : state.newsFeed;
          const pendingSchoolPathSelection =
            state.leagueLevel === LeagueLevel.MIDDLE_SCHOOL && state.currentWeek === 1;
          const nextInterestById =
            state.leagueLevel === LeagueLevel.HIGH_SCHOOL && Object.keys(state.teamInterestById).length > 0
              ? buildInterestDeltaFromMatch({
                  currentInterest: state.teamInterestById,
                  programs: HIGH_SCHOOL_RECRUITING_PROGRAMS,
                  player: state.player,
                  result: state.lastMatchResult,
                  scoutVisibilityGain: visibilityGain,
                })
              : state.teamInterestById;
          const recruitingState =
            state.leagueLevel === LeagueLevel.HIGH_SCHOOL
              ? resolveInterestAndOffers({
                  state: {
                    offers: state.offers,
                    currentWeek: nextState.currentWeek,
                  },
                  teamInterestById: nextInterestById,
                })
              : {
                  teamInterestById: state.teamInterestById,
                  offers: state.offers,
                };
          const nextHealthState = advanceHealthState({
            injury: state.injury,
            wearTear: state.wearTear,
            currentWeek: state.currentWeek,
          });
          const matchRewardTransaction = buildFinanceTransactionFromDelta(state.lastMatchResult.bankDelta, {
            category: "match_reward",
            description: state.lastMatchResult.didWin ? "Win bonus" : "Game payout",
            source: "match",
          });
          const financeUpdate = matchRewardTransaction ? buildFinanceTransactionState(state, matchRewardTransaction) : null;
          const nextMeterState = applyCareerMeterDeltas(state, state.lastMatchResult.meterDeltas);
          const nextRecentRatingTrend = clampRecentRatingTrend(state.recentRatingTrend + Math.sign(state.lastMatchResult.ratingDelta));

          return {
            currentWeek: nextState.currentWeek,
            currentYear: nextState.currentYear,
            seasonNumber: nextState.seasonNumber,
            seasonSchedule: nextState.seasonSchedule,
            view: pendingSchoolPathSelection ? "SCHOOL_PATH_SELECT" : "HUB",
            player: {
              ...(financeUpdate?.player ?? state.player),
              morale: nextMorale,
            },
            financeState: financeUpdate?.financeState ?? state.financeState,
            financeLedger: financeUpdate?.financeLedger ?? state.financeLedger,
            lastMatchResult: null,
            lastWeeklyActionResult: null,
            newsFeed,
            scoutVisibility: nextScoutVisibility,
            coachTrust: nextMeterState.coachTrust,
            fans: nextMeterState.fans,
            teammates: nextMeterState.teammates,
            energy: nextMeterState.energy,
            condition: nextMeterState.condition,
            recentRatingTrend: nextRecentRatingTrend,
            teamInterestById: recruitingState.teamInterestById,
            offers: recruitingState.offers,
            pendingSchoolPathSelection,
            ...nextHealthState,
            weeklyActionState: createDefaultWeeklyActionState(state.leagueLevel),
          };
        });
      },
      hydrateCareer: (state) => {
        set(() => ({ ...state, lastWeeklyActionResult: null }));
      },
      resetCareer: (state) => {
        set(() => ({ ...state, lastWeeklyActionResult: null }));
      },
    }),
    {
      name: "leaguebound-career-storage",
      version: 16,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState;
        }

        const typedState = persistedState as Partial<CareerStore> & {
          player?: LegacyPlayerStateInput;
          injuryState?: LegacyPersistedInjuryState;
          weeklyLoop?: {
            eventCompleted?: boolean;
            matchCompleted?: boolean;
            postgamePending?: boolean;
            studyCompleted?: boolean;
          };
        };
        if (!typedState.player) {
          const fallbackPlayer = defaultPlayer;
          const fallbackLeagueLevel = typedState.leagueLevel ?? LeagueLevel.MIDDLE_SCHOOL;
          const fallbackGpa = clampGpa(typedState.gpa ?? initialCareerState.gpa);
          const fallbackCurrentYear = typedState.currentYear ?? initialCareerState.currentYear;
          const fallbackSeasonNumber = typedState.seasonNumber ?? initialCareerState.seasonNumber;
          const fallbackCurrentWeek = typedState.currentWeek ?? initialCareerState.currentWeek;
          const progressionState = createCareerProgressionState({
            player: fallbackPlayer,
            leagueLevel: fallbackLeagueLevel,
            gpa: fallbackGpa,
            currentYear: fallbackCurrentYear,
            seasonNumber: fallbackSeasonNumber,
            currentWeek: fallbackCurrentWeek,
            exile: typedState.exile ?? null,
          });
          return {
            ...typedState,
            leagueLevel: fallbackLeagueLevel,
            gpa: fallbackGpa,
            currentYear: fallbackCurrentYear,
            seasonNumber: fallbackSeasonNumber,
            currentWeek: fallbackCurrentWeek,
            view: getInitialCareerView(),
            newsFeed: [],
            weeklyActionState: createDefaultWeeklyActionState(fallbackLeagueLevel),
            pendingSchoolPathSelection: false,
            financeLedger: [],
            ovrBudget: typedState.ovrBudget ?? 60,
            ...progressionState,
          };
        }

        const normalizedPlayer = normalizePersistedPlayer(typedState.player);
        const migratedPlayer = migratePlayerWithBackstory(normalizedPlayer);
        const newsFeed = Array.isArray(typedState.newsFeed) ? typedState.newsFeed : [];
        const shouldUseBackstoryView = !isInitializedPlayer(migratedPlayer) && BACKSTORY_V1_ENABLED;
        const leagueLevel = typedState.leagueLevel ?? LeagueLevel.MIDDLE_SCHOOL;
        const currentYear = typedState.currentYear ?? initialCareerState.currentYear;
        const seasonNumber = typedState.seasonNumber ?? initialCareerState.seasonNumber;
        const currentWeek = typedState.currentWeek ?? initialCareerState.currentWeek;
        const gpa = clampGpa(typedState.gpa ?? initialCareerState.gpa);
        const resolvedView = shouldUseBackstoryView ? "BACKSTORY" : typedState.view ?? "HUB";
        const progressionState = createCareerProgressionState({
          player: migratedPlayer,
          leagueLevel,
          gpa,
          currentYear,
          seasonNumber,
          currentWeek,
          exile: typedState.exile ?? null,
        });
        const existingExileState = typedState.exileState
          ? {
              ...progressionState.exileState,
              ...typedState.exileState,
              currentMode: typedState.exileState.currentMode ?? progressionState.exileState.currentMode,
              triggerReason: typedState.exileState.triggerReason ?? progressionState.exileState.triggerReason,
              blockedDestinationIds: typedState.exileState.blockedDestinationIds ?? progressionState.exileState.blockedDestinationIds,
              notes: typedState.exileState.notes ?? progressionState.exileState.notes,
            }
          : progressionState.exileState;
        const weeklyActionState = deriveMigratedWeeklyActionState({
          persistedWeeklyLoop: typedState.weeklyLoop,
          view: resolvedView,
          lastMatchResult: typedState.lastMatchResult ?? null,
          initializedPlayer: isInitializedPlayer(migratedPlayer),
          leagueLevel,
        });
        const migratedTeamInterestById = typedState.teamInterestById ?? progressionState.teamInterestById;
        const shouldBackfillHighSchoolRecruiting =
          leagueLevel === LeagueLevel.HIGH_SCHOOL && Object.keys(migratedTeamInterestById).length === 0;
        const highSchoolRecruitingState = shouldBackfillHighSchoolRecruiting
          ? seedHighSchoolRecruitingState(
              {
                player: migratedPlayer,
                scoutVisibility: clampVisibility(typedState.scoutVisibility ?? progressionState.scoutVisibility),
                starRating: typedState.starRating ?? progressionState.starRating,
                currentWeek,
              },
              typedState.schoolPath ?? progressionState.schoolPath,
            )
          : null;
        const migratedOffers = (highSchoolRecruitingState?.offers ?? typedState.offers ?? progressionState.offers).map(
          normalizeOfferExposureTier,
        );
        const migratedInjury =
          typedState.injury ??
          migrateLegacyInjuryState(typedState.injuryState, currentWeek) ??
          progressionState.injury;
        const migratedWearTear = typedState.wearTear ?? 0;

        return {
          ...typedState,
          player: migratedPlayer,
          leagueLevel,
          gpa,
          currentYear,
          seasonNumber,
          currentWeek,
          careerPhase: typedState.careerPhase ?? progressionState.careerPhase,
          view: resolvedView,
          newsFeed,
          weeklyActionState,
          pendingSchoolPathSelection: typedState.pendingSchoolPathSelection ?? false,
          starRating: typedState.starRating ?? progressionState.starRating,
          scoutVisibility: clampVisibility(typedState.scoutVisibility ?? progressionState.scoutVisibility),
          coachTrust: clampMeter(typedState.coachTrust ?? progressionState.coachTrust),
          fans: clampMeter(typedState.fans ?? progressionState.fans),
          teammates: clampMeter(typedState.teammates ?? progressionState.teammates),
          energy: clampMeter(typedState.energy ?? progressionState.energy),
          condition: clampMeter(typedState.condition ?? progressionState.condition),
          recentRatingTrend: clampRecentRatingTrend(typedState.recentRatingTrend ?? progressionState.recentRatingTrend),
          teamInterestById: highSchoolRecruitingState?.teamInterestById ?? migratedTeamInterestById,
          schoolPath: typedState.schoolPath ?? progressionState.schoolPath,
          offers: migratedOffers,
          seasonSchedule: typedState.seasonSchedule ?? progressionState.seasonSchedule,
          relationships: typedState.relationships ?? progressionState.relationships,
          eligibility: syncEligibilityState(
            typedState.eligibility ?? progressionState.eligibility,
            typedState.careerPhase ?? progressionState.careerPhase,
            gpa,
          ),
          injury: migratedInjury,
          wearTear: migratedWearTear,
          financeState: typedState.financeState ?? progressionState.financeState,
          financeLedger: typedState.financeLedger ?? [],
          legacyPerks: typedState.legacyPerks ?? progressionState.legacyPerks,
          ovrBudget: typedState.ovrBudget ?? 60,
          exileState: existingExileState,
          exile: typedState.exile ?? deriveLegacyExile(existingExileState),
          lastMatchResult: normalizeLastMatchResult(typedState.lastMatchResult),
          lastWeeklyActionResult: null,
        };
      },
      partialize: (state) => ({
        player: state.player,
        leagueLevel: state.leagueLevel,
        gpa: state.gpa,
        status: state.status,
        currentYear: state.currentYear,
        seasonNumber: state.seasonNumber,
        currentWeek: state.currentWeek,
        teamId: state.teamId,
        careerPhase: state.careerPhase,
        starRating: state.starRating,
        scoutVisibility: state.scoutVisibility,
        coachTrust: state.coachTrust,
        fans: state.fans,
        teammates: state.teammates,
        energy: state.energy,
        condition: state.condition,
        recentRatingTrend: state.recentRatingTrend,
        teamInterestById: state.teamInterestById,
        schoolPath: state.schoolPath,
        pendingSchoolPathSelection: state.pendingSchoolPathSelection,
        offers: state.offers,
        seasonSchedule: state.seasonSchedule,
        relationships: state.relationships,
        eligibility: state.eligibility,
        injury: state.injury,
        wearTear: state.wearTear,
        financeState: state.financeState,
        financeLedger: state.financeLedger,
        legacyPerks: state.legacyPerks,
        isGoatPath: state.isGoatPath,
        view: state.view,
        currentNarrativeFile: state.currentNarrativeFile,
        lastMatchResult: normalizeLastMatchResult(state.lastMatchResult),
        newsFeed: state.newsFeed,
        weeklyActionState: state.weeklyActionState,
        ovrBudget: state.ovrBudget,
        exile: state.exile,
        exileState: state.exileState,
      }),
    },
  ),
);
