import { router } from "expo-router";
import React, { useState } from "react";
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

const images = [
  require("../assets/images/dog1.jpg"),
  require("../assets/images/dog2.jpeg"),
  require("../assets/images/dog3.jpg"),
  //   require("../assets/images/dog4.jpg"),
  //   require("../assets/images/dog5.jpg"),

  // Add more avatar images if available
];

export default function EditProfile() {
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? "#1e1e1e" : "#ffffff";
  const textColor = theme === "dark" ? "#e1e1e1" : "#000000";

  const handleSave = () => {
    // TODO: Save name and selectedImage to your database
    router.replace("/(tabs)/profile");
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
