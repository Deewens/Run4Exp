import { Vibration } from 'react-native';
import UserSessionApi from '../api/user-session.api'
import {eventType} from './challengeStore.utils'

export default (challengeStore) => {

  let intersectionHandler = async (segementId) => {

    // await UserSessionApi.selfChoosePath(sessionId, {
    //   challengeId: challengeStore.challengeDetail.id,
    //   segmentToChooseId: segementId,
    // }).catch(e => {
    //   console.log(e.response)
    // });

    await challengeStore.setEventToSend((current) => ([
      ...current,
      {
        type: eventType.SegmentPass,
        value: segementId,
      },
    ]))

    let selectedSegment = challengeStore.map.challengeDetail.segments.find(x => x.id === challengeStore.map.userSession.currentSegmentId);

    await challengeStore.setProgress((current) => ({
      ...current,
      distanceToRemove: current.distanceToRemove + selectedSegment.lengths,
    }))

    await challengeStore.setMap((current) => ({
      ...current,
      userSession: {
        ...current.userSession,
        currentSegmentId: segementId,
      }
    }))

    await challengeStore.setModal((current) => ({
      ...current,
      intersectionModal: null
    }));

    await challengeStore.setProgress((current) => ({
      ...current,
      canProgress: true
    }));
  }

  // Validation de l'obstacle
  let obstacleExitHandler = async () => {
    await UserSessionApi.passObstacle(sessionId, userSession.obstacleId);

    await challengeStore.setProgress((current) => ({
      ...current,
      canProgress: true
    }));

    await challengeStore.setModal((current) => ({
      ...current,
      obstacleModal: null
    }));

  }

  let endHandler = async () => {
    await challengeStore.setModal((current) => ({
      ...current,
      endModal: false
    }));

    navigation.navigate("Challenges");
  }

  let eventExecutor = async () => {
    // Gestion de la fin d'un challenge
    if (responseAdvance.data.isEnd === true) {
      Vibration.vibrate()

      await challengeStore.setProgress((current) => ({
        ...current,
        canProgress: false
      }));
  
      await challengeStore.setModal((current) => ({
        ...current,
        endModal: true
      }));
    }

    // Gestion d'une intersection d'un challenge
    if (responseAdvance.data.isIntersection === true) {
      Vibration.vibrate()

      let segment = challengeDetail.segments.find(o => o.id === responseAdvance.data.currentSegmentId);
      let checkpoint = challengeDetail.checkpoints.find(o => o.id === segment.checkpointEndId);

      let startSegments = [];

      checkpoint.segmentsStartsIds.forEach(element => {
        let segmentSelected = challengeDetail.segments.find(o => o.id === element);

        if (segmentSelected) {

          startSegments.push({
            id: segmentSelected.id,
            length: segmentSelected.length
          });
        }

      });

      setCanProgress(false);
      setIntersections(startSegments);
    }

    if (responseAdvance.data.obstacleId !== null) {
      Vibration.vibrate()
      let ob = obstacles.find(o => o.id === responseAdvance.data.obstacleId);

      setModalObstacle(ob);
      setCanProgress(false);
    }
  }

  return {
    intersectionHandler,
    obstacleExitHandler,
    endHandler,
  }
}
