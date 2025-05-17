import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, createContext, useContext,ReactNode } from "react";
import "react-native-reanimated";
import { Slot, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { User, onAuthStateChanged} from "firebase/auth";
import {auth, provider} from "./firebase";
import { User as user} from "@/interface";
import getUserById from "@/components/getUserById";



SplashScreen.preventAutoHideAsync();

type UserContextType = {
  userAcc: user | null;
  setUserAcc: React.Dispatch<React.SetStateAction<user | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [User, setUser] = useState<User|null |undefined>(undefined); // Replace with real auth state
  const [userAcc, setUserAcc] = useState<user|null>(null);
  const [loading, setLoading] = useState(true);
  const[refreshPage,setRefreshPage] = useState(0);

  // Simulate checking auth status (replace with real listener)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User|null)=>{
      if(firebaseUser){
        getUserById(firebaseUser.uid,setUserAcc)
        SplashScreen.hideAsync();
      }
      else{
        setUserAcc(null)
      }
      setLoading(false);
    })
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserContext.Provider value = {{userAcc,setUserAcc}}>{
<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {userAcc ? (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="EditProfile"/>
              <Stack.Screen name="confirm-group"/>
              <Stack.Screen name="confirm-individual"/>
              <Stack.Screen name="wishlist/[id]"/>
              <Stack.Screen name="individual-wishlists"/>
              <Stack.Screen name="group-wishlists"/>
            </>
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    }
    </UserContext.Provider>
  );
}


// Prevent the splash screen from auto-hiding before asset loading is complete.
/*SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}*/