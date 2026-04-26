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
  it("shows the builder review breakdown on Step 5 and removes old labels", () => {
    const screen = render(<BackstoryScreen />);

    const nameInputs = screen.getAllByDisplayValue("");
    fireEvent.changeText(nameInputs[0], "Jordan");
    fireEvent.changeText(nameInputs[1], "Rivers");

    fireEvent.press(screen.getByText("Next"));
    fireEvent.press(screen.getByText("Next"));
    fireEvent.press(screen.getByText("Next"));
    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Step 5: Preview")).toBeTruthy();
    expect(screen.getByText("Builder Review")).toBeTruthy();
    expect(screen.getByText("Classification")).toBeTruthy();
    expect(screen.getByText("Archetype Fit")).toBeTruthy();
    expect(screen.getByText("Top Strengths")).toBeTruthy();
    expect(screen.getByText("Badges")).toBeTruthy();
    expect(screen.getByText("Growth Outlook")).toBeTruthy();
    expect(screen.queryByText(/Build:/)).toBeNull();
    expect(screen.queryByText(/Compatibility Archetype:/)).toBeNull();
  });
});
