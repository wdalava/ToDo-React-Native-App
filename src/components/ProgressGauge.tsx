import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ProgressGauge = ({
  percentage,
  totalCompleted,
  total,
}: {
  percentage: number;
  totalCompleted: number;
  total: number;
}) => {
  return (
    <View style={styles.gaugeContainer}>
      <View style={styles.gaugeBar}>
        <View
          style={[styles.gaugeFill, { height: Math.max(2, percentage * 80) }]}
        />
      </View>

      <View style={styles.gaugeText}>
        <Text style={styles.taskCount}>
          {total <= 0 ? "0" : `${totalCompleted}/${total}`}
        </Text>
        <Text style={styles.taskLabel}>task{total > 1 ? "s" : ""}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gaugeContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    gap: 25,
  },
  gaugeBar: {
    width: 20,
    height: 80,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  gaugeFill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    minHeight: 2,
  },
  gaugeText: {
    gap: 9,
  },
  taskCount: {
    fontSize: 35,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  taskLabel: {
    fontSize: 30,
    fontWeight: "300",
    color: "#FFFFFF",
  },
});

export default ProgressGauge;
