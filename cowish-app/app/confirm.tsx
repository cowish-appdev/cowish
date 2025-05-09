// app/confirm.tsx
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
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

      <ThemedText style={{ marginTop: 20, marginBottom: 10 }}>
        Choose Tag (Hold to Confirm)
      </ThemedText>

      <ThemedView style={styles.tagGrid}>
        {tags.map((tag) => (
          <TagButton
            key={tag.label}
            label={tag.label}
            color={tag.color}
            selected={selectedTag === tag.label}
            onPress={() => setSelectedTag(tag.label)}
            onHoldConfirm={() => {
              setSelectedTag(tag.label);
              router.push("/(tabs)/shared");
            }}
          />
        ))}
      </ThemedView>
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
    rowGap: 8,
    width: 500,
  },
});
