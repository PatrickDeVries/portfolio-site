import proxyWithPersist from 'valtio-persist'
import { persistence } from '../../../../../common/store/persistence'
import { GameState, Role, Roles } from '../types'

const generateRoles = (playerCount: number): Roles => {
  const roleOptions: Role[] = []
  const ballsPerGroup = Math.floor(15 / playerCount)
  const groupCount = Math.floor(15 / ballsPerGroup)
  for (let i = 0; i < groupCount; i++) {
    roleOptions.push({ min: i * ballsPerGroup + 1, max: (i + 1) * ballsPerGroup })
  }

  const lastGroup = roleOptions.at(-1)
  if (lastGroup && lastGroup.max < 15) roleOptions.push({ min: lastGroup.max + 1, max: 15 })

  const roles: Roles = {}
  for (let i = 1; i <= playerCount; i++) {
    roles[i] = roleOptions
  }

  return roles
}

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
  roles: generateRoles(3),
  shots: [],
  rankings: {},
  playerCount: 3,
}

const fives = proxyWithPersist({
  name: 'fives',
  initialState: INITIAL_STATE,
  version: 0,
  migrations: {},
  ...persistence,
})

export default fives

export const reset = () => {
  Object.assign(fives.balls, INITIAL_STATE.balls)
  fives.roles = {}
  Object.assign(fives.roles, generateRoles(fives.playerCount))
  fives.shots = []
  fives.rankings = {}
}

export const resetWithNewCount = (count: number) => {
  fives.playerCount = count
  fives.roles = {}
  Object.assign(fives.roles, generateRoles(count))
  Object.assign(fives.balls, INITIAL_STATE.balls)
  fives.shots = []
  fives.rankings = {}
}
