# Project Status

Methodology:
- This file reflects the active root app in `leaguebound-fresh/`, not sprint intent or roadmap language.
- Status calls are based on wired modules in `src/`, active screens/stores, and existing tests.
- `LeagueBoundRPG/` is archived reference material and does not count toward current implementation status.
- Presence of a type or constant alone does not qualify as implemented; the feature must be wired into the active app flow or explicitly surfaced as scaffold/placeholder.

Current verification note:
- `npm test -- --runInBand` is mostly green, with 40 passing suites and 1 failing suite as of April 25, 2026.
- The current failing suite is `test/matchEngineAdapterDeterminism.test.ts`, so match systems are implemented but not fully stable by test standard.

## Implemented

- Backstory builder and prospect generation
  - The app boots into a playable five-step backstory flow, generates a build-driven prospect, and starts a career from that output. Evidence: `src/features/backstory/screens/BackstoryScreen.tsx`, `src/features/backstory/generator.ts`, `src/store/useCareerStore.ts`, `test/backstoryFlow.test.ts`, `test/backstoryScreenBuilderIntegration.test.ts`.

- Career store persistence and migration
  - Career state is persisted with Zustand + AsyncStorage, includes migration logic, and hydrates/migrates legacy player data into the current schema. Evidence: `src/store/useCareerStore.ts`, `src/types/career.ts`, `src/types/careerProgression.ts`, `test/verifyPersistence.test.ts`, `test/playerStateCompatibility.test.ts`, `test/growthResidueMigration.test.ts`.

- Playable match loop with scoreboard, play log, and postgame handoff
  - The active UI can enter a match, simulate the game loop, update match state, and hand the result into a postgame report and career updates. Evidence: `src/features/match/screens/MatchScreen.tsx`, `src/features/match/hooks/useMatchLoop.ts`, `src/features/match/store/useMatchStore.ts`, `src/features/match/screens/PostgameScreen.tsx`, `src/screens/HomeScreen.tsx`, `src/features/match/tests/SimulateMatch.test.ts`, `src/features/match/tests/MatchScreenKeyMoment.test.tsx`.

- Postgame recap and hometown feed wiring
  - Match completion produces bank/morale updates, box score display, and a local news headline that appears back in the hub. Evidence: `src/features/match/screens/PostgameScreen.tsx`, `src/features/backstory/news.ts`, `src/store/useCareerStore.ts`, `src/screens/HomeScreen.tsx`.

- Basic Ink narrative bridge
  - The app can launch an Ink scene, render lines and choices, process action tags, and apply narrative-driven attribute changes back into the career store. Evidence: `src/components/NarrativeOverlay.tsx`, `src/narrative/inkManager.ts`, `src/narrative/assets/practice_coach.json`, `src/screens/HomeScreen.tsx`, `src/scripts/verifyNarrativeViewBridge.ts`.

- Player builder math and rating derivation
  - Build allocation, archetype/badge classification, caps, and derived rating logic exist as active support systems behind the backstory flow and card display. Evidence: `src/builder/allocate.ts`, `src/builder/classify.ts`, `src/builder/progression.ts`, `src/builder/derivedRatings.ts`, `src/builder/badges/catalog.ts`, `src/builder/badges/resolve.ts`, `test/builderAllocate.test.ts`, `test/builderClassify.test.ts`, `test/derivedRatings.test.ts`.

## Partial

- Career progression model beyond the local match loop
  - The repo now defines richer career concepts such as offers, eligibility, finance, exile, relationships, and season windows, but the active UI still centers on backstory -> hub -> one-off match -> postgame rather than a full advancing career sim. Evidence: `src/types/careerProgression.ts`, `src/store/useCareerStore.ts`, `src/types/career.ts`, `test/careerProgressionModel.test.ts`.

- News feed and lived-in world presentation
  - The home screen shows a small hometown feed and postgame/creation items, but it is not yet the broader social/news ecosystem described in the PRD. Evidence: `src/screens/HomeScreen.tsx`, `src/features/backstory/news.ts`, `src/store/useCareerStore.ts`, `PRD.md`.

- Match engine and key-moment system depth
  - The repo has a real match engine, scheduler, resolution path, overlay, and extensive tests, but one determinism suite is failing and the UX is still narrow relative to the larger simulation ambition. Evidence: `src/matchEngine.ts`, `src/matchEngineAdapter.ts`, `src/match/keyMoments/scheduler.ts`, `src/match/keyMoments/resolveKeyMoment.ts`, `src/features/match/components/KeyMomentOverlay.tsx`, `test/matchEngineAdapterDeterminism.test.ts`, `src/features/match/tests/KeyMomentResolution.test.ts`.

- Narrative content breadth
  - The bridge is real, but the active narrative library appears limited to the practice coach scene rather than a broader event catalog across career phases. Evidence: `src/narrative/inkManager.ts`, `src/narrative/practice_coach.ink`, `src/narrative/assets/practice_coach.json`, `src/components/NarrativeOverlay.tsx`.

## Placeholder

- Key-moment minigame UI
  - The overlay explicitly labels the minigame path as a placeholder shell and the tests assert placeholder behavior rather than a finished playable minigame. Evidence: `src/features/match/components/KeyMomentOverlay.tsx`, `src/features/match/tests/KeyMomentOverlay.test.tsx`.

## Not started

- Local database layer promised in the PRD
  - The PRD calls for relational/local database architecture such as WatermelonDB and MMKV, but the active app currently relies on Zustand + AsyncStorage and does not contain an implemented database subsystem. Evidence: `PRD.md`, `src/store/useCareerStore.ts`, `package.json`.

- Outer-ring league simulation and background world ecosystem
  - The PRD describes focus-ring versus outer-ring world simulation, but the active repo does not expose a broader league scheduler, non-player league simulation loop, or world-state surface in the app. Evidence: `PRD.md`, `src/screens/HomeScreen.tsx`, `src/store/useCareerStore.ts`.

- Transfer portal and NIL offer loop as active gameplay
  - The type layer contains offer and NIL-related shapes, but there is no active screen, workflow, or generation loop for portal decisions or NIL offers in the current app. Evidence: `src/types/careerProgression.ts`, `src/store/useCareerStore.ts`, `PRD.md`.

- Save export / backup flow
  - The PRD mentions JSON export and backup behavior, but the active repo does not include an export UI, export command, or save-file serialization feature beyond local persistence. Evidence: `PRD.md`, `src/store/useCareerStore.ts`, `README.md`.
