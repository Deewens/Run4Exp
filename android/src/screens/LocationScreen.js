import React, { useContext, useEffect, useState } from "react";
import { Platform, Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import Spacer from "../components/Spacer";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';


const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [updateMsg, setUpdateMsg] = useState(null);

  const TASK_FETCH_LOCATION = 'acrobatt';

  let start = () => {
    // 2 start the task
    Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 5, // minimum change (in meters) betweens updates
      deferredUpdatesInterval: 5000, // minimum interval (in milliseconds) between updates
      // foregroundService is how you get the task to be updated as often as would be if the app was open
      foregroundService: {
        notificationTitle: 'Using your location',
        notificationBody: 'To turn off, go back to the app and switch something off.',
      },
    });
  }
  

  let stop = () => {
  // 3 when you're done, stop it
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

      // 1 define the task passing its name and a callback that will be called whenever the location changes
      TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        const [locationtt] = locations;
        setUpdateMsg(locationtt);
      });
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>Location</Text>
      <Text>
        {text}
      </Text>
      <Text>
      {updateMsg}
      </Text>
      <Button title="Start" onPress={start} />
      <Button title="Stop" onPress={stop} />
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
