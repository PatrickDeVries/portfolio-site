import proxyWithPersist from 'valtio-persist'
import { persistence } from '../../../../../common/store/persistence'
import { BallType } from '../../types'
import { GameState } from '../types'

export const INITIAL_STATE: GameState = {
  names: {
    1: '',
    2: '',
    3: '',
    4: '',
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
    1: Object.values(BallType),
    2: Object.values(BallType),
    3: Object.values(BallType),
    4: Object.values(BallType),
  },
  shots: [],
  rankings: {},
}

const sseo = proxyWithPersist({
  name: 'sseo',
  initialState: INITIAL_STATE,
  version: 0,
  migrations: {},
  ...persistence,
})

export default sseo
