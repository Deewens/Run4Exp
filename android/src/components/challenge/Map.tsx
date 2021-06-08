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
  completedSegmentIds: any;
  style: any;
};

export default ({ base64, checkpoints, segments, obstacles, distance, scale, selectedSegmentId, onUpdateSelectedSegment, highlightSegmentId, completedSegmentIds, style }: Props) => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });
  const [checkpointSize, setCheckpointSize] = useState(45)

  const mapDrawing = useMapDrawing(backgroundImage, scale, checkpoints, segments, obstacles, checkpointSize, highlightSegmentId, completedSegmentIds);

  useEffect(() => {
    if (selectedSegmentId && distance) {

      let selectedSegment = segments.find(x => x.id === selectedSegmentId);

      let roundedDistance = roundTwoDecimal(distance);

      let val = calculatePointCoordOnSegment(selectedSegment, roundedDistance, scale);

      if (val == null) {
        return;
      }
      if (mapDrawing?.calculX) {
        setUserPosition({
          x: mapDrawing?.calculX(val.x),
          y: mapDrawing?.calculY(val.y),
        });
      }
    }
  }, [selectedSegmentId, distance]);

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
        minZoom={0.8}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        capture={true}
        initialOffsetX={3}
        initialOffsetY={3}
        onZoomEnd={(e, state, zoomableViewEventObject) => setCheckpointSize(45 * (1 + (zoomableViewEventObject.zoomLevel) * -1))}
        style={{
          padding: 10,
          height: backgroundImage.imageHeight * 3,
          width: backgroundImage.imageWidth * 3,
          justifyContent: 'center',
          alignItems: "center",
        }}
      >
        <View style={[
          {
            height: backgroundImage.imageHeight * 2,
            width: backgroundImage.imageWidth * 2,
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: "center",
          },
        ]}>
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

              <UserPoint x={userPosition.x} y={userPosition.y} />

              {mapDrawing.obstacleList}

            </Svg>

          </View>
        </View>
      </ReactNativeZoomableView>
    )
    :
    null;
};