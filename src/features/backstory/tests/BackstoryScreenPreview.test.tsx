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
  it("shows preset cards, hides secondary position, and previews derived sim identity", () => {
    const screen = render(<BackstoryScreen />);

    expect(screen.queryByText("Secondary Position")).toBeNull();

    const nameInputs = screen.getAllByDisplayValue("");
    fireEvent.changeText(nameInputs[0], "Jordan");
    fireEvent.changeText(nameInputs[1], "Rivers");

    fireEvent.press(screen.getByText("Next"));
    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Playmaker")).toBeTruthy();
    expect(screen.getByText("Sharpshooter")).toBeTruthy();
    expect(screen.getByText("Slasher")).toBeTruthy();
    expect(screen.queryByText("Secondary Position")).toBeNull();

    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Step 4: Review Prospect Profile")).toBeTruthy();
    expect(screen.getAllByText("Archetype").length).toBeGreaterThan(0);
    expect(screen.getByText("Current-Level Sim Projection")).toBeTruthy();
    expect(screen.getByText("Role")).toBeTruthy();
    expect(screen.queryByText("Customization Points Remaining")).toBeNull();
    expect(screen.queryByText("Customize Attributes")).toBeNull();
    expect(screen.queryByText("Hide Customize Attributes")).toBeNull();
    expect(screen.queryByText("Advanced Attribute Editing")).toBeNull();
    expect(screen.queryByText("Hide Advanced Attribute Editing")).toBeNull();
    expect(screen.queryByText("Three Point")).toBeNull();

    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Step 5: Preview")).toBeTruthy();
    expect(screen.getByText("Current-Level Sim Projection")).toBeTruthy();
    expect(screen.getByText("Role")).toBeTruthy();
    expect(screen.getByText("Expected Sim Tendencies")).toBeTruthy();
    expect(screen.getByText("Top Strengths")).toBeTruthy();
    expect(screen.queryByText("Badge Watch")).toBeNull();
    expect(screen.getByText("Growth Outlook")).toBeTruthy();
    expect(screen.queryByText(/Build:/)).toBeNull();
    expect(screen.queryByText(/Compatibility Archetype:/)).toBeNull();
    expect(screen.queryByText(/PG\/SG/)).toBeNull();
  });
});
