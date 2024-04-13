export const PI2 = Math.PI * 2

///
/// Types
///

export type Point2d = {
  x: number
  y: number
}

export type Circle = Point2d & {
  radius: number
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCircle = (b: any): b is Circle => typeof b.radius === 'number'

export type Polygon = {
  vertices: Point2d[]
}

///
/// Intersection checks
///

/// Circle
export const isInCircle = (point: Point2d, circle: Circle): boolean =>
  Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius

/// Polygon
export const isInPolygon = (
  point: Point2d,
  max: Point2d,
  min: Point2d,
  vertices: Point2d[],
): boolean => {
  if (point.x > max.x || point.x < min.x || point.y > max.y || point.y < min.y) {
    return false
  } else {
    const wrappingVertices = [vertices[vertices.length - 1], ...vertices]
    return (
      wrappingVertices.filter(
        (v, index) =>
          index > 0 && doIntersect(v, wrappingVertices[index - 1], point, { x: 1000, y: point.y }),
      ).length %
        2 ===
      1
    )
  }
}

function onSegment(a: Point2d, b: Point2d, c: Point2d) {
  if (
    b.x <= Math.max(a.x, c.x) &&
    b.x >= Math.min(a.x, c.x) &&
    b.y <= Math.max(a.y, c.y) &&
    b.y >= Math.min(a.y, c.y)
  )
    return true

  return false
}

// Based on https://www.geeksforgeeks.org/orientation-3-ordered-points/
function orientation(a: Point2d, b: Point2d, c: Point2d) {
  const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)

  if (val === 0) return 0 // collinear

  return val > 0 ? 1 : 2 // clockwise or counterclockwise
}

// Based on https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
function doIntersect(a1: Point2d, a2: Point2d, b1: Point2d, b2: Point2d) {
  // Find the four orientations needed for general and special cases
  const o1 = orientation(a1, a2, b1)
  const o2 = orientation(a1, a2, b2)
  const o3 = orientation(b1, b2, a1)
  const o4 = orientation(b1, b2, a2)

  // General case
  if (o1 !== o2 && o3 !== o4) return true

  // Special Cases - if a, b, and c are colinear and b lies on segment ac
  if (o1 === 0 && onSegment(a1, b1, a2)) return true
  if (o2 === 0 && onSegment(a1, b2, a2)) return true
  if (o3 === 0 && onSegment(b1, a1, b2)) return true
  if (o4 === 0 && onSegment(b1, a2, b2)) return true

  return false // No intersection
}

// based on https://www.geeksforgeeks.org/program-for-point-of-intersection-of-two-lines/
export const getIntersection = (
  a1: Point2d,
  a2: Point2d,
  b1: Point2d,
  b2: Point2d,
): Point2d | null => {
  // line a (la) as la1*x + la2*y
  const la1 = a2.y - a1.y
  const la2 = a1.x - a2.x
  const la = la1 * a1.x + la2 * a1.y

  // line b (lb) as lb1*x + lb2*y
  const lb1 = b2.y - b1.y
  const lb2 = b1.x - b2.x
  const lb = lb1 * b1.x + lb2 * b1.y

  const det = la1 * lb2 - lb1 * la2

  if (det === 0) {
    return null
  } else {
    return { x: (lb2 * la - la2 * lb) / det, y: (la1 * lb - lb1 * la) / det }
  }
}

///
/// Utilities for moving particles based on geometries
///

// find the angle a particle can turn to based off its goal
export const getNewAngle = (angle: number, goalAngle: number, turnV: number) =>
  (((goalAngle - angle + Math.PI) % PI2) - Math.PI < turnV
    ? goalAngle
    : goalAngle > (angle + Math.PI) % PI2
      ? angle - turnV
      : angle + turnV) % PI2

// move a particle out of a circle
export const escapeRadius = (
  point: Point2d & { angle: number; turnV: number },
  circle: Circle,
  boostSpeed = 1,
) => {
  const angleFromCircle = Math.atan2(point.y - circle.y, point.x - circle.x)
  return getNewAngle(point.angle, angleFromCircle, point.turnV * boostSpeed) // boost to turn speed to make mouse circle cleaner
}

///
/// Shape Generators
///

export const generateRectangleFromCenter = (
  center: Point2d,
  height: number,
  width: number,
): Point2d[] => [
  {
    x: center.x - width / 2,
    y: center.y - height / 2,
  },
  {
    x: center.x + width / 2,
    y: center.y - height / 2,
  },
  {
    x: center.x + width / 2,
    y: center.y + height / 2,
  },
  {
    x: center.x - width / 2,
    y: center.y + height / 2,
  },
]

export const generatePentagon = (scale = 1, offset: Point2d = { x: 0, y: 0 }): Point2d[] =>
  Array.from({ length: 5 }, (_, k) => ({
    x: scale * Math.sin(((Math.PI * 2) / 5) * k) + offset.x,
    y: scale * Math.cos(((Math.PI * 2) / 5) * k) + offset.y,
  }))

export const generateStar = (scale = 1, offset: Point2d = { x: 0, y: 0 }): Point2d[] => {
  const pentagon = generatePentagon(scale, offset)

  return [
    pentagon[0],
    getIntersection(pentagon[0], pentagon[2], pentagon[4], pentagon[1]) ?? { x: 0, y: 0 },
    pentagon[1],
    getIntersection(pentagon[1], pentagon[3], pentagon[0], pentagon[2]) ?? { x: 0, y: 0 },
    pentagon[2],
    getIntersection(pentagon[2], pentagon[4], pentagon[3], pentagon[1]) ?? { x: 0, y: 0 },
    pentagon[3],
    getIntersection(pentagon[3], pentagon[0], pentagon[4], pentagon[2]) ?? { x: 0, y: 0 },
    pentagon[4],
    getIntersection(pentagon[4], pentagon[1], pentagon[0], pentagon[3]) ?? { x: 0, y: 0 },
  ]
}
