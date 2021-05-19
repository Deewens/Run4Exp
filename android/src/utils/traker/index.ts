import { usePedometer } from "./pedometer.traker";

export const useTraker = (useGps: boolean) => {
  let pedometer = usePedometer();

  let subscribe = () => {
    return pedometer.subscribe();
  };

  let unsubscribe = () => {
    return pedometer.unsubscribe();
  };

  let getStepMeters = (stepToRemove) => {
    return pedometer.getStepMeters(stepToRemove);
  };

  return {
    subscribe,
    unsubscribe,
    getStepMeters,
    currentStepCount: pedometer.currentStepCount,
    meterState: pedometer.meterState,
  };
};
