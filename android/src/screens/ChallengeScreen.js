import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import Challenge from "../components/Challenge";
import ChallengeApi from "../api/challenge.api";

const ChallengeScreen = ({}) => {
  const { signout } = useContext(AuthContext);
  let [challengeList, setChallengeList] = useState([]);

  const readData = async () => {
    var response = await ChallengeApi.pagedList(0);

    await setChallengeList(response.data._embedded.challengeResponseModelList);
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <View style={styles.container}>
      <Spacer>
      <Text style={styles.title}>Challenges</Text>
      </Spacer>

      {challengeList?.map(function (challenge, key) {
        return <Challenge key={key} challenge={challenge} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    marginLeft: 20
  },
  title:{
    fontSize: 40
  }
});

export default ChallengeScreen;
