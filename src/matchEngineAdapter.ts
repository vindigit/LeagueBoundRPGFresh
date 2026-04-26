import type { Team } from "./types/team";
import type { InkPlayerState, LegacyPlayerStateInput, Player } from "./types/player";
import { normalizePlayerStateForInk } from "./types/player";
import { LeagueLevel } from "./types/career";
import { KEY_MOMENT_DEFINITIONS } from "./match/keyMoments/catalog";
import { tryResolveKeyMoment } from "./match/keyMoments/resolveKeyMoment";
import type { KeyMomentBuildArgs, KeyMomentPending, KeyMomentResolutionInput, PeriodKey } from "./match/keyMoments/types";
import {
  createSeededRng,
  initializePossession,
  simulatePossession,
  type MatchContext,
  type PossessionResult,
  type PossessionState,
  type SimMetrics,
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
}

export interface AdapterRunOutput {
  state: PossessionState;
  metrics: SimMetrics;
  keyMoments: KeyMomentPending[];
  pendingPossession?: PendingPossession;
  pendingKeyMoment?: KeyMomentPending;
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

export interface MatchEngineAdapterOptions {
  home: TeamInput;
  away: TeamInput;
  userPlayerId: string;
  seed: number;
  leagueLevel?: LeagueLevel;
  secondsRemaining?: number;
  keyMomentRngChance?: number;
  enableKeyMoments?: boolean;
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

const updateMetrics = (metrics: SimMetrics, result: PossessionResult): SimMetrics => ({
  possessions: metrics.possessions + 1,
  fga: metrics.fga + (result.turnoverLikeFailure ? 0 : 1),
  fgm: metrics.fgm + (result.madeShot ? 1 : 0),
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

let pendingIdCounter = 1;

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

export const createMatchEngineAdapter = (
  options: MatchEngineAdapterOptions,
): MatchEngineAdapter => {
  const context: MatchContext = {
    home: normalizeTeamInput(options.home),
    away: normalizeTeamInput(options.away),
  };
  const rng = createSeededRng(options.seed);
  const leagueLevel = options.leagueLevel ?? LeagueLevel.PRO;
  const keyMomentRngChance = options.keyMomentRngChance ?? 0.08;
  const enableKeyMoments = options.enableKeyMoments ?? true;
  const totalSeconds = options.secondsRemaining ?? 20 * 60;
  const userLocation = getPlayerLocation(context, options.userPlayerId);
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
    const rngTrigger = rng() <= keyMomentRngChance;
    if (!critical && !rngTrigger) {
      return undefined;
    }

    const pendingId = `pending-possession-${pendingIdCounter}`;
    const periodState = getPeriodState(totalSeconds, previousState.secondsRemaining);
    const seedValue = Math.floor(rng() * 1_000_000);
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
    };
    const eligible = KEY_MOMENT_DEFINITIONS.filter((definition) =>
      contextArgs.offense === contextArgs.userTeam
        ? definition.type === "create_shot" || definition.type === "make_the_read"
        : definition.type === "on_ball_stop" || definition.type === "jump_lane",
    );
    const pool = eligible.length > 0 ? eligible : KEY_MOMENT_DEFINITIONS;
    const definition = pool[Math.abs(seedValue) % pool.length];
    const buildArgs: KeyMomentBuildArgs = {
      id: pendingId,
      context: contextArgs,
      matchContext: context,
      possessionState: previousState,
      seedValue,
    };
    return definition?.buildPending(buildArgs);
  };

  const buildStepOutput = (overrides: Partial<AdapterStepOutput> = {}): AdapterStepOutput => ({
    state,
    metrics,
    pendingPossession,
    pendingKeyMoment,
    resolvedKeyMoment: undefined,
    userInkState: getUserInkState(),
    ...overrides,
  });

  const stepPossession = (): AdapterStepOutput => {
    if (pendingPossession) {
      return buildStepOutput();
    }

    const previousState = state;
    const keyMoment = buildKeyMoment(previousState);

    if (keyMoment) {
      pendingIdCounter += 1;
      pendingPossession = {
        pendingId: keyMoment.id,
        state: previousState,
        pending: keyMoment,
      };
      pendingKeyMoment = keyMoment;
      return buildStepOutput({
        keyMoment,
      });
    }

    const result = simulatePossession(context, previousState, leagueLevel, rng);

    metrics = updateMetrics(metrics, result);
    state = result.nextState;

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
        };
      }
    }
    return {
      state,
      metrics,
      keyMoments,
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
    const result = resolution?.result ?? simulatePossession(context, pending.state, leagueLevel, rng);

    pendingPossession = undefined;
    pendingKeyMoment = undefined;
    metrics = updateMetrics(metrics, result);
    state = result.nextState;

    return buildStepOutput({
      result,
      resolvedKeyMoment: resolution
        ? {
            pendingId: pending.pending.id,
            type: pending.pending.type,
            success: resolution.success,
            promptText: pending.pending.promptText,
            resultSummaryText: resolution.resultSummaryText,
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
