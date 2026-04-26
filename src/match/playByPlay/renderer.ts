import type { MatchContext, PossessionResult } from "../../matchEngine";

export interface RenderPlayByPlayArgs {
  result: PossessionResult;
  context: MatchContext;
  offense: "home" | "away";
  defense: "home" | "away";
  ballHandlerIndex?: number;
}

const getPlayerName = (context: MatchContext, team: "home" | "away", index: number | undefined): string => {
  if (index === undefined || index < 0 || index > 4) {
    return "Unknown";
  }
  const roster = team === "home" ? context.home.roster : context.away.roster;
  return roster[index]?.name ?? "Unknown";
};

export const renderPossessionPlayByPlayLine = (
  args: RenderPlayByPlayArgs,
): { text: string; type: "score" | "miss" | "turnover" | "info" } => {
  const { result, context, offense, defense, ballHandlerIndex } = args;
  const shooterName = getPlayerName(context, offense, result.shooterIndex);
  const assisterName = getPlayerName(context, offense, result.assisterIndex);
  const defenderName = getPlayerName(context, defense, result.defensivePlay.defenderIndex);
  const rebounderName = getPlayerName(
    context,
    result.offensiveRebound ? offense : defense,
    result.rebounderIndex,
  );
  const handlerName = getPlayerName(context, offense, ballHandlerIndex);

  switch (result.eventType) {
    case "made_3":
      return {
        text: result.assisterIndex !== undefined ? `${shooterName} splashes a 3 (assist ${assisterName})` : `${shooterName} splashes a 3`,
        type: "score",
      };
    case "made_2":
      return {
        text: result.assisterIndex !== undefined ? `${shooterName} finishes for 2 (assist ${assisterName})` : `${shooterName} finishes for 2`,
        type: "score",
      };
    case "putback_make":
      return { text: `${shooterName} converts the putback`, type: "score" };
    case "free_throws": {
      const attempted = result.freeThrows?.attempted ?? 0;
      const made = result.freeThrows?.made ?? 0;
      const foulerName = getPlayerName(context, result.freeThrows?.foulOnTeam ?? defense, result.freeThrows?.foulOnPlayerIndex);
      const foulByDefense = result.freeThrows?.foulOnTeam === defense;
      return {
        text: foulByDefense
          ? `${foulerName} fouls on the contest; ${shooterName} makes ${made} of ${attempted}`
          : `${shooterName} draws contact and makes ${made} of ${attempted}`,
        type: made > 0 ? "score" : "miss",
      };
    }
    case "steal":
      return { text: `${defenderName} strips ${handlerName}`, type: "turnover" };
    case "turnover":
      return { text: `${handlerName} coughs it up`, type: "turnover" };
    case "block":
      return { text: `${defenderName} blocks ${shooterName} at the rim`, type: "miss" };
    case "off_reb":
      return { text: `${rebounderName} keeps it alive with an offensive board`, type: "info" };
    case "def_reb":
      return { text: `${rebounderName} secures the defensive rebound`, type: "miss" };
    case "putback_miss":
      return { text: `${shooterName} misses the putback`, type: "miss" };
    default:
      return { text: `${shooterName} misses`, type: "miss" };
  }
};
