import type { Team } from "./types/team";
import type { InkPlayerState, LegacyPlayerStateInput, Player } from "./types/player";
import { normalizePlayerStateForInk } from "./types/player";
import { LeagueLevel } from "./types/career";
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

type KeyMomentChoiceId = "force_shot" | "pass_to_corner" | "reset";

export interface KeyMomentChoice {
  id: KeyMomentChoiceId;
  label: string;
}

export interface KeyMomentEvent {
  triggered: true;
  pendingId: string;
  contextLine: string;
  reason: "critical_state" | "rng" | "critical_and_rng";
  choices: [KeyMomentChoice, KeyMomentChoice, KeyMomentChoice];
  immediateStatResult: {
    action: PossessionResult["action"];
    pointsDelta: PossessionResult["points"];
    madeShot: boolean;
    turnoverLikeFailure: boolean;
    assisted: boolean;
  };
}

export interface PendingPossession {
  pendingId: string;
  state: PossessionState;
  result: PossessionResult;
}

export interface PendingKeyMoment {
  pendingId: string;
  event: KeyMomentEvent;
}

export interface AdapterStepOutput {
  state: PossessionState;
  metrics: SimMetrics;
  result?: PossessionResult;
  keyMoment?: KeyMomentEvent;
  pendingPossession?: PendingPossession;
  pendingKeyMoment?: PendingKeyMoment;
  userInkState?: { id: string } & InkPlayerState;
}

export interface AdapterRunOutput {
  state: PossessionState;
  metrics: SimMetrics;
  keyMoments: KeyMomentEvent[];
  pendingPossession?: PendingPossession;
  pendingKeyMoment?: PendingKeyMoment;
}

export interface MatchEngineAdapter {
  startGame(): AdapterStepOutput;
  stepPossession(): AdapterStepOutput;
  runPossessions(possessions: number): AdapterRunOutput;
  getState(): AdapterStepOutput;
  updateUserInkState(next: InkPlayerState): AdapterStepOutput;
  resumePendingPossession(): AdapterStepOutput;
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

const KEY_MOMENT_CHOICES: [KeyMomentChoice, KeyMomentChoice, KeyMomentChoice] = [
  { id: "force_shot", label: "Force Shot" },
  { id: "pass_to_corner", label: "Pass to Corner" },
  { id: "reset", label: "Reset" },
];

const normalizeTeamInput = (team: TeamInput): Team => {
  const roster = team.roster.map((player) => normalizePlayerStateForInk(player)) as Team["roster"];
  return {
    name: team.name,
    roster,
    teamOvr: team.teamOvr,
  };
};

const createContextLine = (action: PossessionResult["action"], secondsRemaining: number): string => {
  const clock = Math.max(0, Math.floor(secondsRemaining));
  if (action === "shoot") {
    return `Double team incoming, ${clock}s remaining.`;
  }
  if (action === "pass") {
    return `Defense collapses on drive, ${clock}s remaining.`;
  }
  return `Shot clock pressure, ${clock}s remaining.`;
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
  let state = initializePossession(context, leagueLevel, rng, options.secondsRemaining ?? 20 * 60);
  let metrics: SimMetrics = {
    possessions: 0,
    fga: 0,
    fgm: 0,
    assists: 0,
    turnoverLikeFailures: 0,
  };
  let pendingPossession: PendingPossession | undefined;
  let pendingKeyMoment: PendingKeyMoment | undefined;

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

  const buildKeyMoment = (
    previousState: PossessionState,
    result: PossessionResult,
  ): KeyMomentEvent | undefined => {
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

    let reason: KeyMomentEvent["reason"] = "critical_state";
    if (critical && rngTrigger) {
      reason = "critical_and_rng";
    } else if (rngTrigger) {
      reason = "rng";
    }

    const pendingId = `pending-possession-${pendingIdCounter}`;

    return {
      triggered: true,
      pendingId,
      contextLine: createContextLine(result.action, previousState.secondsRemaining),
      reason,
      choices: KEY_MOMENT_CHOICES,
      immediateStatResult: {
        action: result.action,
        pointsDelta: result.points,
        madeShot: result.madeShot,
        turnoverLikeFailure: result.turnoverLikeFailure,
        assisted: result.assisted,
      },
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
    const result = simulatePossession(context, previousState, leagueLevel, rng);
    const keyMoment = buildKeyMoment(previousState, result);

    if (keyMoment) {
      pendingIdCounter += 1;
      pendingPossession = {
        pendingId: keyMoment.pendingId,
        state: previousState,
        result,
      };
      pendingKeyMoment = {
        pendingId: keyMoment.pendingId,
        event: keyMoment,
      };
      return buildStepOutput({
        result,
        keyMoment,
      });
    }

    metrics = updateMetrics(metrics, result);
    state = result.nextState;

    return buildStepOutput({
      result,
    });
  };

  const startGame = (): AdapterStepOutput => buildStepOutput();

  const runPossessions = (possessions: number): AdapterRunOutput => {
    const keyMoments: KeyMomentEvent[] = [];
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

  const resumePendingPossession = (): AdapterStepOutput => {
    if (!pendingPossession) {
      return buildStepOutput();
    }

    const pending = pendingPossession;
    pendingPossession = undefined;
    pendingKeyMoment = undefined;
    metrics = updateMetrics(metrics, pending.result);
    state = pending.result.nextState;

    return buildStepOutput({
      result: pending.result,
    });
  };

  return {
    startGame,
    stepPossession,
    runPossessions,
    getState,
    updateUserInkState,
    resumePendingPossession,
  };
};
