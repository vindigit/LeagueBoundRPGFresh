import { useMatchStore } from "../store/useMatchStore";

const HOME_NAMES = ["User", "Home SG", "Home SF", "Home PF", "Home C"];
const AWAY_NAMES = ["Away PG", "Away SG", "Away SF", "Away PF", "Away C"];

const getHomePlayer = (index: number) => useMatchStore.getState().matchBoxScore.homePlayers[index];

describe("Match store index validation", () => {
  beforeEach(() => {
    useMatchStore.getState().initializeMatch("My Player", "Rivals High");
    useMatchStore.getState().initializeBoxScore(HOME_NAMES, AWAY_NAMES);
  });

  it("uses the caller-provided home player name instead of a generic placeholder", () => {
    useMatchStore.getState().initializeMatch("Jordan Lewis", "Rivals High");
    const player = useMatchStore.getState().matchBoxScore.homePlayers[0];
    expect(player.name).toBe("Jordan Lewis");
  });

  it("does not mutate stats when shooterIndex is undefined", () => {
    const before = { ...getHomePlayer(0) };

    useMatchStore.getState().recordBoxScoreEvent({
      scoringTeam: "home",
      shooterIndex: undefined,
      points: 2,
      shotAttempted: true,
      shotMade: true,
    });

    const after = getHomePlayer(0);
    expect(after).toEqual(before);
  });

  it("does not mutate stats when shooterIndex is negative", () => {
    const before = { ...getHomePlayer(0) };

    useMatchStore.getState().recordBoxScoreEvent({
      scoringTeam: "home",
      shooterIndex: -1,
      points: 2,
      shotAttempted: true,
      shotMade: true,
    });

    const after = getHomePlayer(0);
    expect(after).toEqual(before);
  });

  it("does not mutate stats when shooterIndex is out of range", () => {
    const before = { ...getHomePlayer(0) };

    useMatchStore.getState().recordBoxScoreEvent({
      scoringTeam: "home",
      shooterIndex: HOME_NAMES.length,
      points: 2,
      shotAttempted: true,
      shotMade: true,
    });

    const after = getHomePlayer(0);
    expect(after).toEqual(before);
  });

  it("does not mutate stats when shooterIndex is NaN", () => {
    const before = { ...getHomePlayer(0) };

    useMatchStore.getState().recordBoxScoreEvent({
      scoringTeam: "home",
      shooterIndex: Number.NaN,
      points: 2,
      shotAttempted: true,
      shotMade: true,
    });

    const after = getHomePlayer(0);
    expect(after).toEqual(before);
  });

  it("does not mutate stats when shooterIndex is fractional", () => {
    const before = { ...getHomePlayer(1) };

    useMatchStore.getState().recordBoxScoreEvent({
      scoringTeam: "home",
      shooterIndex: 1.5,
      points: 2,
      shotAttempted: true,
      shotMade: true,
    });

    const after = getHomePlayer(1);
    expect(after).toEqual(before);
  });

  it("mutates stats for a valid shooter index", () => {
    useMatchStore.getState().recordBoxScoreEvent({
      scoringTeam: "home",
      shooterIndex: 0,
      points: 2,
      shotAttempted: true,
      shotMade: true,
    });

    const player = getHomePlayer(0);
    expect(player.pts).toBe(2);
    expect(player.fga).toBe(1);
    expect(player.fgm).toBe(1);
  });

  it("records free throws and personal fouls without inflating field goals", () => {
    useMatchStore.getState().recordBoxScoreEvent({
      scoringTeam: "home",
      shooterIndex: 0,
      points: 1,
      freeThrowMade: 1,
      freeThrowAttempted: 2,
      foulOnTeam: "away",
      foulOnPlayerIndex: 2,
    });

    const shooter = getHomePlayer(0);
    const fouler = useMatchStore.getState().matchBoxScore.awayPlayers[2];
    const totals = useMatchStore.getState().matchBoxScore;

    expect(shooter.pts).toBe(1);
    expect(shooter.ftm).toBe(1);
    expect(shooter.fta).toBe(2);
    expect(shooter.fga).toBe(0);
    expect(shooter.fgm).toBe(0);
    expect(fouler.pf).toBe(1);
    expect(totals.homeTotals.ftm).toBe(1);
    expect(totals.homeTotals.fta).toBe(2);
    expect(totals.awayTotals.pf).toBe(1);
  });
});
