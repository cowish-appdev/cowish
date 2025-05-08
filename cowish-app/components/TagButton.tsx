import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useRef } from "react";

type TagButtonProps = {
  label: string;
  color: string; // main color for the tag
  selected?: boolean;
  onPress: () => void;
  onDoublePress?: () => void; // ✅ added support for double tap
};

export default function TagButton({
  label,
  color,
  selected = false,
  onPress,
  onDoublePress,
}: TagButtonProps) {
  const lastTapRef = useRef<number>(0);

  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; // ms

    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      onDoublePress?.(); // ✅ double tap detected
    } else {
      onPress(); // ✅ single tap
    }

    lastTapRef.current = now;
  };

  const backgroundColor = selected ? color : `${color}33`; // 33 = ~20% opacity
  const borderColor = selected ? color : `${color}66`; // 66 = ~40% opacity
  const textColor = selected ? "#fff" : color;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
        },
        pressed && styles.pressed,
      ]}
    >
      <ThemedText
        type="defaultSemiBold"
        style={[styles.text, { color: textColor }]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderWidth: 2,
  },
  text: {
    textAlign: "center",
    fontSize: 14,
  },
  pressed: {
    opacity: 0.85,
  },
});
