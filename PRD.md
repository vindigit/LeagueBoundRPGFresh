\# Product Requirements Document (PRD): Leaguebound - Road to the League

Archive note (repo hygiene): `LeagueBoundRPG/` is an archived reference folder; active development/runtime target is repo root `leaguebound-fresh`.

\| \*\*Version\*\* \| \*\*Date\*\* \| \*\*Author\*\* \| \*\*Status\*\*
\| \| :\-\-- \| :\-\-- \| :\-\-- \| :\-\-- \| \| 1.0 \| Feb 14, 2026 \|
Product Team \| \*\*Draft\*\* \|

\-\--

\## 1. Executive Summary & Project Goals

\*\*Leaguebound\*\* is a single-player, text-based RPG simulation built
on React Native. It simulates the career of a basketball player from a
Middle School prospect to an NBA legend.

\*\*The Hook: The \"Lived-in World\"\*\* Unlike traditional sports games
where the world feels static until the player arrives, Leaguebound
features a dynamic background simulation. While the player is in 8th
grade, the NBA Draft is occurring, colleges are recruiting, and the
economy is shifting. The player is not the center of the universe; they
are a participant trying to carve out space in a living ecosystem.

\*\*Project Goals:\*\* 1. \*\*Immersion via Data:\*\* Create a
local-first database where hometowns, high schools, and colleges feel
authentic. 2. \*\*Hybrid Gameplay:\*\* Successfully merge \"Spreadsheet
Sim\" (Basketball GM) with \"Narrative RPG\" (BitLife/New Star Soccer).
3. \*\*Performance:\*\* Achieve 60fps UI performance on mid-range mobile
devices using React Native, with background simulations occurring
without blocking the UI thread.

\-\--

\## 2. User Personas & Stories

\### \*\*Persona A: The Narrative Grinder (BitLife Fan)\*\* \*
\*\*Motivation:\*\* Wants drama, scandals, and lifestyle choices. Cares
about the \"Story\" of their player. \* \*\*User Story:\*\* \"As a
player, I want to accept a shady NIL deal so I can buy a sports car,
even if it risks my eligibility.\"

\### \*\*Persona B: The Min-Max Tactician (Basketball GM Fan)\*\* \*
\*\*Motivation:\*\* Wants deep statistical analysis, build optimization,
and realistic simulation outcomes. \* \*\*User Story:\*\* \"As a Point
Guard, I want to analyze the opposing defense\'s weakness so I can
choose the correct \'Slash\' or \'Kick-out\' option during Key
Moments.\"

\### \*\*Persona C: The Quick-Session Commuter (New Star Soccer Fan)\*\*
\* \*\*Motivation:\*\* Wants fast progression and bite-sized gameplay
loops. \* \*\*User Story:\*\* \"As a busy user, I want to play through a
full week of training and a game in under 5 minutes while on the bus.\"

\-\--

\## 3. Functional Requirements

\### 3.1 Match Engine (The Simulation) The match engine uses a
\*\*Markov Chain\*\* logic flow rather than physics-based gameplay. It
runs in the background for non-player games and presents \"Key Moments\"
for player games.

