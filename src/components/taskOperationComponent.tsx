import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Task } from "@/src/types/task";
import { useTaskStore } from "../context/useTaskStore";
import { Calendar } from "react-native-calendars";

const { width, height } = Dimensions.get("window");

export default function TaskOperationComponent() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();
  const { type } = useLocalSearchParams();
  const navigation = useRouter();

  const [mode, setMode] = useState<"create" | "edit" | "completed">("create");

  const initialFormDataTask = {
    title: "",
    priority: "",
    description: "",
    container: "",
    createdAt: "",
  };

  const [formDataTask, setFormDataTask] = useState(initialFormDataTask);
  const [selectedDate, setSelectedDate] = useState("");
  const [priorityHandle, setPriorityHandle] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const task = tasks.find((task) => task.id === Number(type));

  // Initialize form data when editing existing task
  useEffect(() => {
    if (task) {
      setFormDataTask({
        title: task.title,
        priority: task.priority,
        description: task.description || "",
        container: task.container,
        createdAt: task.createdAt || "",
      });

      // Set priority handle based on task priority
      const priorityMap = { High: 1, Low: 2, Medium: 3 };
      setPriorityHandle(
        priorityMap[task.priority as keyof typeof priorityMap] || null
      );

      if (task.createdAt) {
        setSelectedDate(task.createdAt);
      }
    }
  }, [task]);

  // Determine mode
  useEffect(() => {
    if (!task) setMode("create");
    else if (task.completed) setMode("completed");
    else setMode("edit");
  }, [task]);

  const handleTextChange = (field: string, value: string) => {
    setFormDataTask((prev) => ({ ...prev, [field]: value }));
  };

  const priorityOptions = [
    { id: 1, label: "High", background: "#FFD7D7", color: "#FF6A6A" },
    { id: 2, label: "Low", background: "#D7E0FF", color: "#0559FF" },
    { id: 3, label: "Medium", background: "#FFF0D7", color: "#FFB433" },
  ];

  const priorityChoice = (prioId: number) => {
    if (mode === "completed") return;
    setPriorityHandle(prioId);
    const selectedPriority = priorityOptions.find((p) => p.id === prioId);
    if (selectedPriority) {
      handleTextChange("priority", selectedPriority.label);
    }
  };

  const handleContainerChoice = (container: string) => {
    if (mode === "completed") return;
    handleTextChange("container", container);
    if (container !== "PLANNED") {
      setSelectedDate("");
      handleTextChange("date", "");
    }
  };

  const handleCalendarPress = () => {
    setShowCalendar(true);
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    handleTextChange("date", day.dateString);
    handleTextChange("container", "PLANNED");
    setShowCalendar(false);
  };

  // Fonction helper pour générer des IDs uniques
  const generateId = () => Date.now() + Math.random();

  // Fonction helper pour créer des timestamps
  const now = () => new Date().toISOString();

  const handleActionButton = () => {
    const executeWithLoading = async (operation) => {
      setShowLoadingModal(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await operation();
        navigation.back();
      } catch (error) {
        console.error("Erreur opération:", error);
        // Ici tu peux afficher un toast d'erreur
      } finally {
        setShowLoadingModal(false);
      }
    };

    if (mode === "completed" && task) {
      executeWithLoading(() => deleteTask(task.id));
    } else if (mode === "edit" && task && formDataTask.title.trim()) {
      executeWithLoading(() =>
        updateTask(task.id, {
          ...formDataTask,
          title: formDataTask.title.trim(),
          priority: formDataTask.priority,
          updatedAt: now(),
        })
      );
    } else if (
      mode === "create" &&
      formDataTask.title.trim() &&
      formDataTask.container
    ) {
      executeWithLoading(() =>
        addTask({
          id: generateId(),
          ...formDataTask,
          title: formDataTask.title.trim(),
          completed: false,
          createdAt: now(),
        })
      );
    }
  };

  const isFormValid = () => {
    if (mode === "completed") return true;
    return (
      formDataTask.title.trim() !== "" &&
      (mode === "edit" || formDataTask.container !== "")
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
            paddingHorizontal: 20,
            marginVertical: 20,
            gap: 30,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <BackButton />
            <Text
              style={{ fontSize: 14, letterSpacing: 5, color: "#6d6d6d4f" }}
            >
              {(task?.container || formDataTask.container).toUpperCase()}
            </Text>
          </View>

          {/* Title */}
          <TextInput
            value={
              mode === "create" ? formDataTask.title : formDataTask.title || ""
            }
            onChangeText={(value) => handleTextChange("title", value)}
            style={styles.input}
            autoFocus={mode !== "completed"}
            placeholder={
              mode === "create" ? "New Task" : task?.title || "Task title"
            }
            editable={mode !== "completed"}
          />

          {/* Priority */}
          <View style={{ flexDirection: "row", columnGap: 27 }}>
            {priorityOptions.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  {
                    backgroundColor: p.background,
                    paddingHorizontal: 18,
                    paddingVertical: 2,
                    borderRadius: 23,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: priorityHandle === p.id ? 2 : 0,
                    borderColor: p.color,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => priorityChoice(p.id)}
                disabled={mode === "completed"}
              >
                <Text style={{ color: p.color, fontSize: 13 }}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Container Selection */}
          <View style={{ rowGap: 30 }}>
            <View
              style={{
                flexDirection: "row",
                columnGap: 30,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.dataButton,
                  formDataTask.container === "DAILY" && {
                    backgroundColor: "#000000",
                    borderWidth: 0,
                  },
                  formDataTask.container !== "DAILY" && {
                    borderColor: "#b9b9b968",
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => handleContainerChoice("DAILY")}
                disabled={mode === "completed"}
              >
                <Text
                  style={[
                    styles.dataButtonText,
                    formDataTask.container === "DAILY" && { color: "#FFFFFF" },
                    formDataTask.container !== "DAILY" && {
                      color: "#b9b9b9e7",
                    },
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dataButton,
                  formDataTask.container === "TOMORROW" && {
                    backgroundColor: "#000000",
                    borderWidth: 0,
                  },
                  formDataTask.container !== "TOMORROW" && {
                    borderColor: "#b9b9b968",
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => handleContainerChoice("TOMORROW")}
                disabled={mode === "completed"}
              >
                <Text
                  style={[
                    styles.dataButtonText,
                    formDataTask.container === "TOMORROW" && {
                      color: "#FFFFFF",
                    },
                    formDataTask.container !== "TOMORROW" && {
                      color: "#b9b9b9e7",
                    },
                  ]}
                >
                  Tomorrow
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  styles.calendarButton,
                  formDataTask.container === "PLANNED" && {
                    backgroundColor: "#000000",
                    borderWidth: 0,
                  },
                ]}
                activeOpacity={0.7}
                onPress={handleCalendarPress}
                disabled={mode === "completed"}
              >
                <AntDesign
                  name="calendar"
                  size={30}
                  color={
                    formDataTask.container === "PLANNED"
                      ? "#FFFFFF"
                      : "#b9b9b9e7"
                  }
                />
              </TouchableOpacity>

              {/* Selected Date Display */}
              {selectedDate && (
                <View style={styles.selectedDateContainer}>
                  <Text style={styles.selectedDateText}>
                    {new Date(selectedDate).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {/* Calendar Modal */}
              <Modal visible={showCalendar} transparent animationType="fade">
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      padding: 20,
                      width: "90%",
                    }}
                  >
                    <Calendar
                      onDayPress={handleDateSelect}
                      markedDates={{
                        [selectedDate]: {
                          selected: true,
                          selectedColor: "black",
                        },
                      }}
                      theme={{
                        backgroundColor: "#ffffff",
                        calendarBackground: "#ffffff",
                        todayTextColor: "#000",
                        arrowColor: "black",
                        textDayFontWeight: "500",
                        monthTextColor: "#000",
                        textMonthFontWeight: "bold",
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        marginTop: 15,
                        backgroundColor: "#000",
                        padding: 10,
                        borderRadius: 10,
                        alignItems: "center",
                      }}
                      onPress={() => setShowCalendar(false)}
                    >
                      <Text style={{ color: "#fff" }}>Fermer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>

          {/* Description */}
          <TextInput
            value={formDataTask.description}
            onChangeText={(value) => handleTextChange("description", value)}
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder={
              mode === "create"
                ? "New description..."
                : task?.description || "No description...\nWrite to update"
            }
            editable={mode !== "completed"}
          />

          {/* Action button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              mode === "create" && styles.createButton,
              mode === "edit" && styles.updateButton,
              mode === "completed" && styles.deleteButton,
              !isFormValid() && styles.disabledButton,
            ]}
            onPress={handleActionButton}
            disabled={!isFormValid()}
          >
            <Text
              style={[
                mode === "create" && styles.createButtonText,
                mode === "edit" && styles.updateButtonText,
                mode === "completed" && styles.deleteButtonText,
                !isFormValid() && styles.disabledButtonText,
              ]}
            >
              {mode === "create" && "Create"}
              {mode === "edit" && "Update"}
              {mode === "completed" && "Delete"}
            </Text>
          </TouchableOpacity>

          {/* Loading Modal */}
          <Modal visible={showLoadingModal} transparent animationType="fade">
            <View style={styles.modalBackground}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={{ marginTop: 10, color: "#000", fontSize: 16 }}>
                {mode === "create" && "Tâche créée 🎉"}
                {mode === "edit" && "Tâche mise à jour 🎉"}
                {mode === "completed" && "Tâche supprimée 🗑️"}
              </Text>
              <Text style={{ marginTop: 5, color: "#666", fontSize: 14 }}>
                Redirection...
              </Text>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 30,
    fontWeight: "600",
    paddingHorizontal: 5,
  },
  dataButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#B9B9B9",
    borderRadius: 23,
  },
  dataButtonText: {
    fontSize: 20,
    fontWeight: "300",
  },
  calendarButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    borderWidth: 1,
    borderColor: "#B9B9B9",
    borderRadius: 100,
  },
  selectedDateContainer: {
    marginLeft: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    justifyContent: "center",
  },
  selectedDateText: {
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    height: 200,
    borderRadius: 22,
    padding: 20,
    textAlignVertical: "top",
    borderColor: "#BABABA",
    marginTop: 10,
    fontSize: 18,
  },
  createButton: {
    backgroundColor: "#000000",
    borderRadius: 23,
    paddingHorizontal: 18,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 25,
  },
  deleteButton: {
    backgroundColor: "#FFD7D7",
    borderRadius: 23,
    paddingHorizontal: 18,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  deleteButtonText: {
    color: "#FF3636",
    fontSize: 25,
  },
  updateButton: {
    backgroundColor: "#B6BEFF",
    borderRadius: 23,
    paddingHorizontal: 18,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "#7C43FF",
    fontSize: 25,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    borderRadius: 23,
    paddingHorizontal: 18,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  disabledButtonText: {
    color: "#666666",
    fontSize: 25,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
});
