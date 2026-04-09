import type { Player, PlayerAttributes } from "./player";
import type { MatchBoxScore } from "../features/match/store/useMatchStore";
import type { AttributeGainSource, BackstoryInput, BuildBackstoryInput, CareerNewsItem } from "./backstory";

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

export type ExileStatus = "G_LEAGUE" | "OVERSEAS" | "RETIRED";

export type CareerView = "BACKSTORY" | "HUB" | "NARRATIVE" | "MATCH" | "POSTGAME";

export interface LastMatchResult {
  homeScore: number;
  awayScore: number;
  didWin: boolean;
  bankDelta: number;
  moraleDelta: number;
  weekAfter: number;
  overtimePeriods: number;
  boxScore: MatchBoxScore;
}

export interface CareerState {
  player: Player;
  leagueLevel: LeagueLevel;
  status: CareerStatus;
  currentYear: number;
  seasonNumber: number;
  currentWeek: number;
  teamId: string | null;
  isGoatPath: boolean;
  view: CareerView;
  currentNarrativeFile: string;
  lastMatchResult: LastMatchResult | null;
  newsFeed: CareerNewsItem[];
  ovrBudget: number;
  exile: ExileStatus | null;
}

export interface CareerActions {
  initializeCareer(input: BackstoryInput | BuildBackstoryInput): void;
  applyAttributeGain(attr: keyof PlayerAttributes, amount: number, source?: AttributeGainSource): void;
  updateAttribute(attr: keyof PlayerAttributes, amount: number): void;
  updateBankBalance(amount: number): void;
  advanceWeek(): void;
  advanceSeason(): void;
  updateLeagueLevel(level: LeagueLevel): void;
  updateStatus(status: CareerStatus): void;
  setCurrentWeek(week: number): void;
  setTeam(teamId: string | null): void;
  setGoatPath(isGoatPath: boolean): void;
  setCurrentYear(year: number): void;
  startNarrative(fileName: string): void;
  navigateToMatch(): void;
  navigateToHub(): void;
  completeMatch(result: { homeScore: number; awayScore: number; overtimePeriods?: number; boxScore: MatchBoxScore }): void;
  hydrateCareer(state: CareerState): void;
  resetCareer(state: CareerState): void;
}
