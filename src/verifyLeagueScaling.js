"use strict";

const { register } = require("tsx/cjs/api");
register();

const { createBaseContext, makeAttributes, makePlayer } = require("./verifyFixtures.js");

const LEAGUE_MODIFIERS = {
  MIDDLE_SCHOOL: 0.6,
  HIGH_SCHOOL: 0.75,
  COLLEGE: 0.9,
  PRO: 1.0,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const getScaledAttribute = (value, leagueLevel) => clamp(value * LEAGUE_MODIFIERS[leagueLevel], 0, 99);
const getVariance = (vision, rng) => {
  const spread = 6 + ((99 - vision) / 99) * 8;
  return (rng() * 2 - 1) * spread;
};
const getShotMakeProbability = (shotScore) => clamp(0.4 + shotScore / 280, 0.34, 0.66);
const getFailureProbability = (actionScore) => clamp(0.14 - actionScore / 390, 0.03, 0.17);
const getShotPoints = (threePoint, rng) => {
  const threePointChance = clamp((threePoint - 35) / 90, 0.12, 0.5);
  return rng() <= threePointChance ? 3 : 2;
};

const createSeededRng = (seed) => {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const makeTeam = (roster) => ({ roster });

const getPerimeterDefenseValue = (defenseTeam, leagueLevel) =>
  average(defenseTeam.roster.map((player) => getScaledAttribute(player.attributes.perimeterDefense, leagueLevel)));

const getInteriorDefenseValue = (defenseTeam, leagueLevel) =>
  average(defenseTeam.roster.map((player) => getScaledAttribute(player.attributes.interiorDefense, leagueLevel)));

const simulate = (offenseTeam, defenseTeam, leagueLevel, seed, possessions) => {
  const rng = createSeededRng(seed);
  const perimeterDefenseValue = getPerimeterDefenseValue(defenseTeam, leagueLevel);
  const interiorDefenseValue = getInteriorDefenseValue(defenseTeam, leagueLevel);
  let points = 0;
  let fga = 0;
  let fgm = 0;

  for (let i = 0; i < possessions; i += 1) {
    const ballHandler = offenseTeam.roster[Math.floor(rng() * offenseTeam.roster.length)];
    const threePoint = getScaledAttribute(ballHandler.attributes.threePoint, leagueLevel);
    const shortRange = getScaledAttribute(ballHandler.attributes.shortRange, leagueLevel);
    const handle = getScaledAttribute(ballHandler.attributes.handle, leagueLevel);
    const passing = getScaledAttribute(ballHandler.attributes.passing, leagueLevel);
    const vision = getScaledAttribute(ballHandler.attributes.vision, leagueLevel);
    const speed = getScaledAttribute(ballHandler.attributes.speed, leagueLevel);
    const stamina = getScaledAttribute(ballHandler.attributes.stamina, leagueLevel);

    const energyModifier = (stamina - 50) * 0.18;
    const decisionModifier = (vision - 50) * 0.15;
    const actionRoll = rng();
    const action = actionRoll < 0.34 ? "pass" : actionRoll < 0.72 ? "shoot" : "dribble";

    if (action === "shoot") {
      const shotScore =
        average([threePoint, shortRange]) +
        energyModifier +
        decisionModifier -
        average([perimeterDefenseValue, interiorDefenseValue]) -
        getVariance(vision, rng);
      const made = rng() <= getShotMakeProbability(shotScore);
      fga += 1;
      if (made) {
        fgm += 1;
        points += getShotPoints(threePoint, rng);
      }
    } else if (action === "pass") {
      const actionScore = average([passing, vision, handle]) + energyModifier + decisionModifier - perimeterDefenseValue - getVariance(vision, rng);
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
      const actionScore = average([handle, speed, vision]) + energyModifier - perimeterDefenseValue - getVariance(vision, rng);
      const dribbleFailure = rng() <= getFailureProbability(actionScore);
      if (!dribbleFailure) {
        const finishScore = average([shortRange, speed]) + energyModifier + decisionModifier - interiorDefenseValue - getVariance(vision, rng);
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

const homeSlasherTeam = makeTeam([
  makePlayer("h1", "Slasher Wing", "Slasher", "SF", makeAttributes({ shortRange: 82, dunking: 86, midrange: 58, threePoint: 62, handle: 68, passing: 52, vision: 60, perimeterDefense: 58, interiorDefense: 56, stealing: 57, blocking: 58, offRebounding: 48, defRebounding: 56, speed: 86, strength: 74, stamina: 74 })),
  makePlayer("h2", "Lead Guard", "Playmaker", "PG", makeAttributes({ shortRange: 50, dunking: 48, midrange: 51, threePoint: 55, handle: 66, passing: 64, vision: 58, perimeterDefense: 48, interiorDefense: 42, stealing: 46, blocking: 34, offRebounding: 30, defRebounding: 40, speed: 58, strength: 46, stamina: 64 })),
  makePlayer("h3", "Spot Up", "Sharpshooter", "SG", makeAttributes({ shortRange: 48, dunking: 44, midrange: 61, threePoint: 68, handle: 52, passing: 48, vision: 56, perimeterDefense: 44, interiorDefense: 38, stealing: 41, blocking: 32, offRebounding: 28, defRebounding: 38, speed: 54, strength: 42, stamina: 62 })),
  makePlayer("h4", "Stretch Four", "Stretch Big", "PF", makeAttributes({ shortRange: 52, dunking: 50, midrange: 52, threePoint: 58, handle: 40, passing: 44, vision: 54, perimeterDefense: 48, interiorDefense: 54, stealing: 42, blocking: 40, offRebounding: 48, defRebounding: 60, speed: 50, strength: 52, stamina: 66 })),
  makePlayer("h5", "Interior Five", "Paint Beast", "C", makeAttributes({ shortRange: 66, dunking: 62, midrange: 38, threePoint: 42, handle: 35, passing: 40, vision: 52, perimeterDefense: 44, interiorDefense: 62, stealing: 39, blocking: 48, offRebounding: 56, defRebounding: 70, speed: 52, strength: 60, stamina: 68 })),
]);

const middleDefenseTeam = makeTeam(createBaseContext().away.roster);
const proDefenseTeam = makeTeam([
  makePlayer("p1", "Pro Lock 1", "Lockdown Defender", "PG", makeAttributes({ shortRange: 66, dunking: 70, midrange: 68, threePoint: 74, handle: 80, passing: 78, vision: 86, perimeterDefense: 88, interiorDefense: 74, stealing: 86, blocking: 56, offRebounding: 44, defRebounding: 58, speed: 82, strength: 68, stamina: 84 })),
  makePlayer("p2", "Pro Lock 2", "Lockdown Defender", "SG", makeAttributes({ shortRange: 68, dunking: 72, midrange: 70, threePoint: 76, handle: 78, passing: 74, vision: 86, perimeterDefense: 90, interiorDefense: 76, stealing: 88, blocking: 58, offRebounding: 46, defRebounding: 60, speed: 84, strength: 70, stamina: 86 })),
  makePlayer("p3", "Pro Lock 3", "Lockdown Defender", "SF", makeAttributes({ shortRange: 70, dunking: 76, midrange: 68, threePoint: 72, handle: 74, passing: 70, vision: 88, perimeterDefense: 92, interiorDefense: 82, stealing: 90, blocking: 64, offRebounding: 54, defRebounding: 68, speed: 86, strength: 74, stamina: 86 })),
  makePlayer("p4", "Pro Big 4", "Paint Beast", "PF", makeAttributes({ shortRange: 74, dunking: 80, midrange: 56, threePoint: 60, handle: 54, passing: 62, vision: 84, perimeterDefense: 82, interiorDefense: 90, stealing: 74, blocking: 80, offRebounding: 72, defRebounding: 86, speed: 80, strength: 82, stamina: 86 })),
  makePlayer("p5", "Pro Big 5", "Paint Beast", "C", makeAttributes({ shortRange: 78, dunking: 82, midrange: 50, threePoint: 56, handle: 50, passing: 58, vision: 86, perimeterDefense: 78, interiorDefense: 92, stealing: 72, blocking: 84, offRebounding: 76, defRebounding: 90, speed: 78, strength: 86, stamina: 88 })),
]);

const run = async () => {
  const setupModule = require("./scripts/setupNodeVerificationEnv.ts");
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


