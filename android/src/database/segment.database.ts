import Database from "./database";
import SegmentModel from "./models/SegmentModel";

let segmentDatabase = Database("segments", SegmentModel);

export default () => {
  let listByChallengeId = (challengeId) => {
    return segmentDatabase.listWhere("challengeId", challengeId);
  };

  let replaceEntity = async (object) => {
    let selected = await segmentDatabase.selectById(object.id);

    if (selected === undefined) {
      await segmentDatabase.addData(object);
    } else {
      await segmentDatabase.updateById(object.id, { ...object, id: null });
    }
  };

  return {
    ...segmentDatabase,
    replaceEntity,
    listByChallengeId,
  };
};
