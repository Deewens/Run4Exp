export type Checkpoint = {
  id: number;
  name: string;
  checkpointType: any;
  challengeId: number;
  position_x: number;
  position_y: number;
  segmentsStartsIds: Array<number>;
  segmentsEndsIds: Array<number>;
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
    name: "checkpointType",
    type: "TEXT",
  },
  {
    name: "challengeId",
    type: "INTEGER",
  },
  {
    name: "position_x",
    type: "INTEGER",
  },
  {
    name: "position_y",
    type: "INTEGER",
  },
  {
    name: "segmentsStartsIds",
    type: "TEXT",
  },
  {
    name: "segmentsEndsIds",
    type: "TEXT",
  },
];
