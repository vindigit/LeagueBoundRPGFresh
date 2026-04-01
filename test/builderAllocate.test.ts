import type { PlayerAttributes } from "../src/types/player";
import { applyAllocation } from "../src/builder/allocate";

const makeAttributes = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => ({
  shortRange: 60,
  dunking: 60,
  midrange: 60,
  threePoint: 60,
  handle: 60,
  passing: 60,
  vision: 60,
  perimeterDefense: 60,
  interiorDefense: 60,
  stealing: 60,
  blocking: 60,
  offRebounding: 60,
  defRebounding: 60,
  speed: 60,
  strength: 60,
  stamina: 60,
  ...overrides,
});

describe("Builder allocation", () => {
  it("returns a no-op result for empty changes", () => {
    const current = makeAttributes();
    const result = applyAllocation({
      attributes: current,
      caps: makeAttributes({ threePoint: 80 }),
      availablePoints: 20,
      changes: {},
    });

    expect(result.success).toBe(true);
    expect(result.attributes).toEqual(current);
    expect(result.netCost).toBe(0);
    expect(result.remainingPoints).toBe(20);
  });

  it("applies upgrades, clamps to cap, and preserves untouched attributes", () => {
    const current = makeAttributes({ threePoint: 74, handle: 65 });
    const result = applyAllocation({
      attributes: current,
      caps: makeAttributes({ threePoint: 76, handle: 99 }),
      availablePoints: 20,
      changes: { threePoint: 5, handle: 2 },
    });

    expect(result.success).toBe(true);
    expect(result.attributes.threePoint).toBe(76);
    expect(result.attributes.handle).toBe(67);
    expect(result.attributes.speed).toBe(current.speed);
    expect(result.netCost).toBeGreaterThan(0);
  });

  it("rejects impossible overspend allocations without mutating state", () => {
    const current = makeAttributes({ handle: 80, threePoint: 80 });
    const result = applyAllocation({
      attributes: current,
      caps: makeAttributes({ handle: 99, threePoint: 99 }),
      availablePoints: 3,
      changes: { handle: 5, threePoint: 5 },
    });

    expect(result.success).toBe(false);
    expect(result.attributes).toEqual(current);
    expect(result.rejectedReasons[0]).toContain("overspends");
  });

  it("returns refunds for downward reallocation", () => {
    const current = makeAttributes({ handle: 80, strength: 70 });
    const result = applyAllocation({
      attributes: current,
      caps: makeAttributes({ handle: 99, strength: 99 }),
      availablePoints: 0,
      changes: { handle: -3, strength: 2 },
    });

    expect(result.success).toBe(true);
    expect(result.attributes.handle).toBe(77);
    expect(result.attributes.strength).toBe(72);
    expect(result.refundedPoints).toBeGreaterThan(0);
  });
});
