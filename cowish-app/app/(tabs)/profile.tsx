import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import WishlistItem from "@/components/WishListItem";
import { Background } from "@react-navigation/elements";

export default function ProfileScreen() {
  const theme = useColorScheme();
  const background = theme === "dark" ? "#1e1e1e" : "#ffffff";
  const textColor = theme === "dark" ? "#e1e1e1" : "#000000";

  const [wishlist, setWishlist] = useState([
    { name: "Whiskey Stones", desc: "Reusable ice cubes" },
    { name: "Tom Ford Oud Wood", desc: "Luxury fragrance" },
    { name: "Codenames Game", desc: "Fun party game" },
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Left Column */}
      <View style={styles.leftColumn}>
        {/* Profile Card */}
        <View style={[styles.card, { backgroundColor: background }]}>
          <Text style={[styles.name, { color: textColor }]}>Sami Rahman</Text>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={[styles.email, { color: textColor }]}>
            sami.rahman002@gmail.com
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/EditProfile")}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Share Code Card */}
        <View style={[styles.card, { backgroundColor: background }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Your Share Code
          </Text>
          <Text style={[styles.codeText, { color: textColor }]}>G123456</Text>
        </View>
      </View>

      {/* Right Column */}
      <View style={styles.rightColumn}>
        <View style={[styles.card, { backgroundColor: background }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Your Wishlist
          </Text>

          {wishlist.map((item, index) => (
            <WishlistItem
              key={index}
              item={item}
              theme={theme}
              onDelete={() =>
                setWishlist((prev) => prev.filter((_, i) => i !== index))
              }
            />
          ))}

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    margin: 16,
    gap: 10,
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
    gap: 16,
  },
  rightColumn: {
    flex: 1,
    justifyContent: "flex-start",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileImage: {
    width: "85%",
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  email: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#FF6B81",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  codeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  wishlistCardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  itemTextBlock: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemDesc: {
    fontSize: 13,
    marginTop: 4,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  deleteIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B81",
  },
});
