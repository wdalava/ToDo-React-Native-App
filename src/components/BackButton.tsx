import React, { useCallback } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { hapticLight } from "../types/haptics";
import { BlurView } from "expo-blur";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ButtonProps } from "../types/button";

const BackButton = ({
  activeOpacity = 0.7,
  size = 30,
  style,
  onPress,
  color = "black",
}: ButtonProps) => {
  const navigation = useRouter();

  const handlePress = useCallback(() => {
    hapticLight();
    navigation.back();
    if (onPress) onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[styles.button, style]}
      onPressOut={handlePress}
    >
      <BlurView intensity={20} style={styles.blurButton}>
        <AntDesign name="left" size={size} color={color} />
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff",
  },
  blurButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.38)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BackButton;
