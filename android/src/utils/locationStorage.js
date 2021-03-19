import AsyncStorage from '@react-native-async-storage/async-storage';

export const locationStorageName = 'locations';


export async function getLocations(){
  const data = await AsyncStorage.getItem(locationStorageName);
  return data ? JSON.parse(data) : [];
}

export async function setLocations(locations) {
  await AsyncStorage.setItem(locationStorageName, JSON.stringify(locations));
}

export async function addLocation(location) {
  const existing = await getLocations();
  const locations = [...existing, location];
  await setLocations(locations);
  return locations;
}

export async function clearLocations() {
  await AsyncStorage.removeItem(locationStorageName);
}
