import React, { useState, } from 'react';
import { StyleProp, ViewStyle, StyleSheet, Image, View, ImageResizeMode, ActivityIndicator } from 'react-native';

let createStyles = (width: number | string, height: number | string, style?: any): any => {

  return StyleSheet.create({
    container: {
      height,
      width,
      ...style,
    },
    imageUnloaded: {
      height,
      width,
      backgroundColor: "#F6F6F6",
    },
    activityIndicator: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    }
  });
};

type Props = {
  width: number | string;
  height: number | string;
  base64: string;
  children?: any;
  isLoading?: boolean;
  onPress?: () => void;
  resizeMode?: ImageResizeMode;
  style?: StyleProp<ViewStyle>;
};

export default ({ width, height, base64, children, isLoading, onPress, resizeMode, style }: Props) => {
  const styles = createStyles(width, height, style);

  return (
    <View
      style={styles.container}
      onTouchEnd={onPress}
    >
      {
        isLoading ?
          (
            <View style={styles.imageUnloaded}>
              <ActivityIndicator
                animating={isLoading}
                color="black"
                size={20}
                style={styles.activityIndicator}
              />
            </View>

          )
          :
          (
            <>
              <Image
                style={styles.container}
                source={{ uri: `data:image/jpeg;base64, ${base64}` }}
                resizeMode={resizeMode}
              />
              {children}
            </>
          )
      }

    </View >
  );
};