import React, { useContext, useEffect, useState, useRef } from "react";
import { Text, StyleSheet, View, Image, TouchableHighlight, Animated, Dimensions, FlatList } from "react-native";
import ChallengeApi from "../api/challenge.api";
import { Context as AuthContext } from '../context/AuthContext';
import { apiUrl } from '../utils/const';
import ThemedPage from "../components/ThemedPage";

const Challenge = (props: any) => {
  let { challenge, onPress } = props;
  const { getToken } = useContext(AuthContext);
  let [token, setToken] = useState([]);

  const readData = async () => {
    setToken(await getToken);
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
            source={{
              uri: `${apiUrl}/challenges/${props.challenge.id}/background`,
              headers: { Authorization: `Bearer ${token}` },
            }}
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
    width: 270,
    height: 120,
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