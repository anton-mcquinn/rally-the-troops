// app/events/[id].tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter, useSearchParams } from "expo-router";

const eventDetails = {
  "1": {
    id: "1",
    title: "Event One",
    description: "Details for the first event",
  },
  "2": {
    id: "2",
    title: "Event Two",
    description: "Details for the second event",
  },
};

const EventDetailsScreen = () => {
  const router = useRouter();
  const { id } = useSearchParams(); // Get the event ID from the route

  const event = eventDetails[id];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event?.title}</Text>
      <Text>{event?.description}</Text>
      <Button title="Back to Events" onPress={() => router.back()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default EventDetailsScreen;
