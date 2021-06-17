import Database from "./database";
import ObstacleModel from "./models/ObstacleModel";

let obstacleDatabase = Database("obstacles", ObstacleModel);

export default () => {
  let listByUserSessionId = (userSessionId: number): Promise<Array<any>> => {
    return obstacleDatabase.listWhere("userSessionId", userSessionId);
  };

  let listBySegmentId = (segmentId: number): Promise<Array<any>> => {
    return obstacleDatabase.listWhere("segment_id", segmentId);
  };

  let replaceEntity = async (object): Promise<any> => {
    let selected = await obstacleDatabase.selectById(object.id);

    if (selected === undefined) {
      await obstacleDatabase.addData(object);
    } else {
      await obstacleDatabase.updateById(object.id, { ...object, id: null });
    }
  };

  return {
    ...obstacleDatabase,
    replaceEntity,
    listByUserSessionId,
    listBySegmentId,
  };
};
