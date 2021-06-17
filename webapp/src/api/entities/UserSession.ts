import {EventSessionApi} from "@acrobatt";

export interface IUserSession {
  challengeId: number
  userId: number
  advancement: number // Avancement total en m
  events: EventSession[]
  registrationDate: Date
}

export type EventSession = {
  date: Date
  type: EventSessionApi["type"]
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
      registrationDate: new Date(),
      ...data
    }
  }
}