import { usePedometer } from "./pedometer.traker";
import { useGps } from "./gps.traker";

export const useTraker = (transportMean) => {
  let traker = transportMean === "pedometer" ? usePedometer() : useGps();

  let subscribe = () => {
    return traker.subscribe();
  };

  let unsubscribe = () => {
    return traker.unsubscribe();
  };

  let getStepMeters = () => {
    if (transportMean !== "pedometer") {
      return;
    }
    return traker.getStepMeters();
  };

  let getGpsMeters = () => {
    if (transportMean === "pedometer") {
      return;
    }

    return traker.getGpsMeters();
  };

  return {
    subscribe,
    unsubscribe,
    getStepMeters,
    getGpsMeters,
    currentStepCount: traker?.currentStepCount,
    meterState: traker?.meterState,
  };
};
