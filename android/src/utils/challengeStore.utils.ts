import { useState } from "react";

export enum eventType {
  ADVANCE,
  BEGIN_RUN,
  END_RUN,
  CHOOSE_PATH,
  CHANGE_SEGMENT,
  PASS_OBSTACLE,
  END,
}

export default () => {
  const [map, setMap] = useState({
    base64: null,
    challengeDetail: null,
    obstacles: [],
    userSession: null,
  });

  const [progress, setProgress] = useState({
    distanceTraveled: 0,
    distanceExtra: 0,
    resumeProgress: 0,
    selectedIntersection: null,
    completedObstacleIds: [],
    completedSegmentIds: [],
    currentSegmentId: null,
  });

  const [modal, setModal] = useState({
    endModal: false,
    obstacleModal: null,
    intersectionModal: null,
    pauseModal: null,
    pauseLoading: false,
    pauseAction: null,
  });

  let setStateAsync = (setStateCall, state) => {
    return new Promise(() => {
      setStateCall(state);
    });
  };

  let updateState = (setStateCall, state) => {
    return setStateCall((current) => ({
      ...current,
      state,
    }));
  };

  let addToListState = (setStateCall, state) => {
    return setStateCall((current) => [...current, state]);
  };

  let reset = () => {
    setMap({
      base64: null,
      challengeDetail: null,
      obstacles: [],
      userSession: null,
    });

    setProgress({
      distanceTraveled: 0,
      distanceExtra: 0,
      resumeProgress: 0,
      selectedIntersection: null,
      completedObstacleIds: [],
      completedSegmentIds: [],
      currentSegmentId: null,
    });

    setModal({
      endModal: false,
      obstacleModal: null,
      intersectionModal: null,
      pauseModal: null,
      pauseLoading: false,
      pauseAction: null,
    });
  };

  return {
    map,
    setMap,
    progress,
    setProgress,
    setProgressAsync: (state) => setStateAsync(setProgress, state),
    modal,
    setModal,
    setModalAsync: (state) => setStateAsync(setModal, state),
    updateModal: (state) => updateState(setModal, state),
    reset,
  };
};
