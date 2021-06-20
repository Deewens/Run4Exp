export type Obstacle = {
  id: number;
  position: number;
  response: string;
  riddle: string;
  segmentId: number;
  userSessionId: number;
};

export default [
  {
    name: "id",
    type: "INTEGER PRIMARY KEY",
  },
  {
    name: "position",
    type: "REAL",
  },
  {
    name: "response",
    type: "TEXT",
  },
  {
    name: "riddle",
    type: "TEXT",
  },
  {
    name: "segmentId",
    type: "INTEGER",
  },
  {
    name: "userSessionId",
    type: "INTEGER",
  },
];
