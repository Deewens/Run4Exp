import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, AppState } from "react-native";
import { Button } from "react-native-elements";
import * as Location from 'expo-location';
import { LOCATION, usePermissions } from 'expo-permissions';
import {startTracking, isTracking, stopTracking, getDistanceFromLocations} from '../utils/backgroundLocation.utils';
import {getLocations,addLocation,clearLocations} from '../utils/locationStorage'

const LocationScreen = () => {
  const [errorMsg, setErrorMsg] = useState(null);

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

 


useEffect(()=> {
 (async () =>{
  await clearLocations();
  })();

},[]);

  useEffect(() => {
    setInterval(async () => {
      if(running){
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
      <View variant='page'>
        <Text>We need your permission</Text>
        <Text>To monitor your office marathon, we need access to background location.</Text>
      {!permission
        ? <Text>Chargement</Text>
        : <Button onPress={askPermission}>Grant permission</Button>
      }
    </View>
    );
  }

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
