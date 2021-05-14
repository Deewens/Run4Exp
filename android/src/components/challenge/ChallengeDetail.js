import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ToastAndroid, Modal, View } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Spacer, Button, Image, SvgDrawing } from '../ui';
import ThemedPage from '../ui/ThemedPage';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import UserSessionApi from '../../api/user-session.api';
import HTML from "react-native-render-html";
import { useMapDrawing } from '../../utils/map.utils'
import Svg from 'react-native-svg';
import ActivityModal from '../modal/ActivityModal';
import ObstacleModal from '../modal/ObstacleModal';
import EndModal from '../modal/EndModal';
import IntersectionModal from '../modal/IntersectionModal';

let createStyles = (selectedTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      marginLeft: 20,
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
  const [modalEndOpen, setModalEndOpen] = useState(false);
  const [modalObstacleOpen, setModalObstacleOpen] = useState(false);
  const [modalIntersectionOpen, setModalIntersectionOpen] = useState(false);

  const { checkpointList, segmentList } = useMapDrawing({
    imageWidth: 400,
    imageHeight: 300
  }, challengeDetails?.checkpoints, challengeDetails?.segments,28);

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

      <ActivityModal
        open={modalOpen}
        onExit={() => setModalOpen(false)} />

      <EndModal
        open={modalEndOpen}
        onExit={() => setModalEndOpen(false)} />

      <ObstacleModal
        open={modalObstacleOpen}
        obstacle={{
          title: 'Sport',
          description: 'Faire 10 pompes'
        }}
        onExit={() => setModalObstacleOpen(false)} />

      <IntersectionModal
        open={modalIntersectionOpen}
        intersections= {[
          {
            id: 1,
            name:'1km'
          },
          {
            id: 2,
            name:'10km'
          },
          {
            id: 3,
            name:'3km'
          }
        ]}
        onExit={() => setModalIntersectionOpen(false)} />

      <Button title="Retour" color="blue" onPress={() => navigation.navigate('Challenges')} />
      <Image
        height={300}
        width={400}
        base64={base64}
        isLoading={base64 === null}
      >
        <SvgDrawing height={300} width={400}>
          <Svg width={400} height={300} viewBox={`0 0 ${400} ${300}`} style={styles.svg}>

            {segmentList}


          </Svg>

          <Svg width={400} height={300} viewBox={`0 0 ${400} ${300}`} style={styles.svg}>

            {checkpointList}

          </Svg>
        </SvgDrawing>
      </Image>


      {/* <Text style={styles.text}>{challengeDetails?.description}</Text> */}
      {
        challengeDetails?.description ?
          <HTML source={{ html: challengeDetails?.description }} />
          :
          null
      }

      <Button title="Choix de l'activité" color="green" onPress={() => setModalOpen(true)}></Button>
      <Button title="End" color="green" onPress={() => setModalEndOpen(true)}></Button>
      <Button title="Obstacle" color="green" onPress={() => setModalObstacleOpen(true)}></Button>
      <Button title="Intersection" color="green" onPress={() => setModalIntersectionOpen(true)}></Button>

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
