import axios from "axios";
import * as SecureStore from "expo-secure-store";

const axiosInstance = axios.create({
  baseURL: "https://rtt.rideburro.com", // Base URL for all API requests
  timeout: 10000, // Optional: Set a request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for request/response
axiosInstance.interceptors.request.use(
  async (config) => {
    // Fetch the token from SecureStore
    const token = await SecureStore.getItemAsync("token");

    // If a token is found, add it to the request headers
    if (token) {
      console.log("Token: ", token);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle the error before the request is sent
    return Promise.reject(error);
  },
);
export default axiosInstance;
