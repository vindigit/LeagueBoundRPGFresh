declare const tuning: {
  minEventSeconds: number;
  maxEventSeconds: number;
  turnoverEventSecondsMin: number;
  turnoverEventSecondsMax: number;
  offensiveReboundEventSecondsMin: number;
  offensiveReboundEventSecondsMax: number;
  archetypeWeightAdjustments: Record<
    "Slasher" | "Sharpshooter" | "Playmaker" | "Lockdown Defender" | "Paint Beast" | "Stretch Big",
    { pass: number; shoot: number; dribble: number }
  >;
  baseActionWeights: { pass: number; shoot: number; dribble: number };
  highPressureAdjustments: { pass: number; shoot: number; dribble: number };
  lowPressureAdjustments: { pass: number; shoot: number; dribble: number };
  homeCourt: {
    enabled: boolean;
    shotMultiplier: number;
    turnoverMultiplier: number;
  };
  momentum: {
    enabled: boolean;
    maxStreak: number;
    perMakeBoost: number;
    perMakePenalty: number;
  };
  turnoverBase: number;
  turnoverDivisor: number;
  turnoverMin: number;
  turnoverMax: number;
  stealBase: number;
  stealDivisor: number;
  stealMin: number;
  stealMax: number;
  assistBase: number;
  assistDivisor: number;
  assistMin: number;
  assistMax: number;
  shotZoneByAction: Record<"pass" | "shoot" | "dribble", { three: number; midrange: number; rim: number }>;
  lowShootingThreeSuppressionThreshold: number;
  shotZoneSkillWeight: number;
  shotZoneBbiqWeight: number;
  shotZoneFatigueWeight: number;
  shotContestDivisor: number;
  shotOffenseDivisor: number;
  blockBase: number;
  blockDivisor: number;
  blockMin: number;
  blockMax: number;
  offensiveReboundBase: number;
  offensiveReboundDivisor: number;
  offensiveReboundMin: number;
  offensiveReboundMax: number;
  longReboundThreeBonus: number;
  putbackBase: number;
  putbackDivisor: number;
  putbackMin: number;
  putbackMax: number;
  fatiguePossessionScale: number;
  fatigueStaminaOffset: number;
  fatigueMinMultiplier: number;
  fatigueMaxMultiplier: number;
  decisionVarianceBase: number;
  decisionVarianceBbiqScale: number;
  energyModifierScale: number;
  bbiqModifierScale: number;
  shotMakeBase: number;
  shotMakeMin: number;
  shotMakeMax: number;
  threeShotMakeBase: number;
  midrangeShotMakeBase: number;
  rimShotMakeBase: number;
  threePointOffset: number;
  threePointDivisor: number;
  threePointMin: number;
  threePointMax: number;
};

export default tuning;
