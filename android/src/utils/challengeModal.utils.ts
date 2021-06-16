import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";
import { useEffect } from "react";
import { ToastAndroid } from "react-native";

export default (navigation, challengeStore, traker, challengeDataUtils) => {
  const eventToSendDatabase = EventToSendDatabase();

  // Choix de l'intersection
  let intersectionSelection = async (selectedSegmentId: number) => {
    let selectedSegment = challengeStore.map.challengeDetail.segments.find(
      (x) => x.id === selectedSegmentId
    );

    let advance = challengeStore.modal.intersectionModal.meters;

    if (advance === NaN || advance <= 0) {
      ToastAndroid.show(
        "Erreur lors du chagement d'intersection",
        ToastAndroid.LONG
      );
    }

    await eventToSendDatabase.addEvent(
      eventType.ADVANCE,
      advance,
      challengeStore.map.userSession.id
    );

    await eventToSendDatabase.addEvent(
      eventType.CHOOSE_PATH,
      selectedSegmentId,
      challengeStore.map.userSession.id
    );

    let finishedList = challengeDataUtils.getFinishedSegmentIds(
      challengeStore.map.challengeDetail,
      selectedSegment
    );

    await challengeStore.setProgress((current) => ({
      ...current,
      currentSegmentId: selectedSegmentId,
      completedSegmentIds: finishedList,
      resumeProgress: 0,
      distanceTraveled: challengeStore.progress.distanceTraveled + advance,
    }));

    traker.subscribe();

    await challengeStore.setModal((current) => ({
      ...current,
      intersectionModal: null,
    }));
  };

  // Validation de l'obstacle
  let obstacleValidation = async (obstacleId) => {
    // await UserSessionApi.passObstacle(sessionId, userSession.obstacleId);

    let advance = challengeStore.modal.obstacleModal.meters;

    await eventToSendDatabase.addEvent(
      eventType.ADVANCE,
      advance,
      challengeStore.map.userSession.id
    );

    await eventToSendDatabase.addEvent(
      eventType.PASS_OBSTACLE,
      obstacleId,
      challengeStore.map.userSession.id
    );

    challengeStore.setModal((current) => ({
      ...current,
      obstacleModal: null,
    }));

    challengeStore.setProgress((current) => ({
      ...current,
      completedObstacleIds: [...current.completedObstacleIds, obstacleId],
      distanceTraveled: challengeStore.progress.distanceTraveled + advance,
    }));

    traker.subscribe();
  };

  let endValidation = async () => {
    challengeStore.setModal((current) => ({
      ...current,
      endModal: false,
    }));

    navigation.navigate("Mes courses");
  };

  return {
    intersectionSelection,
    obstacleValidation,
    endValidation,
  };
};
