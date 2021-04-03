import React, { useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";
import Spacer from "../components/Spacer";
import Challenge from "../components/Challenge";
import ChallengeApi from "../api/challenge.api";

const ChallengeScreen = () => {
  let [challengeList, setChallengeList] = useState([]);

  const readData = async () => {
    var response = await ChallengeApi.pagedList(0);

    await setChallengeList(response.data._embedded.challengeResponseModelList);
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Spacer>
      <Text style={styles.title}>Challenges</Text>
      </Spacer>

      {challengeList?.map(function (challenge, key) {
        return <Challenge key={key} challenge={challenge} />;
      })}
    </SafeAreaView>
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
