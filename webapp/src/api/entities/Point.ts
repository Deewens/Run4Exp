import {IPoint} from "@acrobatt";

export class Point implements IPoint {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  equals(point: IPoint) {
    return point.x === this.x && point.y === this.y
  }
}