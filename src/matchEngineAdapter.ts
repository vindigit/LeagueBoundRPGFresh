import type { Team } from "./types/team";
import type { InkPlayerState, LegacyPlayerStateInput, Player } from "./types/player";
import { normalizePlayerStateForInk } from "./types/player";
import { LeagueLevel } from "./types/career";
import type { MatchConsequence } from "./types/careerProgression";
import { createKeyMomentScheduler } from "./match/keyMoments/scheduler";
import { tryResolveKeyMoment } from "./match/keyMoments/resolveKeyMoment";
import type { KeyMomentPending, KeyMomentResolutionInput, PeriodKey } from "./match/keyMoments/types";
import {
  clamp01,
  getWorkRateFatigueLoadMultiplier,
  createSeededRng,
  getPressure,
  initializePossession,
  simulatePossession,
  type MatchFocus,
  type MatchContext,
  type MatchWorkRate,
  type PossessionResult,
  type PossessionState,
  type SimMetrics,
  type UserMatchState,
} from "./matchEngine";

type TeamInput = Omit<Team, "roster"> & {
  roster: [LegacyPlayerStateInput, LegacyPlayerStateInput, LegacyPlayerStateInput, LegacyPlayerStateInput, LegacyPlayerStateInput];
};

export interface PendingPossession {
  pendingId: string;
  state: PossessionState;
  pending: KeyMomentPending;
}

export interface UserPlayerLocation {
  teamKey: "home" | "away";
  playerIndex: number;
}

export interface ResolvedKeyMoment {
  pendingId: string;
  type: KeyMomentPending["type"];
  success: boolean;
  promptText: string;
  resultSummaryText: string;
  consequences: MatchConsequence[];
}

export interface AdapterStepOutput {
  state: PossessionState;
  metrics: SimMetrics;
  result?: PossessionResult;
  keyMoment?: KeyMomentPending;
  pendingPossession?: PendingPossession;
  pendingKeyMoment?: KeyMomentPending;
  resolvedKeyMoment?: ResolvedKeyMoment;
  userInkState?: { id: string } & InkPlayerState;
  userMatchState?: UserMatchState;
}

export interface AdapterRunOutput {
  state: PossessionState;
  metrics: SimMetrics;
  keyMoments: KeyMomentPending[];
  pendingPossession?: PendingPossession;
  pendingKeyMoment?: KeyMomentPending;
  userMatchState?: UserMatchState;
}

export interface MatchEngineAdapter {
  startGame(): AdapterStepOutput;
  stepPossession(): AdapterStepOutput;
  runPossessions(possessions: number): AdapterRunOutput;
  getState(): AdapterStepOutput;
  getContext(): MatchContext;
  getUserPlayerLocation(): UserPlayerLocation | undefined;
  updateUserInkState(next: InkPlayerState): AdapterStepOutput;
  setWorkRate(next: MatchWorkRate): AdapterStepOutput;
  setFocus(next: MatchFocus): AdapterStepOutput;
  resolvePendingKeyMoment(input: KeyMomentResolutionInput): AdapterStepOutput;
}

type BonusSegment = "first_half" | "second_half";
type TeamFoulState = Record<BonusSegment, Record<"home" | "away", number>>;

export interface MatchEngineAdapterOptions {
  home: TeamInput;
  away: TeamInput;
  userPlayerId: string;
  seed: number;
  leagueLevel?: LeagueLevel;
  secondsRemaining?: number;
  keyMomentRngChance?: number;
  enableKeyMoments?: boolean;
  debugBadges?: boolean;
  coachTrust?: number;
  staminaRating?: number;
}

const normalizeTeamInput = (team: TeamInput): Team => {
  const roster = team.roster.map((player) => normalizePlayerStateForInk(player)) as Team["roster"];
  return {
    name: team.name,
    roster,
    teamOvr: team.teamOvr,
  };
};

const isCriticalState = (state: PossessionState): boolean => {
  const scoreDiff = Math.abs(state.score.home - state.score.away);
  return state.secondsRemaining <= 120 && scoreDiff <= 8;
};

