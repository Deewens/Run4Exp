import Database from "./database";
import UserSessionModel from "./models/UserSessionModel";

let userSessionDatabase = Database("usersessions", UserSessionModel);

export default () => {
  let listByUserId = async (userId) => {
    let result = await userSessionDatabase.listWhere("user_id", userId);
    return result;
  };

  let replaceEntity = async (object) => {
    let selected = await userSessionDatabase.selectById(object.id);

    if (selected === undefined) {
      await userSessionDatabase.addData(object);
    } else {
      await userSessionDatabase.updateById(object.id, { ...object, id: null });
    }
  };

  return {
    ...userSessionDatabase,
    replaceEntity,
    listByUserId,
  };
};
