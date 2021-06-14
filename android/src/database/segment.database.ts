import Database from "./database";
import SegmentModel from "./models/SegmentModel";

let segmentDatabase = Database('segments', SegmentModel);

export default () => {

  let selectById = (id) => {
    return segmentDatabase.selectById(id);
  }

  let listByChallengeId = (challengeId) => {
    return segmentDatabase.listWhere('challengeId',challengeId);
  }

  let addData = (object) => {
    return segmentDatabase.addData(object);
  }

  let listAll = async () => {
    let result = await segmentDatabase.listAll();
    return result;
  }

  let updateById = async (id, object) => {
    let result = await segmentDatabase.updateById(id, object);
    return result;
  }

  let replaceEntity = async (object) => {
    let selected = await selectById(object.id);

    if (selected === undefined) {
      await addData(object);
    } else {
      await segmentDatabase.updateById(object.id, {...object,id:null});
    }
  }

  return {
    initTable: segmentDatabase.initTable,
    selectById,
    addData,
    listAll,
    updateById,
    replaceEntity,
    listByChallengeId
  }
}