import {Point} from "@acrobatt";

export interface IObstacle {
  position: number
  riddle: string
  response: string
  segmentId: number
}

export default class Obstacle {
  public readonly attributes: IObstacle

  constructor(data: Partial<IObstacle>, public readonly id?: number) {
    this.attributes = {
      position: 0.50,
      riddle: '',
      response: '',
      segmentId: 0,
      ...data
    }
  }
}