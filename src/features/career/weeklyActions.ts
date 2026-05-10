import { LeagueLevel, type WeeklyActionDefinitionId, type WeeklyActionEntry } from "../../types/career";
import type { CareerState } from "../../types/career";
import type { PlayerAttributes } from "../../types/player";

export interface WeeklyActionDefinition {
  id: WeeklyActionDefinitionId;
  label: string;
  description: string;
  availableIn: LeagueLevel[];
  isNarrative?: boolean;
  narrativeFile?: string;
  attributeGains?: Array<{ attr: keyof PlayerAttributes; amount: number }>;
  buildEntry: (state: Pick<CareerState, "leagueLevel">) => WeeklyActionEntry;
}

const TRAINING_ENERGY = {
  middleSchool: -10,
  highSchool: -14,
};

const TRAINING_CONDITION = {
  middleSchool: -6,
  highSchool: -10,
};

const isMiddleSchool = (leagueLevel: LeagueLevel): boolean => leagueLevel === LeagueLevel.MIDDLE_SCHOOL;

const buildTrainingEntry = (
  id: WeeklyActionDefinitionId,
  label: string,
  leagueLevel: LeagueLevel,
): WeeklyActionEntry => ({
  id,
  label,
  energyDelta: isMiddleSchool(leagueLevel) ? TRAINING_ENERGY.middleSchool : TRAINING_ENERGY.highSchool,
  conditionDelta: isMiddleSchool(leagueLevel) ? TRAINING_CONDITION.middleSchool : TRAINING_CONDITION.highSchool,
});

