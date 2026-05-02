import { render } from "@testing-library/react-native";
import { PlayerCard } from "./PlayerCard";
import { classifyBuilderBuild } from "../builder/classify";
import type { CareerActions, CareerState } from "../types/career";
import type { PlayerAttributes } from "../types/player";

const attributes: PlayerAttributes = {
  shortRange: 78,
  dunking: 74,
  midrange: 82,
  threePoint: 90,
  handle: 93,
  passing: 91,
  vision: 89,
  perimeterDefense: 68,
  interiorDefense: 54,
  stealing: 65,
  blocking: 42,
  offRebounding: 40,
  defRebounding: 48,
  speed: 84,
  strength: 66,
  stamina: 88,
};

const mockClassification = classifyBuilderBuild(attributes, "PG");

const mockCareerState = {
  injury: {
    id: "injury-1",
    type: "ankle_sprain" as const,
    severity: "minor" as const,
    createdWeek: 3,
    weeksRemaining: 2,
    performanceMultiplier: 0.88,
    canPlayThrough: true,
  },
  player: {
    id: "player-1",
    name: "Jordan Rivers",
    age: 18,
    bankBalance: 0,
    morale: 50,
    position: "PG" as const,
    secondaryPosition: "SG" as const,
    archetype: "Playmaker" as const,
    identity: {
      firstName: "Jordan",
      lastName: "Rivers",
      displayName: "Jordan Rivers",
      hometown: {
        slug: "chicago-il",
        city: "Chicago",
        stateCode: "IL",
        state: "Illinois",
      },
      ageStarted: 8,
      ageStartedBand: "STANDARD" as const,
      bodyFrame: "Athletic" as const,
      dominantHand: "Right" as const,
      archetype: "Playmaker" as const,
      primaryPosition: "PG" as const,
      secondaryPosition: "SG" as const,
      height: { feet: 6, inches: 2 },
      weightLbs: 185,
    },
    dna: {
      potential: 90,
      potentialTier: "Gold" as const,
      growthCurve: "LATE_BLOOMER" as const,
      generationSeed: 1,
      growthByLeague: {
        MIDDLE_SCHOOL: 1,
        HIGH_SCHOOL: 1,
        COLLEGE: 1,
        PRO: 1,
      },
      caps: attributes,
      growthResidue: {},
      publicTraits: ["Potential Tier: Gold", "Late Bloomer", "Athletic Frame"],
      builderProfile: {
        classification: mockClassification,
        badges: [{ id: "floor_general", label: "Floor General", tier: "GOLD", description: "Makes the offense hum." }],
      },
    },
    attributes,
    gameStats: {
      points: 0,
      assists: 0,
      rebounds: 0,
      steals: 0,
      blocks: 0,
      fga: 0,
      fgm: 0,
    },
  },
};

jest.mock("../store/useCareerStore", () => ({
  useCareerStore: (selector: (state: CareerState & CareerActions) => unknown) =>
    selector(mockCareerState as unknown as CareerState & CareerActions),
}));

describe("PlayerCard", () => {
  it("renders the builder review breakdown with player-facing labels", () => {
    const screen = render(<PlayerCard />);

    expect(screen.getByText("Projected Sim Identity")).toBeTruthy();
    expect(screen.getByText("Projected Role")).toBeTruthy();
    expect(screen.getByText("Primary Creator")).toBeTruthy();
    expect(screen.getByText("Top Strengths")).toBeTruthy();
    expect(screen.getByText("Playmaking")).toBeTruthy();
    expect(screen.getByText("Shooting")).toBeTruthy();
    expect(screen.getByText("Floor General Gold")).toBeTruthy();
    expect(screen.getByText("Growth Outlook")).toBeTruthy();
    expect(screen.getByText("Slow start, big upside later")).toBeTruthy();
    expect(screen.getByText("Minor ankle sprain • 2 weeks remaining")).toBeTruthy();
    expect(screen.queryByText("Compatibility Archetype:")).toBeNull();
  });
});
