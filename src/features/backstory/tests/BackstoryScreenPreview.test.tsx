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

    expect(screen.getByText("Primary Creator")).toBeTruthy();
    expect(screen.getByText("Shotmaking Guard")).toBeTruthy();
    expect(screen.getByText("Rim Pressure Guard")).toBeTruthy();
    expect(screen.queryByText("Secondary Position")).toBeNull();

    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Starting Build")).toBeTruthy();
    expect(screen.getByText("Projected Sim Identity")).toBeTruthy();
    expect(screen.getByText("Customize Attributes")).toBeTruthy();

    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Step 5: Preview")).toBeTruthy();
    expect(screen.getByText("Projected Sim Identity")).toBeTruthy();
    expect(screen.getByText("Projected Role")).toBeTruthy();
    expect(screen.getByText("Expected Sim Tendencies")).toBeTruthy();
    expect(screen.getByText("Top Strengths")).toBeTruthy();
    expect(screen.getByText("Badge Watch")).toBeTruthy();
    expect(screen.getByText("Growth Outlook")).toBeTruthy();
    expect(screen.queryByText(/Build:/)).toBeNull();
    expect(screen.queryByText(/Compatibility Archetype:/)).toBeNull();
    expect(screen.queryByText(/PG\/SG/)).toBeNull();
  });
});
