import type { BodyFrame, ExactHeight } from "../types/backstory";
import type { PlayerArchetype, PlayerAttributes, Position } from "../types/player";

export type PublicAttributeKey =
  | "shooting"
  | "finishing"
  | "playmaking"
  | "defending"
  | "rebounding"
  | "athleticism"
  | "stamina";

export type PublicAttributes = Record<PublicAttributeKey, number>;

export type StartingArchetypeId =
  | "sharpshooter"
  | "slasher"
  | "playmaker"
  | "lockdown"
  | "glass_cleaner"
  | "stretch_big"
  | "all_around";

export type FuzzyScoutingSummary =
  | "Raw tools"
  | "Polished early"
  | "Coaches see another level"
  | "Scouts are split"
  | "High ceiling, uneven floor";

export interface StartingArchetype {
  id: StartingArchetypeId;
  label: string;
  primaryAttributes: PublicAttributeKey[];
  weakAttributes: PublicAttributeKey[];
  startingAttributeBonuses: Partial<PublicAttributes>;
  growthBias: Partial<Record<PublicAttributeKey, number>>;
  keyMomentBias: {
    preferred: string[];
    avoided: string[];
  };
  challengeModifier: {
    easier: string[];
    harder: string[];
  };
  expectations: {
    coach: string;
    fan: string;
  };
}

export interface PublicBuild {
  publicAttributes: PublicAttributes;
  startingArchetypeId?: StartingArchetypeId;
  position: Position;
  height: ExactHeight;
  weightLbs: number;
  bodyFrame: BodyFrame;
}

export const PUBLIC_ATTRIBUTE_KEYS: readonly PublicAttributeKey[] = [
  "shooting",
  "finishing",
  "playmaking",
  "defending",
  "rebounding",
  "athleticism",
  "stamina",
];

export const BASE_PUBLIC_ATTRIBUTES: PublicAttributes = {
  shooting: 50,
  finishing: 50,
  playmaking: 50,
  defending: 50,
  rebounding: 50,
  athleticism: 50,
  stamina: 50,
};

export const PUBLIC_ATTRIBUTE_BUDGET = 28;
export const PUBLIC_ATTRIBUTE_MIN = 40;
export const PUBLIC_ATTRIBUTE_MAX = 75;

