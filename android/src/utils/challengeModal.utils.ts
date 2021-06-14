import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";
import { useEffect } from "react";

export default (navigation, challengeStore, traker) => {
  const eventToSendDatabase = EventToSendDatabase();

  // Choix de l'intersection
  let intersectionSelection = async (segmentId) => {
    let selectedSegment = challengeStore.map.challengeDetail.segments.find(
      (x) => x.id === challengeStore.map.userSession.currentSegmentId
    );

    await eventToSendDatabase.addEvent(
      eventType.Advance,
      roundTwoDecimal(selectedSegment.length),
      challengeStore.map.userSession.id
    );

    await eventToSendDatabase.addEvent(
      eventType.SegmentPass,
      segmentId,
      challengeStore.map.userSession.id
    );

    await challengeStore.setProgress((current) => ({
      ...current,
      distanceToRemove:
        current.distanceToRemove + roundTwoDecimal(selectedSegment.length),
      canProgress: true,
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
      eventType.ObstaclePass,
      "",
      challengeStore.map.userSession.id
    );

    await challengeStore.setProgress((current) => ({
      ...current,
      canProgress: true,
    }));

    await challengeStore.setModal((current) => ({
      ...current,
      obstacleModal: null,
    }));
  };

  let endValidation = async () => {
    await eventToSendDatabase.addEvent(
      eventType.End,
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
