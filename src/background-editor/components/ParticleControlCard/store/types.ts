import { RepellentShape } from '../../Layout/Background/types'

export type Mouse = {
  x: number
  y: number
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
  mouseShape: RepellentShape

  colorA: string
  colorB: string
}
