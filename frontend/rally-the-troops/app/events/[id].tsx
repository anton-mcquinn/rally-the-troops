import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router"; // Use useLocalSearchParams
import { getEventById } from "../../services/eventApi"; // Assuming you have this API call
import { Event } from "../../types"; // Your Event type

const EventDetails = () => {
  const { id } = useLocalSearchParams(); 
  const [event, setEvent] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id); 
        setEvent(eventData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View>
      <Stack.Screen
        options={{ title: event.title, }}
        />
      <Text>Description: {event.description}</Text>
      <Text>Date: {event.date}</Text>
      <Text>Location: {event.location}</Text>
      <Text>Activity: {event.activity}</Text>
      <Text>Event Creator: {event.createdBy}</Text>
    </View>
  );
};

export default EventDetails;

