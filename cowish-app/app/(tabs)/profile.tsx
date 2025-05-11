import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { router,useLocalSearchParams } from "expo-router";
import WishlistItem from "@/components/WishListItem";
import { Background } from "@react-navigation/elements";
import { User } from "@/interface";
import getUserById from "@/components/getUserById";
import imageMap from "@/assets/imageMap";
import { useUser } from "../_layout";


export default function ProfileScreen() {
  const { userAcc, setUserAcc} = useUser()
  const[loading,setLoading] = useState(true);
  const theme = useColorScheme();
  const background = theme === "dark" ? "#1e1e1e" : "#ffffff";
  const textColor = theme === "dark" ? "#e1e1e1" : "#000000";
  const profilePic = userAcc && userAcc?.profile_pic ? imageMap[userAcc?.profile_pic]||require('@/assets/images/default.jpg'):require('@/assets/images/default.jpg');

  const [wishlist, setWishlist] = useState([
    { name: "Whiskey Stones", desc: "Reusable ice cubes", completed: false },
    { name: "Tom Ford Oud Wood", desc: "Luxury fragrance", completed: false },
    { name: "Codenames Game", desc: "Fun party game", completed: false },
  ]);
  const handleToggleComplete = (index: number) => {
    setWishlist((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  
  
  useEffect(()=>{
    if(userAcc){
      setLoading(false)
    }
  },[userAcc])
  return (
    <View>{
      loading ? (
        <Text>Loading...</Text>
      ) : 
      <ScrollView contentContainerStyle={styles.container}>
      {/* Left Column */}

      <View style={styles.leftColumn}>
        {/* Profile Card */}
        <View style={[styles.card, { backgroundColor: background }]}>
          <Text style={[styles.name, { color: textColor }]}>
            {userAcc?.username ?? ''}
          </Text>
          <Image
            source={profilePic}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={[styles.email, { color: textColor }]}>
            { userAcc?.email ?? ''}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/EditProfile`)}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Share Code Card */}
        <View style={[styles.card, { backgroundColor: background }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Your Share Code
          </Text>
          <Text style={[styles.codeText, { color: textColor }]}>{userAcc?.code ?? '######'}</Text>
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
              onToggle={() => handleToggleComplete(index)}
            />
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>

            <TextInput
              placeholder="Item name"
              style={styles.input}
              value={newItemName}
              onChangeText={setNewItemName}
            />
            <TextInput
              placeholder="Description"
              style={[styles.input, { height: 80 }]}
              value={newItemDesc}
              onChangeText={setNewItemDesc}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  if (newItemName.trim()) {
                    setWishlist((prev) => [
                      ...prev,
                      {
                        name: newItemName,
                        desc: newItemDesc,
                        completed: false,
                      },
                    ]);
                    setNewItemName("");
                    setNewItemDesc("");
                    setModalVisible(false);
                  }
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    }
    </View>
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
    height:"50%",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "85%",
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#e1e1e1",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: "#e1e1e1",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  saveButton: {
    backgroundColor: "#ffa500",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cancelText: {
    color: "#888",
    paddingHorizontal: 12,
  },
});
