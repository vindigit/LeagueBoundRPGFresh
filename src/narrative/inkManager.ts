import { Story } from "inkjs";
import practiceCoachStoryJson from "./assets/practice_coach.json";
import { useCareerStore } from "../store/useCareerStore";
import type { PlayerAttributes } from "../types/player";

const ATTRIBUTE_KEYS: ReadonlyArray<keyof PlayerAttributes> = [
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
];

const ACTION_PREFIX = "ACTION:";
type InkStoryJson = Record<string, unknown>;
export type NarrativeFileName = "practice_coach.ink";
const PRACTICE_COACH_FILE: NarrativeFileName = "practice_coach.ink";

const NARRATIVE_JSON: Record<NarrativeFileName, InkStoryJson> = {
  [PRACTICE_COACH_FILE]: practiceCoachStoryJson as InkStoryJson,
};

export interface InkChoice {
  index: number;
  text: string;
}

export interface InkStoryState {
  lines: string[];
  tags: string[];
  choices: InkChoice[];
  canContinue: boolean;
}

interface UpdateAttributeAction {
  type: "updateAttribute";
  attributeKey: keyof PlayerAttributes;
  amount: number;
}

type ParsedAction = UpdateAttributeAction;

interface InkStoryLike {
  canContinue: boolean;
  currentTags: string[];
  currentChoices: Array<{ text: string }>;
  Continue(): string;
  ChooseChoiceIndex(index: number): void;
}

const isAttributeKey = (value: string): value is keyof PlayerAttributes =>
  ATTRIBUTE_KEYS.includes(value as keyof PlayerAttributes);

const parseActionTag = (tag: string): ParsedAction | null => {
  const trimmedTag = tag.trim();
  if (!trimmedTag.startsWith(ACTION_PREFIX)) {
    return null;
  }

  const actionBody = trimmedTag.slice(ACTION_PREFIX.length).trim().replace(/\\\|/g, "|");
  const parts = actionBody.split("|").map((part) => part.trim());
  if (parts.length !== 3) {
    throw new Error(`Invalid ACTION tag format: "${tag}"`);
  }

  const [actionType, key, rawValue] = parts;
  if (actionType !== "updateAttribute") {
    throw new Error(`Unsupported ACTION type "${actionType}" in tag "${tag}"`);
  }

  if (!isAttributeKey(key)) {
    throw new Error(`Unknown attribute key "${key}" in tag "${tag}"`);
  }

  const amount = Number(rawValue);
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid ACTION value "${rawValue}" in tag "${tag}"`);
  }

  return {
    type: "updateAttribute",
    attributeKey: key,
    amount,
  };
};

const applyAction = (action: ParsedAction): void => {
  if (action.type === "updateAttribute") {
    useCareerStore.getState().applyAttributeGain(action.attributeKey, action.amount, "NARRATIVE");
  }
};

const processTags = (tags: string[]): void => {
  for (const tag of tags) {
    const action = parseActionTag(tag);
    if (action) {
      applyAction(action);
    }
  }
};

const toChoices = (story: InkStoryLike): InkChoice[] =>
  story.currentChoices.map((choice, index) => ({
    index,
    text: choice.text,
  }));

export class InkManager {
  private readonly story: InkStoryLike;

  public constructor(story: InkStoryLike) {
    this.story = story;
  }

  public continueStory(): InkStoryState {
    const lines: string[] = [];
    const tags: string[] = [];

    while (this.story.canContinue) {
      const line = this.story.Continue().trim();
      if (line.length > 0) {
        lines.push(line);
      }

      const currentTags = [...this.story.currentTags];
      if (currentTags.length > 0) {
        tags.push(...currentTags);
        processTags(currentTags);
      }
    }

    return {
      lines,
      tags,
      choices: toChoices(this.story),
      canContinue: this.story.canContinue,
    };
  }

  public chooseOption(index: number): InkStoryState {
    if (!Number.isInteger(index) || index < 0 || index >= this.story.currentChoices.length) {
      throw new Error(`Choice index ${index} is out of range.`);
    }

    this.story.ChooseChoiceIndex(index);
    return this.continueStory();
  }
}

const createStoryFromJson = (storyJson: InkStoryJson): InkStoryLike =>
  new Story(JSON.stringify(storyJson)) as unknown as InkStoryLike;

export const loadPracticeCoachInkManager = (): InkManager =>
  new InkManager(createStoryFromJson(NARRATIVE_JSON[PRACTICE_COACH_FILE]));

export const loadNarrativeInkManager = (fileName: string): InkManager => {
  const sanitizedName = fileName.trim();
  if (sanitizedName.length === 0) {
    throw new Error("Narrative file name must not be empty.");
  }

  if (!(sanitizedName in NARRATIVE_JSON)) {
    throw new Error(`Unknown narrative file "${sanitizedName}".`);
  }

  const storyJson = NARRATIVE_JSON[sanitizedName as NarrativeFileName];
  return new InkManager(createStoryFromJson(storyJson));
};
