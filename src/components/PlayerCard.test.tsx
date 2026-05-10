import { render } from "@testing-library/react-native";
import { inferPublicAttributesFromEngine } from "../builder/publicAttributes";
import { classifyBuilderBuild } from "../builder/classify";
import type { CareerActions, CareerState } from "../types/career";
import type { PlayerAttributes } from "../types/player";
import { PlayerCard } from "./PlayerCard";

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
const inferredPublicAttributes = inferPublicAttributesFromEngine(attributes);

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
  leagueLevel: "MIDDLE_SCHOOL",
  seasonNumber: 1,
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
      publicAttributes: {
        shooting: 67,
        finishing: 60,
        playmaking: 91,
        defending: 55,
        rebounding: 44,
        athleticism: 73,
        stamina: 88,
      },
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

let mockedState = mockCareerState;

jest.mock("../store/useCareerStore", () => ({
  useCareerStore: (selector: (state: CareerState & CareerActions) => unknown) =>
    selector(mockedState as unknown as CareerState & CareerActions),
}));

describe("PlayerCard", () => {
  beforeEach(() => {
    mockedState = mockCareerState;
  });

  it("renders the builder review breakdown with player-facing labels", () => {
    const screen = render(<PlayerCard />);

    expect(screen.getByText("Current-Level Sim Projection")).toBeTruthy();
    expect(screen.getByText("Current Role")).toBeTruthy();
    expect(screen.getByText("Primary Creator")).toBeTruthy();
    expect(screen.getByText("Strengths")).toBeTruthy();
    expect(screen.getAllByText("Playmaking").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shooting").length).toBeGreaterThan(0);
    expect(screen.getByText("Growth Outlook")).toBeTruthy();
    expect(screen.getByText("Slow start, big upside later")).toBeTruthy();
    expect(screen.getByText(/Minor ankle sprain/)).toBeTruthy();
    expect(screen.queryByText("Compatibility Archetype:")).toBeNull();
  });

  it("renders public attributes instead of legacy engine stats when stored public attributes exist", () => {
    const screen = render(<PlayerCard />);

    expect(screen.getAllByText("Playmaking").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shooting").length).toBeGreaterThan(0);
    expect(screen.getByText("Athleticism")).toBeTruthy();
    expect(screen.queryByText("Passing")).toBeNull();
    expect(screen.queryByText("Vision")).toBeNull();
    expect(screen.queryByText("Handle")).toBeNull();
  });

  it("falls back to inferred public attributes for legacy players without stored public attributes", () => {
    mockedState = {
      ...mockCareerState,
      player: {
        ...mockCareerState.player,
        identity: {
          ...mockCareerState.player.identity,
          publicAttributes: undefined,
        },
        dna: {
          ...mockCareerState.player.dna,
          publicAttributes: undefined,
        },
      },
    };

    const screen = render(<PlayerCard />);

    expect(screen.getAllByText("Playmaking").length).toBeGreaterThan(0);
    expect(screen.getByText(String(inferredPublicAttributes.playmaking))).toBeTruthy();
    expect(screen.getAllByText("Shooting").length).toBeGreaterThan(0);
    expect(screen.queryByText("Passing")).toBeNull();
    expect(screen.queryByText("Vision")).toBeNull();
  });
});
