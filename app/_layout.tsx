import { Slot, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          gestureEnabled: true, // swipe back ios
          headerShown: false, // enleve la barre d'entete
          animation: "slide_from_right",
        }}
      >
        <Slot />
      </Stack>
    </SafeAreaProvider>
  );
}
