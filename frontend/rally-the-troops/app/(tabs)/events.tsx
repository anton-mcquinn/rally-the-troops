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
import { Event } from "../../types"; // Your Event type
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons"; // For arrow icons

const EventsScreen = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null); // Track the expanded event ID
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
        setEvents(eventsData);
        console.log(eventsData);
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

  const toggleExpand = (eventId: string) => {
    // Toggle expansion of the event
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const renderEventDetails = (event: Event) => {
    if (expandedEventId !== event._id) {
      return null;
    }
    return (
      <View style={styles.eventDetails}>
        <Text>Description: {event.description}</Text>
        <Text>Activity: {event.activity}</Text>
        <Text>Date: {event.date}</Text>
        <Text>Location: {event.location}</Text>
        <Text>Invitees: {event.invitees.join(", ")}</Text>
        {event.attendees && (
          <Text>Attendees: {event.attendees.join(", ")}</Text>
        )}
        {event.declined && <Text>Declined: {event.declined.join(", ")}</Text>}
        <Text>Created By: {event.createdBy || "Unknown"}</Text>
        {/* Add any additional event details you want to show here */}
      </View>
    );
  };

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
            <View style={styles.eventRow}>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.date}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleExpand(item._id)}
                style={styles.arrowIcon}
              >
                <MaterialIcons
                  name={
                    expandedEventId === item._id
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            {renderEventDetails(item)}
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
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowIcon: {
    padding: 8,
  },
  eventDetails: {
    marginTop: 8,
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 4,
  },
});

export default EventsScreen;
