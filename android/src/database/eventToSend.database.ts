import { eventType } from "../utils/challengeStore.utils";
import Database from "./database";
import EventToSendModel, { EventToSendType } from "./models/EventToSendModel";

let eventToSendDatabase = Database("eventToSend", EventToSendModel);

export default () => {
  let addEvent = (
    type: eventType,
    value: any,
    userSessionId: number
  ): Promise<any> => {
    return eventToSendDatabase.addData({
      type,
      date: Math.round(new Date().getTime() / 1000),
      value,
      userSessionId,
    });
  };

  let listByUserSessionId = async (
    userSessionId: number
  ): Promise<Array<EventToSendType>> => {
    let result = eventToSendDatabase.listWhere("userSessionId", userSessionId);
    return result;
  };

  let replaceEntity = async (object) => {
    let selected = await eventToSendDatabase.selectById(object.id);

    if (selected === undefined) {
      await eventToSendDatabase.addData(object);
    } else {
      await eventToSendDatabase.updateById(object.id, { ...object, id: null });
    }
  };

  let deleteById = (id) => {
    return eventToSendDatabase.executeQuery(
      `delete from eventToSend where id = ${id}`
    );
  };

  let deleteByUserSessionId = (userSessionId: number) => {
    return eventToSendDatabase.executeQuery(
      `delete from eventToSend where userSessionId = ${userSessionId}`
    );
  };

  return {
    ...eventToSendDatabase,
    addEvent,
    replaceEntity,
    listByUserSessionId,
    deleteByUserSessionId,
    deleteById,
  };
};
