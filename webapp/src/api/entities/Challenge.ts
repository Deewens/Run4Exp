import {IPoint} from "@acrobatt";
import {Page} from "../type";

export interface IChallenge {
  name: string
  description: string
  shortDescription: string
  administratorsId: number[]
  scale: number
  published: boolean
}

export class Challenge {
  public readonly attributes: IChallenge

  constructor(data: Partial<IChallenge>, public readonly id?: number) {
    this.attributes = {
      name: '',
      description: '',
      shortDescription: '',
      administratorsId: [],
      scale: 0,
      published: false,
      ...data
    }
  }
}