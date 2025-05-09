import { Pressable, StyleSheet, Animated, View } from "react-native";
import { useRef, useState } from "react";

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
  const [isHolding, setIsHolding] = useState(false);

  const startHold = () => {
    setIsHolding(true);
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    timeoutRef.current = setTimeout(() => {
      onHoldConfirm?.();
    }, 1000);
  };

  const cancelHold = () => {
    setIsHolding(false);
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

  const textColor = selected
    ? "#fff"
    : progress.interpolate({
        inputRange: [0, 1],
        outputRange: [color, "#fff"],
      });

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const fontWeight = selected || isHolding ? "600" : "400";

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
        <Animated.Text
          style={[
            styles.text,
            {
              color: textColor,
              fontWeight: fontWeight,
              zIndex: 1,
            },
          ]}
        >
          {label}
        </Animated.Text>
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
    overflow: "hidden",
    backgroundColor: "#ffffff00",
  },
  text: {
    textAlign: "center",
    fontSize: 14,
  },
});
