import {IPoint} from "@acrobatt";

export interface ICheckpoint {
  name: string
  coordinate: IPoint
  challengeId: number
  segmentsStartsIds: number[]
  segmentsEndsIds: number[]
  checkpointType: 'BEGIN' | 'MIDDLE' | 'END'
}

export class Checkpoint {
  public readonly attributes: ICheckpoint

  constructor(data: Partial<ICheckpoint>, public readonly id?: number) {
    this.attributes = {
      name: "",
      challengeId: 0,
      checkpointType: "MIDDLE",
      coordinate: {x: 0, y: 0},
      segmentsEndsIds: [],
      segmentsStartsIds: [],
      ...data
    }
  }
}