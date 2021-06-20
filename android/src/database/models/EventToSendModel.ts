import { eventType } from "../../utils/challengeStore.utils";

export type EventToSendType = {
  id: number;
  type: eventType;
  date: number;
  value: string;
  userSessionId: number;
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
    name: "userSessionId",
    type: "INTEGER",
  },
];
