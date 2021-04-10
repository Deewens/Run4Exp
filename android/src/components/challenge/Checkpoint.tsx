import React from 'react';
import { Image } from 'react-native-svg';
import { CheckpointTypes } from './types';

type Props = {
  x: number;
  y: number;
  type: CheckpointTypes;
};

export default ({ x, y, type }: Props) => {

  let green = require("../../../assets/marker-icon-green.png");
  let red = require("../../../assets/marker-icon-red.png");
  let blue = require("../../../assets/marker-icon-blue.png");

  let image = type === "BEGIN" ? green : type === "END" ? red : blue;


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
      href={image}
    />
  );
};