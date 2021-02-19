import {Dimension, Point} from "@acrobatt";

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