export const STARTING_ARCHETYPES: readonly StartingArchetype[] = [
  {
    id: "sharpshooter",
    label: "Sharpshooter",
    primaryAttributes: ["shooting"],
    weakAttributes: ["rebounding", "defending"],
    startingAttributeBonuses: { shooting: 8, stamina: 2 },
    growthBias: { shooting: 1.2, stamina: 0.8 },
    keyMomentBias: { preferred: ["catch-and-shoot", "late-clock-three"], avoided: ["traffic-finish"] },
    challengeModifier: { easier: ["open-jumper", "relocation-shot"], harder: ["contact-finish", "box-out"] },
    expectations: { coach: "Space the floor and punish open looks.", fan: "Fans expect quick points when the ball swings your way." },
  },
  {
    id: "slasher",
    label: "Slasher",
    primaryAttributes: ["finishing", "athleticism"],
    weakAttributes: ["shooting"],
    startingAttributeBonuses: { finishing: 6, athleticism: 4 },
    growthBias: { finishing: 1.1, athleticism: 1.1 },
    keyMomentBias: { preferred: ["rim-attack", "transition-drive"], avoided: ["deep-catch-and-shoot"] },
    challengeModifier: { easier: ["beat-first-step", "finish-through-contact"], harder: ["pull-up-three"] },
    expectations: { coach: "Pressure the rim without forcing traffic.", fan: "Fans want downhill plays and loud finishes." },
  },
  {
    id: "playmaker",
    label: "Playmaker",
    primaryAttributes: ["playmaking"],
    weakAttributes: ["rebounding"],
    startingAttributeBonuses: { playmaking: 8, stamina: 2 },
    growthBias: { playmaking: 1.25 },
    keyMomentBias: { preferred: ["make-the-read", "break-pressure"], avoided: ["weak-side-rebound"] },
    challengeModifier: { easier: ["thread-pass", "protect-dribble"], harder: ["finish-over-size"] },
    expectations: { coach: "Organize possessions and keep teammates involved.", fan: "Fans notice the pass before the pass." },
  },
  {
    id: "lockdown",
    label: "Lockdown",
    primaryAttributes: ["defending", "athleticism"],
    weakAttributes: ["shooting", "playmaking"],
    startingAttributeBonuses: { defending: 7, athleticism: 3 },
    growthBias: { defending: 1.25 },
    keyMomentBias: { preferred: ["on-ball-stop", "jump-lane"], avoided: ["self-created-jumper"] },
    challengeModifier: { easier: ["contest-shot", "force-turnover"], harder: ["create-off-dribble"] },
    expectations: { coach: "Take the hardest matchup and stay disciplined.", fan: "Fans expect stops that flip momentum." },
  },
  {
    id: "glass_cleaner",
    label: "Glass Cleaner",
    primaryAttributes: ["rebounding", "defending"],
    weakAttributes: ["playmaking", "shooting"],
    startingAttributeBonuses: { rebounding: 8, defending: 2 },
    growthBias: { rebounding: 1.25, defending: 0.8 },
    keyMomentBias: { preferred: ["secure-board", "putback"], avoided: ["perimeter-isolation"] },
    challengeModifier: { easier: ["box-out", "second-chance"], harder: ["lead-break"] },
    expectations: { coach: "End possessions and create extra chances.", fan: "Fans value the dirty-work possessions." },
  },
  {
    id: "stretch_big",
    label: "Stretch Big",
    primaryAttributes: ["shooting", "rebounding"],
    weakAttributes: ["playmaking", "athleticism"],
    startingAttributeBonuses: { shooting: 5, rebounding: 4, stamina: 1 },
    growthBias: { shooting: 1.1, rebounding: 1 },
    keyMomentBias: { preferred: ["pick-and-pop", "trail-three"], avoided: ["guard-isolation"] },
    challengeModifier: { easier: ["pop-jumper", "defensive-board"], harder: ["switch-on-guard"] },
    expectations: { coach: "Stretch the defense while holding your size role.", fan: "Fans expect rare big-man spacing." },
  },
  {
    id: "all_around",
    label: "All-Around",
    primaryAttributes: ["shooting", "finishing", "defending"],
    weakAttributes: [],
    startingAttributeBonuses: { shooting: 2, finishing: 2, playmaking: 2, defending: 2, rebounding: 1, athleticism: 1 },
    growthBias: { shooting: 1, finishing: 1, playmaking: 1, defending: 1, rebounding: 1, athleticism: 1, stamina: 1 },
    keyMomentBias: { preferred: ["swing-play", "read-and-react"], avoided: [] },
    challengeModifier: { easier: ["balanced-choice"], harder: ["specialist-check"] },
    expectations: { coach: "Fill gaps and make the simple winning play.", fan: "Fans see a player who can grow in several directions." },
  },
];

export const STARTING_ARCHETYPES_BY_ID: Record<StartingArchetypeId, StartingArchetype> =
  STARTING_ARCHETYPES.reduce(
    (byId, archetype) => ({ ...byId, [archetype.id]: archetype }),
    {} as Record<StartingArchetypeId, StartingArchetype>,
  );

const LEGACY_ARCHETYPE_BY_STARTING: Record<StartingArchetypeId, PlayerArchetype> = {
  sharpshooter: "Sharpshooter",
  slasher: "Slasher",
  playmaker: "Playmaker",
  lockdown: "Lockdown Defender",
  glass_cleaner: "Paint Beast",
  stretch_big: "Stretch Big",
  all_around: "Slasher",
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, Math.round(value)));
const rating = (value: number): PlayerAttributes["shortRange"] => clamp(value, 0, 99) as PlayerAttributes["shortRange"];

const heightTotalInches = (height: ExactHeight): number => height.feet * 12 + height.inches;

const normalizePublicAttributes = (attributes: PublicAttributes): PublicAttributes =>
  PUBLIC_ATTRIBUTE_KEYS.reduce(
    (next, key) => ({
      ...next,
      [key]: clamp(attributes[key] ?? BASE_PUBLIC_ATTRIBUTES[key], 0, 99),
    }),
    {} as PublicAttributes,
  );

