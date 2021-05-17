import {
  sum,
  calculateDistanceBetweenPoint,
  calculateDistanceBetweenCheckpoint, calculateCoordOnPolyline,
} from './orthonormalCalculs'
import {Point} from "@acrobatt";

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

const p1: Point = {x: 0.05, y: 0.3}
const p2: Point = {x: 0.9, y: 0.3}
test(`Distance between: ${JSON.stringify(p1)} and ${JSON.stringify(p2)} to equal 0.85`, () => {
  expect(calculateDistanceBetweenPoint(p1, p2)).toBeCloseTo(0.85)
})

const points: Point[] = [{
  x: 0.001,
  y: 0.2
}, {
  x: 0.9,
  y: 0.3
}, {
  x: 0.0009,
  y: 0.3
}]

test(`Distance between two checkpoints with scale of 100. (${JSON.stringify(points)})`, () => {
  expect(calculateDistanceBetweenCheckpoint(points, 100)).toBeCloseTo(180.3644)
})

test(`Calculate coord on a polyline with the distance on this polyline.`, () => {
  const coord = calculateCoordOnPolyline(points, 1.2)
  expect(coord).not.toBeNull()
  //@ts-ignore
  expect(coord.x).toBeCloseTo(0.60)
  //@ts-ignore
  expect(coord.y).toBeCloseTo(0.3)

  expect(calculateCoordOnPolyline(points, 10)).toBeNull()
})
