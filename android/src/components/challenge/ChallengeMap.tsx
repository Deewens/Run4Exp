import React, { useEffect, useState } from 'react';
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
import ChallengeImageDatabase from '../../database/challengeImage.database';

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

  let traker = useTraker("dev");

  useEffect(() => {
    challengeStore.reset();
    traker.reset();
  }, [])

  const challengeDataUtils = ChallengeDataUtils();
  const challengeModalUtils = ChallengeModalUtils(navigation, challengeStore, traker, challengeDataUtils);
  const challengeEventUtils = ChallengeEventUtils(navigation, challengeStore, traker, challengeDataUtils);

  const eventToSendDatabase = EventToSendDatabase();
  const userSessionDatabase = UserSessionDatabase();
  const challengeImageDatabase = ChallengeImageDatabase();



  let getFullDistance = () => {
    let value = challengeStore.progress.distanceBase + traker?.getMeters();
    if (value === NaN) {
      return 0;
    }
    return roundTwoDecimal(value);
  }

  let getOnSegmentDistance = () => {
    let value = challengeStore.progress.distanceBase + traker?.getMeters() - challengeStore.progress.distanceToRemove + challengeStore.progress.resumeProgress;
    if (value === NaN) {
      return 0;
    }
    return value;
  }

  let loadData = async () => {

    let challengeData = await challengeDataUtils.syncData(navigation, sessionId);

    let eventsToSend = await eventToSendDatabase.listByUserSessionId(sessionId);

    let allEvents = [...challengeData.userSession.events, ...eventsToSend]

    let currentSegment = challengeDataUtils.getCurrentSegment(challengeData.segments, challengeData.checkpoints, allEvents);

    let finishedList = challengeDataUtils.getFinishedSegmentIds(challengeData, currentSegment);

    let advances = challengeDataUtils.getAdvancements(allEvents);

    let completedObstacleIds = await challengeDataUtils.getCompletedObstacleIds(challengeData);

    await challengeStore.setProgress({
      distanceToRemove: 0,
      selectedIntersection: null,
      completedObstacleIds,
      completedSegmentIds: finishedList,
      distanceBase: advances.totalAdvancement,
      resumeProgress: advances.currentAdvancement,
      currentSegmentId: currentSegment.id
    });

    let background = null;
    try {

      background = (await challengeImageDatabase.selectById(challengeId))?.value;

      if (!background) {
        let { data: responseBase64 } = await ChallengeApi.getBackgroundBase64(
          challengeId
        );
        background = responseBase64.background;
        await challengeImageDatabase.replaceEntity({ //TODO: replace by only insert
          id: challengeId,
          value: background,
          isThumbnail: false
        });
      }

    } catch (error) {
      let entity = await challengeImageDatabase.selectById(challengeId);
      background = entity.value;
    }

    await challengeStore.setMap((current) => ({
      ...current,
      userSession: challengeData.userSession,
      base64: background,
      obstacles: challengeDataUtils.getObstacles(challengeData),
      challengeDetail: challengeData,
    }));

    // Start challenge

    let dataCurrentSegment = await challengeDataUtils.getCurrentSegment(
      challengeData.segments,
      challengeData.checkpoints,
      challengeData.userSession.events);

    challengeStore.setProgress((current) => ({
      ...current,
      currentSegmentId: dataCurrentSegment.id,
    }));

    traker.subscribe();

    // console.log("challengeStore.progress.resumeProgress", challengeStore.progress.resumeProgress)

    await eventToSendDatabase.addEvent(eventType.BEGIN_RUN, choosenTransport, sessionId);
  }

  useEffect(() => {

    loadData();

    // déclaration de l'évenement de navigation
    navigation.addListener('beforeRemove', (e) => {

      e.preventDefault();

      challengeStore.setModal(current => ({ ...current, pauseModal: true, pauseLoading: false, pauseAction: e.data.action }))

    });

    return () => {
      traker.unsubscribe();
      console.log("unloading challenge")
    }
  }, [])

  let storeLog = async () => {
    console.log("Storelog ");

    Alert.alert(
      "Storelog",
      "",
      [
        {
          text: "map",
          onPress: () => console.log("challengeStore.map", challengeStore.map)
        },
        {
          text: "progress",
          onPress: () => console.log("challengeStore.progress", challengeStore.progress)
        },
        {
          text: "modal",
          onPress: () => console.log("challengeStore.modal", challengeStore.modal)
        },
        {
          text: "getMeters",
          onPress: () => console.log("traker?.getMeters()", traker?.getMeters())
        }
      ],
      { cancelable: false }
    );

  }

  let devLog = async () => {
    console.log("Devlog ");

    let list = await eventToSendDatabase.listAll();
    console.log("eventToSend", list);
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
    console.log("pause")
    traker.unsubscribe();

    await challengeStore.setModal(current => ({ ...current, pauseLoading: true }))

    let advance = traker.getMeters() - challengeStore.progress.distanceToRemove;

    if (advance !== NaN && advance > 0) {
      await eventToSendDatabase.addEvent(eventType.ADVANCE, advance, sessionId);
    } else {
      console.log("Error advance pause ", advance)
    }

    await eventToSendDatabase.addEvent(eventType.END_RUN, "", sessionId);

    await challengeDataUtils.syncData(navigation, sessionId)

    await challengeStore.setModal(current => ({ ...current, pauseModal: false, pauseLoading: false, pauseAction: null }))

    navigation.dispatch(action);
  };

  // Effect utilisé quand on doit vérifier l'avncement de l'utilisateur
  useEffect(() => {
    // Récupération de la distance à ajouter
    let currentSessionDistance = getOnSegmentDistance();

    // Appel à la fonction de gestion
    challengeEventUtils.eventExecutor(currentSessionDistance);

  }, [challengeStore.progress, getOnSegmentDistance()]);

  return (
    <View style={styles.container}>

      <EndModal
        open={challengeStore.modal.endModal}
        onExit={() => challengeModalUtils.endValidation()}
        challengeStore={challengeStore}
        traker={traker} />

      <ObstacleModal
        open={challengeStore.modal.obstacleModal !== null}
        obstacle={challengeStore.modal.obstacleModal}
        onExit={(obstacleId) => challengeModalUtils.obstacleValidation(obstacleId)} />

      <IntersectionModal
        open={challengeStore.modal.intersectionModal != null}
        data={challengeStore.modal.intersectionModal}
        onHighLight={(iId) => challengeStore.setProgress(current => ({ ...current, selectedIntersection: iId }))}
        onExit={(iId) => challengeModalUtils.intersectionSelection(iId)} />

      <PauseModal
        open={challengeStore.modal.pauseModal}
        loading={challengeStore.modal.pauseLoading}
        onPause={() => pause(challengeStore.modal.pauseAction)}
        onExit={() => challengeStore.setModal(current => ({ ...current, pauseModal: false, pauseLoading: false, pauseAction: null }))}
      />

      {challengeStore.map.base64 && challengeStore.map.challengeDetail && challengeStore.map.challengeDetail?.segments ? (
        <View style={StyleSheet.absoluteFill}>

          <Map
            base64={challengeStore.map.base64}
            checkpoints={challengeStore.map.challengeDetail.checkpoints}
            obstacles={challengeStore.map.obstacles}
            segments={challengeStore.map.challengeDetail.segments}
            selectedSegmentId={challengeStore.progress.currentSegmentId}
            highlightSegmentId={challengeStore.progress.selectedIntersection}
            completedSegmentIds={challengeStore.progress.completedSegmentIds}
            distance={getOnSegmentDistance()}
            scale={challengeStore.map.challengeDetail.scale}
          />

          <Animated.View style={[styles.buttonPause]}>

            <Button
              icon="computer"
              padding={10}
              width={50}
              color="light"
              onPress={() => traker.addOneMeter()}
            />

            <Button
              icon="computer"
              padding={10}
              width={50}
              color="gray"
              onPress={() => storeLog()}
            />

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

          {challengeStore.modal.intersectionModal ? null : <Animated.View style={[styles.metersCount]}>

            <Text>{getFullDistance()} mètres</Text>

          </Animated.View>}

        </View>
      )
        : (<>
          <ActivityIndicator color="white" size={'large'} style={styles.loader} />
        </>)
      }
    </View >
  );
};