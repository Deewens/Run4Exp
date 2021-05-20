export interface IUserSession {
  advancement: number,
  currentSegmentId: number
  isEnd: boolean
  isIntersection: boolean
  obstacleId: number
  totalAdvancement: number
}

export class UserSession {
  public readonly attributes: IUserSession

  constructor(data: Partial<IUserSession>, public readonly id?: number) {
    this.attributes = {
      advancement: 0,
      currentSegmentId: 0,
      isEnd: false,
      isIntersection: false,
      obstacleId: 0,
      totalAdvancement: 0,
      ...data
    }
  }
}