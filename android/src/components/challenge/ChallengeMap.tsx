import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChallengeApi from '../../api/challenge.api';
import ObstacleApi from '../../api/obstacle.api';
import { Button } from '../ui';
import Map from './Map'
import UserSessionApi from '../../api/user-session.api';
import EndModal from '../modal/EndModal';
import IntersectionModal from '../modal/IntersectionModal';
import { useTraker } from "../../utils/traker";
import ObstacleModal from '../modal/ObstacleModal';
import ChallengeStore, { eventType } from '../../utils/challengeStore.utils'
import ChallengeModalUtils from '../../utils/challengeModal.utils'
import ChallengeEventUtils from '../../utils/challengeEvent.utils'
import { ActivityIndicator } from 'react-native-paper';
import { roundTwoDecimal } from "../../utils/math.utils";
import EventToSendDatabase from "../../database/eventToSend.database"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  buttonPause: {
    zIndex: 100,
    bottom: 20,
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  metersCount: {
    zIndex: 100,
    top: 10,
    margin: 10,
    padding: 10,
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    opacity: 0.8,
  },
  box: {
    height: 150,
    width: 150,
    borderRadius: 5,
    position: "absolute",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ({ navigation, route }) => {

  const { challengeId, sessionId, choosenTransport } = route.params;

  const challengeStore = ChallengeStore();
  const challengeModalUtils = ChallengeModalUtils(navigation, challengeStore);
  const challengeEventUtils = ChallengeEventUtils(navigation, challengeStore);

  const traker = useTraker(choosenTransport, challengeStore.progress.canProgress);

  const eventToSendDatabase = EventToSendDatabase();

  let getFullDistance = () => {
    if (choosenTransport === 'pedometer') {
      let podometerValue = traker.getStepMeters();

      return roundTwoDecimal(challengeStore.progress.distanceBase + podometerValue);
    }
    var result = challengeStore.progress.distanceBase + traker.getGpsMeters();

    return roundTwoDecimal(result);
  }

  let getOnSegmentDistance = () => {
    let currentSessionDistance;
    if (choosenTransport === 'pedometer') {
      currentSessionDistance = traker.getStepMeters();
    } else {
      currentSessionDistance = traker.getGpsMeters();
    }

    return currentSessionDistance - challengeStore.progress.distanceToRemove;
  }

  let loadData = async () => {
    let { data: responseDetail } = await ChallengeApi.getDetail(challengeId);

    let obstacleList = [];

    responseDetail.segments.forEach(async (segment) => {
      let { data: responseObstacle } = await ObstacleApi.getBySegementId(segment.id);

      responseObstacle.forEach(obstacle => {
        obstacleList.push(obstacle);
      });
    });

    let { data: responseSession } = await UserSessionApi.getById(sessionId);

    let eventToSendList = await eventToSendDatabase.listByUserSessionId(sessionId);

    eventToSendList = eventToSendList.sort((a, b) => a.id > b.id && 1 || -1);

    let lastSegmentId = responseSession.currentSegmentId;
    let lastAdvance = responseSession.totalAdvancement;

    eventToSendList.forEach(element => {
      if (element.type == eventType.SegmentPass) {
        lastSegmentId = element.value;
      }
      if (element.type == eventType.Advance) {
        lastAdvance += element.value;
      }
    })

    responseSession.currentSegmentId = lastSegmentId;
    responseSession.totalAdvancement = lastAdvance;

    console.log(responseSession)

    // await UserSessionApi.startRun(sessionId);

    await challengeStore.setProgress((current) => ({
      ...current,
      distanceBase: responseSession.totalAdvancement
    }));

    let { data: responseBase64 } = await ChallengeApi.getBackgroundBase64(challengeId);

    await challengeStore.setMap((current) => ({
      ...current,
      userSession: responseSession,
      base64: responseBase64.background,
      obstacles: obstacleList,
      challengeDetail: responseDetail,
    }));

    traker.subscribe();
  }

  useEffect(() => {

    loadData();

    navigation.addListener('beforeRemove', (e) => {

      e.preventDefault();

      Alert.alert(
        'Pause',
        'Voulez-vous mettre en pause et reprendre plus tard ?',
        [
          { text: "Continuer", style: 'cancel', onPress: () => null },
          {
            text: 'Pause',
            style: 'destructive',
            onPress: () => {
              traker.unsubscribe();
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    return () => {
      traker.unsubscribe();
    }
  }, [])

  let devLog = async () => {
    console.log("Devlog ");

    let list = await eventToSendDatabase.listAll();
    console.log("eventToSend", list);
  }

  // Fonction qui permet de vérifier l'avancement d'un utilisateur grâce au backend.
  // Elle permet aussi de mettre à jour le userSession pour change le userSessions
  let advance = async () => {

    // Récupération de la distance à ajouter
    let currentSessionDistance = getOnSegmentDistance();

    if (currentSessionDistance <= challengeStore.progress.distanceToRemove) {
      return;
    }

    if (challengeStore.progress.canProgress === false) {
      return;
    }

    challengeEventUtils.eventExecutor(currentSessionDistance);

    // await challengeStore.setProgress(current => ({
    //   ...current,
    //    distanceToRemove: currentSessionDistance
    // }));

    // Mise à jour de l'userSession
    // await challengeStore.setMap(current => ({
    //   ...current,
    //   userSession: responseAdvance.data
    // })); 
  }
  // @ts-ignore
  Array.prototype.sum = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
      total += this[i][prop]
    }
    return total
  }

  useEffect(() => {
    advance();
  }, [challengeStore]);

  return (
    <View style={styles.container}>

      <EndModal
        open={challengeStore.modal.endModal}
        onExit={() => challengeModalUtils.endValidation()} />

      <ObstacleModal
        open={challengeStore.modal.obstacleModal !== null}
        obstacle={challengeStore.modal.obstacleModal}
        onExit={() => challengeModalUtils.obstacleValidation()} />

      <IntersectionModal
        open={challengeStore.modal.intersectionModal != null}
        intersections={challengeStore.modal.intersectionModal}
        onHighLight={(iId) => challengeStore.setProgress(current => ({ ...current, selectedIntersection: iId }))}
        onExit={(iId) => challengeModalUtils.intersectionSelection(iId)} />

      {challengeStore.map.base64 && challengeStore.map.challengeDetail ? (
        <View style={StyleSheet.absoluteFill}>

          <Map
            base64={challengeStore.map.base64}
            checkpoints={challengeStore.map.challengeDetail.checkpoints}
            obstacles={challengeStore.map.obstacles}
            segments={challengeStore.map.challengeDetail.segments}
            selectedSegmentId={challengeStore.map.userSession.currentSegmentId}
            highlightSegmentId={challengeStore.progress.selectedIntersection}
            completedSegmentIds={challengeStore.progress.completedSegment}
            distance={getOnSegmentDistance()}
            scale={challengeStore.map.challengeDetail.scale}
          />

          <Animated.View style={[styles.buttonPause]}>

            <Button
              icon="computer"
              padding={10}
              width={50}
              color="green"
              onPress={() => devLog()}
            />

            <Button
              icon="pause"
              padding={10}
              width={50}
              color="red"
              onPress={() => navigation.goBack()}
            />

          </Animated.View>

          <Animated.View style={[styles.metersCount]}>

            <Text>{getFullDistance()} mètres</Text>

          </Animated.View>

        </View>
      )
        : (<>
          <ActivityIndicator color="white" size={'large'} style={styles.loader} />
        </>)
      }
    </View >
  );
};