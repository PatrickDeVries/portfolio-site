import { BallType, GameState, Player } from '../types'

export const INITIAL_STATE: GameState = {
  names: {
    [Player.One]: '',
    [Player.Two]: '',
    [Player.Three]: '',
    [Player.Four]: '',
  },
  balls: {
    1: 'table',
    2: 'table',
    3: 'table',
    4: 'table',
    5: 'table',
    6: 'table',
    7: 'table',
    8: 'table',
    9: 'table',
    10: 'table',
    11: 'table',
    12: 'table',
    13: 'table',
    14: 'table',
    15: 'table',
  },
  roles: {
    [Player.One]: Object.values(BallType),
    [Player.Two]: Object.values(BallType),
    [Player.Three]: Object.values(BallType),
    [Player.Four]: Object.values(BallType),
  },
  shots: [],
  rankings: {},
}