const isFieldGoalAttempt = (result: PossessionResult): boolean =>
  result.eventType !== "turnover" &&
  result.eventType !== "steal" &&
  result.eventType !== "free_throws";

const updateMetrics = (metrics: SimMetrics, result: PossessionResult): SimMetrics => ({
  possessions: metrics.possessions + 1,
  fga: metrics.fga + (isFieldGoalAttempt(result) ? 1 : 0),
  fgm: metrics.fgm + (isFieldGoalAttempt(result) && result.madeShot ? 1 : 0),
  assists: metrics.assists + (result.assisted && result.madeShot ? 1 : 0),
  turnoverLikeFailures: metrics.turnoverLikeFailures + (result.turnoverLikeFailure ? 1 : 0),
});

const getPlayerById = (context: MatchContext, playerId: string): Player | undefined => {
  const pool = [...context.home.roster, ...context.away.roster];
  return pool.find((player) => player.id === playerId);
};

const getPlayerLocation = (
  context: MatchContext,
  playerId: string,
): { teamKey: "home" | "away"; playerIndex: number; player: Player } | undefined => {
  const homeIndex = context.home.roster.findIndex((player) => player.id === playerId);
  if (homeIndex >= 0) {
    return {
      teamKey: "home",
      playerIndex: homeIndex,
      player: context.home.roster[homeIndex],
    };
  }
  const awayIndex = context.away.roster.findIndex((player) => player.id === playerId);
  if (awayIndex >= 0) {
    return {
      teamKey: "away",
      playerIndex: awayIndex,
      player: context.away.roster[awayIndex],
    };
  }
  return undefined;
};

const toInkPlayerState = (player: Pick<Player, "bankBalance" | "morale" | "position">): InkPlayerState => ({
  BankBalance: player.bankBalance,
  Morale: player.morale,
  Position: player.position,
});

const applyInkPlayerState = (player: Player, inkState: InkPlayerState): Player => ({
  ...player,
  bankBalance: inkState.BankBalance,
  morale: inkState.Morale,
  position: inkState.Position,
});

const getPeriodState = (
  totalSeconds: number,
  secondsRemaining: number,
): { quarter: 1 | 2 | 3 | 4; overtimePeriod?: number; periodKey: PeriodKey; timeRemaining: number } => {
  const regulationSeconds = Math.max(4, totalSeconds);
  const quarterSeconds = Math.max(1, Math.floor(regulationSeconds / 4));
  if (secondsRemaining <= 0) {
    return { quarter: 4, periodKey: "Q4", timeRemaining: 0 };
  }
  if (secondsRemaining > regulationSeconds) {
    const overtimeSeconds = secondsRemaining - regulationSeconds;
    const overtimePeriod = Math.max(1, Math.ceil(overtimeSeconds / quarterSeconds));
    const elapsedInOvertime = overtimeSeconds - (overtimePeriod - 1) * quarterSeconds;
    return { quarter: 4, overtimePeriod, periodKey: `OT${overtimePeriod}`, timeRemaining: Math.max(0, quarterSeconds - elapsedInOvertime) };
  }
  const elapsed = Math.max(0, regulationSeconds - secondsRemaining);
  const quarter = Math.min(4, Math.floor(elapsed / quarterSeconds) + 1) as 1 | 2 | 3 | 4;
  const elapsedInQuarter = elapsed - (quarter - 1) * quarterSeconds;
  return { quarter, periodKey: `Q${quarter}` as PeriodKey, timeRemaining: Math.max(0, quarterSeconds - elapsedInQuarter) };
};

const getBonusSegment = (periodKey: PeriodKey): BonusSegment =>
  periodKey === "Q1" || periodKey === "Q2" ? "first_half" : "second_half";

