import { expandAttributes } from "../src/compat/attrMapping";
import type { OldPlayerAttributes } from "../src/types/player";

const allKeys = [
  "shortRange",
  "dunking",
  "midrange",
  "threePoint",
  "handle",
  "passing",
  "vision",
  "perimeterDefense",
  "interiorDefense",
  "stealing",
  "blocking",
  "offRebounding",
  "defRebounding",
  "speed",
  "strength",
  "stamina",
] as const;

const baseOld: OldPlayerAttributes = {
  shooting: 72,
  finishing: 65,
  vision: 78,
  handle: 81,
  athleticism: 74,
  defense: 68,
  rebounding: 55,
  bbiq: 83,
  stamina: 88,
};

describe("expandAttributes", () => {
  it("produces all 16 attribute keys", () => {
    const expanded = expandAttributes(baseOld);
    expect(Object.keys(expanded)).toEqual(allKeys);
  });

  it("produces integer outputs in 0-99 range", () => {
    const expanded = expandAttributes(baseOld);
    for (const value of Object.values(expanded)) {
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(99);
    }
  });

  it("keeps pass-through mappings", () => {
    const expanded = expandAttributes(baseOld);
    expect(expanded.handle).toBe(baseOld.handle);
    expect(expanded.threePoint).toBe(baseOld.shooting);
    expect(expanded.stamina).toBe(baseOld.stamina);
  });

  it("handles all-zero input", () => {
    const expanded = expandAttributes({
      shooting: 0,
      finishing: 0,
      vision: 0,
      handle: 0,
      athleticism: 0,
      defense: 0,
      rebounding: 0,
      bbiq: 0,
      stamina: 0,
    });

    for (const value of Object.values(expanded)) {
      expect(value).toBe(0);
    }
  });

  it("handles all-99 input", () => {
    const expanded = expandAttributes({
      shooting: 99,
      finishing: 99,
      vision: 99,
      handle: 99,
      athleticism: 99,
      defense: 99,
      rebounding: 99,
      bbiq: 99,
      stamina: 99,
    });

    expect(expanded.shortRange).toBe(99);
    expect(expanded.threePoint).toBe(99);
    expect(expanded.midrange).toBe(89);
    expect(expanded.offRebounding).toBe(79);
  });

  it("clamps and rounds blended values", () => {
    const expanded = expandAttributes({
      shooting: 123.6,
      finishing: -20.4,
      vision: 50.5,
      handle: 51.5,
      athleticism: 150,
      defense: -10,
      rebounding: 101,
      bbiq: 49.2,
      stamina: 200,
    } as unknown as OldPlayerAttributes);

    expect(expanded.midrange).toBe(99);
    expect(expanded.dunking).toBe(14);
    expect(expanded.passing).toBe(51);
    expect(expanded.interiorDefense).toBe(23);
    expect(expanded.stealing).toBe(54);
    expect(expanded.offRebounding).toBe(81);
  });
});
