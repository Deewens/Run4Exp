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
    distanceBase: 0,
    distanceToRemove: 0,
    selectedIntersection: null,
    completedObstacleIds: [],
    completedSegment: [],
    resumeProgress: 0,
    currentSegment: null,
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
  };
};
