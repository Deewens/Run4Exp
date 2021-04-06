import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import Animated, { Value, block, cond, eq, multiply, set, useCode } from 'react-native-reanimated';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { onGestureEvent, pinchActive, pinchBegan, translate, vec } from 'react-native-redash/lib/module/v1';
import ChallengeApi from '../../api/challenge.api';
import Svg, { Polyline } from 'react-native-svg';
import Checkpoint from '../../components/challenge/Checkpoint';
import { Button } from '../ui';
import { Pedometer } from 'expo-sensors';

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
  buttonPause: {
    zIndex: 100,
    bottom: 20,
    position:"absolute",
    width:"100%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  metersCount: {
    zIndex: 100,
    top: 10,
    margin:10,
    padding: 10,
    position:"absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    opacity: 0.8,
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

export default (props) => {
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

  let pause = () => {
    unsubscribe();
    props.onUpdateRunningChallenge(null);
  }

  let [meterState, setMeterState] = useState({
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0,
    subscription: null,
  });


  let subscribe = () => {
    var subscription = Pedometer.watchStepCount((result) => {
      setMeterState((current) => ({
        ...current,
        currentStepCount: result.steps,
      }));
    });

    setMeterState((current) => ({
      ...current,
      subscription,
    }));

    Pedometer.isAvailableAsync().then(
      (result) => {
        setMeterState((current) => ({
          ...current,
          isPedometerAvailable: String(result),
        }));
      },
      (error) => {
        setMeterState((current) => ({
          ...current,
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error,
        }));
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        setMeterState((current) => ({
          ...current,
          pastStepCount: result.steps,
        }));
      },
      (error) => {
        setMeterState((current) => ({
          ...current,
          pastStepCount: "Could not get stepCount: " + error,
        }));
      }
    );
  };

  let unsubscribe = () => {
    meterState.subscription && meterState.subscription.remove();

    setMeterState((current) => ({
      ...current,
      subscription: null,
    }));
  };


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

  let getSegmentPath = (segment) => {
    let result = "";

    segment.coordinates.forEach(element => {
      let x = element.x * backgroundImage.imageWidth;
      let y = element.y * backgroundImage.imageHeight;
      result += `${x},${y} `
    });

    return (
      <>
        <Polyline key={segment.id} stroke="red" strokeWidth="3" points={result} />
        {/* {segment.coordinates.map(function (coord) {
          let x = coord.x * backgroundImage.imageWidth;
          let y = coord.y * backgroundImage.imageHeight;

          return <Circle key={coord.x + "-" + coord.y} fill="red" stroke="red" r="5" cx={x} cy={y}/>
        })} */}
      </>
    );
  }

  let getCheckpointSvg = (checkpoint) => {

    let y = checkpoint.position.y * backgroundImage.imageHeight;
    let x = checkpoint.position.x * backgroundImage.imageWidth;

    return (
      <Checkpoint
        y={y}
        x={x}
        key={checkpoint.id} />
    );
  }

  let loadData = async () => {
    let responseDatail = await ChallengeApi.getDetail(props.id);

    setChallengeDetail(responseDatail.data);

    let response = await ChallengeApi.getBackgroundBase64(props.id);

    let url = `data:image/jpeg;base64, ${response.data.background}`;

    // let dimensions = await getImageDimensions(url)
    Image.getSize(url, (w, h) => {

      setBackgroundImage({
        imageHeight: h,
        imageWidth: w,
        url: url
      });
    })

    subscribe();

    // console.log(localUri)
  }

  useEffect(() => {

    loadData();

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

                {challengeDetail.segments.map(function (segment) {
                  return getSegmentPath(segment);
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

                {challengeDetail.checkpoints.map(function (checkpoint) {
                  return getCheckpointSvg(checkpoint);
                })}
              </Svg>

            </Animated.View>
            <Animated.View style={[styles.buttonPause]}>
              <Button
                icon="pause"
                padding={10}
                width={50} 
                color="red"
                onPress={pause}
              />
            </Animated.View>
            <Animated.View style={[styles.metersCount]}>

            <Text>{meterState.currentStepCount} pas</Text>

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