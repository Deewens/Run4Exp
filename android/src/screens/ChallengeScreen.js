import React, { useState } from 'react';
import ChallengeDetail from '../components/challenge/ChallengeDetail'
import ChallengeMap from '../components/challenge/ChallengeMap'


const ChallengeScreen = ({ navigation, route }) => {
  const id = route.params.id;

  const [runningChallenge, setRunningChallenge] = useState(null);

  let updateRunningChallenge = (sid,transportMean) => {
    console.log("transportMeanfbdf",transportMean)
    setRunningChallenge({id:sid,transportMean})
  }

  return runningChallenge !== null ?
    (
      <ChallengeMap
        id={id}
        onUpdateRunningChallenge={updateRunningChallenge}
        transportMean={runningChallenge.transportMean}
        navigation={navigation} />
    )
    :
    (
      <ChallengeDetail
        id={id}
        onUpdateRunningChallenge={updateRunningChallenge}
        navigation={navigation} />
    );
};

export default ChallengeScreen;
