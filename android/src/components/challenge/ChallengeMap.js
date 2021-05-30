import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, Vibration, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChallengeApi from '../../api/challenge.api';
import ObstacleApi from '../../api/obstacle.api';
import { Button } from '../ui';
import Map from './Map'
import UserSessionApi from '../../api/user-session.api';
import { useInterval } from '../../utils/useInterval';
import EndModal from '../modal/EndModal';
import IntersectionModal from '../modal/IntersectionModal';
import { useTraker } from "../../utils/traker";
import ObstacleModal from '../modal/ObstacleModal';
import ChallengeStore from '../../utils/challengeStore.utils'
import ChallengeMapUtils from '../../utils/challengeMap.utils'
import { ActivityIndicator } from 'react-native-paper';
import { roundTwoDecimal } from "../../utils/math.utils";

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
  }
});

export default ({ navigation, route }) => {

  const { challengeId, sessionId, choosenTransport } = route.params;

  const challengeStore = ChallengeStore();
  const challengeMapUtils = ChallengeMapUtils(challengeStore);

  const traker = useTraker(choosenTransport, challengeStore.progress.canProgress);

  let getFullDistance = () => {
    if (choosenTransport === 'pedometer') {
      let podometerValue = traker.getStepMeters(challengeStore.progress.advanceToRemove);

      return roundTwoDecimal(challengeStore.progress.distanceBase + podometerValue);
    }
    var result = distanceBase + traker.getGpsMeters(challengeStore.progress.advanceToRemove);

    console.log("full distance", result);

    return roundTwoDecimal(result);
  }

  let loadData = async () => {
    let { data: responseDetail } = await ChallengeApi.getDetail(challengeId);

    await UserSessionApi.startRun(sessionId);

    let obstacleList = [];

    responseDetail.segments.forEach(async (segment) => {
      let { data: responseObstacle } = await ObstacleApi.getBySegementId(segment.id);

      responseObstacle.forEach(obstacle => {
        obstacleList.push(obstacle);
      });
    });

    let { data: responseSession } = await UserSessionApi.getById(sessionId);

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

  // Fonction qui permet de vérifier l'avancement d'un utilisateur grâce au backend.
  // Elle permet aussi de mettre à jour le userSession pour change le userSessions
  let advance = async () => {

    // Récupération de la distance à ajouter
    let metersToAdvance;
    if (choosenTransport === 'pedometer') {
      metersToAdvance = roundTwoDecimal((traker.meterState.currentStepCount - challengeStore.progress.advanceToRemove) * 0.64);
    } else {
      metersToAdvance = traker.getGpsMeters(challengeStore.progress.advanceToRemove);
    }

    if (metersToAdvance <= 0) {
      return;
    }

    // Mise à jour de la distance parcourue depuis la reprise du challenge
    let valueToUpdate = 0;
    if (choosenTransport === 'pedometer') {
      valueToUpdate = traker.meterState.currentStepCount;
    } else {
      valueToUpdate = roundTwoDecimal(metersToAdvance + challengeStore.progress.advanceToRemove);
    }

    await challengeStore.setProgress(current => ({
      ...current,
      advanceToRemove: valueToUpdate
    }));

    // Mise à jour de l'userSession
    // await challengeStore.setMap(current => ({
    //   ...current,
    //   userSession: responseAdvance.data
    // })); 
  }

  let f = useCallback(async () => {
    advance();
  }, [traker.meterState, challengeStore.progress.advanceToRemove]);

  useInterval(f, 1000);


  return (
    <View style={styles.container}>

      <EndModal
        open={challengeStore.modal.endModal}
        onExit={() => challengeMapUtils.endHandler()} />

      <ObstacleModal
        open={challengeStore.modal.obstacleModal !== null}
        obstacle={challengeStore.modal.obstacleModal}
        onExit={() => challengeMapUtils.obstacleExitHandler()} />

      <IntersectionModal
        open={challengeStore.modal.intersectionModal != null}
        intersections={challengeStore.modal.intersectionModal}
        onHighLight={(iId) => setSelectedIntersection(iId)}
        onExit={(iId) => challengeMapUtils.intersectionHandler(iId)} />

      {challengeStore.map.base64 && challengeStore.map.challengeDetail ? (
        <View style={StyleSheet.absoluteFill}>

          <Map
            base64={challengeStore.map.base64}
            checkpoints={challengeStore.map.challengeDetail.checkpoints}
            obstacles={challengeStore.map.obstacles}
            segments={challengeStore.map.challengeDetail.segments}
            selectedSegmentId={challengeStore.map.userSession.currentSegmentId}
            highlightSegmentId={challengeStore.progress.selectedIntersection}
            totalDistance={getFullDistance()}
            distance={getFullDistance() + challengeStore.map.userSession.advancement}
            scale={challengeStore.map.challengeDetail.scale}
          />

          <Animated.View style={[styles.buttonPause]}>

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
          <ActivityIndicator />
        </>)
      }
    </View >
  );
};