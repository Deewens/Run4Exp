import { useState } from "react";

export default () => {

  const [map, setMap] = useState({
    base64: null,
    challengeDetail: null,
    obstacles: [],
    userSession: null,
  });

  const [progress, setProgress] = useState({
    distanceBase: 0,
    advanceToRemove: 0,
    selectedIntersection: null,
    canProgress: true,
    completedObstacles: [],
    completedSegmentIds: [],
  });

  const [modal, setModal] = useState({
    endModal: false,
    obstacleModal: null,
    intersectionModal: null,
  });

  const [actionSession, setActionSession] = useState({});

  return {
    map,
    setMap,
    progress,
    setProgress,
    modal,
    setModal,
    actionSession,
    setActionSession
  }
}
