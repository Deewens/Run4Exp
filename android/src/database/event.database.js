import Database from "./database";
import EventModel from "./models/EventModel";

let eventDatabase = Database('events', EventModel);

export let selectById = (id) => {
  return eventDatabase.selectById(id);
}

export let addData = (object, callback) => {
  return eventDatabase.addData(object, callback);
}

export let list = () => {
  return eventDatabase.list();
}

export let updateById = (id, object) => {
  return eventDatabase.updateById(id, object);
}
