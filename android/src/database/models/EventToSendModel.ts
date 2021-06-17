import { eventType } from "../../utils/challengeStore.utils";

export type EventToSendType = {
  id: number;
  type: eventType;
  date: number;
  value: string;
  userSession_id: number;
};

export default [
  {
    name: "id",
    type: "INTEGER PRIMARY KEY AUTOINCREMENT",
  },
  {
    name: "type",
    type: "INTEGER",
  },
  {
    name: "date",
    type: "REAL",
  },
  {
    name: "value",
    type: "TEXT",
  },
  {
    name: "userSession_id",
    type: "INTEGER",
  },
];