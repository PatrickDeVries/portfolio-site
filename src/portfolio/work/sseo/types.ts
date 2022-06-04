export enum Player {
  One = 'ONE',
  Two = 'TWO',
  Three = 'THREE',
  Four = 'FOUR',
}

export enum BallType {
  Solid = 'SOLID',
  Stripe = 'STRIPE',
  Even = 'EVEN',
  Odd = 'ODD',
}

export interface Ball {
  sunkBy: Player | null
  queued: boolean
}

export type Roles = {
  [key in Player]: BallType[]
}

export enum BallTypeCombo {
  SolidEven = 'SOLID_EVEN',
  SolidOdd = 'SOLID_ODD',
  StripeEven = 'STRIPE_EVEN',
  StripeOdd = 'STRIPE_ODD',
}

export interface GameState {
  names: Record<Player, string>
  balls: Ball[]
  roles: Roles
  winners: Player[]
  losers: Player[]
}
