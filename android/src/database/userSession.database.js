import Database from "./database";
import UserSessionModel from "./models/UserSessionModel";

let userSessionDatabase = Database('usersessions', UserSessionModel);

export default () => {

  let selectById = (id) => {
    return userSessionDatabase.selectById(id);
  }

  let addData = (object) => {
    return userSessionDatabase.addData(object);
  }

  let listAll = async () => {
    let result = await userSessionDatabase.listAll();
    return result;
  }

  let listByUserId = async (userId) => {
    let result = await userSessionDatabase.listWhere("user_id", userId);
    return result;
  }

  let updateById = async (id, object) => {
    let result = await userSessionDatabase.updateById(id, object);
    return result;
  }

  let replaceEntity = async (object) => {
    let selected = await selectById(object.id);

    if (selected === undefined) {
      await addData(object);
    } else {
      await userSessionDatabase.updateById(object.id, { ...object, id: null });
    }
  }

  return {
    initTable: userSessionDatabase.initTable,
    selectById,
    addData,
    listAll,
    updateById,
    replaceEntity,
    listByUserId
  }
}