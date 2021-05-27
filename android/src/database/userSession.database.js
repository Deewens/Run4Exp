import Database from "./database";
import UserSessionModel from "./models/UserSessionModel";

let userSessionDatabase = Database('userSessions', UserSessionModel);

export let selectById = (id) => {
  return userSessionDatabase.selectById(id);
}

export let addData = (object, callback) => {
  return userSessionDatabase.addData(object, callback);
}

export let list = () => {
  return userSessionDatabase.list();
}

export let updateById = (id, object) => {
  return userSessionDatabase.updateById(id, object);
}
