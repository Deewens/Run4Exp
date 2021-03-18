import React, { useContext, useEffect, useState } from "react";
import { Platform, Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spacer from "../components/Spacer";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const TASK_FETCH_LOCATION = 'acrobatt';

TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
  console.error("loc")
  if (error) {
    console.error(error);
    return;
  }
  const [locationtt] = locations;
  setUpdateMsg(locations);
});

const LocationScreen = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  const [updateMsg, setUpdateMsg] = useState("");

  const [running, setRunning] = useState(false);

  const [meter, setMeter] = useState(0);

  let start = () => {
    setMeter(0);
    setRunning(true);

    Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 1,
      deferredUpdatesInterval: 1000,

      foregroundService: {
        notificationTitle: 'Location Activé',
        notificationBody: 'Vous pouvez la désactivé depuis l\'application',
      },
    });
  }
  

  let stop = () => {
  setRunning(false);

  Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
    if (value) {
      Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
    }
  });
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
      <Text>
      {updateMsg}
      </Text>
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
