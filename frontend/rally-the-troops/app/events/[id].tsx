import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Use useLocalSearchParams
import { getEventById } from "../../services/eventApi"; // Assuming you have this API call

const EventDetails = () => {
  const { id } = useLocalSearchParams(); // Extracting the dynamic "id" from the route
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id); // Assuming you have an API to fetch event by ID
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
      <Text>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>{event.date}</Text>
      {/* More event details */}
    </View>
  );
};

export default EventDetails;

