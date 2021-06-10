import ChallengeDatabase from "./challenge.database";
import ChallengeImageDatabase from "./challengeImage.database";
import UserDatabase from "./user.database";
import EventToSendDatabase from "./eventToSend.database";
import ObstacleDatabase from "./obstacle.database";
import SegmentDatabase from "./segment.database";
import UserSessionDatabase from "./userSession.database";

export let initAll = async () => {
  const challengeDatabase = ChallengeDatabase();
  const challengeImageDataBase = ChallengeImageDatabase();
  const userDataBase = UserDatabase();
  const eventToSendDatabase = EventToSendDatabase();
  const obstacleDatabase = ObstacleDatabase();
  const segmentDatabase = SegmentDatabase();
  const userSessionDatabase = UserSessionDatabase();

  await challengeDatabase.initTable();
  await challengeImageDataBase.initTable();
  await userDataBase.initTable();
  await eventToSendDatabase.initTable();
  await obstacleDatabase.initTable();
  await segmentDatabase.initTable();
  await userSessionDatabase.initTable();
};
