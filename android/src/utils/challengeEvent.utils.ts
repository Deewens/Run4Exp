import { Vibration } from "react-native";
import UserSessionApi from "../api/user-session.api";
import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";
import EventToSendDatabase from "../database/eventToSend.database";

export default (navigation, challengeStore, traker) => {
  let challengeDetail = challengeStore.map.challengeDetail;

  // Gestion d'une intersection
  let intersectionHandler = async (segmentList) => {
    await challengeStore.setProgress((current) => ({
      ...current,
      canProgress: false,
    }));

    await challengeStore.setModal((current) => ({
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

    await eventToSendDatabase.addEvent(
      eventType.ADVANCE,
      roundTwoDecimal(selectedSegment.length),
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
        current.distanceToRemove + roundTwoDecimal(selectedSegment.length),
      completedSegment: [...current.completedSegment, selectedSegment.id],
    }));

    challengeStore.setMap((current) => ({
      ...current,
      userSession: {
        ...current.userSession,
        currentSegmentId: nextSegment.id,
      },
    }));
  };

  // Gestion d'une fin de challenge
  let endHandler = () => {
    challengeStore.setModal((current) => ({
      ...current,
      endModal: true,
    }));

    challengeStore.setProgress((current) => ({
      ...current,
      canProgress: false,
      resumeProgress: 0,
    }));
  };

  // Gestion de l'arrivé à la fin d'un segment
  let segmentEndHandler = (selectedSegment) => {
    let endCheckpoint = challengeDetail.checkpoints.find(
      (x) => x.id === selectedSegment.checkpointEndId
    );

    let segmentList = [];

    endCheckpoint.segmentsStartsIds.forEach((startSegmentId) => {
      segmentList.push(
        challengeDetail.segments.find((x) => x.id === startSegmentId)
      );
    });

    if (segmentList.length == 0) {
      // fin du challenge
      endHandler();
    }

    if (segmentList.length >= 2) {
      // intersection
      intersectionHandler(segmentList);
    }

    if (segmentList.length == 1) {
      // SegmentPass
      segmentPassHandler(segmentList, selectedSegment);
    }
  };

  // Fonction pour rechercher les événements et les exécuter
  let eventExecutor = async (currentSessionDistance) => {
    let selectedSegment = challengeDetail.segments.find(
      (x) => x.id === challengeStore.map.userSession.currentSegmentId
    );

    let distanceComp =
      currentSessionDistance - challengeStore.progress.distanceToRemove;

    if (selectedSegment.length <= distanceComp) {
      // fin du segment
      segmentEndHandler(selectedSegment);
    }
  };

  return {
    eventExecutor,
  };
};
