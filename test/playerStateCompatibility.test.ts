import { createMatchEngineAdapter } from "../src/matchEngineAdapter";
import { useCareerStore } from "../src/store/useCareerStore";
import { normalizePlayerStateForInk } from "../src/types/player";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

describe("Player state compatibility", () => {
  it("normalizes legacy PascalCase input into camelCase player state", () => {
    const normalized = normalizePlayerStateForInk({
      id: "p1",
      name: "Legacy Player",
      age: 18,
      BankBalance: 200,
      Morale: 55,
      Position: "SG",
      archetype: "Sharpshooter",
      attributes: {
        shooting: 80,
        finishing: 65,
        vision: 60,
        handle: 70,
        athleticism: 72,
        defense: 58,
        rebounding: 49,
        bbiq: 68,
        stamina: 75,
      },
      gameStats: {
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        fga: 0,
        fgm: 0,
      },
    });

    expect(normalized.bankBalance).toBe(200);
    expect(normalized.morale).toBe(55);
    expect(normalized.position).toBe("SG");
    expect(normalized.secondaryPosition).toBe("PG");
  });

  it("prefers camelCase values when both legacy and canonical fields are present", () => {
    const normalized = normalizePlayerStateForInk({
      id: "p2",
      name: "Mixed Player",
      age: 18,
      bankBalance: 900,
      morale: 66,
      position: "PG",
      secondaryPosition: "SG",
      BankBalance: 100,
      Morale: 10,
      Position: "C",
      archetype: "Playmaker",
      attributes: {
        shooting: 70,
        finishing: 70,
        vision: 80,
        handle: 82,
        athleticism: 74,
        defense: 64,
        rebounding: 50,
        bbiq: 72,
        stamina: 78,
      },
      gameStats: {
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        fga: 0,
        fgm: 0,
      },
    });

    expect(normalized.bankBalance).toBe(900);
    expect(normalized.morale).toBe(66);
    expect(normalized.position).toBe("PG");
    expect(normalized.secondaryPosition).toBe("SG");
  });

  it("round-trips ink state through the adapter boundary", () => {
    const makePlayer = (id: string) => ({
      id,
      name: id,
      age: 19,
      bankBalance: 250,
      morale: 62,
      position: "PG" as const,
      secondaryPosition: "SG" as const,
      archetype: "Playmaker" as const,
      attributes: {
        shooting: 70 as const,
        finishing: 66 as const,
        vision: 82 as const,
        handle: 84 as const,
        athleticism: 71 as const,
        defense: 58 as const,
        rebounding: 44 as const,
        bbiq: 78 as const,
        stamina: 80 as const,
      },
      gameStats: {
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        fga: 0,
        fgm: 0,
      },
    });

    const adapter = createMatchEngineAdapter({
      home: {
        name: "Home",
        teamOvr: 0,
        roster: [makePlayer("h1"), makePlayer("h2"), makePlayer("h3"), makePlayer("h4"), makePlayer("h5")],
      },
      away: {
        name: "Away",
        teamOvr: 0,
        roster: [makePlayer("a1"), makePlayer("a2"), makePlayer("a3"), makePlayer("a4"), makePlayer("a5")],
      },
      userPlayerId: "h1",
      seed: 20260220,
    });

    const initial = adapter.startGame();
    expect(initial.userInkState?.BankBalance).toBe(250);
    expect(initial.userInkState?.Morale).toBe(62);
    expect(initial.userInkState?.Position).toBe("PG");

    const next = adapter.updateUserInkState({ BankBalance: 400, Morale: 70, Position: "SG" });
    expect(next.userInkState?.BankBalance).toBe(400);
    expect(next.userInkState?.Morale).toBe(70);
    expect(next.userInkState?.Position).toBe("SG");
  });

  it("migrates persisted legacy PascalCase player state into camelCase", () => {
    const migrate = (useCareerStore as unknown as { persist: { getOptions: () => { migrate?: (state: unknown) => unknown } } }).persist
      .getOptions().migrate;
    expect(migrate).toBeDefined();

    const migrated = migrate?.({
      player: {
        id: "legacy",
        name: "Legacy",
        age: 18,
        BankBalance: 777,
        Morale: 64,
        Position: "SF",
        archetype: "Slasher",
        attributes: {
          shooting: 60,
          finishing: 75,
          vision: 55,
          handle: 66,
          athleticism: 80,
          defense: 57,
          rebounding: 61,
          bbiq: 63,
          stamina: 79,
        },
        gameStats: {
          points: 0,
          assists: 0,
          rebounds: 0,
          steals: 0,
          blocks: 0,
          fga: 0,
          fgm: 0,
        },
      },
    }) as {
      player: {
        bankBalance: number;
        morale: number;
        position: string;
        secondaryPosition: string;
        identity: { height?: { feet: number; inches: number }; weightLbs?: number } | null;
        dna: { potentialTier: string; caps: { shooting: number; finishing: number } };
        attributes: { shooting: number; finishing: number };
      };
      newsFeed: unknown[];
      view: string;
    };

    expect(migrated.player.bankBalance).toBe(777);
    expect(migrated.player.morale).toBe(64);
    expect(migrated.player.position).toBe("SF");
    expect(migrated.player.secondaryPosition).toBe("PF");
    expect(migrated.player.identity).toBeTruthy();
    expect(migrated.player.identity?.height).toBeTruthy();
    expect(typeof migrated.player.identity?.weightLbs).toBe("number");
    expect(migrated.player.dna).toBeTruthy();
    expect(["Bronze", "Silver", "Gold", "Platinum"]).toContain(migrated.player.dna.potentialTier);
    expect(migrated.player.dna.caps.shooting).toBeGreaterThanOrEqual(migrated.player.attributes.shooting);
    expect(migrated.player.dna.caps.finishing).toBeGreaterThanOrEqual(migrated.player.attributes.finishing);
    expect(Array.isArray(migrated.newsFeed)).toBe(true);
    expect(migrated.view).not.toBe("BACKSTORY");
  });
});
