import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { logout } from "../../services/authService";

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout(router); // Properly await and handle logout
            router.push("/login"); // Navigate to the login screen
          } catch (error) {
            console.error("Logout failed:", error);
          }
        },
      },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Button onPress={handleLogout} title="Logout" color="#007AFF" />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="squad"
        options={{
          title: "Squad",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile-settings"
        options={{
          title: "Profile/Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />

      {/* Hide index and create-event from the tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: () => null, // Explicitly hide the tab
        }}
      />
      <Tabs.Screen
        name="create-event"
        options={{
          tabBarButton: () => null, // Explicitly hide the tab
        }}
      />
    </Tabs>
  );
}
