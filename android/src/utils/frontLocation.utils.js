import React, { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import { useInterval } from './useInterval';

export default function useFrontLocation() {
  const [locations, setLocations] = useState([]);
  const [stopTask, setStopTask] = useState(false);
  
  const geodist = require('geodist');

  let f = useCallback(async () => {

    if (stopTask) {
      return;
    }

    let getLocation = await Location.getCurrentPositionAsync({
      accuracy: 6,
      distanceInterval: 1,
      timeInterval: 100
    });
    setLocations(current => {
      current.push(getLocation);
      return current;
    });

  }, [locations, stopTask]);

  useInterval(f, 5000);

  let getDistance = () => {
    if (locations.length < 2) {
      return 0;
    }
    console.log("locations",locations)
    
    return locations
      .map(locationItem => ({ lat: locationItem.coords.latitude, lon: locationItem.coords.longitude }))
      .reduce((distance, locationItem, index, all) => {
        if (index === 0) {
          return distance;
        }
        console.log(distance)
        const total = distance + geodist(
          all[index - 1],
          locationItem,
          { exact: true, unit: 'meters' },
        );
  
        return total;
      }, 0);
  }

  return {
    locations,
    isStopped: stopTask,
    SetStop: setStopTask,
    getDistance
  }
}
