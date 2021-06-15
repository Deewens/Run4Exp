import { useCallback, useEffect, useState } from "react";
import { LOCATION, usePermissions } from "expo-permissions";
import useFrontLocation from "../frontLocation.utils";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { navigate } from "../../navigation/RootNavigation";
import { ToastAndroid } from "react-native";
import { Traker } from "./types";
import { useInterval } from "../useInterval";
import { roundTwoDecimal } from "../math.utils";

export let useGps = (): Traker => {
  const [permission, askPermission] = usePermissions(LOCATION);
  const [locations, setLocations] = useState([]);

  const geodist = require("geodist");

  let getDistance = () => {
    if (locations.length < 2) {
      return 0;
    }

    return locations
      .map((locationItem) => ({
        lat: locationItem.coords.latitude,
        lon: locationItem.coords.longitude,
      }))
      .reduce((distance, locationItem, index, all) => {
        if (index === 0) {
          return distance;
        }

        const total =
          distance +
          geodist(all[index - 1], locationItem, {
            exact: true,
            unit: "meters",
          });

        return total;
      }, 0);
  };

  let checkPermission = async () => {
    if (!permission?.granted) {
      // let { loc:status } = await Permissions.askAsync(Permissions.LOCATION);
      // if (status !== 'granted') {
      //   this.setState({
      //     errorMessage: 'Permission to access location was denied',
      //   });
      // }

      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show(
          "La permission pour accéder à votre position a été refusé",
          ToastAndroid.LONG
        );

        navigate("Mes courses");
        return;
      }

      // let { status } = await Location.requestPermissionsAsync();
      // if (status !== 'granted') {
      //   return;
      // }

      askPermission();
    }
  };

  let f = useCallback(async () => {
    console.log(locations);
    let getLocation = await Location.getCurrentPositionAsync({
      accuracy: 6,
      distanceInterval: 1.5,
      timeInterval: 1000,
    });

    if (locations.length > 0) {
      let lastLoc = locations[locations.length - 1];
      if (
        lastLoc.coords.latitude === getLocation.coords.latitude &&
        lastLoc.coords.longitude === getLocation.coords.longitude
      ) {
        return;
      }
    }

    setLocations((current) => {
      current.push(getLocation);
      return current;
    });
  }, [locations]);

  useInterval(f, 2000);

  let subscribe = () => {
    return;
  };

  let unsubscribe = () => {
    return;
  };

  let getMeters = (): number => {
    if (getDistance() === 0) {
      return 0;
    }
    console.log(
      "roundTwoDecimal(getDistance())",
      roundTwoDecimal(getDistance())
    );
    return roundTwoDecimal(getDistance());
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    subscribe,
    unsubscribe,
    getMeters,
  };
};
