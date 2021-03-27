import React, { useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";
import Button from "../components/Button"
import { LOCATION, usePermissions } from 'expo-permissions';
import { startTracking, stopTracking, getDistanceFromLocations } from '../utils/backgroundLocation.utils';
import { getLocations, clearLocations } from '../utils/locationStorage'

const LocationScreen = () => {
  const [running, setRunning] = useState(false);

  const [meter, setMeter] = useState(0);

  const [permission, askPermission] = usePermissions(LOCATION);

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
      await clearLocations();
    })();

  }, []);

  useEffect(() => {
    setInterval(async () => {
      if (running) {
        console.log("interval")
        var locationList = await getLocations();


        // if(AppState.currentState == 'active'){
        //   console.log("manual loc")

        //   let location = await Location.getCurrentPositionAsync({});

        //   await addLocation(location);
        // }

        console.log(locationList != null)
        var currentDistance = await getDistanceFromLocations(locationList);

        console.log(currentDistance)

        setMeter(Math.round(currentDistance));
      }
    }, 5000);
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //   })();
  // }, []);

  if (!(permission?.granted)) {
    return (
      <SafeAreaView variant='page'>
        <Text>We need your permission</Text>
        <Text>To monitor your office marathon, we need access to background location.</Text>
        {!permission
          ? <Text>Chargement</Text>
          : <Button onPress={askPermission}>Grant permission</Button>
        }
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 40 }}>Location</Text>
      {running ?
        (
          <>
            <Text style={{ fontSize: 30, textAlign: "center" }}>
              {meter} m
      </Text>
            <Button title="Stop" onPress={stop} color="red"/>
          </>)
        :
        (<Button title="Start" onPress={start} color="blue"/>)
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
  },
});

export default LocationScreen;
