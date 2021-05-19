import {Point} from "@acrobatt";

export interface ISegment {
  name: string,
  challengeId: number
  length: number
  checkpointStartId: number
  checkpointEndId: number
  coordinates: Point[]
}

export class Segment {
  public readonly attributes: ISegment

  constructor(data: Partial<ISegment>, public readonly id?: number) {
    this.attributes = {
      name: "",
      challengeId: 0,
      length: 0,
      checkpointStartId: 0,
      checkpointEndId: 0,
      coordinates: [],
      ...data
    }
  }
}