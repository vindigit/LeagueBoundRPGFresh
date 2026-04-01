import { generateBackstoryFromInput } from "../src/features/backstory/generator";
import { toHeightPreset, toWeightPreset } from "../src/features/backstory/constants/bodyMapping";
import { buildBuilderCaps } from "../src/builder/caps";
import {
  DEFAULT_WINGSPAN_PRESET,
  WINGSPAN_PRESET_CONFIG,
  WINGSPAN_PRESETS,
} from "../src/builder/constants/wingspanPresets";
import type { BackstoryInput } from "../src/types/backstory";

describe("Builder wingspan presets", () => {
  it("resolves every preset deterministically with bounded modifiers", () => {
    expect(DEFAULT_WINGSPAN_PRESET).toBe("6_4_6_6");
    expect(WINGSPAN_PRESETS).toHaveLength(6);

    for (const preset of WINGSPAN_PRESETS) {
      const config = WINGSPAN_PRESET_CONFIG[preset];
      expect(config.key).toBe(preset);
      for (const value of Object.values(config.capBonus)) {
        expect(Math.abs(value ?? 0)).toBeLessThanOrEqual(2);
      }
    }
  });
});

describe("Builder caps", () => {
  const fixtures: BackstoryInput[] = [
    {
      firstName: "Slash",
      lastName: "Guard",
      stateCode: "TX",
      citySlug: "houston-tx",
      archetype: "Slasher",
      ageStarted: 8,
      bodyFrame: "Athletic",
      dominantHand: "Right",
      primaryPosition: "PG",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 1 },
      weightLbs: 175,
    },
    {
      firstName: "Sharp",
      lastName: "Wing",
      stateCode: "CA",
      citySlug: "los-angeles-ca",
      archetype: "Sharpshooter",
      ageStarted: 8,
      bodyFrame: "Lean",
      dominantHand: "Right",
      primaryPosition: "SF",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 7 },
      weightLbs: 200,
    },
    {
      firstName: "Lock",
      lastName: "Big",
      stateCode: "IL",
      citySlug: "chicago-il",
      archetype: "Lockdown Defender",
      ageStarted: 5,
      bodyFrame: "Stocky",
      dominantHand: "Left",
      primaryPosition: "PF",
      secondaryPosition: "C",
      height: { feet: 6, inches: 10 },
      weightLbs: 245,
    },
    {
      firstName: "Play",
      lastName: "Hub",
      stateCode: "NY",
      citySlug: "new-york-ny",
      archetype: "Playmaker",
      ageStarted: 12,
      bodyFrame: "Lean",
      dominantHand: "Right",
      primaryPosition: "PG",
      secondaryPosition: "SG",
      height: { feet: 6, inches: 2 },
      weightLbs: 165,
    },
    {
      firstName: "Paint",
      lastName: "Center",
      stateCode: "FL",
      citySlug: "miami-fl",
      archetype: "Paint Beast",
      ageStarted: 9,
      bodyFrame: "Stocky",
      dominantHand: "Right",
      primaryPosition: "C",
      secondaryPosition: "PF",
      height: { feet: 7, inches: 1 },
      weightLbs: 270,
    },
    {
      firstName: "Stretch",
      lastName: "Forward",
      stateCode: "WA",
      citySlug: "seattle-wa",
      archetype: "Stretch Big",
      ageStarted: 6,
      bodyFrame: "Athletic",
      dominantHand: "Left",
      primaryPosition: "PF",
      secondaryPosition: "SF",
      height: { feet: 6, inches: 9 },
      weightLbs: 220,
    },
  ];

  it("matches current backstory cap math for overlapping neutral-wingspan inputs", () => {
    fixtures.forEach((input, index) => {
      const generated = generateBackstoryFromInput(input, { seedOverride: 9000 + index });
      const builderCaps = buildBuilderCaps({
        archetype: input.archetype,
        potential: generated.dna.potential,
        frame: input.bodyFrame,
        growthCurve: generated.dna.growthCurve,
        primaryPosition: input.primaryPosition,
        secondaryPosition: generated.identity.secondaryPosition,
        heightPreset: toHeightPreset(input.height),
        weightPreset: toWeightPreset(input.weightLbs),
        wingspanPreset: DEFAULT_WINGSPAN_PRESET,
      });

      expect(builderCaps).toEqual(generated.dna.caps);
    });
  });

  it("keeps all caps within the hard floor and ceiling", () => {
    const generated = generateBackstoryFromInput(fixtures[4], { seedOverride: 77 });
    const caps = buildBuilderCaps({
      archetype: fixtures[4].archetype,
      potential: generated.dna.potential,
      frame: fixtures[4].bodyFrame,
      growthCurve: generated.dna.growthCurve,
      primaryPosition: fixtures[4].primaryPosition,
      secondaryPosition: generated.identity.secondaryPosition,
      heightPreset: toHeightPreset(fixtures[4].height),
      weightPreset: toWeightPreset(fixtures[4].weightLbs),
      wingspanPreset: "7_1_7_3",
    });

    for (const value of Object.values(caps)) {
      expect(value).toBeGreaterThanOrEqual(40);
      expect(value).toBeLessThanOrEqual(99);
    }
  });
});
