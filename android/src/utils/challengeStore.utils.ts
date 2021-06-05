import { useState } from "react";

export enum eventType {
  Start,
  Advance,
  SegmentPass,
  ObstaclePass,
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
    canProgress: true,
    completedObstacles: [],
    completedSegment: [],
  });

  const [modal, setModal] = useState({
    endModal: false,
    obstacleModal: null,
    intersectionModal: null,
  });

  const [eventToSend, setEventToSend] = useState([
    {
      type: eventType.Start,
      value: "",
    },
  ]);

  const [actionSession, setActionSession] = useState({});

  let setStateAsync = (setStateCall, state) => {
    return new Promise(() => {
      setStateCall(state);
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
    actionSession,
    setActionSession,
    eventToSend,
    setEventToSend,
  };
};
