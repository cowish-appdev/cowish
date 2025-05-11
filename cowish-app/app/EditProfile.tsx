import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
} from "react-native";
import imageMap from "@/assets/imageMap";
import { User } from "@/interface";
import updateProfile from "@/components/updateProfile";
import { useUser } from "./_layout";
import getUserById from "@/components/getUserById";

export default function EditProfile() {
  const images = Object.values(imageMap)
  const keys = Object.keys(imageMap)
  const { userAcc, setUserAcc} = useUser()
  const[loading,setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? "#1e1e1e" : "#ffffff";
  const textColor = theme === "dark" ? "#e1e1e1" : "#000000";
  const keyImg: string| undefined = Object.keys(imageMap).find(k => imageMap[k] === selectedImage)
  useEffect(() => {
    if (userAcc) {
      setLoading(false); // When user data is available, stop loading
    }
  }, [userAcc]);
  const handleSave = async () => {
    // TODO: Save name and selectedImage to your database
    const updated = await updateProfile(userAcc?.uuid ?? '',name,keyImg);
    setUserAcc(updated)
    router.replace(`/(tabs)/profile`);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.card, { backgroundColor }]}>
        <Text style={[styles.label, { color: textColor }]}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
          style={[
            styles.input,
            {
              color: textColor,
              borderColor: theme === "dark" ? "#444" : "#ccc",
            },
          ]}
        />

        <Text style={[styles.label, { color: textColor }]}>
          Choose Profile Image
        </Text>
        <FlatList
          horizontal
          data={images}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedImage(item)}>
              <Image
                source={item}
                style={[
                  styles.avatar,
                  item === selectedImage && styles.selected,
                ]}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 5,
  },
  selected: {
    borderWidth: 2,
    borderColor: "#FF6B81",
  },
  saveButton: {
    backgroundColor: "#FF6B81",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
