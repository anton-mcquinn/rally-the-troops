import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

// Logout function to clear tokens and handle navigation
export const logout = async (router: ReturnType<typeof useRouter>) => {
  try {
    // Clear tokens
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("refresh_token");
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("Logout failed"); // Ensure rejection is handled
  }
};
