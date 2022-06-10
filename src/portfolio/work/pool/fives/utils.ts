import { Balls } from '../types'
import fives from './store'
import { Role, Roles } from './types'

export const ballsSunkToRole = (balls: number[], roles: Role[]): Role[] => {
  const newRoles = roles.filter(({ min, max }) => balls.find(ball => ball >= min && ball <= max))
  return newRoles.length > 0 ? newRoles : roles
}

export const removeDecided = (roles: Roles): Roles => {
  const decidedCount = Object.values(roles).reduce((curr, roles) => curr + +(roles.length === 1), 0)

  if (decidedCount < fives.playerCount) {
    for (let decidedPlayer = 1; decidedPlayer <= fives.playerCount; decidedPlayer++) {
      if (roles[decidedPlayer].length === 1) {
        for (let otherPlayer = 1; otherPlayer < fives.playerCount; otherPlayer++) {
          if (otherPlayer !== decidedPlayer) {
            roles[otherPlayer] = roles[otherPlayer].filter(
              role => role.min !== roles[decidedPlayer][0].min,
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
    const matchingGroupIndex = matchingGroups.findIndex(
      ({ matchingRoles }) =>
        matchingRoles.every(
          matchRole =>
            roles[player].find(playerRole => playerRole.min === matchRole.min) !== undefined,
        ) &&
        roles[player].every(
          playerRole =>
            matchingRoles.find(matchRole => matchRole.min === playerRole.min) !== undefined,
        ),
    )
    if (matchingGroupIndex === -1)
      matchingGroups.push({ matchingRoles: roles[player], players: [player] })
    else matchingGroups[matchingGroupIndex].players.push(player)
  }

  matchingGroups.forEach(group => {
    if (group.matchingRoles.length === group.players.length) {
      for (let player = 1; player <= fives.playerCount; player++) {
        if (!group.players.includes(player)) {
          roles[player] = roles[player].filter(
            playerRole =>
              group.matchingRoles.find(matchRole => matchRole.min === playerRole.min) === undefined,
          )
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
      Number(ball) < roles[player][0].min ||
      Number(ball) > roles[player][0].max ||
      status === 'queued' ||
      status === 'sunk',
  )
}
