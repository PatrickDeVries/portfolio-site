export type Mouse = {
  x: number
  y: number
}

export enum MouseShape {
  Circle = 'Circle',
  Square = 'Square',
  Star = 'Star',
}

export type BackgroundControl = {
  firstHit: boolean
  controlsOpen: boolean

  particleCount: number
  baseV: number
  vVar: number
  baseTurnV: number
  turnVar: number
  freeThinkers: number
  mouseSize: number
  mouseShape: MouseShape

  colorA: string
  colorB: string
}
