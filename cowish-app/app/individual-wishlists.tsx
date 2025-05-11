import { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import FilterTabs from "@/components/filterButton";
import WishlistsPage from "@/components/showWishlists";

export default function IndividualListPage() {
  const [filter, setFilter] = useState("All");

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedText style={{ fontSize: 24, margin: 30 }}>
        Your Friend's Wish Lists
      </ThemedText>

      <FilterTabs selected={filter} onSelect={setFilter} />

      <WishlistsPage filter={filter} />
    </ThemedView>
  );
}
