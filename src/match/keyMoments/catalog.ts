import type { KeyMomentTemplate } from "./types";

export const KEY_MOMENT_BASELINE_QUALITY = 0.55;

export const KEY_MOMENT_TEMPLATES: readonly KeyMomentTemplate[] = [
  {
    id: "KM_AIM_SHOT_PLACEMENT",
    scenario: "offense_shot",
    mode: "minigame",
    promptText: "Key Moment: Find your shooting window and place the shot.",
    minigame: {
      type: "aim_shot_placement",
      durationMs: 2800,
      targetCenter: 0.5,
      targetRadius: 0.14,
    },
  },
  {
    id: "KM_OFFENSE_CHOICE_DECISION",
    scenario: "offense_choice",
    mode: "choice",
    promptText: "Key Moment: Defense is tilted. Make a quick decision.",
    options: [
      { id: "attack_gap", label: "Attack Gap", description: "High-upside drive into traffic.", qualityDelta: 0.12 },
      { id: "kick_out", label: "Kick Out", description: "Safer pass to reset the angle.", qualityDelta: 0.03 },
      { id: "pull_back", label: "Pull Back", description: "Conservative reset under pressure.", qualityDelta: -0.08 },
    ],
  },
  {
    id: "KM_DEFENSE_CHOICE_DECISION",
    scenario: "defense_choice",
    mode: "choice",
    promptText: "Key Moment: Read the action and force a stop.",
    options: [
      { id: "jump_lane", label: "Jump Lane", description: "Aggressive read on the pass.", qualityDelta: 0.12 },
      { id: "contain", label: "Contain", description: "Stay in front and contest late.", qualityDelta: 0.03 },
      { id: "gamble", label: "Gamble", description: "High-risk swipe that can backfire.", qualityDelta: -0.08 },
    ],
  },
];

export const pickKeyMomentTemplate = (seedValue: number): KeyMomentTemplate =>
  KEY_MOMENT_TEMPLATES[Math.abs(Math.floor(seedValue)) % KEY_MOMENT_TEMPLATES.length];
