import React from "react";
import { View, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function SharedPage() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText lightColor="#000000">Shared Wishlists Page</ThemedText>
    </ThemedView>
  );
}
