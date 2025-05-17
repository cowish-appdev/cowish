import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function AddPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [codeType, setCodeType] = useState<"group" | "individual" | null>(null);

  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const successAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Focus input on mount
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  // Handle text input changes
  const handleChangeText = (text: string) => {
    // Only allow alphanumeric characters
    const filtered = text.replace(/[^a-zA-Z0-9]/g, "");

    if (filtered.length <= 7) {
      setCode(filtered);
      setError("");

      // Detect code type
      if (filtered.length > 0) {
        const firstChar = filtered.charAt(0).toLowerCase();
        if (firstChar === "g" && filtered.length === 7) {
          setCodeType("group");
        } else {
          setCodeType("individual");
        }
      } else {
        setCodeType(null);
      }
    }
  };

  // Format displayed code with spaces
  const formattedCode = () => {
    if (code.length <= 3) {
      return code;
    } else if (code.length <= 6) {
      return `${code.slice(0, 3)} ${code.slice(3)}`;
    } else {
      return `${code.slice(0, 3)} ${code.slice(3, 6)} ${code.slice(6, 7)}`;
    }
  };

  const triggerShakeAnimation = () => {
    // Trigger haptic feedback on error
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const triggerSuccessAnimation = () => {
    // Trigger haptic feedback on success
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    Animated.sequence([
      Animated.timing(successAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(successAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(successAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateCode = () => {
    if (!code) {
      setError("Please enter a code");
      triggerShakeAnimation();
      return false;
    }

    const firstChar = code.charAt(0);
    const length = code.length;

    if (firstChar.toLowerCase() === "g" && length === 7) {
      return "group";
    } else if (length === 6) {
      return "individual";
    } else {
      if (firstChar === "G" && length < 7) {
        setError(`Group code must be 7 characters (${7 - length} more needed)`);
      } else if (length < 6) {
        setError(
          `Individual code must be 6 characters (${6 - length} more needed)`
        );
      } else {
        setError("Invalid code format");
      }
      triggerShakeAnimation();
      return false;
    }
  };

  const handleAdd = () => {
    const validatedCodeType = validateCode();

    if (validatedCodeType) {
      setIsLoading(true);

      // Simulating API request delay
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        triggerSuccessAnimation();

        // Navigate after success
        setTimeout(() => {
          if (validatedCodeType === "group") {
            router.push(`../confirm-group?code=${code}`);
          } else {
            router.push(`../confirm-individual?code=${code}`);
          }
        }, 800);
      }, 1000);
    }
  };

  const getInputBorderColor = () => {
    if (error) return "#FF5555";
    if (success) return "#22C55E";
    if (codeType === "group") return "#9061F9";
    if (codeType === "individual") return "#10B981";
    return "#555555";
  };

  const getInputTextColor = () => {
    if (codeType === "group") return "#A78BFA";
    if (codeType === "individual") return "#34D399";
    return "#FFFFFF";
  };

  const getTagBackgroundColor = () => {
    if (codeType === "group") return "#5D3FD3";
    return "#059669";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
    >
      <ThemedView style={styles.container}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ThemedText type="title" style={styles.title}>
            Enter Your Code
          </ThemedText>

          <Animated.View
            style={{ transform: [{ translateX: shakeAnimation }] }}
          >
            <View
              style={[
                styles.inputContainer,
                { borderColor: getInputBorderColor() },
              ]}
            >
              <TextInput
                ref={inputRef}
                style={[styles.input, { color: getInputTextColor() }]}
                placeholder="XXXXXX"
                placeholderTextColor="#666666"
                value={formattedCode()}
                onChangeText={handleChangeText}
                autoCapitalize="characters"
                keyboardType="visible-password"
                returnKeyType="done"
                onSubmitEditing={handleAdd}
                editable={!isLoading && !success}
              />

              {codeType && !error && !success && (
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: getTagBackgroundColor() },
                  ]}
                >
                  <Text style={styles.tagText}>
                    {codeType === "group" ? "Group" : "Individual"}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.spacer} />
          )}

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: success ? "#22C55E" : "#5046e3",
                opacity: !code || error || isLoading ? 0.6 : 1,
              },
            ]}
            onPress={handleAdd}
            disabled={!code || !!error || isLoading || success}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : success ? (
              <Animated.View
                style={{ transform: [{ scale: successAnimation }] }}
              >
                <Text style={styles.buttonText}>Success!</Text>
              </Animated.View>
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Enter the 6-digit code for individual invites
            </Text>
            <Text style={styles.infoText}>
              or G/g-prefixed 7-digit code for group invites
            </Text>
          </View>
        </Animated.View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginHorizontal: 24,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
    position: "relative",
  },
  input: {
    height: 60,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 2,
    textAlign: "center",
    paddingHorizontal: 16,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  tag: {
    position: "absolute",
    right: 12,
    top: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  errorContainer: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#FF5555",
    fontSize: 13,
  },
  spacer: {
    height: 20,
  },
  button: {
    marginHorizontal: 24,
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  infoText: {
    color: "#999999",
    fontSize: 13,
    lineHeight: 20,
  },
  banner: {
    marginTop: 20,
    width: "100%",
    maxWidth: 400,
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
});
