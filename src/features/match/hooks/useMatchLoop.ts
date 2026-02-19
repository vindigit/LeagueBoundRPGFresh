import { useEffect, useRef } from "react";
import type { PlayerAttributes } from "../../../types/player";
import { useCareerStore } from "../../../store/useCareerStore";
import { useMatchStore } from "../store/useMatchStore";

interface SimulatedTickResult {
  type: "score" | "miss";
  team: "home" | "away";
  points?: 2 | 3;
  text: string;
}

const REAL_SECONDS_PER_TICK = 1;
const GAME_SECONDS_PER_TICK = 10;
const POSSESSION_LENGTH = 24;

const flipPossession = (team: "home" | "away"): "home" | "away" =>
  team === "home" ? "away" : "home";

const simulateTick = (
  attributes: PlayerAttributes,
  possession: "home" | "away",
): SimulatedTickResult => {
  const baseScoreChance = 0.35;
  const shootingBonus = (attributes.shooting / 99) * 0.25;
  const scoreChance = possession === "home" ? baseScoreChance + shootingBonus : baseScoreChance;
  const scored = Math.random() < scoreChance;

  if (scored) {
    const points: 2 | 3 = Math.random() < 0.28 ? 3 : 2;
    return {
      type: "score",
      team: possession,
      points,
      text: `${points}PT made`,
    };
  }

  return {
    type: "miss",
    team: possession,
    text: "Missed shot",
  };
};

export const useMatchLoop = (): void => {
  const possessionProgressRef = useRef<number>(0);

  const isPlaying = useMatchStore((state) => state.isPlaying);
  const isPaused = useMatchStore((state) => state.isPaused);
  const gameFinished = useMatchStore((state) => state.gameFinished);
  const pauseMatch = useMatchStore((state) => state.pauseMatch);
  const endMatch = useMatchStore((state) => state.endMatch);
  const updateGame = useMatchStore((state) => state.updateGame);
  const addLog = useMatchStore((state) => state.addLog);

  const playerAttributes = useCareerStore((state) => state.player.attributes);

  useEffect(() => {
    if (!isPlaying || isPaused || gameFinished) {
      return;
    }

    const intervalId = setInterval(() => {
      const { timeRemaining, quarter, possession, homeScore, awayScore } = useMatchStore.getState();
      const nextTimeRemaining = Math.max(0, timeRemaining - GAME_SECONDS_PER_TICK);

      updateGame({ timeRemaining: nextTimeRemaining });

      if (nextTimeRemaining === 0) {
        pauseMatch();
        possessionProgressRef.current = 0;
        const nextQuarter = quarter + 1;

        if (nextQuarter > 4) {
          endMatch();
          addLog({
            id: `end-${Date.now()}`,
            quarter,
            timeRemaining: 0,
            text: "Final buzzer",
            type: "info",
            team: possession,
          });
          return;
        }

        updateGame({
          quarter: nextQuarter as 1 | 2 | 3 | 4,
          timeRemaining: 720,
        });
        addLog({
          id: `q-${Date.now()}`,
          quarter,
          timeRemaining: 0,
          text: `End Q${quarter}. Q${nextQuarter} ready.`,
          type: "info",
          team: possession,
        });
        return;
      }

      possessionProgressRef.current += GAME_SECONDS_PER_TICK;

      if (possessionProgressRef.current < POSSESSION_LENGTH) {
        return;
      }

      possessionProgressRef.current = 0;
      const result = simulateTick(playerAttributes, possession);

      if (result.type === "score") {
        if (result.team === "home") {
          updateGame({
            homeScore: homeScore + (result.points ?? 2),
            possession: "away",
          });
        } else {
          updateGame({
            awayScore: awayScore + (result.points ?? 2),
            possession: "home",
          });
        }
      } else {
        updateGame({ possession: flipPossession(result.team) });
      }

      addLog({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        quarter,
        timeRemaining: nextTimeRemaining,
        text: `${result.team.toUpperCase()} ${result.text}`,
        type: result.type,
        team: result.team,
      });
    }, REAL_SECONDS_PER_TICK * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [addLog, endMatch, gameFinished, isPaused, isPlaying, pauseMatch, playerAttributes, updateGame]);
};
