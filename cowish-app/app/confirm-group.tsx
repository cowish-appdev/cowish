import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, Animated, View, Easing } from "react-native";
import TagButton from "@/components/TagButton";
import { useState, useRef, useEffect } from "react";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Groups } from "@/interface";
import getGroupByCode from "@/components/getGroupByCode";
import { useUser } from "./_layout";
import joinGroup from "@/components/joinGroup";
import imageMap from "@/assets/imageMap";

export default function ConfirmGroupPage() {
  const { userAcc, setUserAcc} = useUser()
  const[loading,setLoading] = useState(true);
  const { code } = useLocalSearchParams();
  const groupCode = Array.isArray(code) ? code[0] : code ?? '';
  const [group,setGroup] = useState<Groups|null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const profilePic = group && group.profile_pic ? imageMap[group.profile_pic]||require('@/assets/images/default.jpg'):require('@/assets/images/default.jpg');

  useEffect(()=>{
    getGroupByCode(groupCode,setGroup)
  },[groupCode])

  const handleHoldConfirm = () => {
    setIsSelected(true);
    joinGroup(groupCode,userAcc?.uuid??'')
    setShowPopup(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowPopup(false);
        router.push("/(tabs)/shared");
      });
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{group?.name?? ''}</ThemedText>
      { group && (
              <Image
                source={profilePic} 
                style={styles.profileImage}
              />
            )}

      <TagButton
        label="Join"
        color="#0a7ea4"
        selected={isSelected}
        onPress={() => setIsSelected(true)}
        onHoldConfirm={handleHoldConfirm}
      />
      <ThemedText style={styles.note}>Hold to Join</ThemedText>

      {showPopup && (
        <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
          <Ionicons name="checkmark-circle" size={28} color="#2ecc71" />
          <ThemedText type="subtitle" style={{ marginLeft: 5, color: "#000" }}>
            {userAcc?.username} joined the group!
          </ThemedText>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  note: {
    fontSize: 12,
    marginTop: 8,
  },
  popup: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    color: "black",
  },
  profileImage: {
    width: 100,  // Set width
    height: 100, // Set height
    borderRadius: 50,  // To make it circular
    marginTop: 10,  // Add some space below the text
  },
});
