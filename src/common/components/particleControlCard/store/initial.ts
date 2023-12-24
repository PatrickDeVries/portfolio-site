import { DARK } from '../../../../theme/themes'
import { BackgroundControl, MouseShape } from './types'

export const INITIAL_SETTINGS: BackgroundControl = {
  firstHit: false,
  controlsOpen: false,

  particleCount: 20000,
  baseV: 0.05,
  vVar: 0.003,
  baseTurnV: 0.03 * Math.PI,
  turnVar: 0.03 * Math.PI,
  freeThinkers: 200,
  mouseSize: 1,
  mouseShape: MouseShape.Circle,

  colorA: DARK.primary,
  colorB: DARK.secondary,
}

export const DEFAULT_SETTINGS: Partial<BackgroundControl> = {
  particleCount: 20000,
  baseV: 0.05,
  vVar: 0.003,
  baseTurnV: 0.03 * Math.PI,
  turnVar: 0.03 * Math.PI,
  freeThinkers: 200,
  mouseSize: 1,
  mouseShape: MouseShape.Circle,

  colorA: DARK.primary,
  colorB: DARK.secondary,
}
