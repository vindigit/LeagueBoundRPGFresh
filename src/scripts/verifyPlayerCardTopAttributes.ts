import assert from "node:assert/strict";
import { getTopAttributes } from "../components/playerCardUtils";
import type { PlayerAttributes } from "../types/player";

const sampleAttributes: PlayerAttributes = {
  shortRange: 81,
  dunking: 77,
  midrange: 79,
  threePoint: 81,
  handle: 73,
  passing: 72,
  vision: 82,
  perimeterDefense: 66,
  interiorDefense: 65,
  stealing: 90,
  blocking: 64,
  offRebounding: 62,
  defRebounding: 61,
  speed: 90,
  strength: 74,
  stamina: 79,
};

const topAttributes = getTopAttributes(sampleAttributes);

assert.equal(topAttributes.length, 6, "Expected exactly six top attributes.");
assert.deepEqual(
  topAttributes.map((attribute) => attribute.key),
  ["stealing", "speed", "vision", "shortRange", "threePoint", "midrange"],
  "Expected stable ordering for equal ratings.",
);
assert.deepEqual(
  topAttributes.map((attribute) => attribute.value),
  [90, 90, 82, 81, 81, 79],
  "Expected descending attribute values.",
);

console.log("verifyPlayerCardTopAttributes: PASS");
