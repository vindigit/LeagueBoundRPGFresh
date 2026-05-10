import { fireEvent, render } from "@testing-library/react-native";
import { BackstoryScreen } from "../screens/BackstoryScreen";
import type { CareerActions, CareerState } from "../../../types/career";

jest.mock("../../../store/useCareerStore", () => ({
  useCareerStore: (selector: (state: CareerState & CareerActions) => unknown) =>
    selector({
      initializeCareer: jest.fn(),
    } as unknown as CareerState & CareerActions),
}));

describe("BackstoryScreen preview", () => {
  it("shows public builder flow, hides secondary position, and previews fuzzy scouting", () => {
    const screen = render(<BackstoryScreen />);

    expect(screen.queryByText("Secondary Position")).toBeNull();

    const nameInputs = screen.getAllByDisplayValue("");
    fireEvent.changeText(nameInputs[0], "Jordan");
    fireEvent.changeText(nameInputs[1], "Rivers");

    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Position")).toBeTruthy();
    expect(screen.queryByText("Secondary Position")).toBeNull();

    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Step 3: Starting Archetype")).toBeTruthy();
    expect(screen.getByText("Playmaker")).toBeTruthy();
    expect(screen.getByText("Sharpshooter")).toBeTruthy();
    expect(screen.getByText("Slasher")).toBeTruthy();
    expect(screen.queryByText("Secondary Position")).toBeNull();

    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Step 4: Allocate Attributes")).toBeTruthy();
    expect(screen.getByText("Shooting")).toBeTruthy();
    expect(screen.getByText("Finishing")).toBeTruthy();
    expect(screen.getByText("Playmaking")).toBeTruthy();
    expect(screen.queryByText("Three Point")).toBeNull();
    expect(screen.queryByText("Potential Tier")).toBeNull();

    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Step 5: Preview")).toBeTruthy();
    expect(screen.getByText("Playstyle")).toBeTruthy();
    expect(screen.getByText("Expected Key Moments")).toBeTruthy();
    expect(screen.getByText("Current-Level Sim Projection")).toBeTruthy();
    expect(screen.getByText("Current Role")).toBeTruthy();
    expect(screen.getByText("Expected Game Shape")).toBeTruthy();
    expect(screen.getByText("Strengths")).toBeTruthy();
    expect(screen.queryByText("Badge Watch")).toBeNull();
    expect(screen.getByText("Growth Outlook")).toBeTruthy();
    expect(screen.queryByText("Bronze")).toBeNull();
    expect(screen.queryByText("Silver")).toBeNull();
    expect(screen.queryByText("Gold")).toBeNull();
    expect(screen.queryByText("Platinum")).toBeNull();
    expect(screen.queryByText(/Build:/)).toBeNull();
    expect(screen.queryByText(/Compatibility Archetype:/)).toBeNull();
    expect(screen.queryByText(/PG\/SG/)).toBeNull();
  });

  it("shows effective attribute values and opens attribute help in Step 4", () => {
    const screen = render(<BackstoryScreen />);

    const nameInputs = screen.getAllByDisplayValue("");
    fireEvent.changeText(nameInputs[0], "Jordan");
    fireEvent.changeText(nameInputs[1], "Rivers");

    fireEvent.press(screen.getByText("Next"));
    fireEvent.press(screen.getByText("Next"));
    fireEvent.press(screen.getByText("Playmaker"));
    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Step 4: Allocate Attributes")).toBeTruthy();
    expect(screen.queryByText(/Archetype-adjusted preview/i)).toBeNull();
    expect(screen.getByText("58")).toBeTruthy();

    fireEvent.press(screen.getByTestId("attribute-help-playmaking"));

    expect(screen.getByTestId("attribute-help-modal")).toBeTruthy();
    expect(screen.getByText("Attribute Info")).toBeTruthy();
    expect(screen.getAllByText("Playmaking")).toHaveLength(2);
    expect(screen.getByText("Affects ball handling, passing, and creating looks.")).toBeTruthy();

    fireEvent.press(screen.getByText("Close"));

    expect(screen.queryByText("Affects ball handling, passing, and creating looks.")).toBeNull();
  });
});
