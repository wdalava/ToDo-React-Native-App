import TasksContainer from "@/src/components/TasksContainer";
import { useTaskStore } from "@/src/context/useTaskStore";
import { Task } from "@/src/types/task";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddTaskButton from "@/src/components/AddTaskButton";
import { AntDesign } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const TASK_CONTAINERS = [
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

const TasksScreen = () => {
  const { type } = useLocalSearchParams();
  const { tasks, handleToggleCompleted } = useTaskStore();
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const navigation = useRouter();

  // Current container memoized
  const currentContainer = useMemo(
    () => TASK_CONTAINERS.find((c) => c.title === type),
    [type]
  );

  // Calcul des tasks pending et completed
  const { pendingTasks, completedTasks, stats } = useMemo(() => {
    const tasksOfType = tasks.filter((task) => task.container === type);
    const completed = tasksOfType.filter((task) => task.completed);
    const pending = tasksOfType.filter((task) => !task.completed);
    const total = tasksOfType.length;
    const percentage = total > 0 ? completed.length / total : 0;

    return {
      pendingTasks: pending,
      completedTasks: completed,
      stats: { total, completed, percentage },
    };
  }, [tasks, type]);

  // Callbacks
  const toggleTask = useCallback(
    (id: number) => handleToggleCompleted(id),
    [handleToggleCompleted]
  );

  const handleAddRedirect = useCallback(() => {
    navigation.push({ pathname: "/taskOperation", params: { type } });
  }, [navigation, type]);

  const handleDetailTask = useCallback(
    (id: number) => {
      navigation.push({ pathname: "/taskOperation", params: { type: id } });
    },
    [navigation]
  );

  const handleShowCompletedTasks = useCallback(() => {
    setShowCompletedTasks((prev) => !prev);
  }, []);

  // Composant footer pour tâches complétées
  const CompletedTasksList = () => {
    if (!showCompletedTasks) return null;

    if (completedTasks.length === 0) {
      return <Text style={styles.emptyText}>Aucune tâche complétée...</Text>;
    }

    return completedTasks.map((task) => (
      <View key={task.id} style={styles.taskCompleted}>
        <Pressable onPress={() => toggleTask(task.id)}>
          <View style={styles.completedCheck}>
            <AntDesign name="check" size={20} />
          </View>
        </Pressable>
        <Text
          style={styles.taskTitleCompleted}
          onPress={() => handleDetailTask(task.id)}
        >
          {task.title}
        </Text>
      </View>
    ));
  };

  if (!currentContainer) return null; // sécuriser si type invalide

  return (
    <SafeAreaView style={styles.globalContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <TasksContainer
              containerName={currentContainer.title.toUpperCase()}
              totalPerContainer={stats.total}
              percentage={stats.percentage}
              totalCompleted={stats.completed.length}
              backgroundLayers={currentContainer.backgroundLayers}
              backButton={true}
              addButton={false}
              rightButton={false}
              containerStyle={styles[currentContainer.styleName]}
            />
            <AddTaskButton
              size={30}
              color="black"
              onPress={handleAddRedirect}
            />
          </View>
        }
        data={pendingTasks}
        keyExtractor={(task) => task.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune tâche en cours...</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Pressable onPress={() => toggleTask(item.id)}>
              <View style={styles.pendingCheck} />
            </Pressable>
            <Text
              style={styles.taskTitle}
              onPress={() => handleDetailTask(item.id)}
            >
              {item.title}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <View style={{ marginTop: 65 }}>
            <View style={styles.completedHeader}>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text style={styles.completedLabel}>COMPLETED</Text>
                <Text style={styles.completedLabel}>
                  ({completedTasks.length})
                </Text>
              </View>
              <Pressable
                onPress={handleShowCompletedTasks}
                style={{ padding: 5 }}
              >
                <AntDesign
                  name={showCompletedTasks ? "up" : "down"}
                  size={17}
                  color={"#ABABAB"}
                />
              </Pressable>
            </View>
            <CompletedTasksList />
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  globalContainer: { flex: 1, paddingHorizontal: 16 },
  headerContainer: {
    position: "relative",
    alignItems: "center",
    marginVertical: 20,
  },
  taskContainer: {
    width: "100%",
    height: height * 0.5,
    borderRadius: 55,
    overflow: "hidden",
    position: "relative",
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
  taskItem: {
    paddingLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    borderBottomWidth: 1,
    padding: 30,
    paddingLeft: 0,
    borderColor: "#E0E0E0",
    width: "85%",
  },
  pendingCheck: {
    height: 30,
    width: 30,
    borderRadius: 32,
    borderWidth: 1,
  },
  taskCompleted: {
    paddingLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  completedCheck: {
    height: 30,
    width: 30,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D7D7",
  },
  taskTitleCompleted: {
    fontSize: 16,
    fontWeight: "500",
    borderBottomWidth: 1,
    padding: 30,
    paddingLeft: 0,
    borderColor: "#E0E0E0",
    width: "85%",
    color: "#7B7B7B",
    textDecorationLine: "line-through",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#cdcdcdff",
    fontSize: 20,
  },
  completedHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
  },
  completedLabel: {
    color: "#ABABAB",
    fontSize: 13,
  },
});

export default TasksScreen;
