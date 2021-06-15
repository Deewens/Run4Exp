import { Vibration } from "react-native";
import UserSessionApi from "../api/user-session.api";
import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";

export default (navigation, challengeStore, traker) => {
  // Gestion d'une intersection
  let intersectionHandler = async (segmentList) => {
    await challengeStore.setModalAsync((current) => ({
      ...current,
      intersectionModal: segmentList,
    }));

    traker.unsubscribe();
  };

  // Gestion d'un passage de segment
  let segmentPassHandler = async (segmentList, selectedSegment) => {
    let eventToSendDatabase = EventToSendDatabase();

    let nextSegment = challengeStore.map.challengeDetail.segments.find(
      (x) => x.id === segmentList[0].id
    );

    console.log(nextSegment);

    await eventToSendDatabase.addEvent(
      eventType.ADVANCE,
      roundTwoDecimal(
        selectedSegment.length - challengeStore.progress.resumeProgress
      ),
      challengeStore.map.userSession.id
    );

    await eventToSendDatabase.addEvent(
      eventType.CHANGE_SEGMENT,
      selectedSegment.id,
      challengeStore.map.userSession.id
    );

    challengeStore.setProgress((current) => ({
      ...current,
      distanceToRemove:
        current.distanceToRemove +
        roundTwoDecimal(selectedSegment.length) -
        challengeStore.progress.resumeProgress,
      completedSegment: [...current.completedSegment, selectedSegment.id],
      currentSegmentId: nextSegment.id,
    }));
  };

  // Gestion d'une fin de challenge
  let endHandler = async () => {
    challengeStore.setProgress((current) => ({
      ...current,
      resumeProgress: 0,
    }));

    await challengeStore.setModalAsync((current) => ({
      ...current,
      endModal: true,
    }));

    traker.unsubscribe();
  };

  //Gestion d'un obstacle
  let obstacleHandler = async (obstacle) => {
    await challengeStore.setModalAsync((current) => ({
      ...current,
      obstacleModal: obstacle,
    }));

    traker.unsubscribe();
  };

  // Gestion de l'arrivé à la fin d'un segment
  let segmentEndHandler = (selectedSegment) => {
    let endCheckpoint = challengeStore.map.challengeDetail.checkpoints.find(
      (x) => x.id === selectedSegment.checkpointEndId
    );

    let segmentList = [];

    endCheckpoint.segmentsStartsIds.forEach((startSegmentId) => {
      segmentList.push(
        challengeStore.map.challengeDetail.segments.find(
          (x) => x.id === startSegmentId
        )
      );
    });

    if (segmentList.length == 0) {
      // end event
      endHandler();
    }

    if (segmentList.length >= 2) {
      // intersection event
      intersectionHandler(segmentList);
    }

    if (segmentList.length == 1) {
      // SegmentPass event
      segmentPassHandler(segmentList, selectedSegment);
    }
  };

  // Fonction pour rechercher les événements et les exécuter
  let eventExecutor = (currentSessionDistance) => {
    if (challengeStore.progress.currentSegmentId == null) {
      return;
    }

    let selectedSegment = challengeStore?.map?.challengeDetail?.segments?.find(
      (x) => x.id === challengeStore.progress.currentSegmentId
    );

    let distanceComp = currentSessionDistance; // - challengeStore.progress.distanceToRemove;
    if (selectedSegment.length <= distanceComp) {
      // fin du segment
      segmentEndHandler(selectedSegment);
    }

    let distanceOnSeg =
      traker?.getMeters() -
      challengeStore.progress.distanceToRemove +
      challengeStore.progress.resumeProgress;
    if (distanceOnSeg === NaN) {
      return 0;
    }

    let userPercentage = (distanceOnSeg / selectedSegment.length) * 100;

    selectedSegment.obstacles.forEach((segmentObstacle) => {
      if (
        segmentObstacle.position <= userPercentage &&
        !challengeStore.progress.completedObstacleIds.includes(
          segmentObstacle.id
        )
      ) {
        obstacleHandler(segmentObstacle);
      }
    });
  };

  return {
    eventExecutor,
  };
};
