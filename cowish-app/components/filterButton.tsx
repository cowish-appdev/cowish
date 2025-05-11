import { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

const filters = ["All", "Friends", "Family", "Coworkers", "Significant Other"];

export default function FilterTabs({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (val: string) => void;
}) {
  const filters = [
    "All",
    "Friends",
    "Family",
    "Coworkers",
    "Significant Other",
  ];

  return (
    <ThemedView
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {filters.map((filter) => (
        <Pressable
          key={filter}
          onPress={() => onSelect(filter)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: selected === filter ? "#4F46E5" : "#E5E7EB",
            margin: 4,
          }}
        >
          <ThemedText style={{ color: selected === filter ? "#fff" : "#000" }}>
            {filter}
          </ThemedText>
        </Pressable>
      ))}
    </ThemedView>
  );
}
