import React from 'react';
import { StyleSheet } from 'react-native';
import Svg from 'react-native-svg';

let createStyles = (style?: any): any => {

  return StyleSheet.create({
    svg: {
      ...StyleSheet.absoluteFillObject,
      position: "absolute",
      ...style,
    },
  });
};

export type Props = {
  height: number | string;
  width: number | string;
  children: any;
  style: any;
};

export default ({ height, width, children, style }: Props) => {

  const styles = createStyles(style);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={styles.svg}>

      {children}

    </Svg>
  )
};