import UserSessionApi from "../api/user-session.api";
import { eventType } from "./challengeStore.utils";
import EventToSendDatabase from "../database/eventToSend.database";
import ChallengeApi from "../api/challenge.api";
import ObstacleApi from "../api/obstacle.api";
import { EventToSendType } from "../database/models/EventToSendModel";
import ChallengeDatabase from "../database/challenge.database";
import SegmentDatabase from "../database/segment.database";
import ObstacleDatabase from "../database/obstacle.database";
import UserSessionDatabase from "../database/userSession.database";

type Obstacle = {
  id: number;
  position: number;
  response: string;
  riddle: string;
  segment_id: number;
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
};

export type Challenge = {
  id: number;
  name: number;
  description: string;
  shortDescription: string;
  scale: number;
  obstacles: Array<Obstacle>;
  segments: Array<Segment>;
  userSession: UserSession;
};

type UserSession = {
  id: number;
  challenge_id: number;
  user_id: number;
  totalAdvancement: number;
  currentSegmentId: number;
  advancement: number;
  events: Array<EventToSendType>;
};

type Event = {
  id: number;
};

export default (
  navigation,
  challengeStore,
  challengeId: number,
  sessionId: number
) => {
  let challengeDetail = challengeStore.map.challengeDetail;

  const userSessionDatabase = UserSessionDatabase();
  const eventToSendDatabase = EventToSendDatabase();
  const challengeDatabase = ChallengeDatabase();
  const segmentDatabase = SegmentDatabase();
  const obstacleDatabase = ObstacleDatabase();

  let getServerData = async (): Promise<Challenge> => {
    let { data: responseDetail } = await ChallengeApi.getDetail(challengeId);

    let obstacles = [];

    responseDetail.segments.forEach(async (segment) => {
      let { data: responseObstacle } = await ObstacleApi.getBySegementId(
        segment.id
      );

      responseObstacle.forEach((obstacle) => {
        obstacles.push(obstacle);
      });
    });

    let { data: responseSession } = await UserSessionApi.getById(sessionId);
    console.log("responseSession", responseSession);
    return {
      ...responseDetail,
      obstacles,
      userSession: responseSession,
    };
  };

  let getLocalChallenge = async (userSessionId): Promise<Challenge> => {
    try {
      let userSession = await userSessionDatabase.selectById(userSessionId);
      let challenge = await challengeDatabase.listByUserSessionId(
        userSession.challenge_id
      );
      let segments = await segmentDatabase.listByChallengeId(challenge.id);
      let obstacles = await obstacleDatabase.listByChallengeId(challenge.id);
      let eventToSend = await eventToSendDatabase.listByUserSessionId(
        userSessionId
      );

      return {
        ...challenge,
        obstacles,
        segments,
        userSession: {
          ...userSession,
          challenge_id: userSession.challengeId,
        },
      };
    } catch {
      return null;
    }

    // let eventToSendList = await eventToSendDatabase.listByUserSessionId(
    //   sessionId
    // );

    // eventToSendList = eventToSendList.sort((a, b) => (a.id > b.id && 1) || -1);

    // eventToSendList.forEach((element) => {
    //   if (element.type == eventType.SegmentPass) {
    //     lastSegmentId = element.value;
    //   }
    //   if (element.type == eventType.Advance) {
    //     lastAdvance += element.value;
    //   }
    // });
  };

  let writeLocalData = async (challengeData: Challenge) => {
    await eventToSendDatabase.deleteByUserSession(challengeData.userSession.id);

    await userSessionDatabase.replaceEntity(challengeData.userSession);

    await challengeDatabase.replaceEntity({
      id: challengeData.id,
      name: challengeData.name,
      description: challengeData.description,
      shortDescription: challengeData.shortDescription,
      scale: challengeData.scale,
    });

    challengeData.obstacles.forEach(async (obstacle) => {
      await obstacleDatabase.replaceEntity(obstacle);
    });

    challengeData.segments.forEach(async (segment) => {
      await segmentDatabase.replaceEntity(segment);
    });
  };

  let sendSessionToOnline = (challengeData: Challenge) => {
    // await UserSessionApi.
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
    console.log("challengeData", challengeData);
    if (challengeData == null) {
      return false;
    }

    return true;
  };

  return {
    getServerData,
    getLocalChallenge,
    writeLocalData,
    validateSession,
    sendSessionToOnline,
    validateChallengeAndSession,
  };
};
