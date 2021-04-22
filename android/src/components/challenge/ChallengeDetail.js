import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ToastAndroid, Modal, View } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Spacer, Button, Image } from '../ui';
import ThemedPage from '../ui/ThemedPage';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import UserSessionApi from '../../api/user-session.api';
import HTML from "react-native-render-html";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

let createStyles = (selectedTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      marginLeft: 20,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "#000000aa",
    },
    modalContent: {
      marginTop: 200,
      borderRadius: 10,
      padding: 40,
      margin: 20,
      backgroundColor: 'white',
    },
    modalListIcon: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalIcon: {
      margin: 15,
    },
    text: {
      padding: 5,
      paddingTop: 0,
      margin: 10,
      color: selectedTheme.colors.text,
    },
    complete: {
      padding: 5,
      color: selectedTheme.colors.text,
      textAlign: "center"
    }
  });
}

export default ({ navigation, id, onUpdateRunningChallenge }) => {
  const [challengeDetails, setChallengeDetails] = useState([]);
  const [base64, setBase64] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const theme = useTheme();
  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;
  let styles = createStyles(selectedTheme);

  let startChallenge = async () => {
    try {
      let responseSession = await UserSessionApi.create({ challengeId: id });

      setUserSession(responseSession.data);
      onUpdateRunningChallenge(id);
    } catch {
      ToastAndroid.show("Erreur lors du démarage du challenge");
    }
  }

  let readData = async () => {
    try {
      let responseSession = await UserSessionApi.self(id);

      if (responseSession.status === 200) {
        setUserSession(responseSession.data);
      }
    } catch {
    }

    var response = await ChallengeApi.getDetail(id);

    setChallengeDetails(response.data);

    let responseBackground = await ChallengeApi.getBackgroundBase64(id);

    setBase64(responseBackground.data.background);
  };

  useEffect(() => {
    readData();
  }, []);

  return challengeDetails != undefined ? (
    <ThemedPage title={challengeDetails?.name} onUserPress={() => navigation.openDrawer()}>
      <Modal visible={modalOpen} animationType='fade' style={styles.modalBackground} transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name='close'
              size={36}
              onPress={() => setModalOpen(false)}
              styles={styles.closeIcon}
            />

            <View style={styles.modalListIcon}>
              <FontAwesome5 name="walking" size={65} color="black" style={styles.modalIcon} />
              <FontAwesome5 name="running" size={65} color="black" style={styles.modalIcon} />
              <MaterialCommunityIcons name="bike" size={65} color="black" style={styles.modalIcon} />
            </View>

          </View>
        </View>
      </Modal>


      <Button title="Retour" color="blue" onPress={() => navigation.navigate('Challenges')} />
      <Image
        height={300}
        width={400}
        base64={base64}
        isLoading={base64 === null}
      />
      {/* <Text style={styles.text}>{challengeDetails?.description}</Text> */}
      {
        challengeDetails?.description ?
          <HTML source={{ html: challengeDetails?.description }} />
          :
          null
      }

      <Button title="Choix de l'activité" color="green" onPress={() => setModalOpen(true)}></Button>

      <Spacer />
      {
        !userSession ? (
          <Button title="Débuter course" color="blue" center onPress={() => startChallenge()} />
        )
          : !userSession.isEnd ?
            (
              <Button title="Reprendre la course" color="red" center onPress={() => onUpdateRunningChallenge(id)} />
            )
            :
            (
              <Text style={styles.complete}>Vous avez fini ce challenge, bravo !</Text>
            )
      }
    </ThemedPage>
  ) :
    (
      <View>
        Loading ...
      </View>
    );
};
