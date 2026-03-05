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
  enforceCapsAtLeastCurrent,
  generateBackstoryFromInput,
  getDefaultSecondaryPosition,
  synthesizeBackstoryInputFromLegacy,
} from "../features/backstory/generator";
import { createCareerCreationNewsItem, createPostgameNewsItem } from "../features/backstory/news";
import {
  CareerStatus,
  LeagueLevel,
  type CareerActions,
  type CareerState,
} from "../types/career";
import { normalizePlayerStateForInk, type LegacyPlayerStateInput, type Player, type PlayerAttributes } from "../types/player";
import type { BackstoryInput, HeightPreset, WeightPreset } from "../types/backstory";
import type { MatchBoxScore } from "../features/match/store/useMatchStore";

type CareerStore = CareerState & CareerActions;

const NEWS_FEED_LIMIT = 100;
const clampAttribute = (value: number): number => Math.min(99, Math.max(0, value));
const clampMorale = (value: number): number => Math.min(100, Math.max(0, value));

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

const initialCareerState: CareerState = {
  player: defaultPlayer,
  leagueLevel: LeagueLevel.MIDDLE_SCHOOL,
  status: CareerStatus.ACTIVE,
  currentYear: 2026,
  seasonNumber: 1,
  currentWeek: 1,
  teamId: null,
  isGoatPath: false,
  view: getInitialCareerView(),
  currentNarrativeFile: "",
  lastMatchResult: null,
  newsFeed: [],
  ovrBudget: 60,
  exile: null,
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
        },
      };
    } else {
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
        },
      };
    }
  return migratedPlayer;
};

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      ...initialCareerState,
      initializeCareer: (input: BackstoryInput) => {
        const seed = input.generationSeed ?? Date.now();
        const generated = generateBackstoryFromInput(input, { seedOverride: seed });
        const creationNews = createCareerCreationNewsItem(generated.identity, initialCareerState.currentWeek);

        set(() => ({
          ...initialCareerState,
          player: {
            ...initialCareerState.player,
            id: seed.toString(),
            name: generated.identity.displayName,
            age: 13,
            position: generated.identity.primaryPosition,
            secondaryPosition: generated.identity.secondaryPosition,
            archetype: generated.identity.archetype,
            identity: generated.identity,
            dna: generated.dna,
            attributes: generated.startingAttributes,
          },
          view: "HUB",
          newsFeed: [creationNews],
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
        set((state) => ({ currentWeek: state.currentWeek + 1 }));
      },
      advanceSeason: () => {
        set((state) => ({
          seasonNumber: state.seasonNumber + 1,
          currentWeek: 1,
        }));
      },
      updateLeagueLevel: (level) => {
        set(() => ({ leagueLevel: level }));
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
        set(() => ({
          view: "NARRATIVE",
          currentNarrativeFile: fileName,
        }));
      },
      navigateToMatch: () => {
        set(() => ({
          view: "MATCH",
          lastMatchResult: null,
        }));
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
          const nextMorale = clampMorale(state.player.morale + moraleDelta);
          const nextWeek = state.currentWeek + 1;
          const lastMatchResult = {
            homeScore,
            awayScore,
            didWin,
            bankDelta,
            moraleDelta,
            weekAfter: nextWeek,
            overtimePeriods: overtimePeriods ?? 0,
            boxScore,
          };

          const newsFeed =
            state.player.identity
              ? appendNewsItem(state.newsFeed, createPostgameNewsItem(state.player.identity, lastMatchResult))
              : state.newsFeed;

          return {
            currentWeek: nextWeek,
            view: "POSTGAME",
            player: {
              ...state.player,
              bankBalance: state.player.bankBalance + bankDelta,
              morale: nextMorale,
            },
            lastMatchResult,
            newsFeed,
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
      version: 6,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState;
        }

        const typedState = persistedState as Partial<CareerStore> & { player?: LegacyPlayerStateInput };
        if (!typedState.player) {
          return {
            ...typedState,
            view: getInitialCareerView(),
            newsFeed: [],
            ovrBudget: typedState.ovrBudget ?? 60,
            exile: typedState.exile ?? null,
          };
        }

        const normalizedPlayer = normalizePersistedPlayer(typedState.player);
        const migratedPlayer = migratePlayerWithBackstory(normalizedPlayer);
        const newsFeed = Array.isArray(typedState.newsFeed) ? typedState.newsFeed : [];
        const shouldUseBackstoryView = !isInitializedPlayer(migratedPlayer) && BACKSTORY_V1_ENABLED;

        return {
          ...typedState,
          player: migratedPlayer,
          view: shouldUseBackstoryView ? "BACKSTORY" : typedState.view ?? "HUB",
          newsFeed,
          ovrBudget: typedState.ovrBudget ?? 60,
          exile: typedState.exile ?? null,
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
        ovrBudget: state.ovrBudget,
        exile: state.exile,
      }),
    },
  ),
);
