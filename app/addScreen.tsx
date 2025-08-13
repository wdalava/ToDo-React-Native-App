import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddScreen = () => {
  const { type } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <View>
        <Text>{type}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default AddScreen;
