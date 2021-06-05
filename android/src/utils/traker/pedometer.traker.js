import { Pedometer } from "expo-sensors";
import { useState } from "react";
import { roundTwoDecimal } from "../math.utils";
export let usePedometer = (canProgress) => {
  const [userSession, setUserSession] = useState(null);

  let [meterState, setMeterState] = useState({
    isPedometerAvailable: "checking",
    currentStepCount: 0,
    subscription: null,
  });
  
  let subscribe = () => {
    var subscription = Pedometer.watchStepCount((result) => {

      if(canProgress){
        setMeterState((current) => ({
          ...current,
          currentStepCount: result.steps,
        }));
      }
    });

    setMeterState((current) => ({
      ...current,
      subscription,
    }));

  };

  let unsubscribe = () => {
    meterState.subscription && meterState.subscription.remove();

    setMeterState((current) => ({
      ...current,
      subscription: null,
    }));
  };

  let getStepMeters = () => {
    return roundTwoDecimal(meterState.currentStepCount * 0.64);
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

