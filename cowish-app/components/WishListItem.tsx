import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WishlistItems } from "@/interface";

export default function WishlistItem({ item, onDelete, onToggle, theme }: {item:WishlistItems, onDelete:any,onToggle:any,theme:any}) {
  const textColor = theme === "dark" ? "#e1e1e1" : "#000000";
  const descColor = theme === "dark" ? "#aaa" : "#555";
  const bgColor = theme === "dark" ? "#2c2c2c" : "#f0f0f0";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Checkbox */}
      <Pressable onPress={onToggle} style={styles.checkbox}>
        {item.completed ? (
          <Ionicons name="checkbox" size={20} color="#4CAF50" />
        ) : (
          <Ionicons name="square-outline" size={20} color={textColor} />
        )}
      </Pressable>

      {/* Texts */}
      <View style={styles.textBlock}>
        <Text
          style={[
            styles.name,
            {
              color: textColor,
              textDecorationLine: item.completed ? "line-through" : "none",
              opacity: item.completed ? 0.6 : 1,
            },
          ]}
        >
          {item.name}
        </Text>
        <Text style={[styles.desc, { color: descColor }]}>{item.description}</Text>
      </View>

      {/* Delete */}
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  textBlock: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  desc: {
    fontSize: 13,
    marginTop: 4,
  },
  deleteIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B81",
  },
});
