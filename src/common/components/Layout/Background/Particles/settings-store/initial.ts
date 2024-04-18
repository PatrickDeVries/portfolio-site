import { RepellentShape } from '@/common/components/Layout/Background/types'
import { DARK } from '@/common/theme'
import { ParticleSettings } from './types'

export const INITIAL_SETTINGS: ParticleSettings = {
  isFirstHit: false,
  areControlsOpen: false,

  particleCount: 20000,
  baseV: 0.05,
  vVar: 0.003,
  baseTurnV: 0.03 * Math.PI,
  turnVar: 0.03 * Math.PI,
  freeThinkers: 200,
  mouseSize: 1,
  mouseShape: RepellentShape.Circle,

  colorA: DARK.primary,
  colorB: DARK.secondary,
}

export const DEFAULT_SETTINGS: Partial<ParticleSettings> = {
  particleCount: 20000,
  baseV: 0.05,
  vVar: 0.003,
  baseTurnV: 0.03 * Math.PI,
  turnVar: 0.03 * Math.PI,
  freeThinkers: 200,
  mouseSize: 1,
  mouseShape: RepellentShape.Circle,

  colorA: DARK.primary,
  colorB: DARK.secondary,
}
