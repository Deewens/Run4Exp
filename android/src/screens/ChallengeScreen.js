import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import Challenge from "../components/Challenge";
import ChallengeApi from "../api/challenge.api";

const Challenge = (id) => {
  const { getToken } = useContext(AuthContext);
  let [token, setToken] = useState([]);
  let [challengeDetails, setChallengeDetails] = useState([]);

  const readData = async (id) => {
    setToken(await getToken);

    var response = await ChallengeApi.getDetail(id);
    setChallengeDetails(response);
  };

  useEffect(() => {
    readData();
  }, []);
  return (
    <ScrollView>
      <TouchableHighlight underlayColor={"COLOR"}>

        <Text style={{ fontSize: 20 }}>{challengeDetailsname}</Text>
        <Text>{challengeDetailsdescription}</Text>
        <Image
          style={styles.background}
          source={{
            uri: `https://acb40feee6f1.ngrok.io/api/challenges/${challengeDetails.id}/background`,
            headers: { Authorization: `Bearer ${token}` },
          }}
        />
        {/* <Text>Crée par {nameCreator}</Text> */}
        <Spacer />
      </TouchableHighlight>
    </ScrollView>
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
  }
});

export default ChallengeScreen;
