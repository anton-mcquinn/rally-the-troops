import axiosInstance from "./axiosInstance"; // Assuming you have set up axiosInstance
import { Event } from "../types"; // Define your Event type here for TypeScript support

// Get events with optional query parameters
export const getEvents = async (filters: any = {}) => {
  try {
    const response = await axiosInstance.get("/event", { params: filters });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch events");
  }
};

// Create a new event
export const createEvent = async (eventData: Event) => {
  try {
    const response = await axiosInstance.post("/event", eventData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create event");
  }
};
