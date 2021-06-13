import Database from "./database";
import ObstacleModel from "./models/ObstacleModel";

let obstacleDatabase = Database('obstacles', ObstacleModel);

export default () => {

  let selectById = (id) => {
    return obstacleDatabase.selectById(id);
  }

  let addData = (object) => {
    return obstacleDatabase.addData(object);
  }

  let listAll = async () => {
    let result = await obstacleDatabase.listAll();
    return result;
  }

  let listByChallengeId = (challengeId) => {
    return obstacleDatabase.listWhere('challengeId',challengeId);
  }

  let updateById = async (id, object) => {
    let result = await obstacleDatabase.updateById(id, object);
    return result;
  }

  let replaceEntity = async (object) => {
    let selected = await selectById(object.id);

    if (selected === undefined) {
      await addData(object);
    } else {
      await obstacleDatabase.updateById(object.id, {...object,id:null});
    }
  }

  return {
    initTable: obstacleDatabase.initTable,
    selectById,
    addData,
    listAll,
    updateById,
    replaceEntity,
    listByChallengeId
  }
}