import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChallengeApi from '../../api/challenge.api';
import { Button } from '../ui';
import { Pedometer } from 'expo-sensors';
import Map from './Map'

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

export default ({id ,onUpdateRunningChallenge}) => {
  const [base64, setBase64] = useState(null);
  const [challengeDetail, setChallengeDetail] = useState(null);

  let pause = () => {
    unsubscribe();
    onUpdateRunningChallenge(null);
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

  let loadData = async () => {
    let responseDetail = await ChallengeApi.getDetail(id);

    setChallengeDetail(responseDetail.data);

    let responseBase64 = await ChallengeApi.getBackgroundBase64(id);

    setBase64(responseBase64.data.background);

    subscribe();
  }

  useEffect(() => {

    loadData();

  }, [])

  return (
    <View style={styles.container}>
      {base64 && challengeDetail ? (
        <View style={StyleSheet.absoluteFill}>

          <Map 
          base64={base64}
          checkpoints={challengeDetail.checkpoints}
          segments={challengeDetail.segments}
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

            <Text>{meterState.currentStepCount} pas</Text>

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