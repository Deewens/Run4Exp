import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import Svg from 'react-native-svg';
import UserPoint from '../../components/challenge/UserPoint';
import { CheckpointObj } from "./types";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { calculatePointCoordOnSegment } from '../../utils/orthonormalCalculs';
import { useMapDrawing } from '../../utils/map.utils'
import { roundTwoDecimal } from "../../utils/math.utils";

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
  segments: any;
  obstacles: Array<any>;
  distance: number;
  scale: number;
  selectedSegmentId: number;
  onUpdateSelectedSegment: any;
  highlightSegmentId: number;
  style: any;
};

export default ({ base64, checkpoints, segments, obstacles, distance, scale, selectedSegmentId, onUpdateSelectedSegment, highlightSegmentId, style }: Props) => {
  const [backgroundImage, setBackgroundImage] = useState(null);

  const mapDrawing = useMapDrawing(backgroundImage, scale, checkpoints, segments, obstacles, undefined, highlightSegmentId);

  let getUserPoint = () => {
    if (selectedSegmentId && distance) {

      let selectedSegment = segments.find(x => x.id === selectedSegmentId);

      let roundedDistance = roundTwoDecimal(distance);

      let val = calculatePointCoordOnSegment(selectedSegment, roundedDistance, scale);

      if (val == null) {
        return;
      }

      return (<UserPoint x={mapDrawing.calculX(val.x)} y={mapDrawing.calculY(val.y)} />)
    }
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

              {mapDrawing.segmentList}

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

              {mapDrawing.checkpointList}

              {getUserPoint()}

              {mapDrawing.obstacleList}

            </Svg>

          </View>
        </View>
      </ReactNativeZoomableView>
    )
    :
    null;
};