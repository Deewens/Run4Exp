import React from "react";
import { StyleProp, ViewStyle, StyleSheet, Image, View } from "react-native";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import {
  Rect,
} from "react-native-svg";

let createStyles = (width: number | string, height: number | string, style?: any): any => {

  return StyleSheet.create({
    container: {
      height,
      width,
      ...style,
    },
  });
};

type Props = {
  width: number | string;
  height: number | string;
  base64: string;
  isLoading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default ({ width, height, base64, isLoading, onPress, style }: Props) => {
  const styles = createStyles(width, height, style);

  return (
    <View
      style={styles.container}
      onTouchEnd={onPress}
    >
      {
        isLoading ?
          (
            // @ts-ignore
            <SvgAnimatedLinearGradient height="100%" width="100%">
              <Rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
            </SvgAnimatedLinearGradient>

          )
          :
          (
            <Image
              style={styles.container}
              source={{ uri: `data:image/jpeg;base64, ${base64}` }}
            />
          )
      }
    </View >
  );
};