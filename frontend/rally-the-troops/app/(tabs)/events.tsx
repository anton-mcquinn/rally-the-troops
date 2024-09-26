import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { getEvents } from "../../services/eventApi";
import { Event } from "../../types";
import * as SecureStore from "expo-secure-store";

const EventsScreen = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [me, setMe] = useState<string | null>(null);

  // Fetch user ID from SecureStore on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync("user_id");
      setMe(userId); // Save the user ID in state
    };

    fetchUserId();
  }, []);

  // Fetch events whenever filters change
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true); // Ensure loading indicator shows when fetching events
        const eventsData = await getEvents(filters);
        console.log("Filter: ", filters);
        setEvents(eventsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (me !== null) {
      fetchEvents();
    }
  }, [filters, me]); // Fetch events again if filters or user ID (me) changes

  const onPressMeFilter = () => {
    if (me) {
      setFilters({
        createdBy: me, // Filter events by current user ID
      });
    }
  };
  const onPressAllFilter = () => {
    if (me) {
      setFilters({
        $or: [{ createdBy: me }, { attendees: me }],
      });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setFilters({})}>
        <Text>DEBUG: All Events</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressAllFilter}>
        <Text>All Events</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressMeFilter}>
        <Text>My Events</Text>
      </TouchableOpacity>
      <FlashList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.date}</Text>
          </View>
        )}
        estimatedItemSize={43}
      />
      <Button
        title="Create Event"
        onPress={() => router.push("/(tabs)/create-event")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EventsScreen;
