import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { logout } from "./authService"; // Assuming this handles logout and redirection

const axiosInstance = axios.create({
  baseURL: "https://rtt.rideburro.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh the access token using the refresh token
const refreshToken = async () => {
  const storedRefreshToken = await SecureStore.getItemAsync("refresh_token");

  if (!storedRefreshToken) {
    throw new Error("No refresh token available"); // This will trigger logout
  }

  const response = await axios.post("https://rtt.rideburro.com/refresh-token", {
    token: storedRefreshToken,
  });

  const newAccessToken = response.data.accessToken;
  await SecureStore.setItemAsync("token", newAccessToken);

  return newAccessToken;
};

// Intercept requests and attach the access token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercept responses to handle token expiration (401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 error) and retry logic
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevents infinite retry loop

      try {
        // Try to refresh the access token
        const newToken = await refreshToken();

        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry the request with the new token
      } catch (refreshError) {
        // If refreshing the token fails, log the user out
        logout(); // Call the logout function from authService
        return Promise.reject(refreshError);
      }
    }

    // If the error isn't related to token expiration, just reject the error
    return Promise.reject(error);
  },
);

export default axiosInstance;
