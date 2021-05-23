import Database from "./database";
import ChallengeModel from "./models/ChallengeModel";

let challengeDatabase = Database('challenges', ChallengeModel);

export let selectById = (id) => {
  return challengeDatabase.selectById(id);
}

export let addData = (object, callback) => {
  return challengeDatabase.addData(object, callback);
}

export let list = () => {
  return challengeDatabase.list();
}

export let updateById = (id, object) => {
  return challengeDatabase.updateById(id, object);
}
