import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Image } from '../ui';
import { DarkerTheme, LightTheme } from '../../styles/theme'
import { Theme } from '@react-navigation/native';
import { useTheme } from '../../styles';

let createStyles = (selectedTheme: Theme): any => {
  return StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.colors.card,
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
      color: selectedTheme.colors.text
    },
    text: {
      padding: 5,
      paddingTop: 0,
      opacity: 0.85,
      color: selectedTheme.colors.text
    }
  });
}


export default (props: any) => {
  let { challenge, onPress } = props;
  let [base64, setBase64] = useState(null);
  let isCancelled = false;

  const theme = useTheme();

  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  let styles = createStyles(selectedTheme);

  const readData = async () => {
    isCancelled = false;
    let response = await ChallengeApi.getBackgroundBase64(challenge.id);

    if (!isCancelled) {
      await setBase64(response.data.background);
    }

    return () => {
      isCancelled = true;
    };
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
          <Text style={styles.title}>{challenge.name}</Text>
          <Text style={styles.text} numberOfLines={2}>{challenge.shortDescription}</Text>
        </>
      </TouchableHighlight>
    </View>
  );
};