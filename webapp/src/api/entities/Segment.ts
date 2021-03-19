import {Point} from "@acrobatt";

interface ISegment {
  name: string,
  challengeId: number
  length: number
  endpointStartId: number
  endpointEndId: number
  coordinates: Point[]
}

export class Segment {
  public readonly attributes: ISegment

  constructor(data: Partial<ISegment>, public readonly id?: number) {
    this.attributes = {
      name: "",
      challengeId: 0,
      length: 0,
      endpointEndId: 0,
      endpointStartId: 0,
      coordinates: [],
      ...data
    }
  }
}