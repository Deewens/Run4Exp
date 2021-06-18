import { Obstacle } from "./ObstacleModel";

export type Coordinate = {
  id: number;
  x: number;
  y: number;
};

export type Segment = {
  id: number;
  name: string;
  length: number;
  challengeId: number;
  checkpointStartId: number;
  checkpointEndId: number;
  coordinates: Array<Coordinate>;
  obstacles: Array<Obstacle>;
};

export default [
  {
    name: "id",
    type: "INTEGER PRIMARY KEY",
  },
  {
    name: "name",
    type: "TEXT",
  },
  {
    name: "length",
    type: "REAL",
  },
  {
    name: "challengeId",
    type: "INTEGER",
  },
  {
    name: "checkpointStartId",
    type: "INTEGER",
  },
  {
    name: "checkpointEndId",
    type: "INTEGER",
  },
  {
    name: "coordinates",
    type: "TEXT",
  },
];
