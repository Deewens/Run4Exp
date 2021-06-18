import Database from "./database";
import CheckpointModel from "./models/CheckpointModel";

let checkpointDatabase = Database("checkpoints", CheckpointModel);

export default () => {
  let listByChallengeId = (challengeId) => {
    return checkpointDatabase.listWhere("challengeId", challengeId);
  };

  let replaceEntity = async (object) => {
    let selected = await checkpointDatabase.selectById(object.id);

    if (selected === undefined) {
      await checkpointDatabase.addData(object);
    } else {
      await checkpointDatabase.updateById(object.id, { ...object, id: null });
    }
  };

  return {
    ...checkpointDatabase,
    replaceEntity,
    listByChallengeId,
  };
};
