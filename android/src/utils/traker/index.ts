import { usePedometer } from "./pedometer.traker";
import { useGps } from "./gps.traker";
import { useDev } from "./dev.traker";
import { Traker } from "./types";
import { TransportMeans } from "../transportMeans";

export const useTraker = (transportMean: TransportMeans): Traker => {
  let traker =
    transportMean === "pedometer"
      ? usePedometer()
      : transportMean === "dev"
      ? useDev()
      : useGps();

  return traker;
};
