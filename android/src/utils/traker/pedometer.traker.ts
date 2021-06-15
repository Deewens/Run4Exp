import { Pedometer } from "expo-sensors";
import { useState } from "react";
import { roundTwoDecimal } from "../math.utils";
import { Traker } from "./types";

export let usePedometer = (): Traker => {
  const [userSession, setUserSession] = useState(null);

  const [meterState, setMeterState] = useState({
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0,
    subscription: null,
  });

  const [metersToAdd, setMetersToAdd] = useState(0);

  let subscribe = () => {
    var subscription = Pedometer.watchStepCount((result) => {
      setMeterState((current) => ({
        ...current,
        currentStepCount: result.steps,
      }));
    });

    setMeterState((current) => ({
      ...current,
      subscription,
    }));
  };

  let unsubscribe = () => {
    setMetersToAdd(getMeters());
    meterState.subscription && meterState.subscription.remove();

    setMeterState((current) => ({
      ...current,
      subscription: null,
    }));
  };

  let getMeters = () => {
    return roundTwoDecimal(meterState.currentStepCount * 0.64 + metersToAdd);
  };

  return {
    subscribe,
    unsubscribe,
    getMeters,
  };
};
