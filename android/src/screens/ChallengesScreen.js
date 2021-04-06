import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import ChallengeItem from '../components/challenge/ChallengeItem';
import ChallengeApi from '../api/challenge.api';
import { ThemedPage } from '../components/ui';

const ChallengeScreen = ({ navigation }) => {
  let [challengeList, setChallengeList] = useState([]);

  const readData = async () => {
    var response = await ChallengeApi.pagedList(0);

    await setChallengeList(response.data._embedded.challengeResponseModelList);
  };

  let navChallenge = (challengeId) => {
    navigation.navigate('Challenge', {
      id: challengeId,
    });
  }

  useEffect(() => {
    readData();
  }, []);

  return (
    <ThemedPage title="Challenges" onUserPress={() => navigation.openDrawer()}>
      {challengeList.length == 0 ? <Text style={styles.text}>Aucun challenge à présenter</Text> :
        challengeList.map(function (challenge, key) {
          return <ChallengeItem key={key} challenge={challenge} onPress={() => navChallenge(challenge.id)} />;
        })}
    </ThemedPage>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
  },
  title: {
    fontSize: 40,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
  }
});

export default ChallengeScreen;
