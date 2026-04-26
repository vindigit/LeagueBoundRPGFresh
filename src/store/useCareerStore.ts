import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
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
import { createCareerCreationNewsItem, createPostgameNewsItem } from "../features/backstory/news";
import { computeOverall } from "../builder/derivedRatings";
import {
  CareerStatus,
  LeagueLevel,
  type CareerActions,
  type CareerState,
  type ExileStatus,
  type WeeklyLoopState,
} from "../types/career";
import type {
  CareerPhase,
  EligibilityState,
  ExileState,
  FinanceState,
  InjuryState,
  SchoolPath,
  SeasonSchedule,
  StarRating,
} from "../types/careerProgression";
import { normalizePlayerStateForInk, type LegacyPlayerStateInput, type Player, type PlayerAttributes } from "../types/player";
import type { BackstoryInput, BuildBackstoryInput, GeneratedBadgeProfile, HeightPreset, WeightPreset } from "../types/backstory";
import type { MatchBoxScore } from "../features/match/store/useMatchStore";

type CareerStore = CareerState & CareerActions;

const NEWS_FEED_LIMIT = 100;
const clampAttribute = (value: number): number => Math.min(99, Math.max(0, value));
const clampMorale = (value: number): number => Math.min(100, Math.max(0, value));
const clampVisibility = (value: number): number => Math.min(100, Math.max(0, Math.round(value)));

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

const createDefaultEligibilityState = (careerPhase: CareerPhase): EligibilityState => ({
  status: "ELIGIBLE",
  amateurStanding: careerPhase !== "PRO",
  academicRisk: 0,
  complianceRisk: 0,
  suspendedGamesRemaining: 0,
  probationEndsWeek: undefined,
  seasonsRemaining: careerPhase === "PRO" ? 99 : careerPhase === "COLLEGE" ? 4 : 4,
  yearsRemaining: careerPhase === "PRO" ? 99 : careerPhase === "COLLEGE" ? 4 : careerPhase === "HIGH_SCHOOL" ? 4 : 1,
  notes: [],
});

