import type { Player } from "./player";

export interface Team {
  name: string;
  roster: [Player, Player, Player, Player, Player];
  teamOvr: number;
}
