import TaskOperationComponent from "@/src/components/taskOperationComponent";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const TaskOperations = () => {
  const { type } = useLocalSearchParams();
  return <TaskOperationComponent />;
};

const styles = StyleSheet.create({});

export default TaskOperations;
