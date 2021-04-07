import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Image } from 'react-native';
import Animated, { Value, block, cond, eq, multiply, set, useCode } from 'react-native-reanimated';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { onGestureEvent, pinchActive, pinchBegan, translate, vec } from 'react-native-redash/lib/module/v1';
import Svg, { Polyline } from 'react-native-svg';
import Checkpoint from '../../components/challenge/Checkpoint';
import { CheckpointObj, Segment } from "./types";

const { width, height } = Dimensions.get("window");
const CANVAS = vec.create(width, height);
const CENTER = vec.divide(CANVAS, 2);
const styles = StyleSheet.create({
  image: {
    width: undefined,
    height: undefined,
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
  },
  box: {
    height: 150,
    width: 150,
    borderRadius: 5,
    position: "absolute",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  }
});

export type Props = {
  base64: string;
  checkpoints: Array<CheckpointObj>;
  segments: Array<Segment>;
  style: any;
};

export default ({ base64, checkpoints, segments, style }: Props) => {
  const origin = vec.createValue(0, 0);
  const pinch = vec.createValue(0, 0);
  const focal = vec.createValue(0, 0);
  const gestureScale = new Value(1);
  const scaleOffset = new Value(1);
  const scale = new Value(1);
  const offset = vec.createValue(0, 0);
  const state = new Value(State.UNDETERMINED);
  const numberOfPointers = new Value(0);
  const pinchGestureHandler = onGestureEvent({
    numberOfPointers,
    scale: gestureScale,
    state,
    focalX: focal.x,
    focalY: focal.y,
  });
  const adjustedFocal = vec.sub(focal, vec.add(CENTER, offset));
  const translation = vec.createValue(0, 0);


  const [backgroundImage, setBackgroundImage] = useState(null);

  useCode(
    () =>
      block([
        cond(pinchBegan(state), vec.set(origin, adjustedFocal)),
        cond(pinchActive(state, numberOfPointers), [
          vec.set(pinch, vec.sub(adjustedFocal, origin)),
          vec.set(
            translation,
            vec.add(pinch, origin, vec.multiply(-1, gestureScale, origin))
          ),
        ]),
        cond(eq(state, State.END), [
          vec.set(offset, vec.add(offset, translation)),
          set(scaleOffset, scale),
          set(gestureScale, 1),
          vec.set(translation, 0),
          vec.set(focal, 0),
          vec.set(pinch, 0),
        ]),
        set(scale, multiply(gestureScale, scaleOffset)),
      ]),
    [
      adjustedFocal,
      focal,
      gestureScale,
      numberOfPointers,
      offset,
      origin,
      pinch,
      scale,
      scaleOffset,
      state,
      translation,
    ]
  );

  let getSegmentPaths = (segment) => {
    let result = "";

    segment.coordinates.forEach(element => {
      let x = element.x * backgroundImage.imageWidth;
      let y = ((1 - element.y) * backgroundImage.imageHeight) - backgroundImage.imageHeight / 2;
      result += `${x},${y} `
    });

    return (
      <Polyline key={segment.id} stroke="#3388ff" strokeWidth="3" points={result} />
    );
  }

  let getCheckpointSvgs = (checkpoint) => {

    let y = ((1 - checkpoint.position.y) * backgroundImage.imageHeight) - backgroundImage.imageHeight / 2;
    let x = checkpoint.position.x * backgroundImage.imageWidth;
    let type = checkpoint.checkpointType;

    return (
      <Checkpoint
        y={y}
        x={x}
        type={type}
        key={checkpoint.id} />
    );
  }

  useEffect(() => {
    let url = `data:image/jpeg;base64, ${base64}`;

    Image.getSize(url, (w, h) => {

      setBackgroundImage({
        imageHeight: h,
        imageWidth: w,
        url: url
      });
    })
  }, [])

  return backgroundImage ?
    (
      <PinchGestureHandler {...pinchGestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.Image
            style={[
              {
                ...styles.image,
                height: backgroundImage.imageHeight,
                width: backgroundImage.imageWidth,
              },
              {
                transform: [
                  ...translate(vec.add(offset, translation)),
                  { scale },
                ],
              },
            ]}
            source={{
              uri: backgroundImage.url
            }}

          />

          <Animated.View
            style={[
              {
                ...styles.box,
                height: backgroundImage.imageHeight,
                width: backgroundImage.imageWidth,
              },
              {
                transform: [
                  ...translate(vec.add(offset, translation)),
                  { scale },
                ],
              },
            ]}
          >
            <Svg height="100%" width="100%" viewBox={`0 0 ${backgroundImage.imageWidth} ${backgroundImage.imageHeight}`} style={styles.svg}>

              {segments.map(function (segment) {
                return getSegmentPaths(segment);
              })}

            </Svg>

          </Animated.View>
          <Animated.View
            style={[
              {
                ...styles.box,
                height: backgroundImage.imageHeight,
                width: backgroundImage.imageWidth,
              },
              {
                transform: [
                  ...translate(vec.add(offset, translation)),
                  { scale },
                ],
              },
            ]}>

            <Svg height="100%" width="100%" viewBox={`0 0 ${backgroundImage.imageWidth} ${backgroundImage.imageHeight}`} style={styles.svg}>

              {checkpoints.map(function (checkpoint) {
                return getCheckpointSvgs(checkpoint);
              })}
            </Svg>

          </Animated.View>
        </Animated.View>
      </PinchGestureHandler>
    )
    :
    null;
};