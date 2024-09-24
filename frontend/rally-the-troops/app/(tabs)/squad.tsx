import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SquadScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Squad Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SquadScreen;
