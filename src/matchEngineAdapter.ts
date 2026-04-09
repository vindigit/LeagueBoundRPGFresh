import type { Team } from "./types/team";
import type { InkPlayerState, LegacyPlayerStateInput, Player } from "./types/player";
import { normalizePlayerStateForInk } from "./types/player";
import { LeagueLevel } from "./types/career";
import { KEY_MOMENT_BASELINE_QUALITY, KEY_MOMENT_TEMPLATES } from "./match/keyMoments/catalog";
import { resolveKeyMoment } from "./match/keyMoments/resolveKeyMoment";
import type { KeyMomentPending, KeyMomentResolutionInput, KeyMomentTemplate, PeriodKey } from "./match/keyMoments/types";
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

export interface AdapterStepOutput {
  state: PossessionState;
  metrics: SimMetrics;
  result?: PossessionResult;
  keyMoment?: KeyMomentPending;
  pendingPossession?: PendingPossession;
  pendingKeyMoment?: KeyMomentPending;
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

const pickChoiceTemplateForState = (state: PossessionState): KeyMomentTemplate => {
  const scenario = state.offenseKey === "home" ? "offense_choice" : "defense_choice";
  const eligible = KEY_MOMENT_TEMPLATES.filter((template) => template.mode === "choice" && template.scenario === scenario);
  return eligible[0] ?? KEY_MOMENT_TEMPLATES.find((template) => template.mode === "choice") ?? KEY_MOMENT_TEMPLATES[0];
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
  const totalSeconds = options.secondsRemaining ?? 20 * 60;
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
    const offenseTeam = previousState.offenseKey === "home" ? context.home : context.away;
    const ballHandler = offenseTeam.roster[previousState.ballHandlerIndex];
    const playerInvolved = ballHandler.id === options.userPlayerId;
    if (!playerInvolved) {
      return undefined;
    }
    const critical = isCriticalState(previousState);
    const rngTrigger = rng() <= keyMomentRngChance;
    if (!critical && !rngTrigger) {
      return undefined;
    }

    const pendingId = `pending-possession-${pendingIdCounter}`;
    const template = pickChoiceTemplateForState(previousState);
    const periodState = getPeriodState(totalSeconds, previousState.secondsRemaining);

    return {
      id: pendingId,
      context: {
        id: pendingId,
        periodKey: periodState.periodKey,
        quarter: periodState.quarter,
        overtimePeriod: periodState.overtimePeriod,
        timeRemaining: previousState.secondsRemaining,
        offense: previousState.offenseKey,
        defense: previousState.defenseKey,
        userTeam: "home",
        userPlayerIndex: previousState.ballHandlerIndex,
        possessionIndex: previousState.possessionIndex,
        score: previousState.score,
      },
      scenario: template.scenario,
      promptText: template.promptText,
      mode: "choice",
      options: template.options,
      simBaselineQuality: KEY_MOMENT_BASELINE_QUALITY,
    };
  };

  const buildStepOutput = (overrides: Partial<AdapterStepOutput> = {}): AdapterStepOutput => ({
    state,
    metrics,
    pendingPossession,
    pendingKeyMoment,
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
    const resolution = resolveKeyMoment({
      pending: pending.pending,
      input,
      context,
      possessionState: pending.state,
    });

    pendingPossession = undefined;
    pendingKeyMoment = undefined;
    metrics = updateMetrics(metrics, resolution.result);
    state = resolution.result.nextState;

    return buildStepOutput({
      result: resolution.result,
    });
  };

  return {
    startGame,
    stepPossession,
    runPossessions,
    getState,
    updateUserInkState,
    resolvePendingKeyMoment,
  };
};
