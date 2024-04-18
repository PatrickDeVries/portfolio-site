import { RepellentShape } from '@/common/components/Layout/Background/types'

export type LavaLampSettings = {
  isFirstHit: boolean
  areControlsOpen: boolean

  particleCount: number
  particleScale: number
  convectionCoefficientScale: number
  lampTempScale: number

  mouseSize: number
  mouseShape: RepellentShape

  hotColor: string
  coldColor: string
}
