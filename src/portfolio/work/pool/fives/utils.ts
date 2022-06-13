import { Balls } from '../types'
import fives from './store'
import { isColor, isRange, Role, Roles } from './types'

const isBallInRole = (role: Role, ball: number): boolean => {
  if (isRange(role)) {
    return ball >= role.min && ball <= role.max
  } else {
    return ball === role.solid || ball === role.stripe
  }
}

export const ballsSunkToRole = (balls: number[], roles: Role[]): Role[] => {
  const newRoles = roles.filter(role => balls.find(ball => isBallInRole(role, ball)))
  return newRoles.length > 0 ? newRoles : roles
}

const isSameRole = (a: Role, b: Role) => {
  if (isRange(a) && isRange(b) && a.min === b.min) return true
  if (isColor(a) && isColor(b) && a.solid === b.solid) return true
  return false
}

export const removeDecided = (roles: Roles): Roles => {
  const decidedCount = Object.values(roles).reduce((curr, roles) => curr + +(roles.length === 1), 0)

  if (decidedCount < fives.playerCount) {
    for (let decidedPlayer = 1; decidedPlayer <= fives.playerCount; decidedPlayer++) {
      if (roles[decidedPlayer].length === 1) {
        for (let otherPlayer = 1; otherPlayer < fives.playerCount; otherPlayer++) {
          if (otherPlayer !== decidedPlayer) {
            roles[otherPlayer] = roles[otherPlayer].filter(
              role => !isSameRole(role, roles[decidedPlayer][0]),
            )
          }
        }
      }
    }

    const newDecided = Object.values(roles).reduce((curr, roles) => curr + +(roles.length === 1), 0)
    if (newDecided > decidedCount) return removeDecided(roles)
    return roles
  }
  return roles
}

export const pushOutOfMatching = (roles: Roles): Roles => {
  const matchingGroups: { matchingRoles: Role[]; players: number[] }[] = [
    { matchingRoles: roles[1], players: [1] },
  ]

  for (let player = 2; player <= fives.playerCount; player++) {
    const matchingGroupIndex = matchingGroups.findIndex(({ matchingRoles }) => {
      const currPlayerRoles = roles[player]

      return (
        matchingRoles.every(
          matchRole =>
            currPlayerRoles.find(playerRole => isSameRole(playerRole, matchRole)) !== undefined,
        ) &&
        currPlayerRoles.every(
          playerRole =>
            matchingRoles.find(matchRole => isSameRole(matchRole, playerRole)) !== undefined,
        )
      )
    })

    if (matchingGroupIndex === -1)
      matchingGroups.push({ matchingRoles: roles[player], players: [player] })
    else matchingGroups[matchingGroupIndex].players.push(player)
  }

  matchingGroups.forEach(group => {
    if (group.matchingRoles.length === group.players.length && group.matchingRoles.length <= 3) {
      for (let player = 1; player <= fives.playerCount; player++) {
        if (!group.players.includes(player)) {
          const newRoles = roles[player].filter(
            playerRole =>
              group.matchingRoles.find(matchRole => isSameRole(matchRole, playerRole)) ===
              undefined,
          )
          if (newRoles.length > 0) roles[player] = newRoles
        }
      }
    }
  })

  return removeDecided(roles)
}

export const cascadeRoles = (roles: Roles): Roles => pushOutOfMatching(removeDecided({ ...roles }))

export const wouldWin = (player: number, balls: Balls, roles: Roles): boolean => {
  if (roles[player].length !== 1) return false

  return Object.entries(balls).every(
    ([ball, status]) =>
      !isBallInRole(roles[player][0], Number(ball)) || status === 'queued' || status === 'sunk',
  )
}
