declare module "@acrobatt" {
  type Dimension = {
    width: number
    height: number
  }

  type Point = {
    x: number,
    y: number
  }

  type LineCoords = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  }

  interface Segment {
    name?: string;
    start: Point | null;
    end: Point | null;
    coords: Point[];
  }

  interface Checkpoint {
    name: string;
    position: Point;
    type: 0 | 1 | 2;
  }

  interface Challenge {
    name: string;
    description: string;
    scale: number;
    obstacles?: [];
    checkpoints: Checkpoint[];
    segments: Segment[];
  }
}