export const WEEKLY_ACTION_DEFINITIONS: Record<WeeklyActionDefinitionId, WeeklyActionDefinition> = {
  TRAIN_SHOOTING: {
    id: "TRAIN_SHOOTING",
    label: "Train Shooting",
    description: "Sharpen your jumper and range.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    attributeGains: [
      { attr: "midrange", amount: 1 },
      { attr: "threePoint", amount: 1 },
    ],
    buildEntry: (state) => buildTrainingEntry("TRAIN_SHOOTING", "Train Shooting", state.leagueLevel),
  },
  TRAIN_FINISHING: {
    id: "TRAIN_FINISHING",
    label: "Train Finishing",
    description: "Attack the rim and convert through contact.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    attributeGains: [
      { attr: "shortRange", amount: 1 },
      { attr: "dunking", amount: 1 },
    ],
    buildEntry: (state) => buildTrainingEntry("TRAIN_FINISHING", "Train Finishing", state.leagueLevel),
  },
  TRAIN_PLAYMAKING: {
    id: "TRAIN_PLAYMAKING",
    label: "Train Playmaking",
    description: "Improve creation, reads, and tempo.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    attributeGains: [
      { attr: "passing", amount: 1 },
      { attr: "vision", amount: 1 },
      { attr: "handle", amount: 1 },
    ],
    buildEntry: (state) => buildTrainingEntry("TRAIN_PLAYMAKING", "Train Playmaking", state.leagueLevel),
  },
  TRAIN_DEFENSE: {
    id: "TRAIN_DEFENSE",
    label: "Train Defense",
    description: "Work on stops, rotations, and pressure.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    attributeGains: [
      { attr: "perimeterDefense", amount: 1 },
      { attr: "stealing", amount: 1 },
    ],
    buildEntry: (state) => buildTrainingEntry("TRAIN_DEFENSE", "Train Defense", state.leagueLevel),
  },
  STUDY: {
    id: "STUDY",
    label: "Study",
    description: "Protect eligibility and steady your grades.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE],
    buildEntry: (state) => ({
      id: "STUDY",
      label: "Study",
      energyDelta: isMiddleSchool(state.leagueLevel) ? -4 : -6,
      conditionDelta: 0,
      gpaDelta: isMiddleSchool(state.leagueLevel) ? 0.1 : 0.2,
    }),
  },
  REST_RECOVERY: {
    id: "REST_RECOVERY",
    label: "Rest / Recovery",
    description: "Recover energy and reduce fatigue.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    buildEntry: (state) => ({
      id: "REST_RECOVERY",
      label: "Rest / Recovery",
      energyDelta: isMiddleSchool(state.leagueLevel) ? 18 : 15,
      conditionDelta: isMiddleSchool(state.leagueLevel) ? 14 : 12,
    }),
  },
  TEAM_BONDING: {
    id: "TEAM_BONDING",
    label: "Team Bonding",
    description: "Build chemistry with teammates.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    buildEntry: (state) => ({
      id: "TEAM_BONDING",
      label: "Team Bonding",
      energyDelta: isMiddleSchool(state.leagueLevel) ? -5 : -7,
      conditionDelta: isMiddleSchool(state.leagueLevel) ? -2 : -3,
      teammatesDelta: isMiddleSchool(state.leagueLevel) ? 6 : 8,
    }),
  },
  SOCIAL_FANS: {
    id: "SOCIAL_FANS",
    label: "Social / Fans",
    description: "Grow your local following and buzz.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    buildEntry: (state) => ({
      id: "SOCIAL_FANS",
      label: "Social / Fans",
      energyDelta: isMiddleSchool(state.leagueLevel) ? -4 : -6,
      conditionDelta: isMiddleSchool(state.leagueLevel) ? -1 : -2,
      fansDelta: isMiddleSchool(state.leagueLevel) ? 5 : 7,
      scoutVisibilityDelta: state.leagueLevel === LeagueLevel.HIGH_SCHOOL ? 3 : 0,
    }),
  },
  FILM_COACH_TRUST: {
    id: "FILM_COACH_TRUST",
    label: "Film / Coach Trust",
    description: "Break down tape and build trust with coaches.",
    availableIn: [LeagueLevel.MIDDLE_SCHOOL, LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    isNarrative: true,
    narrativeFile: "practice_coach.ink",
    attributeGains: [{ attr: "vision", amount: 1 }],
    buildEntry: () => ({
      id: "FILM_COACH_TRUST",
      label: "Film / Coach Trust",
      energyDelta: -3,
      conditionDelta: 0,
      coachTrustDelta: 6,
      narrativeFile: "practice_coach.ink",
    }),
  },
  NIL_APPEARANCE: {
    id: "NIL_APPEARANCE",
    label: "NIL / Money",
    description: "Light promotional work without a full NIL economy.",
    availableIn: [LeagueLevel.HIGH_SCHOOL, LeagueLevel.COLLEGE, LeagueLevel.PRO],
    buildEntry: () => ({
      id: "NIL_APPEARANCE",
      label: "NIL / Money",
      energyDelta: -8,
      conditionDelta: -3,
      fansDelta: 4,
      moneyDelta: 75,
      coachTrustDelta: -2,
    }),
  },
};

export const getWeeklyActionDefinition = (id: WeeklyActionDefinitionId): WeeklyActionDefinition =>
  WEEKLY_ACTION_DEFINITIONS[id];

export const getWeeklyActionIdsForLeagueLevel = (leagueLevel: LeagueLevel): WeeklyActionDefinitionId[] => {
  const ordered: WeeklyActionDefinitionId[] =
    leagueLevel === LeagueLevel.MIDDLE_SCHOOL
      ? ["TRAIN_SHOOTING", "TRAIN_PLAYMAKING", "STUDY", "REST_RECOVERY", "TEAM_BONDING", "FILM_COACH_TRUST"]
      : [
          "TRAIN_SHOOTING",
          "TRAIN_FINISHING",
          "TRAIN_PLAYMAKING",
          "TRAIN_DEFENSE",
          "STUDY",
          "REST_RECOVERY",
          "TEAM_BONDING",
          "SOCIAL_FANS",
          "FILM_COACH_TRUST",
        ];

  return ordered.filter((id) => WEEKLY_ACTION_DEFINITIONS[id].availableIn.includes(leagueLevel));
};
