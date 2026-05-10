# Action Challenges

`ActionChallengeSpec` is the reusable layer that sits under basketball key moments.

## Lifecycle
- Build a challenge spec in the key moment builder.
- Adapt it into `KeyMomentPending` with `buildChallengePending(...)`.
- Render it through `ActionChallengeRenderer`.
- Submit `KeyMomentResolutionInput.executionQuality`.
- Resolve the possession through the existing key moment resolver.

## First-Phase Rules
- Use `challenge` as the source of truth for new minigames.
- Keep `minigame` populated only as a compatibility mirror while legacy tests and flows still depend on it.
- Attribute effects should widen forgiveness or soften misses, never auto-complete success.

## Adding a New Challenge
- Pick a generic kind: `timing`, `aim`, `reaction`, `choice`, or `sequence`.
- Pick a basketball context such as `pullup`, `pass_read`, or `rebound`.
- Define execution config, scoring thresholds, forgiveness values, and optional impact hooks.
- Add renderer support only if the kind is new. Reuse an existing renderer when only the context changes.
- Keep `resolveKeyMoment(...)` unchanged unless the new challenge truly needs new outcome mapping.
