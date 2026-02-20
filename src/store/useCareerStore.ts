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
import type { Player, PlayerAttributes } from "../types/player";

type CareerStore = CareerState & CareerActions;

const clampAttribute = (value: number): number => Math.min(99, Math.max(0, value));

const defaultPlayer: Player = {
  id: "",
  name: "",
  age: 0,
  BankBalance: 0,
  Morale: 0,
  Position: "PG",
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
};

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
            BankBalance: initialCareerState.player.BankBalance,
            bankBalance: initialCareerState.player.BankBalance,
            Morale: initialCareerState.player.Morale,
            morale: initialCareerState.player.Morale,
            Position: initialCareerState.player.Position,
            position: initialCareerState.player.Position,
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
          const nextBankBalance = state.player.BankBalance + amount;
          return {
            player: {
              ...state.player,
              BankBalance: nextBankBalance,
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
        set(() => ({ view: "MATCH" }));
      },
      navigateToHub: () => {
        set(() => ({ view: "HUB" }));
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
      storage: createJSONStorage(() => AsyncStorage),
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
      }),
    },
  ),
);
