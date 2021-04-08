import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChallengeApi from '../../api/challenge.api';
import { Button } from '../ui';
import { Pedometer } from 'expo-sensors';
import Map from './Map'
import UserSessionApi from '../../api/user-session.api';
import { useInterval } from '../../utils/useInterval';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  buttonPause: {
    zIndex: 100,
    bottom: 20,
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  metersCount: {
    zIndex: 100,
    top: 10,
    margin: 10,
    padding: 10,
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    opacity: 0.8,
  },
  box: {
    height: 150,
    width: 150,
    borderRadius: 5,
    position: "absolute",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    // borderWidth: 2,
    // borderColor:"blue",
  }
});

export default ({ id, onUpdateRunningChallenge }) => {
  const [base64, setBase64] = useState(null);
  const [challengeDetail, setChallengeDetail] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [distanceBase, setDistanceBase] = useState(null);
  const [stepToRemove,setStepToRemove] = useState(0);

  let pause = () => {
    unsubscribe();
    onUpdateRunningChallenge(null);
  }

  let [meterState, setMeterState] = useState({
    isPedometerAvailable: "checking",
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

  };

  let unsubscribe = () => {
    meterState.subscription && meterState.subscription.remove();

    setMeterState((current) => ({
      ...current,
      subscription: null,
    }));
  };

  // let updateSelectedSegment = async () => {
  //   let responseSession = await UserSessionApi.self(id);

  //   setUserSession(responseSession.data);
  // }

  let getPodometerDistance = () => {
    return (Math.round(((meterState.currentStepCount - stepToRemove) * 0.89) * 100) / 100);
  }

  let getDistance = () => {
    let podometerValue = getPodometerDistance();

    return Math.round((distanceBase + podometerValue) * 100) / 100;
  }

  let loadData = async () => {
    let responseDetail = await ChallengeApi.getDetail(id);

    setChallengeDetail(responseDetail.data);

    let responseSession = await UserSessionApi.self(id);

    setUserSession(responseSession.data);

    setDistanceBase(responseSession.data.totalAdvancement);

    let responseBase64 = await ChallengeApi.getBackgroundBase64(id);

    setBase64(responseBase64.data.background);

    subscribe();
  }

  useEffect(() => {

    loadData();

    return () => {
     unsubscribe(); 
    }

  }, [])

  let advance = async () => {
    // console.log("currentStepCount",meterState.currentStepCount)
    // console.log("stepToRemove",stepToRemove)

    if (meterState?.currentStepCount !== null &&
       (meterState?.currentStepCount - stepToRemove) !== 0) {

        // console.log("step not equal")

      let responseAdvance = await UserSessionApi.selfAdvance({
        challengeId: id,
        advancement: (Math.round(((meterState.currentStepCount - stepToRemove) * 0.89) * 100) / 100),
      });

      // console.log("userSession", userSession);
      // console.log("responseAdvance.data", responseAdvance.data);

        setDistanceBase(responseAdvance.data.totalAdvancement);
      
        setStepToRemove(meterState.currentStepCount);
      
        setUserSession(responseAdvance.data);

      if (responseAdvance.data.isEnd === true) {
        ToastAndroid.show("Challenge teminé", ToastAndroid.SHORT);
      }
    }
  }
  let f = useCallback(async () => {
    advance();
  }, [meterState,stepToRemove]);

  useInterval(f, 5000);

  // console.log("currentStepCount ", meterState.currentStepCount)

  return (
    <View style={styles.container}>
      {base64 && challengeDetail ? (
        <View style={StyleSheet.absoluteFill}>

          <Map
            base64={base64}
            checkpoints={challengeDetail.checkpoints}
            segments={challengeDetail.segments}
            selectedSegmentId={userSession.currentSegmentId}
            // onUpdateSelectedSegment={updateSelectedSegment}
            totalDistance={getDistance()}
            distance={getPodometerDistance() + userSession.advancement}
            scale={challengeDetail.scale}
          />

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

            <Text>{getDistance()} mètres</Text>

          </Animated.View>

        </View>
      )
        : (<>
          <Text>Salut</Text>
        </>)
      }
    </View >
  );
};