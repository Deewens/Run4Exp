import {Point} from "@acrobatt";

interface IObstacle {
  position: number
  riddle: string
  segmentId: number
}

export class Obstacle {
  public readonly attributes: IObstacle

  constructor(data: Partial<IObstacle>, public readonly id?: number) {
    this.attributes = {
      position: 0.50,
      riddle: '',
      segmentId: 0,
      ...data
    }
  }
}