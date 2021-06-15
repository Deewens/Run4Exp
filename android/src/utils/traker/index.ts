import { usePedometer } from "./pedometer.traker";
import { useGps } from "./gps.traker";
import { Traker } from "./types";

export const useTraker = (transportMean): Traker => {
  let traker = transportMean === "pedometer" ? usePedometer() : useGps();

  return traker;
};
