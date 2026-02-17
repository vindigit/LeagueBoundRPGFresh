export type Position = "PG" | "SG" | "SF" | "PF" | "C";

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
  shooting: Rating0To99;
  finishing: Rating0To99;
  vision: Rating0To99;
  handle: Rating0To99;
  athleticism: Rating0To99;
  defense: Rating0To99;
  rebounding: Rating0To99;
  bbiq: Rating0To99;
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
  BankBalance: number;
  Morale: number;
  Position: Position;
  bankBalance?: number;
  morale?: number;
  position?: Position;
  archetype: PlayerArchetype;
  attributes: PlayerAttributes;
  gameStats: PlayerGameStats;
}

export type PlayerStateInput = Omit<Player, "BankBalance" | "Morale" | "Position"> & {
  BankBalance?: number;
  Morale?: number;
  Position?: Position;
  bankBalance?: number;
  morale?: number;
  position?: Position;
};

export const normalizePlayerStateForInk = (player: PlayerStateInput): Player => {
  const BankBalance = player.BankBalance ?? player.bankBalance;
  const Morale = player.Morale ?? player.morale;
  const Position = player.Position ?? player.position;

  if (BankBalance === undefined || Morale === undefined || Position === undefined) {
    throw new Error("Player state normalization requires balance, morale, and position values.");
  }

  return {
    ...player,
    BankBalance,
    Morale,
    Position,
    bankBalance: BankBalance,
    morale: Morale,
    position: Position,
  };
};
