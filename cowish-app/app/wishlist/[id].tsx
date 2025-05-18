import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Text,
  useColorScheme,
  Image,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import getWishlistItems from "@/components/getWishlistItems";
import { WishlistItems, Wishlist } from "@/interface";
import getWishlist from "@/components/getWishlist";
import getUserById from "@/components/getUserById";
import { User } from "@/interface";
import imageMap from "@/assets/imageMap";
import checkOffItem from "@/components/checkOffItem";
const screenWidth = Dimensions.get("window").width;


const Checkbox = ({
  checked,
  onPress,
  darkMode,
}: {
  checked: boolean;
  onPress: () => void;
  darkMode: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.checkbox,
      { borderColor: darkMode ? "#777" : "#999" },
      checked && {
        backgroundColor: darkMode ? "#4a7eff" : "#7a9cf9",
        borderColor: darkMode ? "#4a7eff" : "#7a9cf9",
      },
    ]}
  >
    {checked && <Text style={styles.checkmark}>✓</Text>}
  </TouchableOpacity>
);

export default function WishlistPage() {
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const { id } = useLocalSearchParams();
  const wishlistId = Array.isArray(id) ? id[0] : id ?? '';
  const [Wishlist, setWishlist] = useState<Wishlist|null>(null)
  const [wishlistItems, setWishlistItems] = useState<WishlistItems[]|[]>([])
  //const wishlist = sampleWishlists.find((w) => w.id === id);
  const [ownerInfo, setOwnerInfo] = useState<User|null>(null)
  //const [items, setItems] = useState(wishlist?.items ?? []);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingOwner, setLoadingOwner] = useState(true);
  console.log(wishlistId)
  useEffect(()=>{
    getWishlist(wishlistId,(data:Wishlist) =>{
      setWishlist(data);
      setLoadingWishlist(false)
    })
    const fetch =async ()=>{
      const items = await getWishlistItems(wishlistId)
      setWishlistItems(items.sort((a:WishlistItems, b:WishlistItems) => {
        return a.item_id.localeCompare(b.item_id);
    }));
      setLoadingItems(false)
    }
    fetch()
  },[])
  useEffect(()=>{
    const fetchowner = async ()=>{
      if(Wishlist&&Wishlist.owner_user_id){
        const thisUser = await getUserById(Wishlist?.owner_user_id ?? '')
        setOwnerInfo(thisUser);
        setLoadingOwner(false)
      }
    }
    fetchowner()
  },[Wishlist])
  console.log("w:",Wishlist)
  console.log("owner:", ownerInfo)
  console.log("item:", wishlistItems)
  const profilePic = ownerInfo && ownerInfo.profile_pic ? imageMap[ownerInfo.profile_pic]||require('@/assets/images/default.jpg'):require('@/assets/images/default.jpg');


  const toggleCheckbox = async (item: WishlistItems) => {
      await checkOffItem(item.item_id, item.completed)
        if (Wishlist && Wishlist.id) {
          // Refetch updated items
          const items = await getWishlistItems(Wishlist.id)
          setWishlistItems(items.sort((a:WishlistItems, b:WishlistItems) => {
              return a.item_id.localeCompare(b.item_id);
          }));
      };
    }
    /*setWishlistItems((prev) =>
      prev.map((item) =>
        item.item_id === itemId ? { ...item, completed: !item.completed } : item
      )
    );*/

  
  if(loadingItems||loadingOwner||loadingWishlist||!Wishlist||!ownerInfo){
    return <ThemedText>Loading...</ThemedText>
  }
  if (!wishlistId || wishlistId === '') {
    return (
      <View style={styles.center}>
        <Text>Wishlist not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1e1e1e" : "#f2f5fa" },
      ]}
    >
      <LinearGradient
        colors={[
          isDark ? "#1e1e1e" : "#ffffff",
          isDark ? "#5046e4" : "#7a9cf9",
        ]}
        style={styles.profileHeader}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={profilePic}
            style={styles.profilePic}
          />
        </View>
        <Text style={styles.profileName}>{ownerInfo?.username}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{ownerInfo?.email}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Code</Text>
            <Text style={styles.infoValue}>{ownerInfo?.code}</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.item_id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.wishItem,
              { backgroundColor: isDark ? "#2c2c2c" : "white" },
            ]}
          >
            <View style={styles.checkboxContainer}>
              <Checkbox
                checked={item.completed}
                onPress={() => toggleCheckbox(item)}
                darkMode={isDark}
              />
            </View>
            <View style={styles.wishItemDetails}>
              <Text
                style={[
                  styles.wishItemName,
                  {
                    color: isDark ? "#eee" : "#000",
                    textDecorationLine: item.completed ? "line-through" : "none",
                  },
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.wishItemName,
                  {
                    fontSize: 13,
                    marginTop: 4,
                    color: isDark ? "#aaa" : "#555",
                    textDecorationLine: item.completed ? "line-through" : "none",
                  },
                ]}
              >
                {item.description}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    //height: "45%",
  },
  avatarContainer: { alignItems: "center", marginBottom: 10 },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "white",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 15,
    marginTop: 7,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  infoItem: {
    alignItems: "center",
    paddingHorizontal: 20,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
    marginBottom: 4,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  infoDivider: {
    height: 40,
    width: 1,
    backgroundColor: "white",
    opacity: 0.5,
    marginTop: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  wishItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    width: 70,
    height: 70,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  wishItemDetails: { flex: 1 },
  wishItemName: {
    fontSize: 16,
    fontWeight: "500",
  },
});

/*const sampleWishlists = [
  {
    id: "w101",
    user: {
      name: "Fin",
      email: "fin@example.com",
      code: "F1N2023",
      profile_pic: "https://i.pravatar.cc/150?img=32",
    },
    items: [
      { id: "1", name: "Whiskey stones", des: "Yummy", checked: false },
      { id: "2", name: "Tom Ford Oud Wood", checked: true },
      { id: "3", name: "Codenames game", checked: false },
    ],
  },
];*/
