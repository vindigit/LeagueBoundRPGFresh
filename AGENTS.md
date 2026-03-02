# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Leaguebound is a single-player, offline basketball RPG built with **React Native (Expo SDK 54)** and **TypeScript**. There is no backend, database, or external API. The `LeagueBoundRPG/` directory is archived — all active development targets the repo root.

### Commands

| Task | Command |
|------|---------|
| Install deps | `npm install --force` (needed due to Windows-only `@expo/ngrok-bin-win32-x64` devDep) |
| Run tests | `npm test` |
| Run specific match test | `npm run test:match` |
| Start dev server (web) | `npx expo start --web --port 8081` |
| Type check | `npx tsc --noEmit` |

There is no dedicated lint script in `package.json`. Use `npx tsc --noEmit` for type checking. Pre-existing TS errors exist in the archived `LeagueBoundRPG/` folder and a few in `test/` files — these are not regressions.

### Expo Web on Linux

Running Expo web mode requires `react-dom`, `react-native-web`, and `@expo/metro-runtime` as dependencies plus the `unstable_transformImportMeta: true` babel-preset-expo option. These were added for Cloud Agent compatibility. Without them, `npx expo start --web` will fail with `import.meta` errors.

### App flow

The app starts on the **Backstory Generator** (character creation), then navigates to the **Career Hub** home screen showing player card, stats, and news feed. From there, "Play Match" starts the Markov-chain match simulation with interactive Key Moments, and "Next Event" triggers an Ink narrative scene.
