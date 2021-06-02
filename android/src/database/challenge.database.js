import Database from "./database";
import ChallengeModel from "./models/ChallengeModel";

let challengeDatabase = Database('challenges', ChallengeModel);

export default () => {

  let selectById = (id) => {
    return challengeDatabase.selectById(id);
  }

  let addData = (object) => {
    return challengeDatabase.addData(object);
  }

  let listAll = async () => {
    let result = await challengeDatabase.listAll();
    return result;
  }

  let updateById = async (id, object) => {
    let result = await challengeDatabase.updateById(id, object);
    return result;
  }

  let replaceEntity = async (object) => {
    let selected = await selectById(object.id);

    if (selected === undefined) {
      await addData(object);
    } else {
      await challengeDatabase.updateById(object.id, {...object,id:null});
    }

  }

  return {
    initTable: challengeDatabase.initTable,
    selectById,
    addData,
    listAll,
    updateById,
    replaceEntity
  }
}