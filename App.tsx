import "./global.css";
import { StatusBar } from "react-native";
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <HomeScreen />
    </>
  );
}
