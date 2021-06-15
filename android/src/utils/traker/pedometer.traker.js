import { Pedometer } from "expo-sensors";
import { useCallback, useEffect, useRef, useState } from "react";
import { roundTwoDecimal } from "../math.utils";
import { AppState } from 'react-native';

export let usePedometer = (canProgress) => {
  const [userSession, setUserSession] = useState(null);

  const [meterState, setMeterState] = useState({
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
    subscription: null
  });

  const appState = useRef(AppState.currentState);

  const [appStateVisible,setAppStateVisible] = useState(appState.current);
  const [backgroundDate,setBackgroundDate] = useState(new Date());
  const [metersToAdd,setMetersToAdd] = useState(0);
  
  let call = useCallback((result) => {
        setMeterState((current) => ({
          ...current,
          currentStepCount: result.steps,
        }));
  },[canProgress]);

  let subscribe = () => {
    var subscription = Pedometer.watchStepCount((result) => {
      call(result)
    });

    setMeterState((current) => ({
      ...current,
      subscription,
    }));

  };

  let unsubscribe = () => {
    setMetersToAdd(getStepMeters());
    meterState.subscription && meterState.subscription.remove();

    setMeterState((current) => ({
      ...current,
      subscription: null,
    }));
  };

  let getStepMeters = () => {
  return roundTwoDecimal((meterState.currentStepCount * 0.64 ) + (metersToAdd));
  }

  let backgroundState = (state) => {
    return state.match(/inactive|background/);
  }

  let activeState = (state) => {
    return state.match(/active/);
  }

  // L'enregistrement des pas en arrière plan ne marche pas sur android :(
  let handleAppStateChange = (nextAppState) => {
    
    if (backgroundState(nextAppState)) {
      console.log("App is going background");
      setBackgroundDate(new Date());
    } else if(activeState(nextAppState)){
      console.log("App is coming to foreground");

      const end = new Date();
      Pedometer.getStepCountAsync(backgroundDate, end).then(
        result => {
          console.log("backgroundSteps",result)
        },
        error => {
            console.log('Could not get stepCount: ' + error)
        }
      );

    }
    setAppStateVisible(nextAppState);
  }

  useEffect(() =>{
    // console.log("Nouveau podomètre")
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      // console.log("Fin podomètre")
    }
  }
  ,[]);

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

