import ChallengeDataBase from "./challenge.database";
import ChallengeImageDataBase from "./challengeImage.database";
import UserDataBase from "./user.database";
import EventToSendDatabase from "./eventToSend.database";

export let initAll = async () => {
  const challengeDatabase = ChallengeDataBase();
  const challengeImageDataBase = ChallengeImageDataBase();
  const userDataBase = UserDataBase();
  const eventToSendDatabase = EventToSendDatabase();

  await challengeDatabase.initTable();
  await challengeImageDataBase.initTable();
  await userDataBase.initTable();
  await eventToSendDatabase.initTable();
};
