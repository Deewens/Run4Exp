import Database from "./database";
import ChallengeImageModel from "./models/ChallengeImageModel";

let challengeImageDatabase = Database("challengeImages", ChallengeImageModel);

export default () => {
  let replaceEntity = async (object) => {
    let selected = await challengeImageDatabase.selectById(object.id);

    if (selected === undefined) {
      await challengeImageDatabase.addData(object);
    } else {
      await challengeImageDatabase.updateById(object.id, {
        ...object,
        id: null,
      });
    }
  };

  return {
    ...challengeImageDatabase,
    replaceEntity,
  };
};
