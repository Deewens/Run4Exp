type Dimension = {
  width: number
  height: number
}

type Point = {
  x: number,
  y: number
}

interface Segment {
  name?: string;
  start: Point;
  end: Point;
  coords: Point[];
}

interface ISegment {
  name: string,
  challengeId: number
  length: number
  checkpointStartId: number
  checkpointEndId: number
  coordinates: Point[]
}

class Segment {
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

export const calculateOrthonormalDimension = (width: number, height: number): Dimension => {
  let smallerLength;
  if (width > height) {
    smallerLength = height / width;
    return {width: 1, height: smallerLength}
  } else {
    smallerLength = width / height;
    return {width: smallerLength, height: 1};
  }
}

export const calculateOrthonormalPoint = (pxPoint: Point, pxDimension: Dimension, orthonormalDimension: Dimension): Point => {
  let x = (pxPoint.x / pxDimension.width) * orthonormalDimension.width;
  let y = (pxPoint.y / pxDimension.height) * orthonormalDimension.height;

  return {x, y};
}

export const calculatePixelPoint = (pxPoint: Point, pxDimension: Dimension, orthonormalDimension: Dimension): Point => {
  let x = (pxPoint.x * pxDimension.width) / orthonormalDimension.width;
  let y = (pxPoint.y * pxDimension.height) / orthonormalDimension.height;

  return {x, y};
}

export const calculateDistanceBetweenPoint = (p1: Point, p2: Point, scale: number) => {
  let x = p2.x - p1.x;
  let y = p2.y - p1.y;

  return (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * scale;
}

export const calculateDistanceBetweenCheckpoint = (points: Point[], scale: number) => {
  let distance = 0

  for (let i = 0; i < points.length; i++) {
    if (i != points.length-1) { // check if it is the last point
      distance += calculateDistanceBetweenPoint(points[i], points[i+1], scale)
    }
  }

  return distance
}

/**
 * Permet de calculer les coordonnées d'un point sur un segment en fonction de la distance donné sur ce segment
 *
 * @param segment Segment sur lequel calculer les coordonnées
 * @param distance Distance sur la polyline
 * @param scale Echelle du repère
 */
export const calculatePointCoordOnSegment = (segment: any, distance: number, scale: number): Point | null => {
  const coords = segment.coordinates

  // Convertie la distance donné en distance orthonormé (0,1)
  distance = distance/scale

  let cumulatedDistance = 0
  for (let i = 0; i < coords.length; i++) {
    if (i != coords.length - 1) {
      // Calculate the length of the current line with coordinates
      let d = Math.sqrt(Math.pow(coords[i + 1].x - coords[i].x, 2) + Math.pow(coords[i + 1].y - coords[i].y, 2))
      cumulatedDistance += d

      if (cumulatedDistance > distance) {
        // Convert the given distance base on the polyline by the length of the current line
        let distanceOnLine = d - (cumulatedDistance - distance)
        let {x1, y1} = {x1: coords[i].x, y1: coords[i].y}
        let {x2, y2} = {x2: coords[i+1].x, y2: coords[i+1].y}

        let x3 = x1 - ((distanceOnLine * (x1 - x2))/d)
        let y3 = y1 - ((distanceOnLine * (y1 - y2))/d)

        return {x: x3, y: y3}
      }
    }
  }

  return null
}