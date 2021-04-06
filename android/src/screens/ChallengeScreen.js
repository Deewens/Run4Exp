import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";
import Spacer from "../components/Spacer";
import ChallengeApi from "../api/challenge.api";
import { apiUrl } from "../utils/const";
import { Context as AuthContext } from '../context/AuthContext';
import ThemedPage from "../components/ThemedPage";
import Button from "../components/Button";
import Image from "../components/Image"

const ChallengeScreen = ({ navigation, route }) => {
  const id = route.params.id;

  let [challengeDetails, setChallengeDetails] = useState([]);
  const [startRecording, setStartRecording] = useState();
  const [base64, setBase64] = useState(null);

  const readData = async () => {
    var response = await ChallengeApi.getDetail(id);

    setChallengeDetails(response.data);

    let responseBackground = await ChallengeApi.getBackgroundBase64(id);

    setBase64(responseBackground.data.background);
  };

  useEffect(() => {
    readData();
  }, []);
  return challengeDetails != undefined ? (
    <ThemedPage title={challengeDetails?.name}>
      <Button title="Retour" color="blue" onPress={() => navigation.navigate('Challenges')} />
      <Image
        height={300}
        width={400}
        base64={base64}
        isLoading={base64 === null}
      />
      <Text style={styles.text}>{challengeDetails?.description}</Text>

      <Spacer />
      {startRecording ? (
        <Button title="Stop" color="blue" center onPress={() => setStartRecording(false)} />
      ) : (
        <Button title="Débuter course" color="blue" center onPress={() => setStartRecording(true)} />
      )}
    </ThemedPage>
  ) :
    (
      <View>
        Loading ...
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    marginLeft: 20
  },
  title: {
    fontSize: 40
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    padding: 5,
    paddingTop: 0,
    opacity: 0.7,
  }
});

export default ChallengeScreen;
