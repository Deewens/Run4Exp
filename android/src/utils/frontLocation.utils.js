import React, { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import { useInterval } from './useInterval';

export default function useFrontLocation() {
  const [locations, setLocations] = useState([]);

  const geodist = require('geodist');

  let f = useCallback(async () => {

    let getLocation = await Location.getCurrentPositionAsync({
      accuracy: 6,
      distanceInterval: 1.5,
      timeInterval: 1000
    });

    if (locations.length > 0) {
      let lastLoc = locations[locations.length - 1];
      if (lastLoc.coords.latitude === getLocation.coords.latitude &&
        lastLoc.coords.longitude === getLocation.coords.longitude) {
        return;
      }
    }

    setLocations(current => {
      current.push(getLocation);
      return current;
    });

  }, [locations]);

  useInterval(f, 2000);

  let getDistance = () => {
    if (locations.length < 2) {
      return 0;
    }

    return locations
      .map(locationItem => ({ lat: locationItem.coords.latitude, lon: locationItem.coords.longitude }))
      .reduce((distance, locationItem, index, all) => {
        if (index === 0) {
          return distance;
        }

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
    getDistance
  }
}
