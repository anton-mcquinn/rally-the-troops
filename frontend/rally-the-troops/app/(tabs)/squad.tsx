import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store"; // For secure storage
import { getSquad } from "../../services/squadApi";

const SquadScreen = () => {
  const [friendEmail, setFriendEmail] = useState(""); // For inputting friend ID
  const [squad, setSquad] = useState([]); // List of current squad members
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // To show success/error messages
  const [userId, setUserId] = useState<string | null>(null); // User ID from SecureStore

  // Fetch user ID from SecureStore on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await SecureStore.getItemAsync("user_id");
      setUserId(storedUserId); // Save the user ID in state
    };
    fetchUserId();
  }, []);

  // Fetch squad data
  useEffect(() => {
    const fetchSquad = async (userId: string | null) => {
      try {
        const squadData = await getSquad(userId);
        setSquad(squadData); // Assuming API returns squad list in response.data.squad
      } catch (error) {
        console.error("Error fetching squad:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchSquad(userId);
    }
  }, [userId]);

  // Handle sending a friend request
  const handleSendRequest = async () => {
    if (!friendEmail) {
      setMessage("Please enter a friend's email.");
      return;
    }

    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      await axios.post(
        `/squad/send-request`,
        { userId, friendEmail }, // Send friend request
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessage("Friend request sent successfully!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      setMessage("Failed to send friend request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Squad</Text>
      {loading ? <Text>Loading...</Text> : null}
      <FlatList
        data={squad}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.squadItem}>
            <Text>{item.username}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />

      <Text style={styles.title}>Send a Friend Request</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Friend ID"
        value={friendEmail}
        onChangeText={setFriendEmail}
      />
      <Button title="Send Request" onPress={handleSendRequest} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  squadItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default SquadScreen;
