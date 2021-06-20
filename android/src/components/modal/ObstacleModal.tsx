import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Vibration } from 'react-native';
import { BaseModal, Button, TextInput } from "../ui";
import { navigate } from "../../navigation/RootNavigation";


let createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: 6
    },
    description: {
      fontSize: 14,
      marginBottom: 16
    },
    error: {
      color: 'red',
      fontSize: 14,
    }
  });
}

type Props = {
  open: boolean;
  onExit: any;
  data: any;
};

export default ({ open, onExit, data }: Props) => {
  let styles = createStyles();

  const [responseInput, setResponseInput] = useState("")
  const [errorText, setErrorText] = useState(null)

  let checkResponse = () => {
    let apiResponse = turnToValidationText(data?.obstacle.response);
    let userResponse = turnToValidationText(responseInput);

    if (apiResponse == userResponse) {
      onExit(data?.obstacle.id);
      return;
    } else {
      setErrorText("Mauvaise réponse");
    }
  }

  let turnToValidationText = (textBase: string) => {
    return textBase.toLowerCase().trim().replace("-", "");
  }

  let handleWrite = (text) => {
    setResponseInput(text);
    setErrorText(null);
  }

  let tryPauseChallenge = () => {
    navigate("Mes courses");
  }

  useEffect(() => {
    if (open) {
      Vibration.vibrate();
    }
  }, [open])

  return (
    <BaseModal
      open={open}
      disallowBackgroundExit
      marginTop={170}
      onExit={() => tryPauseChallenge()}>
      {
        data?.obstacle == null ? null :
          (
            <>
              <Text style={styles.title}>Question</Text>
              <Text style={styles.description}>{data?.obstacle.riddle}</Text>
              <TextInput
                placeholder="Écrivez votre réponse"
                value={responseInput}
                onChangeText={handleWrite}
                width={245}
              />
              <Button
                title='Répondre'
                center
                onPress={() => checkResponse()}
              />
              <Text style={styles.error}>
                {errorText}
              </Text>
            </>
          )
      }
    </BaseModal >
  );
};
