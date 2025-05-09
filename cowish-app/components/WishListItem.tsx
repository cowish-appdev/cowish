import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function WishlistItem({ item, onDelete, theme }: any) {
  const textColor = theme === "dark" ? "#e1e1e1" : "#000000";
  const descColor = theme === "dark" ? "#aaa" : "#555";
  const bgColor = theme === "dark" ? "#2c2c2c" : "#f0f0f0";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.textBlock}>
        <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>
        <Text style={[styles.desc, { color: descColor }]}>{item.desc}</Text>
      </View>
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
