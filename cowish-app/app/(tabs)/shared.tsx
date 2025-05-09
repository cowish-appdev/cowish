import React from "react";
import { View, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { PersonButton, PeopleButton} from "@/components/personButton";

export default function SharedPage() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText lightColor="#000000">Which wish lists are you looking for?</ThemedText>
      <ThemedView
        style = {{flexDirection:'row',justifyContent:'space-around'}}
      >
        <PersonButton onPress={()=>alert('Person icon pressed!')}/>
        <PeopleButton onPress={()=>alert('People icon pressed!')}/>
      </ThemedView>
    </ThemedView>
  );
}
