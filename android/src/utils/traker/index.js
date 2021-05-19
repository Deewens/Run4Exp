import { usePedometer } from "./pedometer.traker";
import { useGps } from "./gps.traker";

export const useTraker = (transportMean,canProgress) => {
  let traker = transportMean === "pedometer" ? usePedometer(canProgress) : useGps(canProgress);

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

  let getGpsMeters = (advanceToRemove) => {
    if (transportMean === "pedometer") {
      return;
    }

    return traker.getGpsMeters(advanceToRemove);
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
