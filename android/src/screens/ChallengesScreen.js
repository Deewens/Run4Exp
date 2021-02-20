import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-navigation";
import Challenge from "../components/Challenge";
import ChallengeApi from "../api/challenge.api";

const AccountScreen = ({}) => {
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
      <Text style={{ fontSize: 40 }}>Challenges</Text>
      {challengeList?.map(function (challenge, key) {
        return <Challenge key={key} challenge={challenge} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
  },
});

export default AccountScreen;
