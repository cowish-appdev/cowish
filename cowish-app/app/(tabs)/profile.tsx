import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View, Text, Button } from "react-native";

export default function ProfilePage() {
  return (
    <ThemedView style={styles.container}>
      {/* Left Side */}
      <View style={styles.leftColumn}>
        <ThemedText style={styles.name}>Name</ThemedText>
        
        <View style={styles.editButton}>
          <Button title="Edit" />
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.rightColumn}>
      <View style={styles.codeLabelContainer}>
      <ThemedText style={styles.codeLabel}>Code: </ThemedText>
 </View>
      <View style={styles.wishlistBox}>
      <ThemedText style={styles.wishlistHeader}>Wishlists</ThemedText>
      <ThemedText>• New headphones</ThemedText>
      <ThemedText>• Travel bag</ThemedText>
      <ThemedText>• Yoga mat</ThemedText>
          {/* Add Button at the bottom-right */}
    <View style={styles.addButton}>
      <Button title="Add" onPress={() => console.log("Add item")} />
    </View>
  </View>
</View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    justifyContent: "flex-start", // align items to start
    alignItems: "flex-start",     // align to top
    gap: 16,                     // space between columns
  },
  leftColumn: {
    flex: 1,               // equal width as right column
    alignItems: "center",  // center the content inside
  },
  rightColumn: {
    flex: 1,               // equal width as left column
    alignItems: "flex-start",
  },
  
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ccc", // fallback color
  },
  editButton: {
    marginTop: 8,
    alignSelf: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  wishlistBox: {
    backgroundColor: "#f0f0f0", // or use themed color
    borderRadius: 12,            // rounded corners
    padding: 16,
    width: "100%",
    borderWidth: 2,             // adds border width
    borderColor: "#ccc",        // border color (light gray)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,               // for Android shadow
  },
  
  codeLabelContainer: {
    marginBottom: 24,
    alignItems: "center"
  },
  wishlistHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  codeLabel: {
    fontSize: 32,
    fontWeight: "500",
    color: "#333",
  },
  addButton: {
    marginTop: 16,
    alignSelf: "flex-end",
  },

});