export const applyStartingArchetypeBonuses = (
  attributes: PublicAttributes,
  startingArchetypeId: StartingArchetypeId,
): PublicAttributes => {
  const archetype = STARTING_ARCHETYPES_BY_ID[startingArchetypeId];
  const normalized = normalizePublicAttributes(attributes);
  return PUBLIC_ATTRIBUTE_KEYS.reduce(
    (next, key) => ({
      ...next,
      [key]: clamp(normalized[key] + (archetype.startingAttributeBonuses[key] ?? 0), 0, 99),
    }),
    {} as PublicAttributes,
  );
};

export const applyPublicAllocation = (
  attributes: PublicAttributes,
  changes: Partial<Record<PublicAttributeKey, number>>,
  availablePoints: number,
): { success: boolean; attributes: PublicAttributes; spentPoints: number; remainingPoints: number; rejectedReasons: string[] } => {
  const current = normalizePublicAttributes(attributes);
  const next = { ...current };
  let spentPoints = 0;

  for (const key of PUBLIC_ATTRIBUTE_KEYS) {
    const delta = Math.trunc(changes[key] ?? 0);
    if (delta === 0) {
      continue;
    }
    const target = clamp(current[key] + delta, PUBLIC_ATTRIBUTE_MIN, PUBLIC_ATTRIBUTE_MAX);
    if (target > current[key]) {
      spentPoints += target - current[key];
    }
    next[key] = target;
  }

  const remainingPoints = availablePoints - spentPoints;
  if (remainingPoints < 0) {
    return {
      success: false,
      attributes: current,
      spentPoints: 0,
      remainingPoints: availablePoints,
      rejectedReasons: [`Allocation overspends available points by ${Math.abs(remainingPoints)}.`],
    };
  }

  return { success: true, attributes: next, spentPoints, remainingPoints, rejectedReasons: [] };
};

export const inferPublicAttributesFromEngine = (attributes: PlayerAttributes): PublicAttributes => ({
  shooting: clamp((attributes.midrange * 0.45) + (attributes.threePoint * 0.55), 0, 99),
  finishing: clamp((attributes.shortRange * 0.55) + (attributes.dunking * 0.45), 0, 99),
  playmaking: clamp((attributes.handle * 0.4) + (attributes.passing * 0.35) + (attributes.vision * 0.25), 0, 99),
  defending: clamp(
    (attributes.perimeterDefense * 0.3) +
      (attributes.interiorDefense * 0.25) +
      (attributes.stealing * 0.2) +
      (attributes.blocking * 0.25),
    0,
    99,
  ),
  rebounding: clamp((attributes.offRebounding * 0.4) + (attributes.defRebounding * 0.6), 0, 99),
  athleticism: clamp((attributes.speed * 0.6) + (attributes.strength * 0.4), 0, 99),
  stamina: clamp(attributes.stamina, 0, 99),
});

export const legacyArchetypeForStartingArchetype = (id: StartingArchetypeId): PlayerArchetype =>
  LEGACY_ARCHETYPE_BY_STARTING[id];

export const getStartingArchetype = (id: StartingArchetypeId): StartingArchetype => STARTING_ARCHETYPES_BY_ID[id];

export const getPlaystyleLabel = (attributes: PublicAttributes, position: Position, startingArchetypeId?: StartingArchetypeId): string => {
  const sorted = PUBLIC_ATTRIBUTE_KEYS
    .map((key) => [key, attributes[key]] as const)
    .sort((left, right) => right[1] - left[1]);
  const top = sorted[0]?.[0] ?? "finishing";
  const archetype = startingArchetypeId ? STARTING_ARCHETYPES_BY_ID[startingArchetypeId]?.label : undefined;
  const labels: Record<PublicAttributeKey, string> = {
    shooting: position === "PF" || position === "C" ? "Floor-spacing big" : "Perimeter scorer",
    finishing: position === "PF" || position === "C" ? "Interior finisher" : "Downhill scorer",
    playmaking: position === "SF" ? "Point wing" : "Table-setter",
    defending: position === "PF" || position === "C" ? "Defensive anchor" : "Point-of-attack defender",
    rebounding: "Glass worker",
    athleticism: "Open-floor athlete",
    stamina: "High-motor connector",
  };
  return archetype && startingArchetypeId !== "all_around" ? `${archetype} ${labels[top].toLowerCase()}` : labels[top];
};

