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
import { getSquad, getPendingRequests, respondToRequest } from "../../services/squadApi"; // API calls for squad
import * as SecureStore from "expo-secure-store"; 

const SquadList = () => {
  const router = useRouter();
  const [squad, setSquad] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<string | null>(null);

  // Fetch user ID from SecureStore on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync("user_id");
      setMe(userId); // Save the user ID in state
    };

    fetchUserId();
  }, []);

  // Fetch squad and pending requests
  useEffect(() => {
    const fetchSquadData = async () => {
      try {
        setLoading(true);
        const [squadData, pendingData] = await Promise.all([getSquad(me), getPendingRequests(me)]);
        setSquad(squadData);
        setPendingRequests(pendingData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (me) {
      fetchSquadData();
    }
  }, [me]);

  // Handle accept/reject friend request
  const handleRequestResponse = async (requestId: string, action: "accepted" | "rejected") => {
    try {
      await respondToRequest(requestId, action);
      setPendingRequests(pendingRequests.filter(req => req._id !== requestId)); // Remove the processed request
      if (action === "accepted") {
        fetchSquad(); // Refresh squad if a request was accepted
      }
    } catch (error) {
      console.error("Error processing request", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Squad</Text>
      <FlashList
        data={squad}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
        estimatedItemSize={43}
      />

      <Text style={styles.title}>Pending Friend Requests</Text>
      <FlashList
        data={pendingRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.requester.name} wants to be friends!</Text>
            <Button title="Accept" onPress={() => handleRequestResponse(item._id, "accepted")} />
            <Button title="Reject" onPress={() => handleRequestResponse(item._id, "rejected")} />
          </View>
        )}
        estimatedItemSize={43}
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

export default SquadList;

