export interface IUserSession {
  challengeId: number
  userId: number
  advancement: number // Avancement total en m
  events: EventSession[]
}

export type EventSession = {
  date: Date
  type: string | "BEGIN_RUN" | "ADVANCE" | "CHOOSE_PATH" | "PASS_OBSTACLE" | "END"
  value: string
}

export class UserSession {
  public readonly attributes: IUserSession

  constructor(data: Partial<IUserSession>, public readonly id?: number) {
    this.attributes = {
      userId: 0,
      events: [],
      advancement: 0,
      challengeId: 0,
      ...data
    }
  }
}