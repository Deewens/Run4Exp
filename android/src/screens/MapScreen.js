import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View, Image, Button } from "react-native";
import Animated, { Value, block, cond, eq, multiply, set, useCode } from "react-native-reanimated";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { onGestureEvent, pinchActive, pinchBegan, translate, vec } from "react-native-redash/lib/module/v1";
import ChallengeApi from "../api/challenge.api"
import * as FileSystem from 'expo-file-system';
import Svg, {
  Defs, LinearGradient, Stop, Path, Circle, Rect,
} from "react-native-svg";


const { width, height } = Dimensions.get("window");
const CANVAS = vec.create(width, height);
const CENTER = vec.divide(CANVAS, 2);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    width: undefined,
    height: undefined,
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  buttonPrev: {
    zIndex: 100,
    // position: "absolute",
    margin: 100
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute"
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

export default () => {
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
  const [challengeDetail, setChallengeDetail] = useState(null);

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

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

  // let getImageDimensions = (file) => {
  //   return new Promise(function (resolved, rejected) {
  //     var i = new Image()
  //     i.onload = function () {
  //       resolved({ w: i.width, h: i.height })
  //     };
  //     i.src = file
  //   })
  // }

  let loadData = async (id) => {
    // const { uri: localUri } = await FileSystem.downloadAsync(`http://192.168.0.200:8080/api/challenges/${id}/background`, FileSystem.documentDirectory + 'name.jpg');

    let responseDatail = await ChallengeApi.getDetail(id);

    setChallengeDetail(responseDatail.data);

    let response = await ChallengeApi.getBackgroundBase64(id);
    // console.log(response.data.background.slice(0,100))

    let url = `data:image/jpeg;base64, ${response.data.background}`;

    // let dimensions = await getImageDimensions(url)
    Image.getSize(url, (w, h) => {

      setBackgroundImage({
        imageHeight: h,
        imageWidth: w,
        url: url
      });
    })

    // console.log(localUri)
  }

  useEffect(() => {

    loadData(1);

  }, [])

  let MapView = () => {
    // console.log(backgroundUrl.slice(0,100))
    // return (
    //   <View style={StyleSheet.absoluteFill}>
    //     <Image
    //     style={styles.image}
    //       source={{
    //         uri: backgroundUrl
    //       }}

    //     />
    //   </View>)


    return (
      <PinchGestureHandler {...pinchGestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <>
            {/* <Button
              title="<"
              style={styles.buttonPrev}
            /> */}
       
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
              <Svg height="100%" width="100%" viewBox="0 0 100 100" style={styles.svg}>
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="blue"
                  strokeWidth="2.5"
                  fill="green"
                />
                <Rect
                  x="15"
                  y="15"
                  width="70"
                  height="70"
                  stroke="red"
                  strokeWidth="2"
                  fill="yellow"
                />
              </Svg>
            </Animated.View>
          </>
        </Animated.View>
      </PinchGestureHandler>
    )
  }


  return (
    <View style={styles.container}>
      {backgroundImage && challengeDetail ? (
        MapView()
      )
        : (<>
          <Text>Salut</Text>
        </>)
      }
    </View >
  );
};