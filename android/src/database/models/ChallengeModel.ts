import { Checkpoint } from "./CheckpointModel";
import { Segment } from "./SegmentModel";
import { UserSession } from "./UserSessionModel";

export type Challenge = {
  id: number;
  name: number;
  description: string;
  shortDescription: string;
  scale: number;
  segments: Array<Segment>;
  userSession: UserSession;
  checkpoints: Array<Checkpoint>;
};

export default [
  {
    name: "id",
    type: "INTEGER",
  },
  {
    name: "name",
    type: "TEXT",
  },
  {
    name: "description",
    type: "TEXT",
  },
  {
    name: "shortDescription",
    type: "TEXT",
  },
  {
    name: "scale",
    type: "REAL",
  },
];
