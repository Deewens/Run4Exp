import UserSessionApi from "../api/user-session.api";
import { eventType } from "./challengeStore.utils";
import EventToSendDatabase from "../database/eventToSend.database";
import ChallengeApi from "../api/challenge.api";
import ChallengeDatabase from "../database/challenge.database";
import SegmentDatabase from "../database/segment.database";
import ObstacleDatabase from "../database/obstacle.database";
import UserSessionDatabase from "../database/userSession.database";
import { Context as AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import EventDatabase from "../database/event.database";
import { ToastAndroid } from "react-native";
import { EventToSendType } from "../database/models/EventToSendModel";
import CheckpointDatabase from "../database/checkpoint.database";

type Obstacle = {
  id: number;
  position: number;
  response: string;
  riddle: string;
  segment_id: number;
  userSession_id: number;
};

type Coordinate = {
  id: number;
  x: number;
  y: number;
};

type Segment = {
  id: number;
  name: string;
  length: number;
  challengeId: number;
  checkpointStartId: number;
  checkpointEndId: number;
  coordinates: Array<Coordinate>;
  obstacles: Array<Obstacle>;
};

export type Challenge = {
  id: number;
  name: number;
  description: string;
  shortDescription: string;
  scale: number;
  segments: Array<Segment>;
  userSession: UserSession;
  checkpoints: Array<Checkpoint>;
};

type Checkpoint = {
  id: number;
  position_x: number;
  position_y: number;
  challengeId: number;
  segmentsStartIds: Array<number>;
  segmentsEndIds: Array<number>;
};

type UserSession = {
  id: number;
  challenge_id: number;
  user_id: number;
  events: Array<Event>;
  isEnd: boolean;
  inscriptionDate: Date;
};

type Event = {
  id: number;
  type: string;
  date: number;
  value: string;
  userSession_id: number;
};

export default () => {
  const userSessionDatabase = UserSessionDatabase();
  const eventToSendDatabase = EventToSendDatabase();
  const challengeDatabase = ChallengeDatabase();
  const segmentDatabase = SegmentDatabase();
  const obstacleDatabase = ObstacleDatabase();
  const eventDatabase = EventDatabase();
  const checkpointDatabase = CheckpointDatabase();

  const { state } = useContext(AuthContext);

  let getServerData = async (sessionId): Promise<Challenge> => {
    let { data: responseSession } = await UserSessionApi.getById(sessionId);

    let { data: responseDetail } = await ChallengeApi.getDetail(
      responseSession.challengeId
    );

    return {
      ...responseDetail,
      userSession: {
        ...responseSession,
        challenge_id: responseSession.challengeId,
        user_id: responseSession.userId,
      },
    };
  };

  let getLocalChallenge = async (userSessionId) => {
    try {
      let userSession = await userSessionDatabase.selectById(userSessionId);
      let challenge = await challengeDatabase.selectById(
        userSession.challenge_id
      );
      let events = await eventDatabase.listByUserSessionId(userSessionId);
      console.log("events ttt", events);
      let segments = await segmentDatabase.listByChallengeId(challenge.id);
      let checkpoints = await checkpointDatabase.listByChallengeId(
        challenge.id
      );
      let segmentsAndObstacles: Array<Segment> = [];

      segments.forEach(async (segment) => {
        let obstacles = await obstacleDatabase.listBySegmentId(segment.id);
        segmentsAndObstacles.push({
          ...segment,
          obstacles,
          coordinates: JSON.parse(
            segment.coordinates
              .replace(/\\/g, "")
              .replace(/x/g, '"x"')
              .replace(/y/g, '"y"')
          ),
        });
      });

      return {
        ...challenge,
        segments: segmentsAndObstacles,
        checkpoints,
        userSession: {
          ...userSession,
          challenge_id: userSession.challenge_id,
          events,
        },
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  let writeLocalData = async (challengeData: Challenge) => {
    await userSessionDatabase.replaceEntity({
      id: challengeData.userSession.id,
      challenge_id: challengeData.id,
      user_id: challengeData.userSession.user_id,
    });

    await challengeDatabase.replaceEntity({
      id: challengeData.id,
      name: challengeData.name,
      description: challengeData.description,
      shortDescription: challengeData.shortDescription,
      scale: challengeData.scale,
    });

    challengeData.userSession.events.forEach(async (event) => {
      await eventDatabase.replaceEntity(event);
    });

    challengeData.segments.forEach(async (segment) => {
      await segmentDatabase.replaceEntity({
        id: segment.id,
        name: segment.name,
        length: segment.length,
        challengeId: segment.challengeId,
        checkpointStartId: segment.checkpointStartId,
        checkpointEndId: segment.checkpointEndId,
        coordinates: JSON.stringify(segment.coordinates)
          .replace(/"x"/g, "x")
          .replace(/"y"/g, "y")
          .replace(/{/g, "\\{")
          .replace(/,/g, "\\,"),
      });

      segment.obstacles.forEach(async (obstacle) => {
        await obstacleDatabase.replaceEntity({
          id: obstacle.id,
          position: obstacle.position,
          response: obstacle.response,
          riddle: obstacle.riddle,
          segment_id: obstacle.segment_id,
        });
      });
    });
  };

  let sendSessionToOnline = async (challengeData: Challenge) => {
    let userSessionId = challengeData.userSession.id;

    let eventToSendList = await eventToSendDatabase.listByUserSessionId(
      userSessionId
    );

    try {
      if (eventToSendList.length > 0) {
        await UserSessionApi.bulkEvents(userSessionId, eventToSendList);
      }

      await eventToSendDatabase.deleteByUserSession(userSessionId);
    } catch (error) {
      console.log("Error on sync");
      ToastAndroid.show("Erreur pendant la synchronisation", ToastAndroid.LONG);
      if (error?.response?.status == 400 || error?.response?.status == 500) {
        await eventToSendDatabase.deleteByUserSession(userSessionId);
      }
    }
  };

  let validateSession = (sessionData: UserSession): boolean => {
    if (sessionData == null) {
      return false;
    }
    if (sessionData?.events?.length < 1) {
      return false;
    }

    return true;
  };

  let validateChallengeAndSession = (challengeData: Challenge): boolean => {
    if (challengeData == null) {
      return false;
    }

    return true;
  };

  let syncData = async (navigation, sessionId): Promise<Challenge> => {
    let challengeData: Challenge = null;
    let localData = await getLocalChallenge(sessionId);

    try {
      challengeData = await getServerData(sessionId);

      if (validateSession(localData?.userSession)) {
        await sendSessionToOnline(localData);
      }

      challengeData = await getServerData(sessionId);

      await writeLocalData(challengeData);
    } catch (e) {
      console.log(e);
      console.log("challengeData offline");

      challengeData = localData;
    }

    if (!validateChallengeAndSession(challengeData)) {
      console.log("Error no data for challenge");
      navigation.navigate("Mes courses");
    }

    return challengeData;
  };

  let getCurrentSegmentByStore = async (challengeStore): Promise<Segment> => {
    if (!challengeStore.map.challengeDetail.userSession.id) {
      return;
    }

    let eventsToSend = await eventToSendDatabase.listByUserSessionId(
      challengeStore.map.challengeDetail.userSession.id
    );

    return getCurrentSegment(
      challengeStore.map.challengeDetail.segments,
      challengeStore.map.challengeDetail.checkpoints,
      [...challengeStore.map.userSession.events, ...eventsToSend]
    );
  };

  let getCurrentSegment = (
    segments: Array<any>,
    checkpoints: Array<any>,
    events: Array<any>
  ): Segment => {
    let startCheckpoint = checkpoints.find((x) => x.checkpointType == "BEGIN");

    let sorted = events.sort(function (a, b) {
      return b.value - a.value;
    });

    let currentId = startCheckpoint.id;
    sorted.forEach((element) => {
      if (
        element.type == eventType.CHANGE_SEGMENT ||
        element.type == eventType.CHOOSE_PATH ||
        element.type == eventType[eventType.CHANGE_SEGMENT] ||
        element.type == eventType[eventType.CHOOSE_PATH]
      ) {
        currentId = parseInt(element.value);
      }
    });

    let selsegment = segments.find((x) => x.id == currentId);
    // console.log("current find : ", selsegment.id);
    return selsegment;
  };

  type AdvancementResult = {
    totalAdvancement: number;
    currentAdvancement: number;
  };

  let getAdvancements = (
    events: Array<Event | EventToSendType>
  ): AdvancementResult => {
    let totalAdvancement = 0;
    let currentAdvancement = 0;

    events.sort((a, b) => a.date - b.date);

    events.forEach((event) => {
      if (
        event.type == eventType.CHANGE_SEGMENT ||
        event.type == eventType.CHOOSE_PATH ||
        event.type == eventType[eventType.CHANGE_SEGMENT] ||
        event.type == eventType[eventType.CHOOSE_PATH]
      ) {
        currentAdvancement = 0;
      }

      if (
        event.type == eventType.ADVANCE ||
        event.type == eventType[eventType.ADVANCE]
      ) {
        totalAdvancement += parseInt(event.value);
        currentAdvancement += parseInt(event.value);
      }
      console.log("events foreach ", event.type, event.date);
    });

    // console.log("currentAdvancement", currentAdvancement);

    return { totalAdvancement, currentAdvancement };
  };

  let getCompletedObstacleIds = async (
    challengeData: Challenge
  ): Promise<Array<number>> => {
    let obstacleIds = [];
    let localEvents = await eventToSendDatabase.listByUserSessionId(
      challengeData.userSession.id
    );

    let allEvents = [...challengeData.userSession.events, ...localEvents];

    allEvents.forEach((event) => {
      if (
        event.type == eventType[eventType.PASS_OBSTACLE] ||
        event.type == eventType.PASS_OBSTACLE
      ) {
        // console.log("obstacle event", event);
        obstacleIds.push(parseInt(event.value));
      }
    });

    return obstacleIds;
  };

  let getObstacles = (challengeData: Challenge): Array<Obstacle> => {
    let obstacles = [];

    challengeData.segments.forEach((segment) => {
      segment.obstacles.forEach((obstacle) => {
        obstacles.push(obstacle);
      });
    });

    return obstacles;
  };

  let getFinishedSegmentIds = (challengeData, currentSegment) => {
    let segmentToCheck = currentSegment;

    let lastSegment = false;

    let finishedList = [];
    while (!lastSegment) {
      let startCheckpoint = challengeData.checkpoints.find(
        (x) => x.id === segmentToCheck.checkpointStartId
      );

      if (
        startCheckpoint.segmentsEndIds &&
        startCheckpoint.segmentsEndIds.length > 0
      ) {
        startCheckpoint.segmentsEndIds.forEach((endId) => {
          finishedList.push(endId);
        });
      } else {
        lastSegment = true;
      }
    }

    return finishedList;
  };

  return {
    getServerData,
    getLocalChallenge,
    writeLocalData,
    validateSession,
    sendSessionToOnline,
    validateChallengeAndSession,
    syncData,
    getCurrentSegment,
    getAdvancements,
    getCompletedObstacleIds,
    getObstacles,
    getCurrentSegmentByStore,
    getFinishedSegmentIds,
  };
};
