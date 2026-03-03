# LeagueBoundRPGFresh
NEW Text Based RPG. I messed up the OG

## Active App vs Archived Folder

- Active app: `C:\Users\valexander\leaguebound-fresh`
- Archived reference only: `LeagueBoundRPG/`
- Start Expo from repo root so Expo Go scans the correct project:
  - `npx expo start --clear --tunnel`

## Home Court Advantage

- Match simulation home-court tuning lives in `src/matchEngineTuning.js` under `homeCourt`.
- Toggle and multipliers:
  - `homeCourt.enabled`
  - `homeCourt.shotMultiplier` (applies to shot make + putback make probability)
  - `homeCourt.turnoverMultiplier` (applies to turnover probability; home reduced, away inverse increased)
- Intended magnitude is subtle: target roughly a `2-5%` home win-rate bump for evenly matched teams.
- Validate home-court effect deterministically:
  - `npm run sim:avg10 -- --check-home-court`
