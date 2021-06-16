import { ToastAndroid, Vibration } from "react-native";
import UserSessionApi from "../api/user-session.api";
import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";

export default (navigation, challengeStore, traker, challengeDataUtils) => {
  // Gestion d'une intersection
  let intersectionHandler = async (segmentList) => {
    await challengeStore.setModalAsync((current) => ({
      ...current,
      intersectionModal: {
        intersections: segmentList,
        meters: traker.getMeters(),
      },
    }));

    traker.unsubscribe();
  };

  // Gestion d'un passage de segment
  let segmentPassHandler = async (segmentList, selectedSegment) => {
    let eventToSendDatabase = EventToSendDatabase();

    let nextSegment = challengeStore.map.challengeDetail.segments.find(
      (x) => x.id === segmentList[0].id
    );

    // console.log(nextSegment);

    let advance = roundTwoDecimal(
      traker.getMeters() - challengeStore.progress.resumeProgress
    );

    if (advance === NaN || advance <= 0) {
      ToastAndroid.show(
        "Une erreur c'est produite lors d'un passage de segment",
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
      selectedSegment.id,
      challengeStore.map.userSession.id
    );

    let finishedList = challengeDataUtils.getFinishedSegmentIds(
      challengeStore.map.challengeDetail,
      nextSegment
    );

    challengeStore.setProgress((current) => ({
      ...current,
      completedSegmentIds: finishedList,
      currentSegmentId: nextSegment.id,
      distanceTraveled: challengeStore.progress.distanceTraveled + advance,
    }));

    traker.unsubscribe();
    traker.subscribe();
  };

  // Gestion d'une fin de challenge
  let endHandler = async () => {
    await challengeStore.setModalAsync((current) => ({
      ...current,
      endModal: true,
    }));

    // traker.unsubscribe();
  };

  //Gestion d'un obstacle
  let obstacleHandler = async (obstacle) => {
    let advance = roundTwoDecimal(
      traker.getMeters() - challengeStore.progress.resumeProgress
    );

    await challengeStore.setModalAsync((current) => ({
      ...current,
      obstacleModal: { obstacle, meters: advance },
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
      return;
    }

    if (segmentList.length >= 2) {
      // intersection event
      intersectionHandler(segmentList);
      return;
    }

    if (segmentList.length == 1) {
      // SegmentPass event
      segmentPassHandler(segmentList, selectedSegment);
    }
  };

  // Fonction pour rechercher les événements et les exécuter
  let eventExecutor = (currentSessionDistance) => {
    if (!challengeStore.progress.currentSegmentId) {
      return;
    }

    let selectedSegment = challengeStore?.map?.challengeDetail?.segments?.find(
      (x) => x.id === challengeStore.progress.currentSegmentId
    );

    if (!selectedSegment) {
      return;
    }

    // console.log("challengeStore.progress. selectedSegment", selectedSegment);

    let distanceComp = currentSessionDistance; // - challengeStore.progress.distanceToRemove;
    if (selectedSegment.length <= distanceComp) {
      // fin du segment
      segmentEndHandler(selectedSegment);
      return;
    }

    let distanceOnSeg =
      traker?.getMeters() + challengeStore.progress.resumeProgress;
    if (distanceOnSeg === NaN) {
      return 0;
    }

    let userPercentage = distanceOnSeg / selectedSegment.length;
    // console.log("userPercentage", userPercentage);
    selectedSegment.obstacles.forEach((segmentObstacle) => {
      // console.log("segmentObstacle.position", segmentObstacle.position);
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
