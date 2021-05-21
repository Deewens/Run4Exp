export type CheckpointTypes =
  | "BEGIN"
  | "MIDDLE"
  | "OBSTACLE"
  | "END";

export type Position = {
  x: number;
  y: number;
};

export type CheckpointObj = {
  name: string;
  position: Position;
  checkpointType: CheckpointTypes;
};

export type Segment = {
  name: string;
  coordinates: Array<Position>;
};
