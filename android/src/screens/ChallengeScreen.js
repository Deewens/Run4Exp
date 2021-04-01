import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView, TouchableHighlight, Image } from "react-native";
import Spacer from "../components/Spacer";
import Challenge from "../components/Challenge";
import ChallengeApi from "../api/challenge.api";
import { apiUrl } from "../utils/const";
import { Context as AuthContext } from '../context/AuthContext';
import { ScrollView } from "react-native-gesture-handler";
import ThemedPage from "../components/ThemedPage";
import Button from "../components/Button";

const ChallengeScreen = ({navigation, route}) => {
  const { getToken } = useContext(AuthContext);
  const id = route.params.id;

  let [token, setToken] = useState([]);
  let [challengeDetails, setChallengeDetails] = useState([]);

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
      <Button title="Retour" color="blue" onPress={() => navigation.navigate('Challenges')}/>
        <Image
          style={styles.image}
          source={{
            uri: `${apiUrl}/challenges/${id}/background`,
            headers: { Authorization: `Bearer ${token}` },
          }}
          />
          <Text>{challengeDetails?.description}</Text>
        {/* <Text>Crée par {nameCreator}</Text> */}
        <Spacer />
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
  image: {
    height:100,
    width: 100
  }
});

export default ChallengeScreen;
