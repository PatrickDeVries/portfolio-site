import { Balls, BallType } from '../types'

export type Roles = Record<number, BallType[]>

export enum BallTypeCombo {
  SolidEven = 'SOLID_EVEN',
  SolidOdd = 'SOLID_ODD',
  StripeEven = 'STRIPE_EVEN',
  StripeOdd = 'STRIPE_ODD',
}

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
}
