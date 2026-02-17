import assert from "node:assert/strict";
import { getTopAttributes } from "../components/playerCardUtils";
import type { PlayerAttributes } from "../types/player";

const sampleAttributes: PlayerAttributes = {
  shooting: 81,
  finishing: 77,
  vision: 81,
  handle: 73,
  athleticism: 90,
  defense: 66,
  rebounding: 62,
  bbiq: 90,
  stamina: 79,
};

const topAttributes = getTopAttributes(sampleAttributes);

assert.equal(topAttributes.length, 3, "Expected exactly three top attributes.");
assert.deepEqual(
  topAttributes.map((attribute) => attribute.key),
  ["athleticism", "bbiq", "shooting"],
  "Expected stable ordering for equal ratings.",
);
assert.deepEqual(
  topAttributes.map((attribute) => attribute.value),
  [90, 90, 81],
  "Expected descending attribute values.",
);

console.log("verifyPlayerCardTopAttributes: PASS");
