import Database from "./database";
import ChallengeModel from "./models/ChallengeModel";

let challengeDatabase = Database("challenges", ChallengeModel);

export default () => {
  let replaceEntity = async (object) => {
    let selected = await challengeDatabase.selectById(object.id);

    if (selected === undefined) {
      await challengeDatabase.addData(object);
    } else {
      await challengeDatabase.updateById(object.id, { ...object, id: null });
    }
  };

  return {
    ...challengeDatabase,
    replaceEntity,
  };
};
