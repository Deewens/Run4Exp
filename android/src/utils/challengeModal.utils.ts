import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";
import { useEffect } from "react";

export default (navigation, challengeStore) => {
  const eventToSendDatabase = EventToSendDatabase();

  // Choix de l'intersection
  let intersectionSelection = async (segmentId) => {
    let selectedSegment = challengeStore.map.challengeDetail.segments.find(
      (x) => x.id === challengeStore.map.userSession.currentSegmentId
    );

    await eventToSendDatabase.addData({
      type: eventType.SegmentPass,
      date: new Date(),
      value: segmentId,
      userSession_id: challengeStore.map.userSession.id,
    });

    await challengeStore.setProgress((current) => ({
      ...current,
      distanceToRemove:
        current.distanceToRemove + roundTwoDecimal(selectedSegment.length),
      canProgress: true,
      completedSegment: [...current.completedSegment, selectedSegment.id],
    }));

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

    await eventToSendDatabase.addData({
      type: eventType.ObstaclePass,
      date: new Date(),
      value: "",
      userSession_id: challengeStore.map.userSession.id,
    });

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
    await eventToSendDatabase.addData({
      type: eventType.End,
      date: new Date(),
      value: "",
      userSession_id: challengeStore.map.userSession.id,
    });

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