\*\*Logic Flow:\*\* 1. \*\*Possession Initialization:\*\* Calculated
based on Team Ratings (Offensive vs. Defensive Rating). 2. \*\*State
Transition:\*\* Ball Handler holds ball -\> Logic Check (Pass vs. Shoot
vs. Dribble) based on Archetype and Game State (Score/Time). 3.
\*\*Resolution (RNG + Modifiers):\*\* \* \`Outcome = (Base Stat + Energy
Modifier + BBIQ Modifier) vs (Opponent Defense + Variance)\` 4. \*\*Key
Moment Trigger:\*\* If the Player is involved in the resolution \*and\*
the game state is critical (or RNG trigger), pause simulation and
present UI Choice.

\*\*Key Moment Choices (UI):\*\* \* \*\*Context:\*\* \"Double team
coming. 4 seconds on shot clock.\" \* \*\*Options:\*\* \* \[A\] Force
Shot (Uses \*Finishing\*, High Risk) \* \[B\] Pass to Corner (Uses
\*Vision\*, Medium Reward) \* \[C\] Reset/Dribble (Uses \*Handle\*, Low
Risk)

\### 3.2 RPG System & Progression \*\*Character Archetypes (Base
Caps):\*\* \* \*\*Slasher:\*\* High Speed/Vert Cap, Low 3PT Cap. \*
\*\*Sharpshooter:\*\* High 3PT/Mid Cap, Low Defense Cap. \*
\*\*Playmaker:\*\* High Vision/Handle Cap. \* \*(See GDD for full
list)\*

\*\*The \"Information Gap\" Mechanic:\*\* \* Players do not see \"True
Ratings\" (1-100). They see \"Perceived Ratings\" based on their
\*\*Scouting/Self-Awareness\*\* level. \* \*Requirement:\* Display
ratings as \"Fuzzy Ranges\" (e.g., B+ to A-) or \"Star Ratings\" until
specific coaching/scouting milestones reveal exact numbers.

\*\*Skill Growth Algorithm:\*\* \* \`Growth = (Potential \* Training
Intensity) + (Match XP) - (Injury Malus)\` \* \*\*Diminishing
Returns:\*\* Growth slows as Age increases and Rating approaches Cap.

\### 3.3 Narrative Engine (Ink Integration) We utilize \`inkjs\` to
bridge narrative scripts with the React Native game state.

\*\*Interface Requirements:\*\* \* \*\*Read State:\*\* Ink scripts must
be able to read \`Player.BankBalance\`, \`Player.Morale\`,
\`Player.Position\`. \* \*\*Write State:\*\* Ink choices must trigger
functions: \`updateBank(-500)\`, \`modifyRelationship(\'Coach\', -10)\`.
\* \*\*Interrupts:\*\* The engine must support \"Interrupt Events\"
(e.g., Academic Probation trigger) that block the \"Next Week\" button
until resolved.

\### 3.4 World Systems \*\*Localized Database:\*\* \* \*\*Structure:\*\*
Hierarchical JSON/SQLite data. \* \`State\` -\> \`Region\` -\> \`City\`
-\> \`HighSchools\` -\> \`Rivals\`. \* \*\*Procedural Generation:\*\* If
a specific city lacks data, procedurally generate schools based on city
population density and regional basketball popularity (e.g., Indiana
generates higher stats than Vermont).

\*\*NIL & Transfer Portal:\*\* \* \*\*Logic:\*\* Offers are generated
based on \`Hype\` (Fan Count) and \`Performance\`. \* \*\*Portal
Window:\*\* A specific state in the offseason calendar. \* \*Input:\*
Player requests transfer. \* \*Simulation:\* Algorithm weighs
\`Player.StarRating\` vs. \`Team.Prestige\` vs. \`Team.Needs\`. \*
\*Output:\* List of offers with Scholarship % and NIL estimates.

\-\--

\## 4. Technical Requirements

\### 4.1 Tech Stack \* \*\*Frontend:\*\* React Native (0.74+). \*
\*\*Language:\*\* TypeScript (Strict mode). \* \*\*Narrative:\*\*
\`inkjs\` (running in a headless JS thread). \* \*\*State
Management:\*\* MobX (preferred for Simulation driven reactivity) or
Redux Toolkit. \* \*\*Local Database:\*\* \* \*\*WatermelonDB (on
SQLite):\*\* For relational data (Leagues, Teams, History logs). \*
\*\*MMKV:\*\* For high-speed user preferences and instant-access session
state.

\### 4.2 Data Architecture \*\*The \"Lazy Loading\" World:\*\* To
maintain performance on mobile, we cannot simulate the entire world
every frame. \* \*\*Focus Ring:\*\* The Player\'s team and immediate
rivals simulate play-by-play. \* \*\*Outer Ring:\*\* The rest of the
league simulates via \"Box Score Generation\" (statistical
approximation), processed in batches during the \"Advance Week\" loading
state.

\### 4.3 Offline/Persistence \* \*\*Requirement:\*\* 100% offline
functionality. \* \*\*Save System:\*\* JSON export capability for \"Save
Scumming\" prevention or cloud backup. \* \*\*Auto-Save:\*\* Triggered
after every \"Week Advance\" and \"Key Moment\" resolution.

\-\--

\## 5. User Interface (UX/UI)

\### 5.1 Design Philosophy \*\*\"The App OS\"\*\* The UI should feel
like a social media/sports news app, not a video game controller. \*
\*\*Navigation:\*\* Bottom Tab Bar (Home, Team, League, Profile,
Actions). \* \*\*Typography:\*\* San Francisco/Roboto (System fonts) for
clean readability. High contrast.

\### 5.2 The News Feed (Home Tab) The central hub for immersion. A
scrolling list combining: 1. \*\*Game Results:\*\* \"Lewisville defeats
Plano West 65-60.\" 2. \*\*Narrative Hooks:\*\* \"Rumor: Coach K spotted
at \[Player Name\]\'s game.\" (Ink integration). 3. \*\*Social Media
Simulation:\*\* Tweets/Posts from fans reacting to the Player\'s last
performance.

\### 5.3 Key Moment Interface \* \*\*Visuals:\*\* A blurred background
of the court. \* \*\*Focus:\*\* Large, distinct text buttons for
choices. \* \*\*Feedback:\*\* Immediate statistical result + Text
commentary line (\"You bricked it off the back iron.\").

\-\--

\## 6. Success Metrics (KPIs)

Since this is a single-player simulation, engagement is the primary
metric.

1\. \*\*Retention:\*\* \* \*\*D1 Retention:\*\* Target \> 40% (Did they
finish Middle School?). \* \*\*D30 Retention:\*\* Target \> 15% (Are
they playing multiple careers?). 2. \*\*Session Depth:\*\* \* Average
Seasons completed per user. \* % of users who reach the \"Pro\" phase.
3. \*\*Ad Adoption (Monetization):\*\* \* % of users watching \"Second
Chance\" Rewarded Ads (for Elite Camp invites). Target \> 25% daily
active users.

\-\--

\## 7. Risk Assessment

\| Risk Category \| Risk Description \| Mitigation Strategy \| \| :\-\--
\| :\-\-- \| :\-\-- \| \| \*\*Scope Creep\*\* \| Simulating a full
NCAA/NBA world is resource-intensive. \| \*\*Abstraction:\*\* Only
simulate \"Key Rivals\" in depth. Use statistical approximation for
leagues the player isn\'t in. \| \| \*\*Statistical Balancing\*\* \|
Players becoming 99 OVR too fast or game becoming too easy. \| \*\*The
\"Information Gap\":\*\* Hide true ratings so players can\'t min-max
easily. Implement \"Plateaus\" where growth stalls without specific
expensive trainers. \| \| \*\*Narrative Repetition\*\* \| Ink events
feeling repetitive after 3 seasons. \| \*\*Tagging System:\*\* Tag
events by Career Phase (HS, College, Pro) and Archetype so users only
see relevant events. \| \| \*\*Performance\*\* \| React Native UI lag
during weekly simulation processing. \| \*\*Web Workers / JSI:\*\*
Offload the simulation math to a separate thread via JSI bindings so the
UI spinner remains fluid. \|

\-\--

\## 8. Implementation Roadmap (Phase 1)

1\. \*\*Week 1-2:\*\* Setup React Native repo, integrate \`inkjs\`,
build basic Attribute/State store (MobX). 2. \*\*Week 3-4:\*\* Build the
\"Match Engine\" (Markov Chain) generic logic (no UI). Console log
output only. 3. \*\*Week 5-6:\*\* Build the \"News Feed\" UI and hook up
the Match Engine to the UI. 4. \*\*Week 7-8:\*\* Implement the \"Middle
School\" tutorial loop (4 games + 1 Ink script). 5. \*\*Week 9:\*\*
Internal Alpha Test (Playable Tutorial).
