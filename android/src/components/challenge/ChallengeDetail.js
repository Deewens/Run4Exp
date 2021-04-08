import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ToastAndroid } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Spacer, Button, Image } from '../ui';
import ThemedPage from '../ui/ThemedPage';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import UserSessionApi from '../../api/user-session.api';

let createStyles = (selectedTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      marginLeft: 20
    },
    text: {
      padding: 5,
      paddingTop: 0,
      margin: 10,
      color: selectedTheme.colors.text,
    }
  });
}

export default ({ navigation, id, onUpdateRunningChallenge }) => {
  const [challengeDetails, setChallengeDetails] = useState([]);
  const [base64, setBase64] = useState(null);
  const [userSession, setUserSession] = useState(null);

  const theme = useTheme();

  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  let styles = createStyles(selectedTheme);

    let startChallenge = async () => {
      try {
        console.log(id)
        let responseSession = await UserSessionApi.create({challengeId: id});
  
          setUserSession(responseSession.data);
          onUpdateRunningChallenge(id);
      } catch  {
        ToastAndroid.show("Erreur lors du démarage du challenge");
      }
    }

  let readData = async () => {

    try {
      let responseSession = await UserSessionApi.self(id);

      if (responseSession.status === 200) {
        setUserSession(responseSession.data);
      }
    } catch  {
    }
    
    var response = await ChallengeApi.getDetail(id);

    setChallengeDetails(response.data);

    let responseBackground = await ChallengeApi.getBackgroundBase64(id);

    setBase64(responseBackground.data.background);
  };

  useEffect(() => {
    readData();
  }, []);

  return challengeDetails != undefined ? (
    <ThemedPage title={challengeDetails?.name} onUserPress={() => navigation.openDrawer()}>
      <Button title="Retour" color="blue" onPress={() => navigation.navigate('Challenges')} />
      <Image
        height={300}
        width={400}
        base64={base64}
        isLoading={base64 === null}
      />
      <Text style={styles.text}>{challengeDetails?.description}</Text>

      <Spacer />
      {
        !userSession ? (
          <Button title="Débuter course" color="blue" center onPress={() => startChallenge()} />
        )
          : !userSession.isEnd ?
          (
            <Button title="Reprendre la course" color="red" center onPress={() => onUpdateRunningChallenge(id)} />
          )
          :
          (
            <Text>Vous avez fini ce challenge, bravo !</Text>
          )
      }
    </ThemedPage>
  ) :
    (
      <View>
        Loading ...
      </View>
    );
};
