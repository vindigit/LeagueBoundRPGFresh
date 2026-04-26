import type { LastMatchResult } from "../../types/career";
import type { Offer, ProjectedRole } from "../../types/careerProgression";
import type { Player, Position, PlayerArchetype } from "../../types/player";

export interface RecruitingProgram {
  id: string;
  label: string;
  prestige: number;
  exposureTier: string;
  phases: readonly ["HIGH_SCHOOL"];
  preferredPositions: readonly Position[];
  preferredArchetypes: readonly PlayerArchetype[];
  baseInterest: number;
}

interface SeedInterestInput {
  programs: readonly RecruitingProgram[];
  player: Player;
  scoutVisibility: number;
  starRating: number;
  schoolPathExposureBoost: number;
}

interface MatchInterestDeltaInput {
  currentInterest: Record<string, number>;
  programs: readonly RecruitingProgram[];
  player: Player;
  result: LastMatchResult;
  scoutVisibilityGain: number;
}

interface OfferGenerationInput {
  currentOffers: Offer[];
  interestById: Record<string, number>;
  programs: readonly RecruitingProgram[];
  currentWeek: number;
}

const clampInterest = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

const roleOrder: Record<ProjectedRole, number> = {
  BENCH: 1,
  ROTATION: 2,
  SIXTH_MAN: 3,
  STARTER: 4,
  STAR: 5,
};

const createOfferId = (programId: string, week: number): string => `offer-${programId}-${week}`;

const getFitBonus = (program: RecruitingProgram, player: Player): number => {
  let bonus = 0;
  if (program.preferredPositions.includes(player.position)) {
    bonus += 8;
  }
  if (player.secondaryPosition && program.preferredPositions.includes(player.secondaryPosition)) {
    bonus += 4;
  }
  if (program.preferredArchetypes.includes(player.archetype)) {
    bonus += 6;
  }
  return bonus;
};

const getPlayerPoints = (result: LastMatchResult): number => result.boxScore.homePlayers[0]?.pts ?? 0;
const getPlayerAssists = (result: LastMatchResult): number => result.boxScore.homePlayers[0]?.ast ?? 0;
const getPlayerRebounds = (result: LastMatchResult): number => result.boxScore.homePlayers[0]?.reb ?? 0;

const getProjectedRole = (interest: number): ProjectedRole => {
  if (interest >= 88) {
    return "STAR";
  }
  if (interest >= 78) {
    return "STARTER";
  }
  if (interest >= 68) {
    return "SIXTH_MAN";
  }
  if (interest >= 58) {
    return "ROTATION";
  }
  return "BENCH";
};

const getOfferType = (interest: number): Offer["type"] => (interest >= 72 ? "SCHOLARSHIP" : "WALK_ON");

export const HIGH_SCHOOL_RECRUITING_PROGRAMS: readonly RecruitingProgram[] = [
  {
    id: "houston-cougars",
    label: "Houston Cougars",
    prestige: 71,
    exposureTier: "Regional",
    phases: ["HIGH_SCHOOL"],
    preferredPositions: ["PG", "SG"],
    preferredArchetypes: ["Playmaker", "Sharpshooter"],
    baseInterest: 34,
  },
  {
    id: "texas-longhorns",
    label: "Texas Longhorns",
    prestige: 84,
    exposureTier: "National",
    phases: ["HIGH_SCHOOL"],
    preferredPositions: ["SG", "SF"],
    preferredArchetypes: ["Sharpshooter", "Slasher"],
    baseInterest: 28,
  },
  {
    id: "baylor-bears",
    label: "Baylor Bears",
    prestige: 79,
    exposureTier: "National",
    phases: ["HIGH_SCHOOL"],
    preferredPositions: ["PG", "SF"],
    preferredArchetypes: ["Playmaker", "Lockdown Defender"],
    baseInterest: 30,
  },
  {
    id: "gonzaga-bulldogs",
    label: "Gonzaga Bulldogs",
    prestige: 82,
    exposureTier: "National",
    phases: ["HIGH_SCHOOL"],
    preferredPositions: ["PF", "C"],
    preferredArchetypes: ["Stretch Big", "Paint Beast"],
    baseInterest: 26,
  },
  {
    id: "duke-blue-devils",
    label: "Duke Blue Devils",
    prestige: 90,
    exposureTier: "Blue Blood",
    phases: ["HIGH_SCHOOL"],
    preferredPositions: ["SF", "PF"],
    preferredArchetypes: ["Slasher", "Stretch Big"],
    baseInterest: 24,
  },
];

