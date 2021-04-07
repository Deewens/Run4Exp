import React, { useState } from 'react';
import ChallengeDetail from '../components/challenge/ChallengeDetail'
import ChallengeMap from '../components/challenge/ChallengeMap'


const ChallengeScreen = ({ navigation, route }) => {
  const id = route.params.id;

  const [runningChallenge, setRunningChallenge] = useState(null);

  let updateRunningChallenge = (running) => {
    setRunningChallenge(running)
  }

  return runningChallenge !== null ?
    (
      <ChallengeMap
        id={id}
        onUpdateRunningChallenge={updateRunningChallenge}
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