const createDefaultInjuryState = (): InjuryState => ({
  status: "HEALTHY",
  bodyArea: undefined,
  severity: undefined,
  diagnosis: undefined,
  recoveryWeeksRemaining: 0,
  lingeringRisk: 0,
  restrictions: [],
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
  const weeks = [
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
    teamInterestById: {},
    schoolPath: defaultSchoolPathForPhase(careerPhase),
    offers: [],
    seasonSchedule: createDefaultSeasonSchedule(input.currentYear, input.seasonNumber, careerPhase, input.currentWeek),
    relationships: {},
    eligibility: createDefaultEligibilityState(careerPhase),
    injuryState: createDefaultInjuryState(),
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

const createDefaultWeeklyLoopState = (input: Partial<WeeklyLoopState> = {}): WeeklyLoopState => ({
  eventCompleted: input.eventCompleted ?? false,
  matchCompleted: input.matchCompleted ?? false,
  postgamePending: input.postgamePending ?? false,
});

const canStartNarrative = (weeklyLoop: WeeklyLoopState): boolean => !weeklyLoop.eventCompleted && !weeklyLoop.postgamePending;

const canStartMatch = (weeklyLoop: WeeklyLoopState): boolean =>
  weeklyLoop.eventCompleted && !weeklyLoop.matchCompleted && !weeklyLoop.postgamePending;

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

const deriveMigratedWeeklyLoop = (input: {
  persistedWeeklyLoop?: Partial<WeeklyLoopState>;
  view?: CareerState["view"];
  lastMatchResult?: CareerState["lastMatchResult"];
  initializedPlayer: boolean;
}): WeeklyLoopState => {
  const fallback = (() => {
    if (!input.initializedPlayer || input.view === "BACKSTORY") {
      return createDefaultWeeklyLoopState();
    }
    if (input.view === "POSTGAME" && input.lastMatchResult) {
      return createDefaultWeeklyLoopState({
        eventCompleted: true,
        matchCompleted: true,
        postgamePending: true,
      });
    }
    if (input.view === "NARRATIVE") {
      return createDefaultWeeklyLoopState();
    }
    if (input.view === "HUB" || input.view === "MATCH") {
      return createDefaultWeeklyLoopState({
        eventCompleted: true,
      });
    }
    return createDefaultWeeklyLoopState();
  })();

  return createDefaultWeeklyLoopState({
    eventCompleted: input.persistedWeeklyLoop?.eventCompleted ?? fallback.eventCompleted,
    matchCompleted: input.persistedWeeklyLoop?.matchCompleted ?? fallback.matchCompleted,
    postgamePending: input.persistedWeeklyLoop?.postgamePending ?? fallback.postgamePending,
  });
};

const initialCareerState: CareerState = {
  player: defaultPlayer,
  leagueLevel: LeagueLevel.MIDDLE_SCHOOL,
  careerPhase: "MIDDLE_SCHOOL_AAU",
  status: CareerStatus.ACTIVE,
  starRating: 1,
  scoutVisibility: 20,
  currentYear: 2026,
  seasonNumber: 1,
  currentWeek: 1,
  teamId: null,
  teamInterestById: {},
  schoolPath: "LOCAL_3A",
  offers: [],
  seasonSchedule: createDefaultSeasonSchedule(2026, 1, "MIDDLE_SCHOOL_AAU", 1),
  relationships: {},
  eligibility: createDefaultEligibilityState("MIDDLE_SCHOOL_AAU"),
  injuryState: createDefaultInjuryState(),
  financeState: createDefaultFinanceState(),
  legacyPerks: [],
  isGoatPath: false,
  view: getInitialCareerView(),
  currentNarrativeFile: "",
  lastMatchResult: null,
  newsFeed: [],
  weeklyLoop: createDefaultWeeklyLoopState(),
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
  },
});

const normalizePersistedPlayer = (player: LegacyPlayerStateInput): Player => normalizePlayerStateForInk(player);

const isBuildBackstoryInput = (input: BackstoryInput | BuildBackstoryInput): input is BuildBackstoryInput =>
  "buildAttributes" in input;

const isInitializedPlayer = (player: Player): boolean =>
  player.id.trim().length > 0 && player.name.trim().length > 0 && Boolean(player.identity) && Boolean(player.dna);

const appendNewsItem = (existingNews: CareerState["newsFeed"], item: CareerState["newsFeed"][number]): CareerState["newsFeed"] =>
  [item, ...existingNews].slice(0, NEWS_FEED_LIMIT);


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
  return migratedPlayer;
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
          newsFeed: [creationNews],
          weeklyLoop: createDefaultWeeklyLoopState(),
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
      updateBankBalance: (amount) => {
        set((state) => {
          const nextBankBalance = state.player.bankBalance + amount;
          return {
            player: {
              ...state.player,
              bankBalance: nextBankBalance,
            },
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
          return {
            currentWeek: nextState.currentWeek,
            currentYear: nextState.currentYear,
            seasonNumber: nextState.seasonNumber,
            seasonSchedule: nextState.seasonSchedule,
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
            eligibility: createDefaultEligibilityState(careerPhase),
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
      setGoatPath: (isGoatPath) => {
        set(() => ({ isGoatPath }));
      },
      setCurrentYear: (year) => {
        set(() => ({ currentYear: year }));
      },
      startNarrative: (fileName) => {
        set((state) => {
          if (!canStartNarrative(state.weeklyLoop)) {
            return state;
          }

          return {
            view: "NARRATIVE",
            currentNarrativeFile: fileName,
          };
        });
      },
      completeNarrativeEvent: () => {
        set((state) => ({
          view: "HUB",
          currentNarrativeFile: "",
          weeklyLoop: {
            ...state.weeklyLoop,
            eventCompleted: true,
          },
        }));
      },
      closeNarrative: () => {
        set(() => ({
          view: "HUB",
          currentNarrativeFile: "",
        }));
      },
      navigateToMatch: () => {
        set((state) => {
          if (!canStartMatch(state.weeklyLoop)) {
            return state;
          }

          return {
            view: "MATCH",
            lastMatchResult: null,
          };
        });
      },
      navigateToHub: () => {
        set(() => ({
          view: "HUB",
          lastMatchResult: null,
        }));
      },
      completeMatch: ({ homeScore, awayScore, overtimePeriods, boxScore }) => {
        set((state) => {
          const didWin = homeScore > awayScore;
          const bankDelta = didWin ? 500 : 300;
          const moraleDelta = didWin ? 5 : -3;
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
          };

          return {
            view: "POSTGAME",
            lastMatchResult,
            weeklyLoop: {
              ...state.weeklyLoop,
              matchCompleted: true,
              postgamePending: true,
            },
          };
        });
      },
      resolvePostgameAndAdvanceWeek: () => {
        set((state) => {
          if (!state.lastMatchResult) {
            return {
              view: "HUB",
              weeklyLoop: createDefaultWeeklyLoopState(),
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
          const newsFeed =
            state.player.identity
              ? appendNewsItem(state.newsFeed, createPostgameNewsItem(state.player.identity, state.lastMatchResult))
              : state.newsFeed;

          return {
            currentWeek: nextState.currentWeek,
            currentYear: nextState.currentYear,
            seasonNumber: nextState.seasonNumber,
            seasonSchedule: nextState.seasonSchedule,
            view: "HUB",
            player: {
              ...state.player,
              bankBalance: state.player.bankBalance + state.lastMatchResult.bankDelta,
              morale: nextMorale,
            },
            lastMatchResult: null,
            newsFeed,
            weeklyLoop: createDefaultWeeklyLoopState(),
          };
        });
      },
      hydrateCareer: (state) => {
        set(() => ({ ...state }));
      },
      resetCareer: (state) => {
        set(() => ({ ...state }));
      },
    }),
    {
      name: "leaguebound-career-storage",
      version: 9,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState;
        }

        const typedState = persistedState as Partial<CareerStore> & { player?: LegacyPlayerStateInput };
        if (!typedState.player) {
          const fallbackPlayer = defaultPlayer;
          const fallbackLeagueLevel = typedState.leagueLevel ?? LeagueLevel.MIDDLE_SCHOOL;
          const fallbackCurrentYear = typedState.currentYear ?? initialCareerState.currentYear;
          const fallbackSeasonNumber = typedState.seasonNumber ?? initialCareerState.seasonNumber;
          const fallbackCurrentWeek = typedState.currentWeek ?? initialCareerState.currentWeek;
          const progressionState = createCareerProgressionState({
            player: fallbackPlayer,
            leagueLevel: fallbackLeagueLevel,
            currentYear: fallbackCurrentYear,
            seasonNumber: fallbackSeasonNumber,
            currentWeek: fallbackCurrentWeek,
            exile: typedState.exile ?? null,
          });
          return {
            ...typedState,
            leagueLevel: fallbackLeagueLevel,
            currentYear: fallbackCurrentYear,
            seasonNumber: fallbackSeasonNumber,
            currentWeek: fallbackCurrentWeek,
            view: getInitialCareerView(),
            newsFeed: [],
            weeklyLoop: createDefaultWeeklyLoopState(),
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
        const resolvedView = shouldUseBackstoryView ? "BACKSTORY" : typedState.view ?? "HUB";
        const progressionState = createCareerProgressionState({
          player: migratedPlayer,
          leagueLevel,
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
        const weeklyLoop = deriveMigratedWeeklyLoop({
          persistedWeeklyLoop: typedState.weeklyLoop,
          view: resolvedView,
          lastMatchResult: typedState.lastMatchResult ?? null,
          initializedPlayer: isInitializedPlayer(migratedPlayer),
        });

        return {
          ...typedState,
          player: migratedPlayer,
          leagueLevel,
          currentYear,
          seasonNumber,
          currentWeek,
          careerPhase: typedState.careerPhase ?? progressionState.careerPhase,
          view: resolvedView,
          newsFeed,
          weeklyLoop,
          starRating: typedState.starRating ?? progressionState.starRating,
          scoutVisibility: clampVisibility(typedState.scoutVisibility ?? progressionState.scoutVisibility),
          teamInterestById: typedState.teamInterestById ?? progressionState.teamInterestById,
          schoolPath: typedState.schoolPath ?? progressionState.schoolPath,
          offers: typedState.offers ?? progressionState.offers,
          seasonSchedule: typedState.seasonSchedule ?? progressionState.seasonSchedule,
          relationships: typedState.relationships ?? progressionState.relationships,
          eligibility: typedState.eligibility ?? progressionState.eligibility,
          injuryState: typedState.injuryState ?? progressionState.injuryState,
          financeState: typedState.financeState ?? progressionState.financeState,
          legacyPerks: typedState.legacyPerks ?? progressionState.legacyPerks,
          ovrBudget: typedState.ovrBudget ?? 60,
          exileState: existingExileState,
          exile: typedState.exile ?? deriveLegacyExile(existingExileState),
          lastMatchResult: typedState.lastMatchResult
            ? {
                ...typedState.lastMatchResult,
                boxScore: typedState.lastMatchResult.boxScore ?? emptyBoxScore(),
              }
            : null,
        };
      },
      partialize: (state) => ({
        player: state.player,
        leagueLevel: state.leagueLevel,
        status: state.status,
        currentYear: state.currentYear,
        seasonNumber: state.seasonNumber,
        currentWeek: state.currentWeek,
        teamId: state.teamId,
        careerPhase: state.careerPhase,
        starRating: state.starRating,
        scoutVisibility: state.scoutVisibility,
        teamInterestById: state.teamInterestById,
        schoolPath: state.schoolPath,
        offers: state.offers,
        seasonSchedule: state.seasonSchedule,
        relationships: state.relationships,
        eligibility: state.eligibility,
        injuryState: state.injuryState,
        financeState: state.financeState,
        legacyPerks: state.legacyPerks,
        isGoatPath: state.isGoatPath,
        view: state.view,
        currentNarrativeFile: state.currentNarrativeFile,
        lastMatchResult: state.lastMatchResult
          ? {
              ...state.lastMatchResult,
              boxScore: state.lastMatchResult.boxScore ?? emptyBoxScore(),
            }
          : null,
        newsFeed: state.newsFeed,
        weeklyLoop: state.weeklyLoop,
        ovrBudget: state.ovrBudget,
        exile: state.exile,
        exileState: state.exileState,
      }),
    },
  ),
);
