import {Dimension, Point} from "@acrobatt";
import {Segment} from "../api/entities/Segment";

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

/**
 * Prends les coordonnées en pixel et les transforme en coordonnée orthonormé
 * Exemple:
 * calculatePixelPoint({x: 0, y: 0.5}, {width: 500, height: 250}, {width: 1, height: 0.5}) => {x: 0: y 250}
 *
 * @param pxPoint Point à calculer en pixel
 * @param pxDimension Dimensions de l'image en pixel
 * @param orthonormalDimension Dimensions de l'image orthonormé
 * @return Point convertie orthonormée
 */
export const calculateOrthonormalPoint = (pxPoint: Point, pxDimension: Dimension, orthonormalDimension: Dimension): Point => {
  let x = (pxPoint.x / pxDimension.width) * orthonormalDimension.width;
  let y = (pxPoint.y / pxDimension.height) * orthonormalDimension.height;

  return {x, y};
}

/**
 * Prends les coordonnées orthonormée et les transforme en pixel
 * calculatePixelPoint({x: 0, y: 0.5}, {width: 500, height: 250}, {width: 1, height: 0.5}) => {x: 0: y 250}
 *
 * @param orthonormalPoint Point à calculer orthonormé
 * @param pxDimension Dimensions de l'image en pixel
 * @param orthonormalDimension Dimensions de l'image orthonormé
 * @return Point convertie en pixel
 */
export const calculatePixelPoint = (orthonormalPoint: Point, pxDimension: Dimension, orthonormalDimension: Dimension): Point => {
  let x = (orthonormalPoint.x * pxDimension.width) / orthonormalDimension.width;
  let y = (orthonormalPoint.y * pxDimension.height) / orthonormalDimension.height;

  return {x, y};
}

export const calculateDistanceBetweenPoint = (p1: Point, p2: Point) => {
  let x = p2.x - p1.x;
  let y = p2.y - p1.y;

  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export const calculateDistanceBetweenCheckpoint = (points: Point[], scale: number) => {
  let distance = 0

  for (let i = 0; i < points.length; i++) {
    if (i != points.length-1) { // check if it is the last point
      distance += calculateDistanceBetweenPoint(points[i], points[i+1]) * scale
    }
  }

  return distance
}

/**
 * Permet de calculer les coordonnées d'un point sur une polyline en fonction de la distance donné sur cette polyline
 * Le segment est représenté par sa liste de coordonnée sur le repère orthonormé.
 *
 * @param coords Liste des coordonnées composant la polyline
 * @param distance Distance sur la polyline
 * @return les coordonnées X, Y sur le repère orthonormé -- null si le tableau de coords est vide ou si la distance donné n'est pas comprise entre le point de départ et le point d'arrivé de la polyline
 */
export const calculateCoordOnPolyline = (coords: Point[], distance: number): Point | null => {
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

export function sum(a: number, b: number) {
  return a + b
}