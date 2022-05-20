import { MutableRefObject } from 'react'
import { BufferGeometry } from 'three'
import proxyWithPersist from 'valtio-persist'
import { dark, ThemeName } from '../../../theme/themes'
import { persistence } from '../../store'

export type Mouse = {
  x: number
  y: number
}

export enum MouseShape {
  Circle = 'Circle',
  Square = 'Square',
  Star = 'Star',
}

//TODO: split up theme pieces and relocate, do not persist particle info
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

  positions?: number[]
  velocities?: number[]
  angles?: number[]

  particles?: MutableRefObject<BufferGeometry | undefined>
}

const DEFAULT_SETTINGS: BackgroundControl = {
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

const store = proxyWithPersist({
  name: 'particles',
  initialState: DEFAULT_SETTINGS,
  ...persistence,
})

export default store
