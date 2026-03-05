import type { Rating0To99 } from "./player";

// TODO: Sprint 2 - remove this temporary legacy-key typing shim when match engine is rewritten.
declare module "./player" {
  interface PlayerAttributes {
    shooting: Rating0To99;
    finishing: Rating0To99;
    athleticism: Rating0To99;
    defense: Rating0To99;
    rebounding: Rating0To99;
    bbiq: Rating0To99;
  }
}
