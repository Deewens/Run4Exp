import Database from "./database";
import EventModel from "./models/EventModel";

let eventDatabase = Database("events", EventModel);

export default () => {
  let updateBy = async (propertyName, propertyValue, object) => {
    let query = `UPDATE events SET `;

    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const value = object[key];
        query += `${key} = "${value}",`;
      }
    }

    query = query.slice(0, -1);

    query += ` WHERE ${propertyName} = ${propertyValue}`;

    let result = await eventDatabase.executeQuery(query, null);
    return result;
  };

  let replaceEntity = async (object): Promise<any> => {
    let selected = await eventDatabase.selectWhere("date", object.date);

    if (selected === undefined) {
      await eventDatabase.addData(object);
    } else {
      await updateBy("date", object.date, {
        ...object,
      });
    }
  };

  let listByUserSessionId = (userSessionId: number): Promise<any> => {
    return eventDatabase.listWhere("userSessionId", userSessionId);
  };

  return {
    ...eventDatabase,
    replaceEntity,
    listByUserSessionId,
    updateBy,
  };
};
