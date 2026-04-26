import type { RelationshipState, SchoolPath } from "../types/careerProgression";
import type { PlayerAttributes } from "../types/player";

type AttributeDelta = Partial<Record<keyof PlayerAttributes, number>>;

export interface SchoolPathProfile {
  key: SchoolPath;
  label: string;
  shortLabel: string;
  summary: string;
  exposureLabel: string;
  difficultyLabel: string;
  playingTimeLabel: string;
  localityLabel: string;
  immediateExposureBoost: number;
  weeklyExposureGain: number;
  bankRewardBonus: number;
  moraleRewardBonus: number;
  userRuntimeDelta: AttributeDelta;
  teammateRuntimeDelta: AttributeDelta;
  opponentRuntimeDelta: AttributeDelta;
  fanbaseAffinity: number;
  fanbaseTrust: number;
  fanbaseInfluence: number;
}

export const SCHOOL_PATH_PROFILES: Record<SchoolPath, SchoolPathProfile> = {
  LOCAL_3A: {
    key: "LOCAL_3A",
    label: "Local 3A",
    shortLabel: "3A",
    summary: "Stay close to home, carry the offense, and build buzz in front of hometown crowds.",
    exposureLabel: "Lower exposure, easier climb",
    difficultyLabel: "Lightest competition",
    playingTimeLabel: "Feature role expected",
    localityLabel: "Strong hometown support",
    immediateExposureBoost: 6,
    weeklyExposureGain: 2,
    bankRewardBonus: 90,
    moraleRewardBonus: 2,
    userRuntimeDelta: {
      shortRange: 4,
      midrange: 3,
      threePoint: 3,
      handle: 4,
      passing: 4,
      vision: 4,
      speed: 2,
      stamina: 3,
    },
    teammateRuntimeDelta: {
      passing: -2,
      vision: -2,
      perimeterDefense: -2,
    },
    opponentRuntimeDelta: {
      shortRange: -4,
      midrange: -4,
      threePoint: -4,
      handle: -3,
      passing: -3,
      vision: -3,
      perimeterDefense: -3,
      interiorDefense: -2,
      speed: -2,
      strength: -2,
    },
    fanbaseAffinity: 78,
    fanbaseTrust: 72,
    fanbaseInfluence: 66,
  },
  STATE_5A: {
    key: "STATE_5A",
    label: "State 5A",
    shortLabel: "5A",
    summary: "Step into the biggest public-school stage with balanced minutes, pressure, and visibility.",
    exposureLabel: "Balanced exposure",
    difficultyLabel: "Balanced competition",
    playingTimeLabel: "Rotation-to-starter fight",
    localityLabel: "Solid community backing",
    immediateExposureBoost: 12,
    weeklyExposureGain: 4,
    bankRewardBonus: 40,
    moraleRewardBonus: 1,
    userRuntimeDelta: {
      handle: 1,
      passing: 1,
      vision: 1,
      stamina: 1,
    },
    teammateRuntimeDelta: {},
    opponentRuntimeDelta: {},
    fanbaseAffinity: 64,
    fanbaseTrust: 60,
    fanbaseInfluence: 58,
  },
  PREP: {
    key: "PREP",
    label: "Prep",
    shortLabel: "Prep",
    summary: "Chase the brightest spotlight against top talent, but earn every minute the hard way.",
    exposureLabel: "Highest exposure",
    difficultyLabel: "Toughest competition",
    playingTimeLabel: "Minutes must be earned",
    localityLabel: "Limited hometown cushion",
    immediateExposureBoost: 20,
    weeklyExposureGain: 7,
    bankRewardBonus: -20,
    moraleRewardBonus: 0,
    userRuntimeDelta: {
      shortRange: -2,
      midrange: -2,
      threePoint: -2,
      handle: -3,
      passing: -3,
      vision: -3,
      speed: -1,
      stamina: -2,
    },
    teammateRuntimeDelta: {
      threePoint: 2,
      passing: 2,
      vision: 2,
      perimeterDefense: 2,
      speed: 2,
    },
    opponentRuntimeDelta: {
      shortRange: 4,
      midrange: 4,
      threePoint: 5,
      handle: 4,
      passing: 4,
      vision: 4,
      perimeterDefense: 4,
      interiorDefense: 3,
      speed: 3,
      strength: 2,
    },
    fanbaseAffinity: 48,
    fanbaseTrust: 42,
    fanbaseInfluence: 44,
  },
};

export const getSchoolPathProfile = (path: SchoolPath): SchoolPathProfile => SCHOOL_PATH_PROFILES[path];

export const formatSchoolPathLabel = (path: SchoolPath): string => getSchoolPathProfile(path).label;

export const createSchoolPathFanbaseRelationship = (
  path: SchoolPath,
  hometownLabel: string,
): RelationshipState => {
  const profile = getSchoolPathProfile(path);

  return {
    id: "fanbase-hometown",
    type: "FANBASE",
    label: `${hometownLabel} Support`,
    affinity: profile.fanbaseAffinity,
    trust: profile.fanbaseTrust,
    influence: profile.fanbaseInfluence,
    tags: [path, "HOME_TOWN"],
  };
};
