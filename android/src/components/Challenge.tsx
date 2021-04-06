import React, { useContext, useEffect, useState, useRef } from "react";
import { Text, StyleSheet, View, TouchableHighlight, Animated, Dimensions, FlatList } from "react-native";
import ChallengeApi from "../api/challenge.api";
import { Context as AuthContext } from '../context/AuthContext';
import { apiUrl } from '../utils/const';
import ThemedPage from "../components/ThemedPage";
import Image from "./Image";

const Challenge = (props: any) => {
  let { challenge, onPress } = props;
  let [base64, setBase64] = useState(null);

  const readData = async () => {
    let response = await ChallengeApi.getBackgroundBase64(props.challenge.id);

    setBase64(response.data.background);
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <View>
      <TouchableHighlight underlayColor={"COLOR"} onPress={() => onPress()} style={styles.container}>
        <>
          <Image
            style={styles.background}
            height={120}
            width="100%"
            base64={base64}
            isLoading={base64 === null}
          />
          <Text style={styles.title}>{props.challenge.name}</Text>
          <Text style={styles.text} numberOfLines={2}>{props.challenge.description}</Text>
        </>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  background: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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

export default Challenge;