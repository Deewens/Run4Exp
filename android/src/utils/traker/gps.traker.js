import { Pedometer } from "expo-sensors";
import { useState } from "react";
import { LOCATION, usePermissions } from 'expo-permissions';
import { getDistanceFromLocations } from "../backgroundLocation.utils";
import { getLocations } from "../locationStorage";

export let useGps = () => {
  const [meter, setMeter] = useState(null);
  const [permission, askPermission] = usePermissions(LOCATION);

  let [meterState, setMeterState] = useState({
    isPedometerAvailable: "checking",
    currentStepCount: 0,
    subscription: null,
  });
  
  let subscribe = () => {

    setInterval(async () => {
      if (running) {
        var locationList = await getLocations();

        var currentDistance = await getDistanceFromLocations(locationList);

        setMeter(Math.round(currentDistance));
      }
    }, 5000);

  };



  let unsubscribe = () => {
    meterState.subscription && meterState.subscription.remove();

    setMeterState((current) => ({
      ...current,
      subscription: null,
    }));
  };

  let getStepMeters = (stepToRemove) => {
    return (Math.round(((meterState.currentStepCount - stepToRemove) * 0.89) * 100) / 100);
  }

  return {
    userSession,
    setUserSession,
    subscribe,
    unsubscribe,
    getStepMeters,
    currentStepCount: meterState.currentStepCount,
    meterState
  }
}

