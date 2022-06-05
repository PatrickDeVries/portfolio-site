import proxyWithPersist from 'valtio-persist'
import { dark, ThemeName } from '../../../theme/themes'
import { persistence } from '../../store/persistence'

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
  theme: ThemeName

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

const INITIAL_SETTINGS: BackgroundControl = {
  theme: 'dark',

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

  colorA: dark.primary,
  colorB: dark.secondary,
}

const DEFAULT_SETTINGS: Partial<BackgroundControl> = {
  particleCount: 20000,
  baseV: 0.05,
  vVar: 0.003,
  baseTurnV: 0.03 * Math.PI,
  turnVar: 0.03 * Math.PI,
  freeThinkers: 200,
  mouseSize: 1,
  mouseShape: MouseShape.Circle,

  colorA: dark.primary,
  colorB: dark.secondary,
}

const particleSettings = proxyWithPersist({
  name: 'particleSettings',
  initialState: INITIAL_SETTINGS,
  version: 0,
  migrations: {},
  ...persistence,
})

export const resetSettings = () => Object.assign(particleSettings, DEFAULT_SETTINGS)

export default particleSettings