export const getFuzzyScoutingSummary = (
  potential: number,
  growthCurve: "EARLY_STARTER" | "STEADY" | "LATE_BLOOMER",
  attributes: PublicAttributes,
): FuzzyScoutingSummary => {
  const values = PUBLIC_ATTRIBUTE_KEYS.map((key) => attributes[key]);
  const spread = Math.max(...values) - Math.min(...values);
  if (growthCurve === "EARLY_STARTER" && potential < 82) {
    return "Polished early";
  }
  if (potential >= 88 && spread >= 14) {
    return "High ceiling, uneven floor";
  }
  if (potential >= 84) {
    return "Coaches see another level";
  }
  if (spread >= 18) {
    return "Scouts are split";
  }
  return "Raw tools";
};

export const getExpectedKeyMoments = (startingArchetypeId: StartingArchetypeId): string[] =>
  STARTING_ARCHETYPES_BY_ID[startingArchetypeId].keyMomentBias.preferred;

export const deriveEngineRatings = (publicBuild: PublicBuild): PlayerAttributes => {
  const attrs = publicBuild.startingArchetypeId
    ? applyStartingArchetypeBonuses(publicBuild.publicAttributes, publicBuild.startingArchetypeId)
    : normalizePublicAttributes(publicBuild.publicAttributes);
  const inches = heightTotalInches(publicBuild.height);
  const heightDelta = inches - 76;
  const weightDelta = (publicBuild.weightLbs - 190) / 20;
  const big = publicBuild.position === "PF" || publicBuild.position === "C";

  const frame = {
    Lean: { speed: 2, stamina: 2, strength: -2, rebounding: -1, finishing: 0, defending: 0 },
    Athletic: { speed: 1, stamina: 0, strength: 0, rebounding: 0, finishing: 2, defending: 2 },
    Stocky: { speed: -2, stamina: -1, strength: 3, rebounding: 2, finishing: 1, defending: 0 },
  }[publicBuild.bodyFrame];

  const speedBody = -heightDelta * 0.35 - weightDelta * 1.5 + frame.speed;
  const strengthBody = weightDelta * 2.5 + frame.strength;
  const reboundBody = heightDelta * 0.35 + weightDelta * 1.1 + frame.rebounding;
  const interiorBody = heightDelta * 0.25 + weightDelta * 0.6;
  const handleBody = -Math.max(0, heightDelta) * 0.25;
  const staminaBody = -Math.max(0, weightDelta) * 1.2 + frame.stamina;
  const finishBody = Math.max(0, heightDelta) * 0.12 + frame.finishing;
  const defendBody = frame.defending;

  return {
    shortRange: rating(attrs.finishing + finishBody + (big ? 2 : 0)),
    dunking: rating(attrs.finishing * 0.65 + attrs.athleticism * 0.35 + finishBody + Math.max(0, heightDelta) * 0.2),
    midrange: rating(attrs.shooting * 0.9 + attrs.playmaking * 0.1),
    threePoint: rating(attrs.shooting + (big ? -1 : 0)),
    handle: rating(attrs.playmaking * 0.7 + attrs.athleticism * 0.3 + handleBody - (big ? 3 : 0)),
    passing: rating(attrs.playmaking),
    vision: rating(attrs.playmaking * 0.9 + attrs.stamina * 0.1),
    perimeterDefense: rating(attrs.defending + attrs.athleticism * 0.08 + defendBody - (big ? 1 : 0)),
    interiorDefense: rating(attrs.defending * 0.75 + attrs.rebounding * 0.25 + interiorBody + (big ? 3 : 0)),
    stealing: rating(attrs.defending * 0.75 + attrs.athleticism * 0.25 + defendBody),
    blocking: rating(attrs.defending * 0.55 + attrs.rebounding * 0.2 + attrs.athleticism * 0.25 + interiorBody),
    offRebounding: rating(attrs.rebounding + reboundBody),
    defRebounding: rating(attrs.rebounding + reboundBody + 1),
    speed: rating(attrs.athleticism + speedBody),
    strength: rating(attrs.athleticism * 0.45 + attrs.rebounding * 0.25 + attrs.finishing * 0.3 + strengthBody),
    stamina: rating(attrs.stamina + staminaBody),
  };
};
