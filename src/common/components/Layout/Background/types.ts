export type Point2d = {
  x: number
  y: number
}

export type Circle = Point2d & {
  radius: number
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const isCircle = (b: any): b is Circle => typeof b.radius === 'number'

export type Polygon = {
  vertices: Point2d[]
}

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
