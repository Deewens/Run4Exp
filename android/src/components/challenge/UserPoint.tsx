import React from 'react';
import { Image } from 'react-native-svg';

type Props = {
  x: number;
  y: number;
};

export default ({ x, y }: Props) => {

  let imageFile = require("../../../assets/runner-logo.png");

  return (
    <Image
      x={x}
      y={y}
      height="45"
      width="45"
      // @ts-ignore
      style={{
        transform: {
          translateY: -45,
          translateX: -22.5
        },
      }}
      href={imageFile}
    />
  );
};