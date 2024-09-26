import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createEvent } from "../../services/eventApi";
import * as SecureStore from "expo-secure-store";

const CreateEventScreen = () => {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // You can later integrate a date picker
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("");
  const [invitees, setInvitees] = useState(""); // This could be a comma-separated string of emails or IDs
  const [loading, setLoading] = useState(false);
  const [createdBy, setCreatedBy] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync("userId");
      setCreatedBy(userId);
    };
    fetchUserId();
  }, []);

  const handleCreateEvent = async () => {
    if (!title || !description || !date || !location || !activity) {
      Alert.alert("Please fill in all fields");
      return;
    }

    // Prepare invitees (split comma-separated string)
    const inviteesArray = invitees.split(",").map((email) => email.trim());

    const newEvent = {
      title,
      description,
      date,
      location,
      activity,
      createdBy,
      invitees: inviteesArray,
    };

    setLoading(true);
    try {
      // Make the API call to create an event
      const response = await createEvent(newEvent);
      console.log("Event Created: ", response);
      Alert.alert("Event created successfully");
      router.push("/(tabs)/events"); // Navigate back to events list
    } catch (error) {
      console.error("Failed to create event: ", error);
      Alert.alert("Error creating event", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Activity"
        value={activity}
        onChangeText={setActivity}
      />
      <TextInput
        style={styles.input}
        placeholder="Invitees (comma-separated emails)"
        value={invitees}
        onChangeText={setInvitees}
      />

      <Button
        title={loading ? "Creating..." : "Create Event"}
        onPress={handleCreateEvent}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default CreateEventScreen;
