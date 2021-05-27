import Database from "./database";
import ChallengeImageModel from "./models/ChallengeImageModel";

let challengeImageDatabase = Database('challengeImages', ChallengeImageModel);

export default () => {

  let selectById = (id) => {
    return challengeImageDatabase.selectById(id);
  }

  let addData = (object) => {
    return challengeImageDatabase.addData(object);
  }

  let listAll = async () => {
    let result = await challengeImageDatabase.listAll();
    return result;
  }

  let updateById = async (id, object) => {
    let result = await challengeImageDatabase.updateById(id, object);
    return result;
  }

  let replaceEntity = async (object) => {
    let selected = await selectById(object.id);

    if (selected === undefined) {
      await addData(object);
    } else {
      await challengeImageDatabase.updateById(object.id, {...object,id:null});
    }

  }

  return {
    initTable: challengeImageDatabase.initTable,
    selectById,
    addData,
    listAll,
    updateById,
    replaceEntity
  }
}