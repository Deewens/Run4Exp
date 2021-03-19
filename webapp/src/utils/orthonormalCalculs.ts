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

export const calculateDistanceOnSegment = (segment: Segment, distance: number): {x: number, y: number} | null => {
  let totalLength = 0
  segment.attributes.coordinates.forEach((coord, i, array) => {
    if (i != array.length - 1) {
      let d = Math.sqrt(Math.pow(array[i + 1].x - coord.x, 2) + Math.pow(array[i + 1].y - coord.y, 2))
      totalLength += d
    }
  })


  let totalDistance = 0
  segment.attributes.coordinates.forEach((coord, i, array) => {
    if (i != array.length - 1) {
      let d = Math.sqrt(Math.pow(array[i+1].x - coord.x, 2) + Math.pow(array[i+1].y - coord.y, 2))
      totalDistance += d

      // console.log(`Distance ${distance}`)
      // console.log(`Total distance ${totalDistance}`)
      if (distance < totalDistance) {
        let x1 = coord.x
        let x2 = array[i + 1].x
        let y1 = coord.y
        let y2 = array[i + 1].y

        console.log(`Distance ${d}`)
        console.log(`Total distance ${totalLength}`)
        console.log((d/totalLength)*distance)
        let test = (d/totalLength)*distance
        console.log(`X: ${(x2-x1)/test}`)
        console.log(`Y: ${(y2-y1)/test}`)
        return {x: (x2-x1)*test, y: (y2-y1)*test}
      }
    }
  })


  return null
}