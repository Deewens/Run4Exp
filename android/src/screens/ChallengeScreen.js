import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ChallengeApi from '../api/challenge.api';
import ObstacleApi from '../api/obstacle.api';
import { Spacer, Button, Image, SvgDrawing } from '../components/ui';
import ThemedPage from '../components/ui/ThemedPage';
import { DarkerTheme, LightTheme } from '../styles/theme';
import { useTheme } from '../styles';
import UserSessionApi from '../api/user-session.api';
import HTML from "react-native-render-html";
import { useMapDrawing } from '../utils/map.utils'
import Svg from 'react-native-svg';

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

const ChallengeScreen = ({ navigation, route }) => {
  const id = route.params.id;

  const [challengeDetails, setChallengeDetails] = useState([]);
  const [base64, setBase64] = useState(null);

  const [obstacles, setObstacles] = useState([]);

  const { checkpointList, segmentList, obstacleList } = useMapDrawing({
    imageWidth: 400,
    imageHeight: 300
  }, challengeDetails.scale, challengeDetails?.checkpoints, challengeDetails?.segments, obstacles, 22, undefined, []);

  const theme = useTheme();
  let selectedTheme = theme?.mode === "dark" ? DarkerTheme : LightTheme;
  let styles = createStyles(selectedTheme);

  let subscribeToChallenge = async () => {
    await UserSessionApi.create({ challengeId: id }).then(
      () => {
        navigation.navigate('Mes courses', {
          highLightId: id
        });
      }
    );

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

    let responseObstacles = [];

    response.data.segments.forEach(async (element) => {
      await ObstacleApi.getBySegementId(element.id).then(res => {
        res.data.forEach(elementob => {
          responseObstacles.push(elementob);
        });
      }).catch();
    });

    setObstacles(responseObstacles);

    let responseBackground = await ChallengeApi.getBackgroundBase64(id);

    setBase64(responseBackground.data.background);
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <ThemedPage
      title={challengeDetails?.name}
      onUserPress={() => navigation.openDrawer()}
      loader={challengeDetails == undefined || base64 == null}
      showReturn={true}
      onReturnPress={() => navigation.navigate('Challenges')}
    >

      <Image
        height={300}
        width={400}
        base64={base64}
        isLoading={base64 === null}
      >
        <SvgDrawing height={300} width={400}>
          <Svg width={400} height={300} viewBox={`0 0 ${400} ${300}`} style={styles.svg}>

            {segmentList}

            {checkpointList}

            {obstacleList}

          </Svg>
        </SvgDrawing>
      </Image>


      {
        challengeDetails?.description ?
          <HTML source={{ html: challengeDetails?.description }} />
          :
          null
      }

      <Spacer />
      <Button title="S'incrire au challenge" color="blue" center onPress={() => subscribeToChallenge()} />
    </ThemedPage>
  );
};

export default ChallengeScreen;
