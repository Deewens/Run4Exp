import { Pedometer } from "expo-sensors";
import { useState } from "react";
import { roundTwoDecimal } from "../math.utils";
import { Traker } from "./types";

export let useDev = (): Traker => {
  const [meterState, setMeterState] = useState(0);

  let subscribe = () => {
    setMeterState(0);
  };

  let unsubscribe = () => {
    setMeterState(0);
  };

  let getMeters = () => {
    return meterState;
  };

  let reset = () => {
    unsubscribe();

    setMeterState(0);
  };

  let addOneMeter = () => {
    setMeterState((current) => current + 1);
  };

  return {
    subscribe,
    unsubscribe,
    getMeters,
    reset,
    addOneMeter,
  };
};
