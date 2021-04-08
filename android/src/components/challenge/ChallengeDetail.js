import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Spacer, Button, Image } from '../ui';
import ThemedPage from '../ui/ThemedPage';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';

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

  const theme = useTheme();

  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  let styles = createStyles(selectedTheme);

  let readData = async () => {
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
      <Button title="Débuter course" color="blue" center onPress={() => onUpdateRunningChallenge(id)} />
    </ThemedPage>
  ) :
    (
      <View>
        Loading ...
      </View>
    );
};
