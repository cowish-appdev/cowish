import { useState } from "react";
import { TextInput, Button, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AddButton from "@/components/AddButton";

export default function AddPage() {
  const [code, setCode] = useState("");

  const handleAdd = () => {
    alert(`You entered: ${code}`);
    // Later: confirm person or group, and apply tag
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
