import React, { useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  AccessibilityRole,
  ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import BackButton from "./BackButton";
import ProgressGauge from "./ProgressGauge";
import RightButton from "./RightButton";
import AddTaskButton from "./AddTaskButton";
import { TaskType } from "../types/taskType";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

interface Props {
  totalPerContainer: number;
  containerName: string;
  backButton?: boolean;
  addButton?: boolean;
  rightButton?: boolean;
  percentage: number;
  totalCompleted: number;
  backgroundLayers: string[];
  containerStyle?: ViewStyle;
}

const VALID_CONTAINERS = ["daily", "tomorrow", "planned"] as const;

const TasksContainer = ({
  totalPerContainer,
  containerName,
  backButton = false,
  addButton = false,
  rightButton = false,
  percentage,
  totalCompleted,
  backgroundLayers,
  containerStyle,
}: Props) => {
  // Validation stricte du containerName
  const normalizedContainerName = containerName?.toLowerCase();
  if (
    !normalizedContainerName ||
    !VALID_CONTAINERS.includes(normalizedContainerName as TaskType)
  ) {
    throw new Error(
      `TasksContainer: invalid containerName "${containerName}". Expected one of ${VALID_CONTAINERS.join(
        ", "
      )}.`
    );
  }

  const containerType = normalizedContainerName as TaskType;

  // Validation des couleurs
  const backgroundColors = useMemo<[string, string, string]>(() => {
    if (!backgroundLayers || backgroundLayers.length !== 3) {
      console.warn(
        `TasksContainer: Expected exactly 3 background colors, got ${
          backgroundLayers ? backgroundLayers.length : 0
        }. Using fallback colors.`
      );
      return ["#ccc", "#aaa", "#888"];
    }
    return backgroundLayers as [string, string, string];
  }, [backgroundLayers]);

  // Validation des stats
  const validatedStats = useMemo(() => {
    const total = Math.max(0, totalPerContainer || 0);
    const completed = Math.min(Math.max(0, totalCompleted || 0), total);
    const perc = Math.max(0, Math.min(1, percentage || 0));
    return { total, completed, perc };
  }, [totalCompleted, totalPerContainer, percentage]);

  const navigation = useRouter();

  const handleRightRedirect = () => {
    navigation.push({
      pathname: "/tasksScreen",
      params: { type: containerType },
    });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Background layers */}
      <View style={[styles.layer1, { backgroundColor: backgroundColors[0] }]} />
      <View
        style={[
          containerType === "daily"
            ? styles.layer2
            : containerType === "tomorrow"
            ? styles.layer4
            : styles.layer6,
          { backgroundColor: backgroundColors[1] },
        ]}
      />
      <View
        style={[
          containerType === "daily"
            ? styles.layer3
            : containerType === "tomorrow"
            ? styles.layer5
            : styles.layer7,
          { backgroundColor: backgroundColors[2] },
        ]}
      />

      {/* Blur + content */}
      <BlurView
        intensity={Platform.OS === "android" ? 50 : 100}
        style={styles.blurContainer}
      >
        {backButton && (
          <View style={styles.buttonBack}>
            <BackButton />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title} accessibilityRole="header">
            {containerName}
          </Text>
          <Text style={styles.title}>Tasks</Text>
        </View>

        <ProgressGauge
          percentage={validatedStats.total === 0 ? 0 : validatedStats.perc}
          totalCompleted={validatedStats.completed}
          total={validatedStats.total === 0 ? 0 : validatedStats.total}
        />

        {rightButton && (
          <View style={styles.buttonRight}>
            <RightButton onPress={handleRightRedirect} />
          </View>
        )}

        {addButton && (
          <View style={styles.addButton}>
            <AddTaskButton />
          </View>
        )}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  layer1: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: 100,
    top: -20,
    left: -10,
  },
  layer2: {
    width: width,
    height: height * 0.46,
    borderRadius: 200,
    position: "absolute",
    top: -50,
    left: -70,
  },
  layer3: {
    width: width * 0.5,
    height: height * 0.23,
    borderRadius: 100,
    position: "absolute",
    top: -20,
    left: 25,
  },
  layer4: {
    width: width * 0.8,
    height: height * 0.36,
    borderRadius: 200,
    position: "absolute",
    top: 63,
    left: 22,
  },
  layer5: {
    width: width * 0.4,
    height: height * 0.18,
    borderRadius: 200,
    position: "absolute",
    top: 140,
    left: 100,
  },
  layer6: {
    width: width,
    height: height * 0.46,
    borderRadius: 200,
    position: "absolute",
    bottom: -50,
    right: -70,
  },
  layer7: {
    width: width * 0.5,
    height: height * 0.23,
    borderRadius: 100,
    position: "absolute",
    bottom: -20,
    right: -25,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 25,
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    fontSize: 50,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    width: "100%",
    textTransform: "capitalize",
  },
  buttonRight: { alignItems: "flex-end" },
  buttonBack: { alignItems: "flex-start" },
  addButton: {
    position: "absolute",
    bottom: -40,
    left: "50%",
    transform: [{ translateX: -40 }],
    width: 80,
    height: 80,
  },
});

export default TasksContainer;
