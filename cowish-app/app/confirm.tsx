import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";

export default function ConfirmPage() {
  const { code } = useLocalSearchParams();

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>Here is your friend</ThemedText>
      <ThemedText>Code: {code}</ThemedText>
    </ThemedView>
  );
}
