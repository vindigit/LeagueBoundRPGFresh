import { buildCreateShotPending, resolveCreateShot } from "./createShot";
import { buildJumpLanePending, resolveJumpLane } from "./jumpLane";
import { buildMakeTheReadPending, resolveMakeTheRead } from "./makeTheRead";
import { buildOnBallStopPending, resolveOnBallStop } from "./onBallStop";
import type { KeyMomentType } from "./types";
import type { KeyMomentDefinition } from "./shared";

export const KEY_MOMENT_BASELINE_QUALITY = 0.55;

export const KEY_MOMENT_DEFINITIONS: readonly KeyMomentDefinition[] = [
  {
    type: "create_shot",
    buildPending: buildCreateShotPending,
    resolve: resolveCreateShot,
  },
  {
    type: "make_the_read",
    buildPending: buildMakeTheReadPending,
    resolve: resolveMakeTheRead,
  },
  {
    type: "on_ball_stop",
    buildPending: buildOnBallStopPending,
    resolve: resolveOnBallStop,
  },
  {
    type: "jump_lane",
    buildPending: buildJumpLanePending,
    resolve: resolveJumpLane,
  },
] as const;

export const KEY_MOMENT_TYPE_ORDER: readonly KeyMomentType[] = KEY_MOMENT_DEFINITIONS.map((definition) => definition.type);

export const getKeyMomentDefinition = (type: KeyMomentType): KeyMomentDefinition | undefined =>
  KEY_MOMENT_DEFINITIONS.find((definition) => definition.type === type);
