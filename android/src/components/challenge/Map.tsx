import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import Svg from 'react-native-svg';
import UserPoint from '../../components/challenge/UserPoint';
import { CheckpointObj } from "./types";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { calculatePointCoordOnSegment } from '../../utils/orthonormalCalculs';
import { useMapDrawing } from '../../utils/map.utils'

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
  distance: number;
  scale: number;
  selectedSegmentId: number;
  onUpdateSelectedSegment: any;
  highlightSegmentId: number;
  style: any;
};

export default ({ base64, checkpoints, segments, distance, scale, selectedSegmentId, onUpdateSelectedSegment, highlightSegmentId, style }: Props) => {
  const [backgroundImage, setBackgroundImage] = useState(null);

  const { checkpointList, segmentList } = useMapDrawing(backgroundImage, checkpoints, segments, undefined, highlightSegmentId);

  let getUserPoint = () => {
    if (selectedSegmentId && distance) {

      let selectedSegment = segments.find(x => x.id === selectedSegmentId);

      let roundedDistance = Math.round(((distance) / 100) * 100);

      let val = calculatePointCoordOnSegment(selectedSegment, roundedDistance, scale);

      if (val == null) {
        return;
      }

      let y = ((1 - val.y) * 1.3 - 0.32) * (backgroundImage.imageHeight);
      let x = val.x * backgroundImage.imageWidth;

      // console.log(x, ",", y)
      return (<UserPoint x={x} y={y} />)
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

              {segmentList}


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

              {checkpointList}

              {getUserPoint()}

            </Svg>

          </View>
        </View>
      </ReactNativeZoomableView>
    )
    :
    null;
};