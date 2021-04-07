import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import Checkpoint from '../../components/challenge/Checkpoint';
import { CheckpointObj, Segment } from "./types";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

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
  const [backgroundImage, setBackgroundImage] = useState(null);

  let getSegmentPaths = (segment) => {
    let result = "";

    segment.coordinates.forEach(element => {
      let x = element.x * backgroundImage.imageWidth;
      let y = ((1 - element.y) * 1.3 - 0.33) * (backgroundImage.imageHeight);
      result += `${x},${y} `
    });

    return (
      <Polyline key={segment.id} stroke="#3388ff" strokeWidth="3" points={result} />
    );
  }

  let getCheckpointSvgs = (checkpoint) => {

    let y = ((1 - checkpoint.position.y) * 1.3 - 0.32) * (backgroundImage.imageHeight);
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
      <ReactNativeZoomableView
        maxZoom={1.5}
        minZoom={0.5}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        capture={true}
        style={{
          padding: 10,
        }}
      >
        <View style={StyleSheet.absoluteFill}>
          <Image
            style={[
              {
                ...styles.image,
                height: backgroundImage.imageHeight,
                width: backgroundImage.imageWidth,
              },
            ]}
            source={{
              uri: backgroundImage.url
            }}

          />

          <View
            style={[
              {
                ...styles.box,
                height: backgroundImage.imageHeight,
                width: backgroundImage.imageWidth,
              },
            ]}
          >
            <Svg width={backgroundImage.imageWidth} height={backgroundImage.imageHeight} viewBox={`0 0 ${backgroundImage.imageWidth} ${backgroundImage.imageHeight}`} style={styles.svg}>

              {segments.map(function (segment) {
                return getSegmentPaths(segment);
              })}

              <Circle cx="0" cy="0" fill="red" r="10"></Circle>
              <Circle cx={backgroundImage.imageWidth} cy={backgroundImage.imageHeight} fill="green" r="10"></Circle>

            </Svg>

          </View>
          <View
            style={[
              {
                ...styles.box,
                height: backgroundImage.imageHeight,
                width: backgroundImage.imageWidth,
              },
            ]}>

            <Svg width={backgroundImage.imageWidth} height={backgroundImage.imageHeight} viewBox={`0 0 ${backgroundImage.imageWidth} ${backgroundImage.imageHeight}`} style={styles.svg}>

              {checkpoints.map(function (checkpoint) {
                return getCheckpointSvgs(checkpoint);
              })}
            </Svg>

          </View>
        </View>
      </ReactNativeZoomableView>
    )
    :
    null;
};