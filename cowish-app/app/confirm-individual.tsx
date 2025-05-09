// app/confirm.tsx
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, Animated, View, Easing } from "react-native";
import TagButton from "@/components/TagButton";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ConfirmPage() {
  const { code } = useLocalSearchParams();
  const [selectedTag, setSelectedTag] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const tags = [
    { label: "Friend", color: "#0a7ea4" },
    { label: "Family", color: "#2ecc71" },
    { label: "Co-worker", color: "#e67300" },
    { label: "Significant Other", color: "#d6336c" },
  ];

  const handleHoldConfirm = (label: string) => {
    setSelectedTag(label);
    setShowPopup(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowPopup(false);
        router.push("/(tabs)/shared");
      });
    }, 2000);
  };

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
            onHoldConfirm={() => handleHoldConfirm(tag.label)}
          />
        ))}
      </ThemedView>

      {showPopup && (
        <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
          <Ionicons name="checkmark-circle" size={28} color="#2fcc71" />
          <ThemedText type="subtitle" style={{ marginLeft: 5, color: "#000" }}>
            You’ve added a new friend!
          </ThemedText>
        </Animated.View>
      )}
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
  popup: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
