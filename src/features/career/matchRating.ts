import type { MatchBoxScore, PlayerBoxScoreLine } from "../match/store/useMatchStore";
import type { MatchConsequence } from "../../types/careerProgression";

export interface CareerMeterDeltas {
  coachTrust: number;
  fans: number;
  teammates: number;
  energy: number;
  condition: number;
}

export interface MatchRatingResult {
  matchRating: number;
  meterDeltas: CareerMeterDeltas;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const roundTenth = (value: number): number => Math.round(value * 10) / 10;

const getUserLine = (boxScore: MatchBoxScore): PlayerBoxScoreLine | undefined => boxScore.homePlayers[0];

const getEfficiencyBonus = (playerLine: PlayerBoxScoreLine): number => {
  if (playerLine.fga <= 0) {
    return 0;
  }

  const fgPct = playerLine.fgm / playerLine.fga;
  if (fgPct >= 0.65) {
    return 1;
  }
  if (fgPct >= 0.5) {
    return 0.6;
  }
  if (fgPct >= 0.4) {
    return 0.2;
  }
  if (fgPct >= 0.3) {
    return -0.3;
  }
  return -0.8;
};

const getConsequencePenalty = (consequences: MatchConsequence[]): number =>
  consequences.reduce((total, consequence) => {
    if (consequence.kind === "injury") {
      return total + 0.6;
    }

    return total + Math.min(0.5, consequence.wearTearDelta * 0.02);
  }, 0);

export const calculatePersonalMatchRating = (input: {
  boxScore: MatchBoxScore;
  didWin: boolean;
  consequences: MatchConsequence[];
}): MatchRatingResult => {
  const playerLine = getUserLine(input.boxScore);
  if (!playerLine) {
    return {
      matchRating: 5,
      meterDeltas: {
        coachTrust: 0,
        fans: 0,
        teammates: 0,
        energy: -6,
        condition: -2,
      },
    };
  }

  const scoringImpact = playerLine.pts * 0.11;
  const playmakingImpact = playerLine.ast * 0.27;
  const reboundingImpact = playerLine.reb * 0.09;
  const defensiveImpact = playerLine.stl * 0.35 + playerLine.blk * 0.3;
  const turnoverPenalty = playerLine.to * 0.32;
  const efficiencyBonus = getEfficiencyBonus(playerLine);
  const winBonus = input.didWin ? 0.45 : -0.15;
  const consequencePenalty = getConsequencePenalty(input.consequences);
  const rawRating =
    5 +
    scoringImpact +
    playmakingImpact +
    reboundingImpact +
    defensiveImpact +
    efficiencyBonus +
    winBonus -
    turnoverPenalty -
    consequencePenalty;
  const matchRating = roundTenth(clamp(rawRating, 0, 10));

  const coachTrust =
    Math.round((matchRating - 5) * 1.4 + (input.didWin ? 1 : -1) - playerLine.to * 0.6);
  const fans =
    Math.round((matchRating - 5) * 1.6 + Math.min(3, playerLine.pts / 8) + (input.didWin ? 1 : 0));
  const teammates =
    Math.round((matchRating - 5) * 1.1 + playerLine.ast * 0.5 - playerLine.to * 0.7 + getEfficiencyBonus(playerLine) * 2);
  const energy = -clamp(Math.round(6 + playerLine.fga * 0.3 + playerLine.to * 0.5 + playerLine.reb * 0.2), 4, 16);
  const condition =
    -clamp(
      Math.round(2 + playerLine.fga * 0.12 + playerLine.reb * 0.08 + input.consequences.reduce((sum, item) => sum + item.wearTearDelta, 0) * 0.15),
      2,
      18,
    );

  return {
    matchRating,
    meterDeltas: {
      coachTrust: clamp(coachTrust, -8, 8),
      fans: clamp(fans, -10, 10),
      teammates: clamp(teammates, -8, 8),
      energy,
      condition,
    },
  };
};
