declare const tuning: {
  minEventSeconds: number;
  maxEventSeconds: number;
  archetypeWeightAdjustments: Record<
    "Slasher" | "Sharpshooter" | "Playmaker" | "Lockdown Defender" | "Paint Beast" | "Stretch Big",
    { pass: number; shoot: number; dribble: number }
  >;
  baseActionWeights: { pass: number; shoot: number; dribble: number };
  highPressureAdjustments: { pass: number; shoot: number; dribble: number };
  lowPressureAdjustments: { pass: number; shoot: number; dribble: number };
  energyModifierScale: number;
  bbiqModifierScale: number;
  varianceBaseSpread: number;
  varianceBbiqSpread: number;
  shotMakeBase: number;
  shotMakeDivisor: number;
  shotMakeMin: number;
  shotMakeMax: number;
  failureBase: number;
  failureDivisor: number;
  failureMin: number;
  failureMax: number;
  threePointOffset: number;
  threePointDivisor: number;
  threePointMin: number;
  threePointMax: number;
};

export default tuning;
