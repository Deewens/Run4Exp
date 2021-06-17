import { EventModel } from "./EventModel";

export type UserSession = {
  id: number;
  challengeId: number;
  userId: number;
  inscriptionDate: Date;
  events: Array<EventModel>;
};

export default [
  {
    name: "id",
    type: "INTEGER PRIMARY KEY",
  },
  {
    name: "challengeId",
    type: "INTEGER",
  },
  {
    name: "userId",
    type: "INTEGER",
  },
  {
    name: "inscriptionDate",
    type: "DATE",
  },
];
