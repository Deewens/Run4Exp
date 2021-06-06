import { eventType } from "./challengeStore.utils";
import { roundTwoDecimal } from "./math.utils";

export default (navigation, challengeStore) => {
  // Choix de l'intersection
  let intersectionSelection = async (segementId) => {
    let selectedSegment = challengeStore.map.challengeDetail.segments.find(
      (x) => x.id === challengeStore.map.userSession.currentSegmentId
    );

    challengeStore.addEventToSend({
      type: eventType.SegmentPass,
      value: segementId,
    });

    await challengeStore.setProgress((current) => ({
      ...current,
      distanceToRemove:
        current.distanceToRemove + roundTwoDecimal(selectedSegment.length),
      canProgress: true,
    }));

    await challengeStore.setMap((current) => ({
      ...current,
      userSession: {
        ...current.userSession,
        currentSegmentId: segementId,
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

    challengeStore.addEventToSend({
      type: eventType.ObstaclePass,
      value: "",
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
    challengeStore.addEventToSend({
      type: eventType.End,
      value: "",
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
