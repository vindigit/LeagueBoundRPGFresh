import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ARCHETYPE_DEFAULTS } from "../constants/archetypes";
import {
  CareerStatus,
  LeagueLevel,
  type CareerActions,
  type CareerState,
} from "../types/career";
import { normalizePlayerStateForInk, type LegacyPlayerStateInput, type Player, type PlayerAttributes } from "../types/player";
import type { MatchBoxScore } from "../features/match/store/useMatchStore";

type CareerStore = CareerState & CareerActions;

const clampAttribute = (value: number): number => Math.min(99, Math.max(0, value));
const clampMorale = (value: number): number => Math.min(100, Math.max(0, value));

const defaultPlayer: Player = {
  id: "",
  name: "",
  age: 0,
  bankBalance: 0,
  morale: 0,
  position: "PG",
  archetype: "Slasher",
  attributes: {
    shooting: 0,
    finishing: 0,
    vision: 0,
    handle: 0,
    athleticism: 0,
    defense: 0,
    rebounding: 0,
    bbiq: 0,
    stamina: 0,
  },
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

const initialCareerState: CareerState = {
  player: defaultPlayer,
  leagueLevel: LeagueLevel.MIDDLE_SCHOOL,
  status: CareerStatus.ACTIVE,
  currentYear: 2026,
  seasonNumber: 1,
  currentWeek: 1,
  teamId: null,
  isGoatPath: false,
  view: "HUB",
  currentNarrativeFile: "",
  lastMatchResult: null,
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

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      ...initialCareerState,
      initializeCareer: (playerName, archetype) => {
        const attributes = ARCHETYPE_DEFAULTS[archetype];
        set(() => ({
          ...initialCareerState,
          player: {
            ...initialCareerState.player,
            id: Date.now().toString(),
            name: playerName,
            age: 13,
            archetype,
            attributes,
          },
        }));
      },
      updateAttribute: (attr, amount) => {
        set((state) => {
          const currentValue = state.player.attributes[attr];
          const nextValue = clampAttribute(currentValue + amount) as PlayerAttributes[typeof attr];
          return {
            player: {
              ...state.player,
              attributes: {
                ...state.player.attributes,
                [attr]: nextValue,
              },
            },
          };
        });
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

          return {
            currentWeek: nextWeek,
            view: "POSTGAME",
            player: {
              ...state.player,
              bankBalance: state.player.bankBalance + bankDelta,
              morale: nextMorale,
            },
            lastMatchResult: {
              homeScore,
              awayScore,
              didWin,
              bankDelta,
              moraleDelta,
              weekAfter: nextWeek,
              overtimePeriods: overtimePeriods ?? 0,
              boxScore,
            },
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
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState;
        }

        const typedState = persistedState as CareerStore;
        if (!typedState.player) {
          return typedState;
        }

        return {
          ...typedState,
          player: normalizePersistedPlayer(typedState.player as unknown as LegacyPlayerStateInput),
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
      }),
    },
  ),
);
