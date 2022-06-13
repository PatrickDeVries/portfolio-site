import proxyWithPersist from 'valtio-persist'
import { persistence } from '../../../../../common/store/persistence'
import { Color, GameState, Range_, Roles } from '../types'

const generateRoles = (playerCount: number): { roles: Roles; free: number[] } => {
  const roles: Roles = {}
  const free: number[] = []

  if (playerCount < 6) {
    const ballsPerGroup = Math.floor(15 / playerCount)
    const groupCount = Math.floor(15 / ballsPerGroup)
    const roleOptions: Range_[] = []

    for (let i = 0; i < groupCount; i++) {
      if (i < playerCount) {
        roleOptions.push({
          min: i * ballsPerGroup + 1,
          max: (i + 1) * ballsPerGroup,
        })
      } else {
        free.push(i * ballsPerGroup + 1, i * ballsPerGroup + 2, i * ballsPerGroup + 3)
      }
    }

    for (let i = 1; i <= playerCount; i++) {
      roles[i] = roleOptions
    }
  } else {
    const roleOptions: Color[] = []

    for (let i = 1; i <= Math.min(playerCount, 7); i++) {
      roleOptions.push({ solid: i, stripe: i + 8 })
    }

    if (playerCount === 6) {
      free.push(7, 15)
    }
    if (playerCount > 7) {
      for (let i = 0; i < playerCount - 7; i++) {
        roleOptions.push({ solid: -1, stripe: -1 })
      }
    }

    free.push(8)

    for (let i = 1; i <= playerCount; i++) {
      roles[i] = roleOptions
    }
  }

  return { roles, free: free.sort((a, b) => a - b) }
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
  roles: generateRoles(3).roles,
  freeBalls: [],
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

  fives.freeBalls = []
  fives.roles = {}
  const newRoles = generateRoles(fives.playerCount)
  fives.freeBalls = newRoles.free
  Object.assign(fives.roles, newRoles.roles)

  fives.shots = []
  fives.rankings = {}
}

export const resetWithNewCount = (count: number) => {
  fives.playerCount = count

  fives.freeBalls = []
  fives.roles = {}
  const newRoles = generateRoles(count)
  fives.freeBalls = newRoles.free
  Object.assign(fives.roles, newRoles.roles)

  Object.assign(fives.balls, INITIAL_STATE.balls)
  fives.shots = []
  fives.rankings = {}
}
