import { Size } from '@react-three/fiber'
import { Circle, Point2d, Polygon, Repellent, RepellentShape, Scale, isCircle } from './types'

export const PI2 = Math.PI * 2

///
/// Intersection checks
///

// Circle
export const isPointInCircle = (point: Point2d, circle: Circle): boolean =>
  Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius

// Polygon
export const isPointInPolygon = ({
  point,
  max,
  min,
  vertices,
}: { point: Point2d; max: Point2d; min: Point2d; vertices: Point2d[] }): boolean => {
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

// Any shape
export const isPointInShape = ({
  point,
  shape,
  shapeMaxes,
  shapeMins,
}: { point: Point2d; shape: Circle | Polygon; shapeMaxes: Point2d; shapeMins: Point2d }) => {
  const pointIsInShape = isCircle(shape)
    ? shape.radius > 0 && isPointInCircle(point, shape)
    : isPointInPolygon({ point, max: shapeMaxes, min: shapeMins, vertices: shape.vertices })

  return pointIsInShape
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

// move a particle out of a circle by turning
export const getAngleFromPoint = ({ point, fromPoint }: { point: Point2d; fromPoint: Point2d }) =>
  Math.atan2(point.y - fromPoint.y, point.x - fromPoint.x)

// move a particle out of a radius with horizontal/vertical velocities
export const getRadiusEscapeVelocities = ({
  point,
  shapeCenter,
  shapeMaxes,
  shapeMins,
  horizontalMaxSpeed,
  verticalMaxSpeed,
}: {
  point: Point2d
  shapeCenter: Point2d
  shapeMaxes: Point2d
  shapeMins: Point2d
  horizontalMaxSpeed: number
  verticalMaxSpeed: number
}) => {
  const angleFromCenter = Math.atan2(point.y - shapeCenter.y, point.x - shapeCenter.x)
  const distanceFromTop = shapeMaxes.y - point.y
  const distanceFromRight = shapeMaxes.x - point.x
  const distanceFromBottom = shapeMins.y - point.y
  const distanceFromLeft = shapeMins.x - point.x

  return {
    horizontalVelocity: [
      Math.cos(angleFromCenter) * horizontalMaxSpeed,
      distanceFromLeft,
      distanceFromRight,
    ].reduce((acc, curr) => (Math.abs(curr) < Math.abs(acc) ? curr : acc)), // exit the circle if possible, otherwise continue out at the max speed
    verticalVelocity: [
      Math.sin(angleFromCenter) * verticalMaxSpeed,
      distanceFromTop,
      distanceFromBottom,
    ].reduce((acc, curr) => (Math.abs(curr) < Math.abs(acc) ? curr : acc)), // exit the circle if possible, otherwise continue out at the max speed
  }
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

export const generateRectangleFromBoundingRect = ({
  top,
  right,
  bottom,
  left,
}: {
  top: number
  right: number
  bottom: number
  left: number
}): Point2d[] => [
  {
    x: left,
    y: top,
  },
  {
    x: right,
    y: top,
  },
  {
    x: right,
    y: bottom,
  },
  {
    x: left,
    y: bottom,
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

export const getMouseShape = ({
  position,
  shape,
  size,
}: { position: Point2d; shape: RepellentShape; size: number }): Circle | Polygon => {
  switch (shape) {
    case RepellentShape.Circle:
      return { ...position, radius: size, $type: RepellentShape.Circle }
    case RepellentShape.Rectangle:
      return {
        vertices: generateRectangleFromCenter(position, size * 2, size * 2),
        $type: RepellentShape.Rectangle,
      }
    case RepellentShape.Star:
      return {
        vertices: generateStar(size, position),
        $type: RepellentShape.Star,
      }
  }
}

///
/// Utils for shape information
///

export const getShapeMins = (shape: Circle | Polygon) =>
  isCircle(shape)
    ? { x: shape.x - shape.radius, y: shape.y - shape.radius }
    : {
        x: Math.min.apply(
          Math,
          shape.vertices.map(v => v.x),
        ),
        y: Math.min.apply(
          Math,
          shape.vertices.map(v => v.y),
        ),
      }

export const getShapeMaxes = (shape: Circle | Polygon) =>
  isCircle(shape)
    ? { x: shape.x + shape.radius, y: shape.y + shape.radius }
    : {
        x: Math.max.apply(
          Math,
          shape.vertices.map(v => v.x),
        ),
        y: Math.max.apply(
          Math,
          shape.vertices.map(v => v.y),
        ),
      }

export const getShapeCenter = ({
  shape,
  mins,
  maxes,
}: { shape: Circle | Polygon; mins: Point2d; maxes: Point2d }): Point2d =>
  isCircle(shape)
    ? shape
    : {
        x: (mins.x + maxes.x) / 2,
        y: (mins.y + maxes.y) / 2,
      }

export const getRepellentFromShape = (shape: Circle | Polygon): Repellent => {
  if (isCircle(shape)) {
    return {
      shape,
      mins: { x: shape.x - shape.radius, y: shape.y - shape.radius },
      maxes: { x: shape.x + shape.radius, y: shape.y + shape.radius },
      center: shape,
    }
  } else {
    let mins = { x: shape.vertices[0].x, y: shape.vertices[0].y }
    let maxes = { x: shape.vertices[0].x, y: shape.vertices[0].y }
    for (let i = 1; i < shape.vertices.length; i++) {
      const x = shape.vertices[i].x
      const y = shape.vertices[i].y

      if (x < mins.x) mins.x = x
      if (y < mins.y) mins.y = y
      if (x > maxes.x) maxes.x = x
      if (y > maxes.y) maxes.y = y
    }

    return {
      shape,
      mins,
      maxes,
      center: { x: (mins.x + maxes.x) / 2, y: (mins.y + maxes.y) / 2 },
    }
  }
}

///
/// DOM interfacing utils
///

// Based on https://www.geeksforgeeks.org/window-to-viewport-transformation-in-computer-graphics-with-implementation/
export const projectWindowPointIntoViewport = (
  point: Point2d,
  viewportScale: {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
  },
): Point2d => ({
  x:
    viewportScale.xMin +
    (point.x - 0) * ((viewportScale.xMax - viewportScale.xMin) / (window.innerWidth - 0)),
  y:
    -viewportScale.yMin +
    (point.y - 0) * ((-viewportScale.yMax - -viewportScale.yMin) / (window.innerHeight - 0)), // three.js coordinate system y axis is inverted to the window's coordinate system
})

export const scaleWidthIntoViewport = (width: number, viewportScale: Scale) =>
  width * ((viewportScale.xMax - viewportScale.xMin) / (window.innerWidth - 0))

///
/// Repellent information utils
///

const getFixedRepellentShapes = (
  pathname: string,
  viewport: Size,
  viewportScale: Scale,
): (Circle | Polygon)[] => {
  switch (pathname) {
    case '/':
      return viewport.width < viewport.height
        ? []
        : [
            {
              vertices: generateStar(viewport.width * 0.1, {
                x: (viewportScale.xMin * 3) / 4,
                y: 0,
              }),
              $type: RepellentShape.Star,
            },
            {
              vertices: generateStar(viewport.width * 0.1, {
                x: (viewportScale.xMax * 3) / 4,
                y: 0,
              }),
              $type: RepellentShape.Star,
            },
          ]
    default:
      return []
  }
}

const getFixedRepellentInfo = (pathname: string, viewport: Size, viewportScale: Scale) => {
  const fixedRepellentShapes = getFixedRepellentShapes(pathname, viewport, viewportScale)
  const fixedRepellentShapesWithMetadata = fixedRepellentShapes.map(getRepellentFromShape)

  return fixedRepellentShapesWithMetadata
}
const getVisibleDynamicRepellents = () => {
  const allRepellents = document.querySelectorAll('*[data-repel-particles="true"]')
  const visibleRepellents = Array.from(allRepellents).filter(repellent => {
    const { top, bottom, left, right } = repellent.getBoundingClientRect()

    const verticallyVisible =
      (top > 0 && top < window.innerHeight) || (bottom > 0 && bottom < window.innerHeight)
    const horizontallyVisible =
      (left > 0 && left < window.innerWidth) || (right > 0 && right < window.innerWidth)

    return verticallyVisible && horizontallyVisible
  })
  return visibleRepellents
}

const getVisibleDynamicRepellentShapes = (viewportScale: Scale): (Circle | Polygon)[] => {
  const dynamicRepellents = getVisibleDynamicRepellents()

  return dynamicRepellents.map(repellent => {
    const { top, right, bottom, left } = repellent.getBoundingClientRect()
    const repellentShape = repellent.getAttribute('data-repel-shape') as RepellentShape

    switch (repellentShape) {
      case RepellentShape.Circle:
        return {
          ...projectWindowPointIntoViewport(
            { x: (right + left) / 2, y: (top + bottom) / 2 },
            viewportScale,
          ),
          radius: scaleWidthIntoViewport((right - left) / 2, viewportScale),
          $type: RepellentShape.Circle,
        }
      case RepellentShape.Rectangle:
        return {
          vertices: generateRectangleFromBoundingRect({ top, right, bottom, left }).map(point =>
            projectWindowPointIntoViewport(point, viewportScale),
          ),
          $type: RepellentShape.Rectangle,
        }
      case RepellentShape.Star:
        return {
          vertices: generateStar(bottom - top, {
            x: (right + left) / 2,
            y: (bottom + top) / 2,
          }).map(point => projectWindowPointIntoViewport(point, viewportScale)),
          $type: RepellentShape.Star,
        }
      default:
        return {
          vertices: generateRectangleFromBoundingRect({ top, right, bottom, left }).map(point =>
            projectWindowPointIntoViewport(point, viewportScale),
          ),
          $type: RepellentShape.Rectangle,
        }
    }
  })
}

const getDynamicRepellentInfo = (viewportScale: Scale) => {
  const dynamicRepellentShapes = getVisibleDynamicRepellentShapes(viewportScale)
  const dynamicRepellentShapesWithMetadata = dynamicRepellentShapes.map(getRepellentFromShape)

  return dynamicRepellentShapesWithMetadata
}

export const getRepellentInfo = (pathname: string, viewport: Size, viewportScale: Scale) => {
  const fixedRepellentShapesWithMetadata = getFixedRepellentInfo(pathname, viewport, viewportScale)
  const dynamicRepellentShapesWithMetadata = getDynamicRepellentInfo(viewportScale)

  return [...fixedRepellentShapesWithMetadata, ...dynamicRepellentShapesWithMetadata]
}

export const getWindowBoundsCollisions = ({
  viewport,
  viewportTop,
  position,
  xVelocity,
  yVelocity,
}: {
  viewport: Size
  viewportTop: number
  position: Point2d
  xVelocity: number
  yVelocity: number
}) => {
  const minX = -viewport.width / 2
  const minY = -viewport.height / 2
  const maxX = viewport.width / 2
  const maxY = viewport.height / 2 - viewportTop

  const isAtTop = position.y > maxY
  const hasCollidedWithTop = isAtTop && yVelocity > 0
  const isAtRight = position.x > maxX
  const hasCollidedWithRight = isAtRight && xVelocity > 0
  const isAtBottom = position.y < minY
  const hasCollidedWithBottom = isAtBottom && yVelocity < 0
  const isAtLeft = position.x < minX
  const hasCollidedWithLeft = isAtLeft && xVelocity < 0

  return {
    isAtTop,
    hasCollidedWithTop,
    isAtRight,
    hasCollidedWithRight,
    isAtBottom,
    hasCollidedWithBottom,
    isAtLeft,
    hasCollidedWithLeft,
  }
}

///
/// Utilities for interacting with background settings
///

// Scales a `base` value by a % change `scale`
export const scaleSetting = ({ base, scale }: { base: number; scale: number }): number =>
  base + (base * scale) / 100
