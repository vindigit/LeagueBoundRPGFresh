import type { BuilderBadgeId } from "./catalog";

export type BuilderBadgeEffectModifier =
  | "deepRangeThreeMake"
  | "deepRangeThreeZoneWeight"
  | "rimPressureRimMake"
  | "rimPressurePutbackMake"
  | "floorGeneralBallSecurity"
  | "floorGeneralAssistProbability"
  | "pointOfAttackDefenderPressure"
  | "pointOfAttackStealProbability"
  | "pointOfAttackPerimeterContest"
  | "anchorOpponentRimMake"
  | "anchorRimBlockProbability"
  | "glassCleanerReboundWeight"
  | "glassCleanerPutbackMake"
  | "powerDriverRimBallSecurity"
  | "powerDriverRimMake"
  | "slitheryRimBallSecurity"
  | "slitheryLayupMake"
  | "posterizerDunkAttempt"
  | "posterizerDunkMake"
  | "posterizerDunkBlockResistance"
  | "midRangeMagicianMidrangeZoneWeight"
  | "midRangeMagicianMidrangeMake"
  | "catchAndShootAssistedJumperMake"
  | "needleThreaderPassBallSecurity"
  | "needleThreaderAssistProbability"
  | "quickFirstStepRimZoneWeight"
  | "quickFirstStepRimBallSecurity"
  | "pickpocketDefenderPressure"
  | "pickpocketStealProbability"
  | "helpDefenderRimContest"
  | "helpDefenderWeakSideBlock"
  | "chaseDownRimBlockProbability"
  | "chaseDownPutbackBlockProbability"
  | "boxOutBeastDefReboundWeight"
  | "boxOutBeastOffReboundSuppression"
  | "putbackBossOffReboundWeight"
  | "putbackBossPutbackMake";

export interface BuilderBadgeEffectProfile {
  modifiers: Partial<Record<BuilderBadgeEffectModifier, number>>;
}

export const BUILDER_BADGE_EFFECTS: Record<BuilderBadgeId, BuilderBadgeEffectProfile> = {
  rim_pressure: {
    modifiers: {
      rimPressureRimMake: 0.012,
      rimPressurePutbackMake: 0.01,
    },
  },
  slithery: {
    modifiers: {
      slitheryRimBallSecurity: 3,
      slitheryLayupMake: 0.01,
    },
  },
  posterizer: {
    modifiers: {
      posterizerDunkAttempt: 0.015,
      posterizerDunkMake: 0.015,
      posterizerDunkBlockResistance: 4,
    },
  },
  deep_range: {
    modifiers: {
      deepRangeThreeMake: 0.015,
      deepRangeThreeZoneWeight: 4,
    },
  },
  mid_range_magician: {
    modifiers: {
      midRangeMagicianMidrangeZoneWeight: 5,
      midRangeMagicianMidrangeMake: 0.015,
    },
  },
  catch_and_shoot: {
    modifiers: {
      catchAndShootAssistedJumperMake: 0.015,
    },
  },
  floor_general: {
    modifiers: {
      floorGeneralBallSecurity: 4,
      floorGeneralAssistProbability: 0.01,
    },
  },
  needle_threader: {
    modifiers: {
      needleThreaderPassBallSecurity: 4,
      needleThreaderAssistProbability: 0.01,
    },
  },
  quick_first_step: {
    modifiers: {
      quickFirstStepRimZoneWeight: 4,
      quickFirstStepRimBallSecurity: 3,
    },
  },
  point_of_attack: {
    modifiers: {
      pointOfAttackDefenderPressure: 4,
      pointOfAttackStealProbability: 0.01,
      pointOfAttackPerimeterContest: 2,
    },
  },
  pickpocket: {
    modifiers: {
      pickpocketDefenderPressure: 4,
      pickpocketStealProbability: 0.01,
    },
  },
  help_defender: {
    modifiers: {
      helpDefenderRimContest: 3,
      helpDefenderWeakSideBlock: 0.008,
    },
  },
  anchor: {
    modifiers: {
      anchorOpponentRimMake: -0.012,
      anchorRimBlockProbability: 0.008,
    },
  },
  chase_down: {
    modifiers: {
      chaseDownRimBlockProbability: 0.008,
      chaseDownPutbackBlockProbability: 0.008,
    },
  },
  glass_cleaner: {
    modifiers: {
      glassCleanerReboundWeight: 5,
      glassCleanerPutbackMake: 0.008,
    },
  },
  box_out_beast: {
    modifiers: {
      boxOutBeastDefReboundWeight: 5,
      boxOutBeastOffReboundSuppression: 0.01,
    },
  },
  putback_boss: {
    modifiers: {
      putbackBossOffReboundWeight: 5,
      putbackBossPutbackMake: 0.01,
    },
  },
  power_driver: {
    modifiers: {
      powerDriverRimBallSecurity: 3,
      powerDriverRimMake: 0.01,
    },
  },
};
