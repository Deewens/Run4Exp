import { useEffect, useState } from "react";
import { LOCATION, usePermissions } from 'expo-permissions';
import useFrontLocation from '../../utils/frontLocation.utils';
import { ToastAndroid } from "react-native";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export let useGps = (canProgress) => {
  const [permission, askPermission] = usePermissions(LOCATION);

  let {
    locations,
    isStopped,
    SetStop,
    getDistance
  } = useFrontLocation(canProgress);

  let checkPermission = async () => {
    if (!(permission?.granted)) {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      // let { status } = await Location.requestPermissionsAsync();
      // if (status !== 'granted') {
      //   ToastAndroid.show('Permission to access location was denied');
      //   return;
      // }

      askPermission(true);
      ToastAndroid.show('Using location');
    }
  }

  let subscribe = () => {
    return;
  };

  let unsubscribe = () => {
    SetStop(true)
  };

  let getGpsMeters = (advanceToRemove) => {
    if(getDistance() === 0){
      return 0;
    }

    return (Math.round((getDistance() - advanceToRemove) * 100) / 100);
  }

  useEffect(() =>{
    // checkPermission();
  },[])

  return {
    meterState: locations,
    subscribe,
    unsubscribe,
    getGpsMeters,
  }
}

