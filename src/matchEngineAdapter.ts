import type { Team } from "./types/team";
import type { InkPlayerState, LegacyPlayerStateInput, Player } from "./types/player";
import { normalizePlayerStateForInk } from "./types/player";
import { LeagueLevel } from "./types/career";
import type { MatchConsequence } from "./types/careerProgression";
import { createKeyMomentScheduler } from "./match/keyMoments/scheduler";
import { tryResolveKeyMoment } from "./match/keyMoments/resolveKeyMoment";
import type { KeyMomentPending, KeyMomentResolutionInput, PeriodKey } from "./match/keyMoments/types";
import {
  createSeededRng,
  getPressure,
  initializePossession,
  simulatePossession,
  type MatchContext,
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

const clampMatchRating = (value: number): number =>
  Math.max(0, Math.min(99, Math.round(value)));

const getPeriodState = (
  totalSeconds: number,
  secondsRemaining: number,
): { quarter: 1 | 2 | 3 | 4; overtimePeriod?: number; periodKey: PeriodKey } => {
  const regulationSeconds = Math.max(4, totalSeconds);
  const quarterSeconds = Math.max(1, Math.floor(regulationSeconds / 4));
  if (secondsRemaining <= 0) {
    return { quarter: 4, periodKey: "Q4" };
  }
  if (secondsRemaining > regulationSeconds) {
    const overtimeSeconds = secondsRemaining - regulationSeconds;
    const overtimePeriod = Math.max(1, Math.ceil(overtimeSeconds / quarterSeconds));
    return { quarter: 4, overtimePeriod, periodKey: `OT${overtimePeriod}` };
  }
  const elapsed = Math.max(0, regulationSeconds - secondsRemaining);
  const quarter = Math.min(4, Math.floor(elapsed / quarterSeconds) + 1) as 1 | 2 | 3 | 4;
  return { quarter, periodKey: `Q${quarter}` as PeriodKey };
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
        baseWorkRate: userLocation.player.attributes.stamina,
        baseFocus: userLocation.player.morale,
        workRate: userLocation.player.attributes.stamina,
        focus: userLocation.player.morale,
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
    const pressurePenalty = Math.round(getPressure(currentState) * 12);
    const success = overrides?.success === true;
    const failedKeyMoment = overrides?.failedKeyMoment === true;

    userMatchState = {
      ...userMatchState,
      workRate: clampMatchRating(userMatchState.baseWorkRate - touchLoad * 2 + (success ? 2 : 0) - (failedKeyMoment ? 1 : 0)),
      focus: clampMatchRating(
        userMatchState.baseFocus - pressurePenalty - Math.floor(touchLoad / 2) + (success ? 4 : 0) - (failedKeyMoment ? 4 : 0),
      ),
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
    const pendingId = `pending-possession-${pendingIdCounter}`;
    const periodState = getPeriodState(totalSeconds, previousState.secondsRemaining);
    const foulSegment = getBonusSegment(periodState.periodKey);
    const defenderTeamFoulsInSegment = teamFoulsBySegment[foulSegment][previousState.defenseKey];
    const contextArgs = {
      id: pendingId,
      periodKey: periodState.periodKey,
      quarter: periodState.quarter,
      overtimePeriod: periodState.overtimePeriod,
      timeRemaining: previousState.secondsRemaining,
      offense: previousState.offenseKey,
      defense: previousState.defenseKey,
      userTeam: userLocation.teamKey,
      userPlayerIndex: userLocation.playerIndex,
      possessionIndex: previousState.possessionIndex,
      score: previousState.score,
      workRate: userMatchState?.workRate ?? userLocation.player.attributes.stamina,
      focus: userMatchState?.focus ?? userLocation.player.morale,
    };
    const scheduled = keyMomentScheduler.onPossessionBoundary({
      context: contextArgs,
      periodTotalSeconds: Math.max(1, Math.floor(totalSeconds / 4)),
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
    resolvePendingKeyMoment,
  };
};
