import "./global.css";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { HomeScreen } from "./src/screens/HomeScreen";
import { useCareerStore } from "./src/store/useCareerStore";

const DEV_RESET_ON_LAUNCH = true;

export default function App() {
  useEffect(() => {
    if (!__DEV__ || !DEV_RESET_ON_LAUNCH) {
      return;
    }

    void (async () => {
      await useCareerStore.persist.clearStorage();
      useCareerStore.setState(useCareerStore.getInitialState(), true);
    })();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <HomeScreen />
    </>
  );
}
