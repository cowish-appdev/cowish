// app/group/[id].tsx
import {
  View,
  StyleSheet,
  Image,
  useColorScheme,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Modal,
  ColorValue,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import getGroupWishlistInfo from "@/components/getGroupWishlistInfo";
import { GroupWishlistInfo, wishlist } from "@/interface";
import imageMap from "@/assets/imageMap";
import checkOffItem from "@/components/checkOffItem";
import editWishlist from "@/components/editWishlist";
import createGroup from "@/components/createGroup";
import createWishlistGroup from "@/components/createWishlistGroup";

const { width } = Dimensions.get("window");

export default function GroupPage() {
  const { id } = useLocalSearchParams();
  const groupId = Array.isArray(id) ? id[0] : id ?? "";
  //const group = sampleGroups.find((g) => g.id === id) || sampleGroups[0]; // Default to first group if not found
  const theme = useColorScheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [expandedWishlist, setExpandedWishlist] = useState<string | null>(null);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [addWishlistModalVisible, setAddWishlistModalVisible] = useState(false);
  const [currentWishlistId, setCurrentWishlistId] = useState<string | null>(
    null
  );
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");

  const [newWishlistName, setNewWishlistName] = useState("");
  const [newWishlistDescription, setNewWishlistDescription] = useState("");
  //const [wishlists, setWishlists] = useState(group?.wishlists || []);
  const [groupWishlists, setGroupWishlists] =
    useState<GroupWishlistInfo | null>(null);
  const profilePic =
    groupWishlists?.profile_pic && groupWishlists?.profile_pic
      ? imageMap[groupWishlists?.profile_pic] ||
        require("@/assets/images/default.jpg")
      : require("@/assets/images/default.jpg");

  useEffect(() => {
    getGroupWishlistInfo(groupId, setGroupWishlists);
  }, []);

  const isDark = theme === "dark";
  const colors = useMemo(() => {
    const headerGradient: [ColorValue, ColorValue, ColorValue] = isDark
      ? ["rgba(0,0,0,0.9)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]
      : [
          "rgba(247,247,247,0.9)",
          "rgba(247,247,247,0.6)",
          "rgba(247,247,247,0)",
        ];
    const buttonGradient: [ColorValue, ColorValue, ColorValue] = isDark
      ? ["#7047eb", "#4F46E5", "#3832a8"]
      : ["#6366F1", "#4F46E5", "#4338CA"];

    return {
      headerGradient,
      buttonGradient,
      background: isDark ? "#000" : "#f7f7f7",
      textPrimary: isDark ? "#fff" : "#111",
      textSecondary: isDark ? "#a0a0a0" : "#6e6e6e",
      card: isDark ? "rgba(30, 30, 33, 0.8)" : "rgba(255, 255, 255, 0.85)",
      cardBorder: isDark ? "#2c2c2e" : "#e1e1e1",
      checkboxEmpty: isDark ? "#3a3a3c" : "#d1d1d6",
      checkboxFilled: isDark ? "#4F46E5" : "#4F46E5",
      cardShadow: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
      addItemButton: isDark ? "#2c2c2e" : "#f2f2f2",
      modalBackground: isDark ? "#1c1c1e" : "#ffffff",
      input: isDark ? "#2c2c2e" : "#f2f2f2",
      inputText: isDark ? "#ffffff" : "#000000",
      divider: isDark ? "#2c2c2e" : "#e1e1e1",
      completed: isDark ? "#505050" : "#a0a0a0",
    };
  }, [isDark]);

  // Header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [250, 70],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Toggle wishlist expansion
  const toggleWishlist = (wishlistId: string) => {
    setExpandedWishlist(expandedWishlist === wishlistId ? null : wishlistId);
  };

  // Toggle item completion
  const toggleItemCompletion = async (wishlistId: string, itemId: string) => {
    const currentWishlist = groupWishlists?.wishlists.find(
      (w) => w.id === wishlistId
    );
    const item = currentWishlist?.items.find((i) => i.id === itemId);
    if (!item) return;

    await checkOffItem(itemId, item.completed);
    await getGroupWishlistInfo(groupId, setGroupWishlists);
  };

  // Open add item modal
  const openAddItemModal = (wishlistId: string) => {
    setCurrentWishlistId(wishlistId);
    setNewItemName("");
    setAddItemModalVisible(true);
  };

  // Add new item
  const addNewItem = async () => {
    if (newItemName.trim() === "" || !currentWishlistId) return;
    //const currentWishlist = groupWishlists?.wishlists.find((w) => w.id === currentWishlistId);
    await editWishlist(currentWishlistId, newItemName, newItemDescription);
    await getGroupWishlistInfo(groupId, setGroupWishlists);
    setAddItemModalVisible(false);
    setNewItemName("");
    setNewItemDescription("");
  };

  // Add new wishlist
  const addNewWishlist = async () => {
    if (newWishlistName.trim() === "") return;
    const newWishlist = await createWishlistGroup(
      groupId,
      newWishlistName,
      newWishlistDescription
    );
    await getGroupWishlistInfo(groupId, setGroupWishlists);
    //setWishlists((currentWishlists) => [...currentWishlists, newWishlist]);
    setAddWishlistModalVisible(false);
    setNewWishlistName("");
    setNewWishlistDescription("");

    // Automatically expand the new wishlist
    setTimeout(() => {
      setExpandedWishlist(newWishlist.id);
    }, 300);
  };

  // Calculate progress for each wishlist
  const getWishlistProgress = (
    items: { id: string; name: string; completed: boolean }[]
  ) => {
    if (!items || items.length === 0) return 0;
    const completedItems = items.filter((item) => item.completed).length;
    return (completedItems / items.length) * 100;
  };

  if (!groupId) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>Group not found.</ThemedText>
        <TouchableOpacity
          style={styles.backToHomeButton}
          onPress={() => router.replace("/")}
        >
          <ThemedText style={styles.backToHomeText}>Back to Home</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={colors.headerGradient}
          style={styles.headerGradient}
          pointerEvents="none"
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Animated.View
          style={[styles.headerTitle, { opacity: headerTitleOpacity }]}
        >
          <ThemedText
            style={[styles.headerTitleText, { color: colors.textPrimary }]}
          >
            {groupWishlists?.name ?? ""}
          </ThemedText>
        </Animated.View>

        <Animated.View
          style={[
            styles.profileContainer,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <Image source={profilePic} style={styles.groupImage} />
          <ThemedText style={[styles.groupName, { color: colors.textPrimary }]}>
            {groupWishlists?.name ?? ""}
          </ThemedText>
          <ThemedText
            style={[styles.groupMeta, { color: colors.textSecondary }]}
          >
            {groupWishlists?.memberCount ?? 0} members
          </ThemedText>
        </Animated.View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 260 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.sectionHeaderContainer}>
          <ThemedText
            style={[styles.sectionTitle, { color: colors.textPrimary }]}
          >
            Wishlists
          </ThemedText>
          <TouchableOpacity
            style={styles.addWishlistButton}
            onPress={() => setAddWishlistModalVisible(true)}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={colors.textPrimary}
            />
            <ThemedText
              style={[styles.addWishlistText, { color: colors.textPrimary }]}
            >
              New Wishlist
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Wishlists */}
        {groupWishlists?.wishlists.map((wishlist) => {
          const progress = getWishlistProgress(wishlist.items);
          const isExpanded = expandedWishlist === wishlist.id;

          return (
            <View
              key={wishlist.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  shadowColor: colors.cardShadow,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.wishlistHeader}
                onPress={() => toggleWishlist(wishlist.id)}
                activeOpacity={0.7}
              >
                <View style={styles.wishlistTitleContainer}>
                  <ThemedText
                    style={[styles.cardTitle, { color: colors.textPrimary }]}
                  >
                    {wishlist.title}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.cardDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {wishlist.description}
                  </ThemedText>
                </View>

                <View style={styles.wishlistHeaderRight}>
                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { backgroundColor: colors.checkboxEmpty },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progress}%`,
                            backgroundColor: colors.checkboxFilled,
                          },
                        ]}
                      />
                    </View>
                    <ThemedText
                      style={[
                        styles.progressText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {Math.round(progress)}%
                    </ThemedText>
                  </View>

                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.wishlistContent}>
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: colors.divider },
                    ]}
                  />

                  {wishlist && wishlist.items.length > 0 ? (
                    wishlist.items.map((item) => (
                      <TouchableOpacity
                        style={styles.itemContainer}
                        onPress={() =>
                          toggleItemCompletion(wishlist.id, item.id)
                        }
                        activeOpacity={0.7}
                      >
                        <TouchableOpacity
                          style={[
                            styles.checkbox,
                            {
                              backgroundColor: item.completed
                                ? colors.checkboxFilled
                                : "transparent",
                              borderColor: item.completed
                                ? colors.checkboxFilled
                                : colors.checkboxEmpty,
                            },
                          ]}
                          onPress={() =>
                            toggleItemCompletion(wishlist.id, item.id)
                          }
                        >
                          {item.completed && (
                            <Ionicons name="checkmark" size={14} color="#fff" />
                          )}
                        </TouchableOpacity>

                        <View style={{ flex: 1 }}>
                          <ThemedText
                            style={[
                              styles.itemText,
                              {
                                color: item.completed
                                  ? colors.completed
                                  : colors.textPrimary,
                                textDecorationLine: item.completed
                                  ? "line-through"
                                  : "none",
                              },
                            ]}
                          >
                            {item.name}
                          </ThemedText>

                          {item.description ? (
                            <ThemedText
                              style={[
                                styles.itemDescription,
                                {
                                  color: colors.textSecondary,
                                  textDecorationLine: item.completed
                                    ? "line-through"
                                    : "none",
                                },
                              ]}
                            >
                              {item.description}
                            </ThemedText>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <ThemedText
                      style={[
                        styles.emptyText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      No items yet
                    </ThemedText>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.addItemButton,
                      { backgroundColor: colors.addItemButton },
                    ]}
                    onPress={() => openAddItemModal(wishlist.id)}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color={colors.textSecondary}
                    />
                    <ThemedText
                      style={[
                        styles.addItemText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Add Item
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addItemModalVisible}
        onRequestClose={() => setAddItemModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={90}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.modalBackground },
            ]}
          >
            <View style={styles.modalHeader}>
              <ThemedText
                style={[styles.modalTitle, { color: colors.textPrimary }]}
              >
                Add New Item
              </ThemedText>
              <TouchableOpacity
                onPress={() => setAddItemModalVisible(false)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  color: colors.inputText,
                },
              ]}
              placeholder="Item name"
              placeholderTextColor={colors.textSecondary}
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  color: colors.inputText,
                  height: 80,
                  textAlignVertical: "top",
                  paddingTop: 12,
                },
              ]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newItemDescription}
              onChangeText={setNewItemDescription}
              multiline={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddItemModalVisible(false)}
              >
                <ThemedText
                  style={[styles.buttonText, { color: colors.textSecondary }]}
                >
                  Cancel
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.addButton,
                  { opacity: newItemName.trim() === "" ? 0.5 : 1 },
                ]}
                onPress={addNewItem}
                disabled={newItemName.trim() === ""}
              >
                <LinearGradient
                  colors={colors.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <ThemedText style={[styles.buttonText, { color: "#fff" }]}>
                    Add Item
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Wishlist Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addWishlistModalVisible}
        onRequestClose={() => setAddWishlistModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={90}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.modalBackground },
            ]}
          >
            <View style={styles.modalHeader}>
              <ThemedText
                style={[styles.modalTitle, { color: colors.textPrimary }]}
              >
                Create New Wishlist
              </ThemedText>
              <TouchableOpacity
                onPress={() => setAddWishlistModalVisible(false)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  color: colors.inputText,
                  marginBottom: 12,
                },
              ]}
              placeholder="Wishlist name"
              placeholderTextColor={colors.textSecondary}
              value={newWishlistName}
              onChangeText={setNewWishlistName}
              autoFocus
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  color: colors.inputText,
                  height: 80,
                  textAlignVertical: "top",
                  paddingTop: 12,
                },
              ]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newWishlistDescription}
              onChangeText={setNewWishlistDescription}
              multiline={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddWishlistModalVisible(false)}
              >
                <ThemedText
                  style={[styles.buttonText, { color: colors.textSecondary }]}
                >
                  Cancel
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.addButton,
                  { opacity: newWishlistName.trim() === "" ? 0.5 : 1 },
                ]}
                onPress={addNewWishlist}
                disabled={newWishlistName.trim() === ""}
              >
                <LinearGradient
                  colors={colors.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <ThemedText style={[styles.buttonText, { color: "#fff" }]}>
                    Create Wishlist
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
  },
  backToHomeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#4F46E5",
  },
  backToHomeText: {
    color: "#fff",
    fontWeight: "600",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    zIndex: -1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },

  headerTitle: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: "600",
  },
  profileContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  groupName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 14,
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  addWishlistButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addWishlistText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wishlistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  wishlistTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
  },
  wishlistHeaderRight: {
    alignItems: "flex-end",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  wishlistContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemText: {
    fontSize: 15,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    padding: 16,
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addItemText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 10,
  },
  addButton: {
    marginLeft: 10,
    overflow: "hidden",
  },
  addButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});

/*const sampleGroups = [
  {
    id: "g123456",
    name: "Camping Crew",
    profile_pic: "https://i.pravatar.cc/100?img=8",
    memberCount: 8,
    description: "Planning our annual trip to Yosemite National Park",
    wishlists: [
      {
        id: "w001",
        title: "Tent Equipment",
        description: "All camping essentials for shelter",
        items: [
          { id: "i001", name: "4-Person Tent", completed: false },
          { id: "i002", name: "Sleeping Bags", completed: true },
          { id: "i003", name: "Inflatable Mattress", completed: false },
        ],
      },
      {
        id: "w002",
        title: "Cooking Tools",
        description: "Gas stove, pots, and utensils",
        items: [
          { id: "i004", name: "Portable Gas Stove", completed: false },
          { id: "i005", name: "Cooking Pots Set", completed: false },
          { id: "i006", name: "Camping Utensils", completed: true },
          { id: "i007", name: "Cooler", completed: false },
        ],
      },
      {
        id: "w003",
        title: "Outdoor Gear",
        description: "For activities and exploration",
        items: [
          { id: "i008", name: "Hiking Boots", completed: true },
          { id: "i009", name: "Backpacks", completed: true },
          { id: "i010", name: "Water Bottles", completed: true },
        ],
      },
    ],
  },
  {
    id: "g654321",
    name: "Office Buddies",
    profile_pic: "https://i.pravatar.cc/100?img=23",
    memberCount: 12,
    description: "Workplace team building and activities",
    wishlists: [
      {
        id: "w004",
        title: "Office Party Supplies",
        description: "For the summer event",
        items: [
          { id: "i011", name: "Decorations", completed: false },
          { id: "i012", name: "Paper Plates & Cups", completed: false },
        ],
      },
    ],
  },
];*/
