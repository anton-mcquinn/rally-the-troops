import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="tabs" options={{ headerShown: false }} />{" "}
      {/* Tab layout */}
      <Stack.Screen
        name="events/[id]"
        options={{ title: "Event Details" }}
      />{" "}
      {/* Dynamic event details */}
    </Stack>
  );
}
