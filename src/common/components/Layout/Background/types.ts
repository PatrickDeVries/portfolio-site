export type Point2d = {
  x: number
  y: number
}

export type Circle = Point2d & {
  radius: number
  $type: RepellentShape.Circle
}

export const isCircle = (s: Circle | Polygon): s is Circle => s.$type === RepellentShape.Circle
export const isRectangle = (s: Circle | Polygon): s is Rectangle =>
  s.$type === RepellentShape.Rectangle
export const isStar = (s: Circle | Polygon): s is Star => s.$type === RepellentShape.Star
export const isPolygon = (s: Circle | Polygon): s is Polygon =>
  s.$type === RepellentShape.Rectangle || s.$type === RepellentShape.Star

export type Rectangle = {
  vertices: Point2d[]
  $type: RepellentShape.Rectangle
}

export type Star = {
  vertices: Point2d[]
  $type: RepellentShape.Star
}

export type Polygon = Rectangle | Star

export type Repellent = { shape: Circle | Polygon; mins: Point2d; maxes: Point2d; center: Point2d }

export enum RepellentShape {
  Circle = 'CIRCLE',
  Rectangle = 'RECTANGLE',
  Star = 'STAR',
}

export interface Scale {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}
