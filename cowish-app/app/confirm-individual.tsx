// app/confirm.tsx
import React from 'react'
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, Animated, Image, Easing } from "react-native";
import TagButton from "@/components/TagButton";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import getUserByCode from '@/components/getUserByCode';
import { User } from "@/interface";
import imageMap from "@/assets/imageMap";
import { useUser } from './_layout';
import addRelationship from '@/components/addRelationship';

export default function ConfirmPage() {
  const { userAcc, setUserAcc} = useUser()
  const[loading,setLoading] = useState(true);
  const { code } = useLocalSearchParams();
  const userCode = Array.isArray(code) ? code[0] : code ?? '';
  const [user, setUser] = useState<User|null>(null);
  const [selectedTag, setSelectedTag] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const profilePic = user && user.profile_pic ? imageMap[user.profile_pic]||require('@/assets/images/default.jpg'):require('@/assets/images/default.jpg');


  const tags = [
    { label: "Friend", color: "#0a7ea4",value:"friend"},
    { label: "Family", color: "#2ecc71",value:"family" },
    { label: "Co-worker", color: "#e67300",value:"coworker" },
    { label: "Significant Other", color: "#d6336c",value:"significant-other" },
  ];
  

  const handleHoldConfirm = (label: string) => {
    setSelectedTag(label);
    addRelationship(userAcc?.uuid??'',user?.uuid??'',label)
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
  useEffect(()=>{
      if(userAcc){
        setLoading(false)
      }
    },[userAcc])
  useEffect(()=>{
    getUserByCode(userCode, setUser)
  },[])
  return (
    <ThemedView style={styles.container}>

      <ThemedText>{userAcc?.username}</ThemedText>
      <ThemedText type="title">{user ? user.username: ''}</ThemedText>
      { user && (
        <Image
          source={profilePic} 
          style={styles.profileImage}
        />
      )}
      <ThemedText style={{ marginTop: 20, marginBottom: 10 }}>
        Choose Tag (Hold to Confirm)
      </ThemedText>

      <ThemedView style={styles.tagGrid}>
        {tags.map((tag) => (
          <TagButton
            key={tag.label}
            label={tag.label}
            color={tag.color}
            selected={selectedTag === tag.value}
            onPress={() => setSelectedTag(tag.value)}
            onHoldConfirm={() => handleHoldConfirm(tag.value)}
          />
        ))}
      </ThemedView>

      {showPopup && (
        <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
          <Ionicons name="checkmark-circle" size={28} color="#2fcc71" />
          <ThemedText type="subtitle" style={{ marginLeft: 5, color: "#000" }}>
            You’ve added a new friend!
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
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 20,
    rowGap: 8,
    width: 500,
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
  },
  profileImage: {
    width: 100,  // Set width
    height: 100, // Set height
    borderRadius: 50,  // To make it circular
    marginTop: 10,  // Add some space below the text
  },
});
