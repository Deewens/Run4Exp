import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Pedometer } from "expo-sensors";
import Spacer from "../components/Spacer";
import Button from "../components/Button"

const PodometerScreen = () => {

  const readData = async () => { };

  let [meterState, setMeterState] = useState({
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0,
    subscription: null,
  });

  let _subscribe = () => {
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

  let _unsubscribe = () => {
    meterState.subscription && meterState.subscription.remove();

    setMeterState((current) => ({
      ...current,
      subscription: null,
    }));
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>Podometre</Text>

      <Text style={{ fontSize: 50 }}>{meterState.currentStepCount}</Text>

      {!meterState.isPedometerAvailable ? (
        <Text style={{ color: "red" }}>Aucun podomètre sur cet appareil</Text>
      ) : (
        <>
          {meterState.subscription === null ? (
            <Button title="Start" onPress={_subscribe} color="blue"/>
          ) : (
            <Button title="Stop" onPress={_unsubscribe} color="red"/>
          )}
          <Spacer />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
  },
});

export default PodometerScreen;
