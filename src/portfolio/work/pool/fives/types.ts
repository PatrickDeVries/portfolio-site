import { Balls } from '../types'

export interface Role {
  min: number
  max: number
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
  rankings: Record<number, number | undefined>
  playerCount: number
}
