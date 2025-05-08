// app/confirm.tsx
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { View, Button } from "react-native";
import TagButton from "@/components/TagButton";
import { useState } from "react";

export default function ConfirmPage() {
  const { code } = useLocalSearchParams(); // get code from route
  const [selectedTag, setSelectedTag] = useState("");
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ThemedText type="title">Added name here</ThemedText>

      {/* Later: fetch and show user/group profile info here */}

      <ThemedText style={{ marginTop: 20 }}>Choose tag:</ThemedText>

      {/* Replace with tag selection later */}
      <TagButton
        label="Friend"
        color="#0a7ea4"
        selected={selectedTag === "Friend"}
        onPress={() => setSelectedTag("Friend")}
      />

      <TagButton
        label="Family"
        color="#2ecc71"
        selected={selectedTag === "Family"}
        onPress={() => setSelectedTag("Family")}
      />

      <TagButton
        label="Co-worker"
        color="#e67300"
        selected={selectedTag === "Co-worker"}
        onPress={() => setSelectedTag("Co-worker")}
      />

      <TagButton
        label="Significant Other"
        color="#d6336c"
        selected={selectedTag === "Significant Other"}
        onPress={() => setSelectedTag("Significant Other")}
      />
    </ThemedView>
  );
}
