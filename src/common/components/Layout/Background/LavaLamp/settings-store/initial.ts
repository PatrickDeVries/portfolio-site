import { RepellentShape } from '@/common/components/Layout/Background/types'
import { DARK } from '@/common/theme'
import { LavaLampSettings } from './types'

export const INITIAL_SETTINGS: LavaLampSettings = {
  isFirstHit: false,
  areControlsOpen: false,

  particleCount: 2500,
  particleScale: 0,
  convectionCoefficientScale: 0,
  conductionCoefficientScale: 0,
  lampTempScale: 0,

  mouseSize: 1,
  mouseShape: RepellentShape.Circle,

  hotColor: DARK.hot,
  coldColor: DARK.cold,
}

export const DEFAULT_SETTINGS: Partial<LavaLampSettings> = {
  particleCount: 2500,
  particleScale: 0,
  convectionCoefficientScale: 0,
  conductionCoefficientScale: 0,
  lampTempScale: 0,

  mouseSize: 1,
  mouseShape: RepellentShape.Circle,

  hotColor: DARK.hot,
  coldColor: DARK.cold,
}
