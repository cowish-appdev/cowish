import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WishlistsPage from "@/components/showWishlists";

export default function groupListPage() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText style={{ fontSize: 24, margin: 30 }}>
        Your Group's Wishlists
      </ThemedText>
    </ThemedView>
  );
}
