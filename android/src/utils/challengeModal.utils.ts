import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";
import { useEffect } from "react";

export default (navigation, challengeStore, traker) => {
  const eventToSendDatabase = EventToSendDatabase();

  // Choix de l'intersection
  let intersectionSelection = async (segmentId, selectedSegment) => {
    // let selectedSegment = await challengeDataUtils.getCurrentSegmentByStore(
    //   challengeStore
    // );
    await eventToSendDatabase.addEvent(
      eventType.ADVANCE,
      roundTwoDecimal(selectedSegment.length),
      challengeStore.map.userSession.id
    );

    await eventToSendDatabase.addEvent(
      eventType.CHANGE_SEGMENT,
      segmentId,
      challengeStore.map.userSession.id
    );

    let listToSend = await eventToSendDatabase.listByUserSessionId(
      challengeStore.map.challengeDetail.userSession.Id
    );
    let newxList = [
      ...challengeStore.map.challengeDetail.userSession.events,
      ...listToSend,
    ];

    let lastSegChangeId = null;
    newxList.forEach((element) => {
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
  let obstacleValidation = async () => {
    // await UserSessionApi.passObstacle(sessionId, userSession.obstacleId);

    await eventToSendDatabase.addEvent(
      eventType.PASS_OBSTACLE,
      "",
      challengeStore.map.userSession.id
    );

    await challengeStore.setModal((current) => ({
      ...current,
      obstacleModal: null,
    }));
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
