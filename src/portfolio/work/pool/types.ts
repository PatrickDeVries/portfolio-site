export enum BallType {
  Solid = 'SOLID',
  Stripe = 'STRIPE',
  Even = 'EVEN',
  Odd = 'ODD',
}

export type BallStatus = 'table' | 'queued' | 'sunk'

export type Balls = Record<number, BallStatus>
