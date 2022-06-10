import { Balls, BallType } from '../types'
import { BallTypeCombo, Roles } from './types'

export const ballsSunkToRole = (balls: number[], role: BallType[]): BallType[] => {
  const sunkTypes = {
    [BallType.Even]: balls.filter(ball => ball % 2 === 0),
    [BallType.Odd]: balls.filter(ball => !(ball % 2 === 0)),
    [BallType.Solid]: balls.filter(ball => ball <= 8),
    [BallType.Stripe]: balls.filter(ball => ball >= 9),
  }

  const newRole = Object.values(BallType).reduce<BallType[]>(
    (arr, r) => (sunkTypes[r].length > 0 && role.includes(r) ? [...arr, r] : arr),
    [],
  )

  return newRole.length > 0 ? newRole : role
}

export const removeDecided = (roles: Roles): Roles => {
  const decidedCount = Object.values(roles).reduce(
    (curr, ballTypes) => curr + +(ballTypes.length === 1),
    0,
  )
  if (decidedCount < 4) {
    for (let decidedPlayer = 1; decidedPlayer < 5; decidedPlayer++) {
      if (roles[decidedPlayer].length === 1) {
        for (let otherPlayer = 1; otherPlayer < 5; otherPlayer++) {
          if (otherPlayer !== decidedPlayer) {
            roles[otherPlayer] = roles[otherPlayer].filter(
              ballType => ballType !== roles[decidedPlayer][0],
            )
          }
        }
      }
    }

    const newDecided = Object.values(roles).reduce(
      (curr, ballTypes) => curr + +(ballTypes.length === 1),
      0,
    )
    if (newDecided > decidedCount) return removeDecided(roles)
    return roles
  }
  return roles
}

export const getQuarters = (roles: Roles): Record<BallTypeCombo, number[]> => {
  const playersInQuarters = Object.keys(roles)
    .filter(player => roles[Number(player)].length === 2)
    .map(Number)

  return {
    [BallTypeCombo.SolidEven]: playersInQuarters.filter(player =>
      [BallType.Solid, BallType.Even].every(ballType => roles[player].includes(ballType)),
    ),
    [BallTypeCombo.SolidOdd]: playersInQuarters.filter(player =>
      [BallType.Solid, BallType.Odd].every(ballType => roles[player].includes(ballType)),
    ),
    [BallTypeCombo.StripeEven]: playersInQuarters.filter(player =>
      [BallType.Stripe, BallType.Even].every(ballType => roles[player].includes(ballType)),
    ),
    [BallTypeCombo.StripeOdd]: playersInQuarters.filter(player =>
      [BallType.Stripe, BallType.Odd].every(ballType => roles[player].includes(ballType)),
    ),
  }
}

export const pushByQuarter = (roles: Roles): Roles => {
  const playersInQuarters = Object.keys(roles)
    .filter(player => roles[Number(player)].length === 2)
    .map(Number)

  if (playersInQuarters.length <= 1) return roles

  const quarters = getQuarters(roles)

  const fullCorner = Object.keys(quarters).find(q => quarters[q as BallTypeCombo].length > 1)
  if (!fullCorner) return roles

  Object.keys(roles)
    .filter(player => !quarters[fullCorner as BallTypeCombo].includes(Number(player)))
    .forEach(player => {
      roles[Number(player)] = roles[Number(player)].filter(
        ballType => !roles[quarters[fullCorner as BallTypeCombo][0]].includes(ballType),
      )
    })

  return removeDecided(roles)
}

export const cascadeRoles = (roles: Roles): Roles => pushByQuarter(removeDecided({ ...roles }))

export const getDecided = (roles: Roles) => {
  const solidPlayer = Object.keys(roles)
    .map(Number)
    .find(player => roles[player].length === 1 && roles[player].includes(BallType.Solid))
  const stripePlayer = Object.keys(roles)
    .map(Number)
    .find(player => roles[player].length === 1 && roles[player].includes(BallType.Stripe))
  const evenPlayer = Object.keys(roles)
    .map(Number)
    .find(player => roles[player].length === 1 && roles[player].includes(BallType.Even))
  const oddPlayer = Object.keys(roles)
    .map(Number)
    .find(player => roles[player].length === 1 && roles[player].includes(BallType.Odd))

  return {
    [BallType.Solid]: solidPlayer,
    [BallType.Stripe]: stripePlayer,
    [BallType.Even]: evenPlayer,
    [BallType.Odd]: oddPlayer,
  }
}

export const wouldWin = (
  player: number,
  balls: Balls,
  decided: Record<BallType, number | undefined>,
): boolean => {
  let won = false
  Object.values(BallType).forEach(ballType => {
    if (decided[ballType] === player) {
      switch (ballType) {
        case BallType.Solid:
          won = Object.entries(balls)
            .filter(([key]) => Number(key) < 9)
            .every(([, status]) => status === 'sunk' || status === 'queued')
          break

        case BallType.Stripe:
          won = Object.entries(balls)
            .filter(([key]) => Number(key) > 8)
            .every(([, status]) => status === 'sunk' || status === 'queued')
          break

        case BallType.Even:
          won = Object.entries(balls)
            .filter(([key]) => Number(key) % 2 === 0)
            .every(([, status]) => status === 'sunk' || status === 'queued')
          break

        case BallType.Odd:
          won = Object.entries(balls)
            .filter(([key]) => Number(key) % 2 !== 0)
            .every(([, status]) => status === 'sunk' || status === 'queued')
          break
      }
    }
  })

  return won
}
