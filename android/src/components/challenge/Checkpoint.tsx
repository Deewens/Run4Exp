import React from 'react';
import { Image } from 'react-native-svg';
import { CheckpointTypes } from './types';

type Props = {
  x: number;
  y: number;
  type: CheckpointTypes;
  size?: number;
};

export default ({ x, y, type, size }: Props) => {

  let green = require("../../../assets/marker-icon-green.png");
  let red = require("../../../assets/marker-icon-red.png");
  let blue = require("../../../assets/marker-icon-blue.png");
  let orange = require("../../../assets/marker-icon-orange.png");

  let image = type === "BEGIN" ? green : type === "END" ? red : type === "OBSTACLE" ? orange : blue;

  size = size === undefined ? 45 : size;

  return (
    <Image
      x={x}
      y={y}
      height={size}
      width={size}
      // @ts-ignore
      style={{
        transform: {
          translateY: -1 * size,
          translateX: (-1 * size) / 2
        },
      }}
      href={image}
    />
  );
};