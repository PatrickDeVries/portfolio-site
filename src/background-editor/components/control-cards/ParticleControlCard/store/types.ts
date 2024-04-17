import { RepellentShape } from '@/common/components/Layout/Background/types'

export type ParticleSettings = {
  isFirstHit: boolean
  areControlsOpen: boolean

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
