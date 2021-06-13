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
import ChallengeDataUtils, { Challenge } from '../../utils/challengeData.utils';
import { ActivityIndicator } from 'react-native-paper';
import { roundTwoDecimal } from "../../utils/math.utils";
import EventToSendDatabase from "../../database/eventToSend.database"
import UserSessionDatabase from '../../database/userSession.database';
import PauseModal from '../modal/PauseModal';

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
  const challengeDataUtils = ChallengeDataUtils();

  const traker = useTraker(choosenTransport, challengeStore.progress.canProgress);

  const eventToSendDatabase = EventToSendDatabase();
  const userSessionDatabase = UserSessionDatabase();

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

    let challengeData = await challengeDataUtils.syncData(navigation, sessionId);

    await challengeStore.setProgress({
      distanceToRemove: 0,
      selectedIntersection: null,
      canProgress: true,
      completedObstacles: [],
      completedSegment: [],
      distanceBase: challengeData.userSession.totalAdvancement,
    });

    let { data: responseBase64 } = await ChallengeApi.getBackgroundBase64(
      challengeId
    );

    await challengeStore.setMap((current) => ({
      ...current,
      userSession: challengeData.userSession,
      base64: responseBase64.background,
      obstacles: challengeData.obstacles,
      challengeDetail: challengeData,
    }));

    // Start challenge

    traker.subscribe();
  }

  useEffect(() => {

    loadData();

    navigation.addListener('beforeRemove', (e) => {

      e.preventDefault();

      challengeStore.setModal(current => ({ ...current, pauseModal: true, pauseLoading: false, pauseAction: e.data.action }))

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
  }

  // @ts-ignore
  Array.prototype.sum = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
      total += this[i][prop]
    }
    return total
  }

  let pause = async (action) => {
    traker.unsubscribe();

    await challengeStore.setModal(current => ({ ...current, pauseLoading: true }))

    await eventToSendDatabase.addEvent(eventType.Advance, getFullDistance() - challengeStore.progress.distanceToRemove, sessionId);

    await challengeDataUtils.syncData(navigation, sessionId)

    await challengeStore.setModal(current => ({ ...current, pauseModal: false, pauseLoading: false, pauseAction: null }))

    navigation.dispatch(action);
  };

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

      <PauseModal
        open={challengeStore.modal.pauseModal != null}
        loading={challengeStore.modal.pauseLoading}
        onPause={() => pause(challengeStore.modal.pauseAction)}
        onExit={() => challengeStore.setModal(current => ({ ...current, pauseModal: false, pauseLoading: false, pauseAction: null }))}
      />

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