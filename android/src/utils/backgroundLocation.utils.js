
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import {addLocation} from './locationStorage'

const TASK_FETCH_LOCATION = 'acrobatt';

const geodist = require('geodist');

export async function isTracking() {
  return await Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION);
}


export async function startTracking() {
  await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    accuracy: Location.Accuracy.Highest,
    timeInterval: 5 * 1000,
    
    
    foregroundService: {
      notificationTitle: 'Bonne course',
      notificationBody: 'Acrobatt vous observe courir',
      notificationColor: '#333333',
    },

    activityType: Location.ActivityType.Fitness,
    showsBackgroundLocationIndicator: true,
  });
  console.log('background location traking begin');
}


export async function stopTracking() {
  await Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
  console.log('background location traking end');
}

export function getDistanceFromLocations(locations) {
  if (locations.length < 2) {
    return 0;
  }

  return locations
    .map(location => ({ lat: location.coords.latitude, lon: location.coords.longitude }))
    .reduce((distance, location, index, all) => {
      if (index === 0) {
        return distance;
      }
      
      const total = distance + geodist(
        all[index - 1],
        location,
        { exact: true, unit: 'meters' },
      );

      return total;
    }, 0);
}



TaskManager.defineTask(TASK_FETCH_LOCATION, async (event) => {
  if (event.error) {
    return console.error('Error from location task ', event.error);
  }

  const locations = (event.data).locations;
  console.log('Received new locations', locations);

  try {
    for (const location of locations) {
      await addLocation(location);
    }
  } catch (error) {
    console.log('Something went wrong when saving a new location...', error);
  }
});

