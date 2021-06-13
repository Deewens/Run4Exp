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
import { Context as AuthContext } from "../context/AuthContext";
import { useContext } from "react";

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
  isEnd: boolean;
};

type Event = {
  id: number;
};

export default () => {
  const userSessionDatabase = UserSessionDatabase();
  const eventToSendDatabase = EventToSendDatabase();
  const challengeDatabase = ChallengeDatabase();
  const segmentDatabase = SegmentDatabase();
  const obstacleDatabase = ObstacleDatabase();

  const { state } = useContext(AuthContext);

  let getServerData = async (sessionId): Promise<Challenge> => {
    let { data: responseSession } = await UserSessionApi.getById(sessionId);

    let { data: responseDetail } = await ChallengeApi.getDetail(
      responseSession.challengeId
    );

    let obstacles = [];

    responseDetail.segments.forEach(async (segment) => {
      let { data: responseObstacle } = await ObstacleApi.getBySegementId(
        segment.id
      );

      responseObstacle.forEach((obstacle) => {
        obstacles.push(obstacle);
      });
    });

    return {
      ...responseDetail,
      obstacles,
      userSession: { ...responseSession, user_id: state.userId },
    };
  };

  let getLocalChallenge = async (userSessionId) => {
    try {
      let userSession = await userSessionDatabase.selectById(userSessionId);
      let challenge = await challengeDatabase.selectById(
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
          challenge_id: userSession.challenge_id,
          events: eventToSend,
        },
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  let writeLocalData = async (challengeData: Challenge) => {
    console.log("challengeData.userSession", challengeData.userSession);
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

    challengeData.obstacles.forEach(async (obstacle) => {
      await obstacleDatabase.replaceEntity({
        id: obstacle.id,
        position: obstacle.position,
        response: obstacle.response,
        riddle: obstacle.riddle,
        segment_id: obstacle.segment_id,
      });
    });

    challengeData.segments.forEach(async (segment) => {
      await segmentDatabase.replaceEntity(segment);
    });
  };

  let sendSessionToOnline = async (challengeData: Challenge) => {
    let userSessionId = challengeData.userSession.id;

    let eventlist = await eventToSendDatabase.listByUserSessionId(
      userSessionId
    );
    console.log("eventlist", eventlist);

    try {
      eventlist.forEach(async (event) => {
        console.log("event", event);
        switch (event.type) {
          case eventType.ObstaclePass:
            console.log("ObstaclePass");
            await UserSessionApi.passObstacle(userSessionId, event.value);
            break;

          case eventType.Advance:
            console.log("Advance");
            await UserSessionApi.selfAdvance(userSessionId, {
              advancement: event.value,
            });
            break;

          case eventType.Start:
            console.log("start");
            await UserSessionApi.startRun(userSessionId);
            break;

          case eventType.End:
            console.log("End");
            // await UserSessionApi.selfAdvance(userSessionId, {});
            break;

          case eventType.SegmentPass:
            console.log("SegmentPass");
            // await UserSessionApi.passSegment(userSessionId, {});
            break;
          default:
            break;
        }

        await eventToSendDatabase.deleteById(event.id);
      });
    } catch (error) {
      console.log("Error on sync");
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
        console.log("session is valid");
        await sendSessionToOnline(localData);
      }

      challengeData = await getServerData(sessionId);

      await writeLocalData(challengeData);
    } catch (e) {
      console.log(e);
      console.log("challengeData hors ligne");

      challengeData = localData; //Hors ligne
    }

    if (!validateChallengeAndSession(challengeData)) {
      console.log("Error no data for challenge");
      navigation.navigate("Mes courses");
      //TODO: go back
    }

    return challengeData;
  };

  return {
    getServerData,
    getLocalChallenge,
    writeLocalData,
    validateSession,
    sendSessionToOnline,
    validateChallengeAndSession,
    syncData,
  };
};