export const seedHighSchoolTeamInterest = (input: SeedInterestInput): Record<string, number> =>
  Object.fromEntries(
    input.programs.map((program) => {
      const seededInterest = clampInterest(
        program.baseInterest +
          Math.round(input.starRating * 4) +
          Math.round(input.scoutVisibility * 0.25) +
          Math.round(input.schoolPathExposureBoost * 0.6) +
          getFitBonus(program, input.player) -
          Math.round(program.prestige * 0.08),
      );

      return [program.id, seededInterest];
    }),
  );

export const applyInterestDelta = (
  currentInterest: Record<string, number>,
  targetId: string,
  amount: number,
): Record<string, number> => {
  if (targetId === "all") {
    return Object.fromEntries(
      Object.entries(currentInterest).map(([programId, interest]) => [programId, clampInterest(interest + amount)]),
    );
  }

  if (!(targetId in currentInterest)) {
    return currentInterest;
  }

  return {
    ...currentInterest,
    [targetId]: clampInterest((currentInterest[targetId] ?? 0) + amount),
  };
};

export const buildInterestDeltaFromMatch = (input: MatchInterestDeltaInput): Record<string, number> => {
  const points = getPlayerPoints(input.result);
  const assists = getPlayerAssists(input.result);
  const rebounds = getPlayerRebounds(input.result);
  const winLossDelta = input.result.didWin ? 6 : -4;
  const productionDelta =
    Math.round(points / 4) +
    Math.round(assists / 3) +
    Math.round(rebounds / 5) +
    Math.max(0, input.scoutVisibilityGain - 1);

  return Object.fromEntries(
    input.programs.map((program) => {
      const fitBias = Math.round(getFitBonus(program, input.player) / 4);
      const prestigePenalty = Math.round(program.prestige / 25);
      const change = winLossDelta + productionDelta + fitBias - prestigePenalty;
      return [program.id, clampInterest((input.currentInterest[program.id] ?? 0) + change)];
    }),
  );
};

export const generateHighSchoolOffers = (input: OfferGenerationInput): Offer[] => {
  const hasAcceptedHighSchoolOffer = input.currentOffers.some(
    (offer) => offer.status === "ACCEPTED" && offer.phases.includes("HIGH_SCHOOL"),
  );
  if (hasAcceptedHighSchoolOffer) {
    return input.currentOffers;
  }

  const existingOffersBySource = new Map(
    input.currentOffers
      .filter((offer) => offer.phases.includes("HIGH_SCHOOL"))
      .map((offer) => [offer.sourceTeamId, offer] as const),
  );

  const nextOffers = [...input.currentOffers];

  for (const program of input.programs) {
    const interest = input.interestById[program.id] ?? 0;
    if (interest < 58) {
      continue;
    }

    const offerType = getOfferType(interest);
    const projectedRole = getProjectedRole(interest);
    const existing = existingOffersBySource.get(program.id);

    if (existing) {
      if (existing.status !== "AVAILABLE") {
        continue;
      }

      const existingRoleOrder = roleOrder[existing.projectedRole];
      const nextRoleOrder = roleOrder[projectedRole];
      const typeUpgrade = existing.type === "WALK_ON" && offerType === "SCHOLARSHIP";
      if (nextRoleOrder > existingRoleOrder || typeUpgrade || interest > existing.interestLevel + 4) {
        const index = nextOffers.findIndex((offer) => offer.id === existing.id);
        if (index >= 0) {
          nextOffers[index] = {
            ...existing,
            type: offerType,
            projectedRole,
            interestLevel: interest,
            expiresWeek: input.currentWeek + 2,
            notes: typeUpgrade ? "Upgraded after recent performances." : existing.notes,
          };
        }
      }
      continue;
    }

    nextOffers.push({
      id: createOfferId(program.id, input.currentWeek),
      sourceTeamId: program.id,
      sourceLabel: program.label,
      exposureTier: program.exposureTier,
      type: offerType,
      phases: ["HIGH_SCHOOL"],
      projectedRole,
      scholarshipPercent: offerType === "SCHOLARSHIP" ? Math.min(100, 45 + Math.max(0, interest - 58) * 2) : undefined,
      interestLevel: interest,
      status: "AVAILABLE",
      createdWeek: input.currentWeek,
      expiresWeek: input.currentWeek + 2,
      notes: offerType === "SCHOLARSHIP" ? "Program is ready to invest in your rise." : "Staff wants to keep evaluating your upside.",
      tags: ["HIGH_SCHOOL", offerType, program.id],
    });
  }

  return nextOffers;
};
