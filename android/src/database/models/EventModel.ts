export type EventModel = {
  id: number;
  date: number;
  type: string;
  value: string;
  userSessionId: number;
};

export default [
  {
    name: "id",
    type: "INTEGER PRIMARY KEY",
  },
  {
    name: "date",
    type: "REAL",
  },
  {
    name: "type",
    type: "INTEGER",
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
