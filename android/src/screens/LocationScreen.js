import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import * as Location from 'expo-location';
import {startTracking, isTracking, stopTracking} from '../utils/backgroundLocation.utils';

const LocationScreen = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  const [running, setRunning] = useState(false);

  const [meter, setMeter] = useState(0);

  let start = () => {
    setMeter(0);
    setRunning(true);
    startTracking();
  }
  

  let stop = () => {
  setRunning(false);
  stopTracking();
  }


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>Location</Text>
      {running ? 
    (
      <>
      <Text style={{ fontSize: 30, textAlign:"center" }}>
        {meter} m
      </Text>
    <Button title="Stop" onPress={stop} />
    </>)  
    :
    (<Button title="Start" onPress={start} />)
    }   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
  },
});

export default LocationScreen;
