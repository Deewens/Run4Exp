import { useState } from "react";
import { LOCATION, usePermissions } from 'expo-permissions';
import { getLocations } from "../locationStorage";
import { startTracking, stopTracking, getDistanceFromLocations } from '../../utils/backgroundLocation.utils';

export let useGps = () => {
  const [meter, setMeter] = useState(null);
  const [permission, askPermission] = usePermissions(LOCATION);

  if (!(permission?.granted)) {
    askPermission(true);
  }

  let subscribe = () => {
    startTracking();

    setInterval(async () => {
      if (permission?.granted) {
        var locationList = await getLocations();

        var currentDistance = await getDistanceFromLocations(locationList);

        setMeter(Math.round(currentDistance));
      }
    }, 1000);

  };

  let unsubscribe = () => {
    stopTracking();
  };

  let getGpsMeters = () => {
    return meter;
  }

  return {
    meterState: meter,
    subscribe,
    unsubscribe,
    getGpsMeters,
    currentStepCount: meter,
  }
}

