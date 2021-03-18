
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const TASK_FETCH_LOCATION = 'acrobatt';

export async function isTracking() {
  return await Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION);
}


export async function startTracking() {
  await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 1000,
    
    foregroundService: {
      notificationTitle: 'Office marathon is active',
      notificationBody: 'Monitoring your location to measure total distance',
      notificationColor: '#333333',
    },

    activityType: Location.ActivityType.Fitness,
    showsBackgroundLocationIndicator: true,
  });
  console.log('[tracking]', 'started background location task');
}


export async function stopTracking() {
  await Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
  console.log('[tracking]', 'stopped background location task');
}


TaskManager.defineTask(TASK_FETCH_LOCATION, async (event) => {
  if (event.error) {
    return console.error('[tracking]', 'Something went wrong within the background location task...', event.error);
  }

  const locations = (event.data).locations;
  console.log('[tracking]', 'Received new locations', locations);

  try {
    for (const location of locations) {
      await addLocation(location);
    }
  } catch (error) {
    console.log('[tracking]', 'Something went wrong when saving a new location...', error);
  }
});