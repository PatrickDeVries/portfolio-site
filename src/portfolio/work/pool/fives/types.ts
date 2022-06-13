import { Balls } from '../types'

export interface Range_ {
  min: number
  max: number
}

export interface Color {
  solid: number
  stripe: number
}

export type Role = Range_ | Color

export const isRange = (role: Role): role is Range_ => {
  return (role as Range_).min !== undefined
}
export const isColor = (role: Role): role is Color => {
  return (role as Color).solid !== undefined
}

export type Roles = Record<number, Role[]>

export interface Shot {
  player: number
  balls: number[]
  roles: Roles
  rankings: Record<number, number | undefined>
  lost: boolean
}

export interface GameState {
  names: Record<number, string>
  balls: Balls
  shots: Shot[]
  roles: Roles
  freeBalls: number[]
  rankings: Record<number, number | undefined>
  playerCount: number
}
