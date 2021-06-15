import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";
import { useEffect } from "react";

export default (navigation, challengeStore, traker, challengeDataUtils) => {
  const eventToSendDatabase = EventToSendDatabase();

  // Choix de l'intersection
  let intersectionSelection = async (segmentId) => {
    let selectedSegment = await challengeDataUtils.getCurrentSegmentByStore(
      challengeStore
    );
    console.log("selectedSegment", selectedSegment);
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

    await challengeStore.setProgress((current) => ({
      ...current,
      distanceToRemove:
        current.distanceToRemove + roundTwoDecimal(selectedSegment.length),
      completedSegment: [...current.completedSegment, selectedSegment.id],
      resumeProgress: 0,
    }));

    traker.subscribe();

    await challengeStore.setMap((current) => ({
      ...current,
      userSession: {
        ...current.userSession,
        currentSegmentId: segmentId,
      },
    }));

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