export const createMatchEngineAdapter = (
  options: MatchEngineAdapterOptions,
): MatchEngineAdapter => {
  const context: MatchContext = {
    home: normalizeTeamInput(options.home),
    away: normalizeTeamInput(options.away),
  };
  const rng = createSeededRng(options.seed);
  const leagueLevel = options.leagueLevel ?? LeagueLevel.PRO;
  const enableKeyMoments = options.enableKeyMoments ?? true;
  const totalSeconds = options.secondsRemaining ?? 20 * 60;
  const coachTrust = Math.max(0, Math.min(100, Math.round(options.coachTrust ?? 50)));
  const staminaRating = Math.max(0, Math.min(99, Math.round(options.staminaRating ?? 70)));
  const userLocation = getPlayerLocation(context, options.userPlayerId);
  const keyMomentScheduler = createKeyMomentScheduler();
  let state = initializePossession(context, leagueLevel, rng, totalSeconds);
  let metrics: SimMetrics = {
    possessions: 0,
    fga: 0,
    fgm: 0,
    assists: 0,
    turnoverLikeFailures: 0,
  };
  let pendingPossession: PendingPossession | undefined;
  let pendingKeyMoment: KeyMomentPending | undefined;
  let pendingIdCounter = 1;
  let teamFoulsBySegment: TeamFoulState = {
    first_half: { home: 0, away: 0 },
    second_half: { home: 0, away: 0 },
  };
  let userMatchState: UserMatchState | undefined = userLocation
    ? {
        workRate: "normal",
        focus: "balanced",
        fatigue: 0,
        touchLoad: 0,
        lateGamePenalty: 0,
      }
    : undefined;

  const getUserTouchLoad = (currentState: PossessionState): number => {
    if (!userLocation) {
      return 0;
    }
    const touches = userLocation.teamKey === "home" ? currentState.homeTouches : currentState.awayTouches;
    return touches[userLocation.playerIndex] ?? 0;
  };

  const refreshUserMatchState = (
    currentState: PossessionState,
    overrides?: { success?: boolean; failedKeyMoment?: boolean },
  ): UserMatchState | undefined => {
    if (!userMatchState) {
      return undefined;
    }

    const touchLoad = getUserTouchLoad(currentState);
    const pressure = getPressure(currentState);
    const success = overrides?.success === true;
    const failedKeyMoment = overrides?.failedKeyMoment === true;
    const workRateFatigue = Math.max(0, getWorkRateFatigueLoadMultiplier(userMatchState.workRate) - 1) * 0.12;
    const touchFatigue = touchLoad * 0.018;
    const lateGameShare = clamp01(1 - currentState.secondsRemaining / Math.max(1, totalSeconds));
    const lateGamePenalty = clamp01(Math.max(0, lateGameShare - 0.72) / 0.28);
    const executionSwing = success ? -0.03 : failedKeyMoment ? 0.05 : 0;
    userMatchState = {
      ...userMatchState,
      touchLoad,
      lateGamePenalty,
      fatigue: clamp01(touchFatigue + workRateFatigue + pressure * 0.08 + lateGamePenalty * 0.14 + executionSwing),
    };

    return userMatchState;
  };

  const getUserInkState = (): AdapterStepOutput["userInkState"] => {
    const userPlayer = getPlayerById(context, options.userPlayerId);
    if (!userPlayer) {
      return undefined;
    }
    return {
      id: userPlayer.id,
      ...toInkPlayerState(userPlayer),
    };
  };

  const updateUserInkState = (next: InkPlayerState): AdapterStepOutput => {
    const userPlayer = getPlayerById(context, options.userPlayerId);
    if (!userPlayer) {
      return {
        state,
        metrics,
        pendingPossession,
        pendingKeyMoment,
        userInkState: undefined,
        userMatchState,
      };
    }

    const updatedUser = applyInkPlayerState(userPlayer, next);
    userPlayer.bankBalance = updatedUser.bankBalance;
    userPlayer.morale = updatedUser.morale;
    userPlayer.position = updatedUser.position;

    return {
      state,
      metrics,
      pendingPossession,
      pendingKeyMoment,
      userInkState: getUserInkState(),
      userMatchState,
    };
  };

  const buildKeyMoment = (previousState: PossessionState): KeyMomentPending | undefined => {
    if (!enableKeyMoments) {
      return undefined;
    }
    if (!userLocation) {
      return undefined;
    }
    const userOnOffense =
      previousState.offenseKey === userLocation.teamKey && previousState.ballHandlerIndex === userLocation.playerIndex;
    const userOnDefense = previousState.defenseKey === userLocation.teamKey;
    if (!userOnOffense && !userOnDefense) {
      return undefined;
    }
    const critical = isCriticalState(previousState);
    const elapsedSeconds = Math.max(0, totalSeconds - previousState.secondsRemaining);
    if (!critical && (previousState.possessionIndex <= 2 || elapsedSeconds < 90)) {
      return undefined;
    }
    const pendingId = `pending-possession-${pendingIdCounter}`;
    const periodState = getPeriodState(totalSeconds, previousState.secondsRemaining);
    const foulSegment = getBonusSegment(periodState.periodKey);
    const defenderTeamFoulsInSegment = teamFoulsBySegment[foulSegment][previousState.defenseKey];
    const contextArgs = {
      id: pendingId,
      periodKey: periodState.periodKey,
      quarter: periodState.quarter,
      overtimePeriod: periodState.overtimePeriod,
      timeRemaining: periodState.timeRemaining,
      offense: previousState.offenseKey,
      defense: previousState.defenseKey,
      userTeam: userLocation.teamKey,
      userPlayerIndex: userLocation.playerIndex,
      possessionIndex: previousState.possessionIndex,
      score: previousState.score,
      workRate: userMatchState?.workRate ?? "normal",
      focus: userMatchState?.focus ?? "balanced",
      fatigue: userMatchState?.fatigue ?? 0,
      coachTrust,
      staminaRating,
      leverage: critical ? "clutch" : periodState.quarter >= 4 && Math.abs(previousState.score.home - previousState.score.away) <= 10 ? "high" : "normal",
    };
    const scheduled = keyMomentScheduler.onPossessionBoundary({
      context: contextArgs,
      periodTotalSeconds: Math.max(1, Math.floor(totalSeconds / 4)),
      matchTotalSeconds: totalSeconds,
      matchContext: context,
      possessionState: previousState,
      userMatchState,
      defenderTeamFoulsInSegment,
      forceTrigger: critical,
      pendingId,
    });
    if (scheduled.pending) {
      scheduled.pending.defenderTeamFoulsInSegment = defenderTeamFoulsInSegment;
      if (scheduled.pending.type === "foul_pressure") {
        scheduled.pending.foulType = previousState.offenseKey === userLocation.teamKey ? "shooting" : "bonus";
        const nextTeamFoulCount = defenderTeamFoulsInSegment + 1;
        scheduled.pending.freeThrowMode =
          scheduled.pending.foulType === "shooting" || nextTeamFoulCount >= 10
            ? "two_shots"
          : nextTeamFoulCount >= 7
              ? "one_and_one"
              : "two_shots";
      }
    }
    return scheduled.pending;
  };

  const buildStepOutput = (overrides: Partial<AdapterStepOutput> = {}): AdapterStepOutput => ({
    state,
    metrics,
    pendingPossession,
    pendingKeyMoment,
    resolvedKeyMoment: undefined,
    userInkState: getUserInkState(),
    userMatchState,
    ...overrides,
  });

  const stepPossession = (): AdapterStepOutput => {
    if (pendingPossession) {
      return buildStepOutput();
    }

    const previousState = state;
    const keyMoment = buildKeyMoment(previousState);

    if (keyMoment) {
      pendingPossession = {
        pendingId: keyMoment.id,
        state: previousState,
        pending: keyMoment,
      };
      pendingKeyMoment = keyMoment;
      pendingIdCounter += 1;
      return buildStepOutput({
        keyMoment,
      });
    }

    const result = simulatePossession(context, previousState, leagueLevel, rng, userLocation && userMatchState
      ? {
          userControl: {
            teamKey: userLocation.teamKey,
            playerIndex: userLocation.playerIndex,
            matchState: userMatchState,
          },
          debugBadges: options.debugBadges,
        }
      : { debugBadges: options.debugBadges });

    metrics = updateMetrics(metrics, result);
    state = result.nextState;
    refreshUserMatchState(state);

    return buildStepOutput({
      result,
    });
  };

  const startGame = (): AdapterStepOutput => buildStepOutput();

  const runPossessions = (possessions: number): AdapterRunOutput => {
    const keyMoments: KeyMomentPending[] = [];
    for (let i = 0; i < possessions && state.secondsRemaining > 0; i += 1) {
      const step = stepPossession();
      if (step.keyMoment) {
        keyMoments.push(step.keyMoment);
      }
      if (step.pendingPossession) {
        return {
          state,
          metrics,
          keyMoments,
          pendingPossession: step.pendingPossession,
          pendingKeyMoment: step.pendingKeyMoment,
          userMatchState,
        };
      }
    }
    return {
      state,
      metrics,
      keyMoments,
      userMatchState,
    };
  };

  const getState = (): AdapterStepOutput => buildStepOutput();

  const setWorkRate = (next: MatchWorkRate): AdapterStepOutput => {
    if (!userMatchState) {
      return buildStepOutput();
    }
    userMatchState = {
      ...userMatchState,
      workRate: next,
    };
    refreshUserMatchState(state);
    return buildStepOutput();
  };

  const setFocus = (next: MatchFocus): AdapterStepOutput => {
    if (!userMatchState) {
      return buildStepOutput();
    }
    userMatchState = {
      ...userMatchState,
      focus: next,
    };
    refreshUserMatchState(state);
    return buildStepOutput();
  };

  const resolvePendingKeyMoment = (input: KeyMomentResolutionInput): AdapterStepOutput => {
    if (!pendingPossession) {
      return buildStepOutput();
    }
    if (input.pendingId !== pendingPossession.pendingId) {
      return buildStepOutput();
    }

    const pending = pendingPossession;
    const resolution = tryResolveKeyMoment({
      pending: pending.pending,
      input,
      context,
      possessionState: pending.state,
    });
    const result = resolution?.result ?? simulatePossession(context, pending.state, leagueLevel, rng, userLocation && userMatchState
      ? {
          userControl: {
            teamKey: userLocation.teamKey,
            playerIndex: userLocation.playerIndex,
            matchState: userMatchState,
          },
          debugBadges: options.debugBadges,
        }
      : { debugBadges: options.debugBadges });

    pendingPossession = undefined;
    pendingKeyMoment = undefined;
    if (result.freeThrows) {
      const periodState = getPeriodState(totalSeconds, pending.state.secondsRemaining);
      const segment = getBonusSegment(periodState.periodKey);
      teamFoulsBySegment = {
        ...teamFoulsBySegment,
        [segment]: {
          ...teamFoulsBySegment[segment],
          [result.freeThrows.foulOnTeam]: teamFoulsBySegment[segment][result.freeThrows.foulOnTeam] + 1,
        },
      };
    }
    metrics = updateMetrics(metrics, result);
    state = result.nextState;
    refreshUserMatchState(state, {
      success: resolution?.success,
      failedKeyMoment: resolution ? !resolution.success : false,
    });

    return buildStepOutput({
      result,
      resolvedKeyMoment: resolution
        ? {
            pendingId: pending.pending.id,
            type: pending.pending.type,
            success: resolution.success,
            promptText: pending.pending.promptText,
            resultSummaryText: resolution.resultSummaryText,
            consequences: resolution.consequences ?? [],
          }
        : undefined,
    });
  };

  return {
    startGame,
    stepPossession,
    runPossessions,
    getState,
    getContext: () => context,
    getUserPlayerLocation: () =>
      userLocation
        ? {
            teamKey: userLocation.teamKey,
            playerIndex: userLocation.playerIndex,
          }
        : undefined,
    updateUserInkState,
    setWorkRate,
    setFocus,
    resolvePendingKeyMoment,
  };
};
