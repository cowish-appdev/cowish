import { Pressable, StyleSheet, Animated, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useRef } from "react";

type TagButtonProps = {
  label: string;
  color: string;
  selected?: boolean;
  onPress: () => void;
  onHoldConfirm?: () => void;
};

export default function TagButton({
  label,
  color,
  selected = false,
  onPress,
  onHoldConfirm,
}: TagButtonProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<number | null>(null);

  const startHold = () => {
    // Start fill animation
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Trigger action after full hold
    timeoutRef.current = setTimeout(() => {
      onHoldConfirm?.();
    }, 1000);
  };

  const cancelHold = () => {
    // Reset fill animation
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const borderColor = selected ? color : `${color}66`;
  const textColor = selected ? "#fff" : color;

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={startHold}
      onPressOut={cancelHold}
      style={styles.wrapper}
    >
      <View style={[styles.button, { borderColor }]}>
        {/* Fill bar */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: color,
              width: fillWidth,
            },
          ]}
        />
        {/* Text on top */}
        <ThemedText
          type="defaultSemiBold"
          style={[styles.text, { color: textColor, zIndex: 1 }]}
        >
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    overflow: "hidden", // ⬅️ Important to keep fill inside
    backgroundColor: "#ffffff00", // transparent background
  },
  text: {
    textAlign: "center",
    fontSize: 14,
  },
});
