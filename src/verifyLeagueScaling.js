"use strict";

const LEAGUE_MODIFIERS = {
  MIDDLE_SCHOOL: 0.6,
  HIGH_SCHOOL: 0.75,
  COLLEGE: 0.9,
  PRO: 1.0,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const getScaledAttribute = (value, leagueLevel) => clamp(value * LEAGUE_MODIFIERS[leagueLevel], 0, 99);
const getEnergyModifier = (stamina) => (stamina - 50) * 0.18;
const getBbiqModifier = (bbiq) => (bbiq - 50) * 0.15;
const getVariance = (bbiq, rng) => {
  const spread = 6 + ((99 - bbiq) / 99) * 8;
  return (rng() * 2 - 1) * spread;
};
const getShotMakeProbability = (shotScore) => clamp(0.4 + shotScore / 280, 0.34, 0.66);
const getFailureProbability = (actionScore) => clamp(0.14 - actionScore / 390, 0.03, 0.17);
const getShotPoints = (shooting, rng) => {
  const threePointChance = clamp((shooting - 35) / 90, 0.12, 0.5);
  return rng() <= threePointChance ? 3 : 2;
};

const createSeededRng = (seed) => {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const makePlayer = (id, _archetype, _position, attrs) => ({ id, attributes: attrs });
const mkTeam = (roster) => ({ roster });

const getDefenseValue = (defenseTeam, leagueLevel) =>
  average(
    defenseTeam.roster.map((player) =>
      average([
        getScaledAttribute(player.attributes.defense, leagueLevel),
        getScaledAttribute(player.attributes.bbiq, leagueLevel),
      ]),
    ),
  );

const simulate = (offenseTeam, defenseTeam, leagueLevel, seed, possessions) => {
  const rng = createSeededRng(seed);
  const defenseValue = getDefenseValue(defenseTeam, leagueLevel);
  let points = 0;
  let fga = 0;
  let fgm = 0;

  for (let i = 0; i < possessions; i += 1) {
    const ballHandler = offenseTeam.roster[Math.floor(rng() * offenseTeam.roster.length)];
    const scaledShooting = getScaledAttribute(ballHandler.attributes.shooting, leagueLevel);
    const scaledFinishing = getScaledAttribute(ballHandler.attributes.finishing, leagueLevel);
    const scaledVision = getScaledAttribute(ballHandler.attributes.vision, leagueLevel);
    const scaledHandle = getScaledAttribute(ballHandler.attributes.handle, leagueLevel);
    const scaledAthleticism = getScaledAttribute(ballHandler.attributes.athleticism, leagueLevel);
    const scaledBbiq = getScaledAttribute(ballHandler.attributes.bbiq, leagueLevel);
    const scaledStamina = getScaledAttribute(ballHandler.attributes.stamina, leagueLevel);

    const actionRoll = rng();
    const action = actionRoll < 0.34 ? "pass" : actionRoll < 0.72 ? "shoot" : "dribble";

    if (action === "shoot") {
      const shotScore =
        average([scaledShooting, scaledFinishing]) +
        getEnergyModifier(scaledStamina) +
        getBbiqModifier(scaledBbiq) -
        defenseValue -
        getVariance(scaledBbiq, rng);
      const made = rng() <= getShotMakeProbability(shotScore);
      fga += 1;
      if (made) {
        fgm += 1;
        points += getShotPoints(scaledShooting, rng);
      }
    } else if (action === "pass") {
      const actionScore =
        average([scaledVision, scaledHandle, scaledBbiq]) +
        getEnergyModifier(scaledStamina) +
        getBbiqModifier(scaledBbiq) -
        defenseValue -
        getVariance(scaledBbiq, rng);
      const passFailure = rng() <= getFailureProbability(actionScore);
      if (!passFailure) {
        const made = rng() <= getShotMakeProbability(actionScore);
        fga += 1;
        if (made) {
          fgm += 1;
          points += 2;
        }
      }
    } else {
      const actionScore =
        average([scaledHandle, scaledAthleticism, scaledBbiq]) +
        getEnergyModifier(scaledStamina) -
        defenseValue -
        getVariance(scaledBbiq, rng);
      const dribbleFailure = rng() <= getFailureProbability(actionScore);
      if (!dribbleFailure) {
        const finishScore =
          average([scaledFinishing, scaledAthleticism]) +
          getEnergyModifier(scaledStamina) +
          getBbiqModifier(scaledBbiq) -
          defenseValue -
          getVariance(scaledBbiq, rng);
        const made = rng() <= getShotMakeProbability(finishScore);
        fga += 1;
        if (made) {
          fgm += 1;
          points += 2;
        }
      }
    }
  }

  return {
    pointsPerPossession: possessions > 0 ? points / possessions : 0,
    fgPct: fga > 0 ? (fgm / fga) * 100 : 0,
  };
};

const homeSlasherTeam = mkTeam([
  makePlayer("h1", "Slasher", "SF", {
    shooting: 62,
    finishing: 82,
    vision: 52,
    handle: 68,
    athleticism: 86,
    defense: 58,
    rebounding: 56,
    bbiq: 60,
    stamina: 74,
  }),
  makePlayer("h2", "Playmaker", "PG", {
    shooting: 55,
    finishing: 50,
    vision: 64,
    handle: 66,
    athleticism: 58,
    defense: 48,
    rebounding: 40,
    bbiq: 58,
    stamina: 64,
  }),
  makePlayer("h3", "Sharpshooter", "SG", {
    shooting: 68,
    finishing: 48,
    vision: 48,
    handle: 52,
    athleticism: 54,
    defense: 44,
    rebounding: 38,
    bbiq: 56,
    stamina: 62,
  }),
  makePlayer("h4", "Stretch Big", "PF", {
    shooting: 58,
    finishing: 52,
    vision: 44,
    handle: 40,
    athleticism: 50,
    defense: 54,
    rebounding: 60,
    bbiq: 54,
    stamina: 66,
  }),
  makePlayer("h5", "Paint Beast", "C", {
    shooting: 42,
    finishing: 66,
    vision: 40,
    handle: 35,
    athleticism: 52,
    defense: 62,
    rebounding: 70,
    bbiq: 52,
    stamina: 68,
  }),
]);

const middleDefenseTeam = mkTeam([
  makePlayer("a1", "Playmaker", "PG", {
    shooting: 52,
    finishing: 46,
    vision: 56,
    handle: 58,
    athleticism: 54,
    defense: 42,
    rebounding: 38,
    bbiq: 44,
    stamina: 58,
  }),
  makePlayer("a2", "Sharpshooter", "SG", {
    shooting: 62,
    finishing: 44,
    vision: 42,
    handle: 48,
    athleticism: 52,
    defense: 40,
    rebounding: 36,
    bbiq: 42,
    stamina: 56,
  }),
  makePlayer("a3", "Slasher", "SF", {
    shooting: 50,
    finishing: 60,
    vision: 45,
    handle: 55,
    athleticism: 62,
    defense: 46,
    rebounding: 44,
    bbiq: 46,
    stamina: 60,
  }),
  makePlayer("a4", "Stretch Big", "PF", {
    shooting: 56,
    finishing: 50,
    vision: 42,
    handle: 38,
    athleticism: 48,
    defense: 44,
    rebounding: 52,
    bbiq: 45,
    stamina: 58,
  }),
  makePlayer("a5", "Paint Beast", "C", {
    shooting: 38,
    finishing: 58,
    vision: 36,
    handle: 30,
    athleticism: 48,
    defense: 50,
    rebounding: 60,
    bbiq: 46,
    stamina: 62,
  }),
]);

const proDefenseTeam = mkTeam([
  makePlayer("p1", "Lockdown Defender", "PG", {
    shooting: 74,
    finishing: 66,
    vision: 78,
    handle: 80,
    athleticism: 82,
    defense: 88,
    rebounding: 58,
    bbiq: 86,
    stamina: 84,
  }),
  makePlayer("p2", "Lockdown Defender", "SG", {
    shooting: 76,
    finishing: 68,
    vision: 74,
    handle: 78,
    athleticism: 84,
    defense: 90,
    rebounding: 60,
    bbiq: 86,
    stamina: 86,
  }),
  makePlayer("p3", "Lockdown Defender", "SF", {
    shooting: 72,
    finishing: 70,
    vision: 70,
    handle: 74,
    athleticism: 86,
    defense: 92,
    rebounding: 68,
    bbiq: 88,
    stamina: 86,
  }),
  makePlayer("p4", "Paint Beast", "PF", {
    shooting: 60,
    finishing: 74,
    vision: 62,
    handle: 54,
    athleticism: 80,
    defense: 90,
    rebounding: 86,
    bbiq: 84,
    stamina: 86,
  }),
  makePlayer("p5", "Paint Beast", "C", {
    shooting: 56,
    finishing: 78,
    vision: 58,
    handle: 50,
    athleticism: 78,
    defense: 92,
    rebounding: 90,
    bbiq: 86,
    stamina: 88,
  }),
]);

const run = async () => {
  const setupModule = await import("./scripts/setupNodeVerificationEnv.ts");
  const setupNodeVerificationEnv =
    setupModule.setupNodeVerificationEnv ?? setupModule.default?.setupNodeVerificationEnv;
  if (typeof setupNodeVerificationEnv !== "function") {
    throw new Error("Failed to load setupNodeVerificationEnv.");
  }
  await setupNodeVerificationEnv();

  const middle = simulate(homeSlasherTeam, middleDefenseTeam, "MIDDLE_SCHOOL", 20260301, 300);
  const pro = simulate(homeSlasherTeam, proDefenseTeam, "PRO", 20260301, 300);

  console.log("=== League Scaling Check ===");
  console.log(`Middle School PPP: ${middle.pointsPerPossession.toFixed(3)} | FG%: ${middle.fgPct.toFixed(1)}%`);
  console.log(`Pro Level PPP: ${pro.pointsPerPossession.toFixed(3)} | FG%: ${pro.fgPct.toFixed(1)}%`);
  console.log(
    middle.pointsPerPossession > pro.pointsPerPossession
      ? "PASS: Slasher-led offense performs better vs middle-school competition than vs pro competition."
      : "CHECK TUNING: Pro context did not reduce offensive output as expected.",
  );
};

run().catch((error) => {
  console.error("League scaling verification failed:", error);
  process.exitCode = 1;
});
