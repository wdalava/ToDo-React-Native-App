import React, { useCallback } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { hapticLight } from "../types/haptics";
import { ButtonProps } from "../types/button";
import { useRouter } from "expo-router";

export default function AddTaskButton({
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
      onPressOut={handlePress}
      activeOpacity={activeOpacity}
      style={[styles.button, style]}
    >
      <BlurView intensity={20} style={styles.blurButton}>
        <Feather name={"plus"} size={size} color={color} />
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: -50,
    left: "50%",
    transform: [{ translateX: -45 }],
    width: 100,
    height: 100,
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
