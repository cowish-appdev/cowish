import { useEffect, useState } from "react";
import React from "react";
import { TextInput, Button, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AddButton from "@/components/AddButton";
import { router } from "expo-router";
import { useRouter } from "expo-router";

export default function AddPage() {
  const [code, setCode] = useState("");

  const router = useRouter();

  const handleAdd = () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    const firstChar = trimmedCode.charAt(0).toLowerCase();
    const length = trimmedCode.length;

    if (firstChar === "g" && length === 7) {
      router.push(`../confirm-group?code=${trimmedCode}`);
    } else if (length === 6) {
      router.push(`../confirm-individual?code=${trimmedCode}`);
    } else {
      alert("Invalid code format.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Insert Code Here
      </ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Enter code"
        value={code}
        onChangeText={setCode}
        placeholderTextColor="#999"
        returnKeyLabel="done"
        onSubmitEditing={handleAdd}
      />

      <AddButton onPress={handleAdd} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  input: {
    width: "55%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "white",
    marginBottom: 10,
  },
  button: {},
});
