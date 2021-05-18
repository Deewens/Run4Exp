import { usePedometer } from "./pedometer.traker";
import { useGps } from "./gps.traker";
import { TransportMeans } from "../transportMeans";

export const useTraker = (transportMean: TransportMeans) => {
  let traker = transportMean === "pedometer" ? usePedometer() : useGps();

  let subscribe = () => {
    return traker.subscribe();
  };

  let unsubscribe = () => {
    return traker.unsubscribe();
  };

  let getStepMeters = (stepToRemove) => {
    if (transportMean !== "pedometer") {
      return;
    }
    return traker.getStepMeters(stepToRemove);
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
