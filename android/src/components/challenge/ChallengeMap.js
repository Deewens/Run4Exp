import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  const [distanceToAdd, setDistanceToAdd] = useState(null);

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

      setDistanceToAdd((current) => current + result.steps - meterState.currentStepCount);

      setMeterState((current) => ({
        ...current,
        currentStepCount: result.steps,
      }));
    });

    setMeterState((current) => ({
      ...current,
      subscription,
    }));

    // Pedometer.isAvailableAsync().then(
    //   (result) => {
    //     setMeterState((current) => ({
    //       ...current,
    //       isPedometerAvailable: String(result),
    //     }));
    //   },
    //   (error) => {
    //     setMeterState((current) => ({
    //       ...current,
    //       isPedometerAvailable: "Could not get isPedometerAvailable: " + error,
    //     }));
    //   }
    // );

  };

  let unsubscribe = () => {
    meterState.subscription && meterState.subscription.remove();

    setMeterState((current) => ({
      ...current,
      subscription: null,
    }));
  };

  let updateSelectedSegment = async (newSegmentId) => {

    let responseSession = await UserSessionApi.self(id);

    setUserSession(responseSession.data);
  }

  let loadData = async () => {
    let responseDetail = await ChallengeApi.getDetail(id);

    setChallengeDetail(responseDetail.data);

    let responseSession = await UserSessionApi.self(id);

    setUserSession(responseSession.data);

    let responseBase64 = await ChallengeApi.getBackgroundBase64(id);

    setBase64(responseBase64.data.background);

    subscribe();
  }

  useEffect(() => {

    loadData();

  }, [])

let advance = async () =>{
  console.log("advance",distanceToAdd)
  if (distanceToAdd !== null) {
    await UserSessionApi.selfAdvance({
      challengeId: id,
      advancement: distanceToAdd,
    });

    setDistanceToAdd(0);
  }
}
  let f = useCallback(async () => {
    advance();
  }, [distanceToAdd]);

  useInterval(f, 10000);

  console.log("distanceToAdd", distanceToAdd);
  console.log("currentStepCount ", meterState.currentStepCount)

  return (
    <View style={styles.container}>
      {base64 && challengeDetail ? (
        <View style={StyleSheet.absoluteFill}>

          <Map
            base64={base64}
            checkpoints={challengeDetail.checkpoints}
            segments={challengeDetail.segments}
            selectedSegmentId={userSession.currentSegmentId}
            onUpdateSelectedSegment={updateSelectedSegment}
            distance={Math.round((meterState.currentStepCount * 0.89) * 100) / 100}
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

            <Text>{Math.round((meterState.currentStepCount * 0.89) * 100) / 100} mètres</Text>

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