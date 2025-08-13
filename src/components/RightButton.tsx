import React, { useCallback } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { hapticLight } from "../types/haptics";
import { ButtonProps } from "../types/button";

export default function RightButton({
  onPress,
  size = 30,
  color = "#fff",
  activeOpacity = 0.7,
  style,
}: ButtonProps) {
  const handlePress = useCallback(() => {
    hapticLight();
    if (onPress) onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={activeOpacity}
      style={[styles.button, style]}
      accessibilityRole="button"
      accessibilityLabel="Right arrow button"
    >
      <BlurView intensity={20} style={styles.blurButton}>
        <Feather name={"arrow-right"} size={size} color={color} />
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fff",
  },
  blurButton: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.38)",
    justifyContent: "center",
    alignItems: "center",
  },
});
