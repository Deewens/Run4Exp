import { eventType } from "../utils/challengeStore.utils";
import Database from "./database";
import EventToSendModel, { EventToSendType } from "./models/EventToSendModel";

let eventToSendDatabase = Database("eventToSend", EventToSendModel);

export default () => {
  let addData = (object: any) => {
    return eventToSendDatabase.addData(object);
  };

  let addEvent = (
    type: eventType,
    value: any,
    userSession_id: number
  ): Promise<any> => {
    return addData({
      type,
      date: new Date(),
      value,
      userSession_id,
    });
  };

  let listAll = async () => {
    let result = await eventToSendDatabase.listAll();
    return result;
  };

  let listByUserSessionId = async (
    userSessionId: number
  ): Promise<Array<EventToSendType>> => {
    let result = eventToSendDatabase.listWhere("userSession_id", userSessionId);
    return result;
  };

  let replaceEntity = async (object) => {
    let selected = await eventToSendDatabase.selectById(object.id);

    if (selected === undefined) {
      await addData(object);
    } else {
      await eventToSendDatabase.updateById(object.id, { ...object, id: null });
    }
  };

  return {
    initTable: eventToSendDatabase.initTable,
    addData,
    addEvent,
    listAll,
    replaceEntity,
    listByUserSessionId,
  };
};
