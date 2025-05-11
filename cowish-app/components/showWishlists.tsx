import {
  FlatList,
  Image,
  StyleSheet,
  View,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";

const mockUsers = [
  {
    user_id: "u1",
    username: "Fin",
    profile_pic: "https://i.pravatar.cc/150?img=32",
    wishlist_id: "w101",
    item_count: 5,
    tag: "Friends",
  },
  {
    user_id: "u2",
    username: "Fah",
    profile_pic: "https://i.pravatar.cc/150?img=12",
    wishlist_id: "w102",
    item_count: 4,
    tag: "Family",
  },
  {
    user_id: "u3",
    username: "Boom",
    profile_pic: "https://i.pravatar.cc/150?img=65",
    wishlist_id: "w103",
    item_count: 7,
    tag: "Friends",
  },
  {
    user_id: "u4",
    username: "Ling",
    profile_pic: "https://i.pravatar.cc/150?img=25",
    wishlist_id: "w104",
    item_count: 7,
    tag: "Coworkers",
  },
  {
    user_id: "u3",
    username: "Boom",
    profile_pic: "https://i.pravatar.cc/150?img=65",
    wishlist_id: "w103",
    item_count: 7,
    tag: "Friends",
  },
];

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const containerPaddingHorizontal = 20;
const cardMarginHorizontal = 6;
const availableWidth = screenWidth - containerPaddingHorizontal * 2;
const cardWidth = availableWidth / numColumns - cardMarginHorizontal * 2;

export default function FriendList({ filter }: { filter: string }) {
  const theme = useColorScheme();
  const filteredUsers =
    filter === "All" ? mockUsers : mockUsers.filter((u) => u.tag === filter);

  const renderCard = ({ item }: { item: (typeof mockUsers)[0] }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme === "dark" ? "#2c2c2c" : "#f1f1f1",
        },
      ]}
    >
      <Image source={{ uri: item.profile_pic }} style={styles.avatar} />
      <ThemedText
        style={[styles.username, { color: theme === "dark" ? "#fff" : "#111" }]}
      >
        {item.username}
      </ThemedText>
      <ThemedText
        style={[
          styles.itemCount,
          { color: theme === "dark" ? "#aaa" : "#555" },
        ]}
      >
        {item.item_count} items
      </ThemedText>
      <TouchableOpacity
        onPress={() => router.push(`/wishlist/${item.wishlist_id}`)}
        style={styles.button}
      >
        <ThemedText style={styles.buttonText}>View Wishlist →</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.user_id}
        renderItem={renderCard}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: containerPaddingHorizontal,
  },
  card: {
    width: cardWidth,
    margin: cardMarginHorizontal,
    backgroundColor: "#2c2c2c",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  row: {
    justifyContent: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
