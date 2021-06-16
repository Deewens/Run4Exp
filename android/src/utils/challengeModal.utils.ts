import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";
import { useEffect } from "react";
import { ToastAndroid } from "react-native";

export default (navigation, challengeStore, traker) => {
  const eventToSendDatabase = EventToSendDatabase();

  // Choix de l'intersection
  let intersectionSelection = async (selectedSegmentId: number) => {
    let selectedSegment = challengeStore.map.challengeDetail.segments.find(
      (x) => x.id === selectedSegmentId
    );

    let advance = roundTwoDecimal(
      traker?.getMeters() - challengeStore.progress.distanceToRemove
    );

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
      eventType.CHANGE_SEGMENT,
      selectedSegmentId,
      challengeStore.map.userSession.id
    );

    challengeStore.setProgress((current) => ({
      ...current,
      currentSegmentId: selectedSegmentId,
    }));

    let listToSend = await eventToSendDatabase.listByUserSessionId(
      challengeStore.map.userSession.Id
    );
    let allEvents = [
      ...challengeStore.map.challengeDetail.userSession.events,
      ...listToSend,
    ];

    let lastSegChangeId = null;
    allEvents.forEach((element) => {
      console.log("element.type", element.type);
      if (
        element.type == eventType.CHANGE_SEGMENT ||
        element.type == eventType.CHOOSE_PATH ||
        element.type == eventType[eventType.CHANGE_SEGMENT] ||
        element.type == eventType[eventType.CHOOSE_PATH]
      ) {
        lastSegChangeId = element.value;
      }
    });

    await challengeStore.setProgress((current) => ({
      ...current,
      distanceToRemove:
        current.distanceToRemove + roundTwoDecimal(selectedSegment.length),
      completedSegment: [...current.completedSegment, selectedSegment.id],
      resumeProgress: 0,
      currentSegment: lastSegChangeId,
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

    await eventToSendDatabase.addEvent(
      eventType.PASS_OBSTACLE,
      obstacleId,
      challengeStore.map.userSession.id
    );

    challengeStore.setProgress((current) => ({
      ...current,
      completedObstacleIds: [...current.completedObstacleIds, obstacleId],
    }));

    challengeStore.setModal((current) => ({
      ...current,
      obstacleModal: null,
    }));

    traker.subscribe();
  };

  let endValidation = async () => {
    await eventToSendDatabase.addEvent(
      eventType.END,
      "",
      challengeStore.map.userSession.id
    );

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
