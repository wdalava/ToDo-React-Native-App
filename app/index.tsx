import React, { useMemo } from "react";
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Image,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TasksContainer from "@/src/components/TasksContainer";
import { useTaskStore } from "@/src/context/useTaskStore";
import { Task } from "@/src/types/task";
import { TaskType } from "@/src/types/taskType";

const { height } = Dimensions.get("window");

const TASK_CONTAINERS: {
  title: TaskType;
  backgroundLayers: [string, string, string];
  styleName: "taskContainer" | "plannedTaskContainer";
}[] = [
  {
    title: "daily",
    backgroundLayers: ["#8EA1CF", "#DCB05F", "#A031C8"],
    styleName: "taskContainer",
  },
  {
    title: "tomorrow",
    backgroundLayers: ["#06B6D4", "#037BF8", "#371BFF"],
    styleName: "taskContainer",
  },
  {
    title: "planned",
    backgroundLayers: ["#F59E0B", "#EF4444", "#8B5CF6"],
    styleName: "plannedTaskContainer",
  },
];

const Dashboard = () => {
  const { tasks } = useTaskStore();

  // Calcul des stats pour chaque container
  const taskStats = useMemo(() => {
    const stats: Record<
      TaskType,
      { completed: Task[]; total: number; percentage: number }
    > = {
      daily: { completed: [], total: 0, percentage: 0 },
      tomorrow: { completed: [], total: 0, percentage: 0 },
      planned: { completed: [], total: 0, percentage: 0 },
    };

    TASK_CONTAINERS.forEach(({ title }) => {
      const tasksOfType = tasks.filter((t) => t.container === title);
      const completed = tasksOfType.filter((t) => t.completed);
      stats[title] = {
        completed,
        total: tasksOfType.length,
        percentage:
          tasksOfType.length > 0 ? completed.length / tasksOfType.length : 0,
      };
    });

    return stats;
  }, [tasks]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.globalContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Hello</Text>
            <Text style={styles.nameText}>John Doe</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatarImage}
              source={require("../assets/images/alexander-hipp-iEEBWgY_6lA-unsplash.jpg")}
            />
          </View>
        </View>

        {/* Containers */}
        <View style={styles.mainContainer}>
          {TASK_CONTAINERS.map((container) => {
            const { title, backgroundLayers, styleName } = container;
            const stats = taskStats[title];

            return (
              <TasksContainer
                key={title}
                containerName={title.toUpperCase()}
                totalPerContainer={stats.total}
                percentage={stats.percentage}
                totalCompleted={stats.completed.length}
                backgroundLayers={backgroundLayers}
                backButton={false}
                addButton={false}
                rightButton={true}
                containerStyle={styles[styleName]}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  globalContainer: { gap: 40, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  greetingText: {
    fontSize: 25,
    fontWeight: "200",
    letterSpacing: 1,
    color: "#64748B",
  },
  nameText: {
    fontSize: 40,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#1E293B",
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  avatarImage: { width: "100%", height: "100%", resizeMode: "cover" },
  mainContainer: { gap: 16, paddingHorizontal: 16 },
  taskContainer: {
    width: "100%",
    height: height * 0.5,
    borderRadius: 55,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  plannedTaskContainer: {
    width: "100%",
    height: height * 0.5,
    borderRadius: 55,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
});

export default React.memo(Dashboard);
