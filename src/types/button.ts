import { ViewStyle } from "react-native";

export interface ButtonProps {
  onPress?: () => void;
  size?: number;
  color?: string;
  activeOpacity?: number;
  style?: ViewStyle | ViewStyle[];
}
