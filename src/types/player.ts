import type { PlayerDNA, PlayerIdentity } from "./backstory";
export type Position = "PG" | "SG" | "SF" | "PF" | "C";
export type WingspanPreset = "5_10_6_0" | "6_1_6_3" | "6_4_6_6" | "6_7_6_9" | "6_10_7_0" | "7_1_7_3";

export type PlayerArchetype =
  | "Slasher"
  | "Sharpshooter"
  | "Playmaker"
  | "Lockdown Defender"
  | "Paint Beast"
  | "Stretch Big";

export type Rating0To99 =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63
  | 64
  | 65
  | 66
  | 67
  | 68
  | 69
  | 70
  | 71
  | 72
  | 73
  | 74
  | 75
  | 76
  | 77
  | 78
  | 79
  | 80
  | 81
  | 82
  | 83
  | 84
  | 85
  | 86
  | 87
  | 88
  | 89
  | 90
  | 91
  | 92
  | 93
  | 94
  | 95
  | 96
  | 97
  | 98
  | 99;

export interface PlayerAttributes {
  shortRange: Rating0To99;
  dunking: Rating0To99;
  midrange: Rating0To99;
  threePoint: Rating0To99;
  handle: Rating0To99;
  passing: Rating0To99;
  vision: Rating0To99;
  perimeterDefense: Rating0To99;
  interiorDefense: Rating0To99;
  stealing: Rating0To99;
  blocking: Rating0To99;
  offRebounding: Rating0To99;
  defRebounding: Rating0To99;
  speed: Rating0To99;
  strength: Rating0To99;
  stamina: Rating0To99;
}

export interface PlayerGameStats {
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  fga: number;
  fgm: number;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  bankBalance: number;
  morale: number;
  position: Position;
  secondaryPosition?: Position;
  archetype: PlayerArchetype;
  identity: PlayerIdentity | null;
  dna: PlayerDNA | null;
  attributes: PlayerAttributes;
  gameStats: PlayerGameStats;
}

export interface InkPlayerState {
  BankBalance: number;
  Morale: number;
  Position: Position;
}

export type LegacyPlayerStateInput = Omit<Player, "bankBalance" | "morale" | "position" | "identity" | "dna"> & {
  identity?: PlayerIdentity | null;
  dna?: PlayerDNA | null;
  bankBalance?: number;
  morale?: number;
  position?: Position;
  secondaryPosition?: Position;
  BankBalance?: number;
  Morale?: number;
  Position?: Position;
};

export const normalizePlayerStateForInk = (player: LegacyPlayerStateInput): Player => {
  const bankBalance = player.bankBalance ?? player.BankBalance;
  const morale = player.morale ?? player.Morale;
  const position = player.position ?? player.Position;

  if (bankBalance === undefined || morale === undefined || position === undefined) {
    throw new Error("Player state normalization requires balance, morale, and position values.");
  }

  const secondaryDefaults: Record<Position, Position> = {
    PG: "SG",
    SG: "PG",
    SF: "PF",
    PF: "C",
    C: "PF",
  };

  const { BankBalance: _legacyBalance, Morale: _legacyMorale, Position: _legacyPosition, ...rest } = player;

  return {
    ...rest,
    bankBalance,
    morale,
    position,
    secondaryPosition: player.secondaryPosition ?? secondaryDefaults[position],
    identity: player.identity ?? null,
    dna: player.dna ?? null,
  };
};
