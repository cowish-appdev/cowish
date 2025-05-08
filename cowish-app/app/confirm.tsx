// app/confirm.tsx
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { View, Button, StyleSheet } from "react-native";
import TagButton from "@/components/TagButton";
import { useState } from "react";

export default function ConfirmPage() {
  const { code } = useLocalSearchParams(); // get code from route
  const [selectedTag, setSelectedTag] = useState("");

  const tags = [
    { label: "Friend", color: "#0a7ea4" },
    { label: "Family", color: "#2ecc71" },
    { label: "Co-worker", color: "#e67300" },
    { label: "Significant Other", color: "#d6336c" },
  ];
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Added name here</ThemedText>

      {/* Later: fetch and show user/group profile info here */}

      <ThemedText style={{ marginTop: 20, marginBottom: 10 }}>
        Choose tag:
      </ThemedText>

      {/* Replace with tag selection later */}

      <ThemedView style={styles.tagGrid}>
        {tags.map((tag) => (
          <TagButton
            key={tag.label}
            label={tag.label}
            color={tag.color}
            selected={selectedTag === tag.label}
            onPress={() => setSelectedTag(tag.label)}
            onDoublePress={() => {
              setSelectedTag(tag.label); // just in case
              router.push("/(tabs)/shared");
            }}
          />
        ))}
      </ThemedView>
      {/* <TagButton
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
      /> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 20,
    rowGap: 4,
    width: 500, // adjust if needed to force 2 tags per row
  },
});
