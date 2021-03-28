import React, { useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";
import Button from "../components/Button"
import { LOCATION, usePermissions } from 'expo-permissions';
import { startTracking, stopTracking, getDistanceFromLocations } from '../utils/backgroundLocation.utils';
import { getLocations, clearLocations } from '../utils/locationStorage'
import ThemedPage from "../components/ThemedPage";

const LocationScreen = ({navigation}) => {
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
      <ThemedPage variant='page' onUserPress={() => navigation.openDrawer()}>
        <Text>We need your permission</Text>
        <Text>To monitor your office marathon, we need access to background location.</Text>
        {!permission
          ? <Text>Chargement</Text>
          : <Button onPress={askPermission}>Grant permission</Button>
        }
      </ThemedPage>
    );
  }

  return (
    <ThemedPage title="Location" onUserPress={() => navigation.openDrawer()}>
      {running ?
        (
          <>
            <Text style={{ fontSize: 30, textAlign: "center" }}>
              {meter} m
      </Text>
            <Button center title="Stop" onPress={stop} color="red"/>
          </>)
        :
        (<Button center title="Start" onPress={start} color="blue"/>)
      }
    </ThemedPage>
  );
};

export default LocationScreen;
