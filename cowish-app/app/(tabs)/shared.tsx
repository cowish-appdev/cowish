import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { PersonButton, PeopleButton } from "@/components/personButton";

export default function SharedPage() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Wish Lists</ThemedText>
        <ThemedText style={styles.subtitle}>
          Select the type of wish list you want to view
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonsContainer}>
        <PersonButton
          onPress={() => console.log("Navigating to individual wishlists")}
        />

        <PeopleButton
          onPress={() => console.log("Navigating to group wishlists")}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
});
