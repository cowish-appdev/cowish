import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  useColorScheme,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export const PersonIcon = ({ size = 36, color = "#3B82F6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5 -5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"
      fill={color}
    />
  </Svg>
);

export const GroupIcon = ({ size = 36, color = "#3B82F6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05C16.17 13.67 19 14.83 19 17.5V20h5v-3.5C24 14.17 19.67 13 16 13Z"
      fill={color}
    />
  </Svg>
);

export default function WishListSelection() {
  const [selected, setSelected] = useState<string | null>(null);
  const isDarkMode = useColorScheme() === "dark";

  const individualScale = useState(new Animated.Value(1))[0];
  const groupScale = useState(new Animated.Value(1))[0];

  const handleSelect = (type: string) => {
    setSelected(type);

    // Reset both animations
    Animated.spring(individualScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    Animated.spring(groupScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Animate the selected card
    if (type === "individual") {
      Animated.spring(individualScale, {
        toValue: 1.05,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(groupScale, {
        toValue: 1.05,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }

    console.log(`Selected ${type} wishlists`);
  };

  const handleContinue = () => {
    if (selected === "individual") {
      router.push("/individual-wishlists");
    } else {
      router.push("/group-wishlists");
    }
  };

  // Theme colors
  const colors = {
    background: isDarkMode ? "#121212" : "#F0F8FF",
    card: isDarkMode ? "#242424" : "#FFFFFF",
    primary: "#3B82F6", // Blue
    primaryDark: "#2563EB", // Darker blue
    iconBg: isDarkMode ? "#3B4252" : "#EBF4FF",
    text: isDarkMode ? "#FFFFFF" : "#1F2937",
    textSecondary: isDarkMode ? "#A1A1AA" : "#6B7280",
    buttonText: "#FFFFFF",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Wish Lists</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select the type of wish list you want to view
          </Text>
        </View>

        {/* Cards section */}
        <View style={styles.cardsContainer}>
          {/* Individual Wish List Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelect("individual")}
          >
            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  transform: [{ scale: individualScale }],
                  borderColor:
                    selected === "individual" ? colors.primary : "transparent",
                  borderWidth: selected === "individual" ? 2 : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.iconBg },
                ]}
              >
                <PersonIcon />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Individual Lists
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  { color: colors.textSecondary },
                ]}
              >
                View your friends’ lists
              </Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Group Wish List Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelect("group")}
          >
            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  transform: [{ scale: groupScale }],
                  borderColor:
                    selected === "group" ? colors.primary : "transparent",
                  borderWidth: selected === "group" ? 2 : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.iconBg },
                ]}
              >
                <GroupIcon />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Group Lists
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Build lists together
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        {selected && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = width > 600 ? 270 : width * 0.42;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16, // Consistent gap between cards
    marginBottom: 24,
  },
  card: {
    width: cardWidth,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 6, // Additional margin for proper spacing
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  personIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  groupIconContainer: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 20,
  },
  groupIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    marginHorizontal: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 24,
  },
  continueButton: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 29,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  arrowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    width: 14,
    height: 2,
    marginRight: -5,
  },
});
