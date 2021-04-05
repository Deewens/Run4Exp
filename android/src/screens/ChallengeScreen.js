import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView, Image } from "react-native";
import Spacer from "../components/Spacer";
import ChallengeApi from "../api/challenge.api";
import { apiUrl } from "../utils/const";
import { Context as AuthContext } from '../context/AuthContext';
import ThemedPage from "../components/ThemedPage";
import Button from "../components/Button";

const ChallengeScreen = ({ navigation, route }) => {
  const { getToken } = useContext(AuthContext);
  const id = route.params.id;

  let [token, setToken] = useState([]);
  let [challengeDetails, setChallengeDetails] = useState([]);
  const [startRecording, setStartRecording] = useState();

  const readData = async () => {
    setToken(await getToken);

    var response = await ChallengeApi.getDetail(id);

    setChallengeDetails(response.data);
  };

  useEffect(() => {
    readData();
  }, []);
  return challengeDetails != undefined ? (
    <ThemedPage title={challengeDetails?.name}>
      <Button title="Retour" color="blue" onPress={() => navigation.navigate('Challenges')} />
      <Image
        style={styles.background}
        source={{
          uri: `${apiUrl}/challenges/${id}/background`,
          headers: { Authorization: `Bearer ${token}` },
        }}
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
  background: {
    width: 400,
    height: 300,
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
