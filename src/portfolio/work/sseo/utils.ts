import { Ball, BallType, BallTypeCombo, Player, Roles } from './types'

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
    Object.values(Player).forEach(decidedPlayer => {
      if (roles[decidedPlayer].length === 1) {
        Object.values(Player)
          .filter(p => p !== decidedPlayer)
          .forEach(p => {
            roles[p] = roles[p].filter(ballType => ballType !== roles[decidedPlayer][0])
          })
      }
    })

    const newDecided = Object.values(roles).reduce(
      (curr, ballTypes) => curr + +(ballTypes.length === 1),
      0,
    )
    if (newDecided > decidedCount) return removeDecided(roles)
    return roles
  }
  return roles
}

export const getQuarters = (roles: Roles): Record<BallTypeCombo, Player[]> => {
  const playersInQuarters = Object.keys(roles).filter(
    player => roles[player as keyof Roles].length === 2,
  ) as Player[]

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
  const playersInQuarters = Object.keys(roles).filter(
    player => roles[player as keyof Roles].length === 2,
  )
  if (playersInQuarters.length <= 1) return roles

  const quarters = getQuarters(roles)

  const fullCorner = Object.keys(quarters).find(q => quarters[q as BallTypeCombo].length > 1)
  if (!fullCorner) return roles

  Object.keys(roles)
    .filter(player => !quarters[fullCorner as BallTypeCombo].includes(player as keyof Roles))
    .forEach(player => {
      roles[player as keyof Roles] = roles[player as keyof Roles].filter(
        ballType => !roles[quarters[fullCorner as BallTypeCombo][0]].includes(ballType),
      )
    })

  roles = removeDecided(roles)

  return roles
}

export const cascadeRoles = (roles: Roles): Roles => {
  let rolesCopy = { ...roles }
  rolesCopy = removeDecided(rolesCopy)
  rolesCopy = pushByQuarter(rolesCopy)

  return rolesCopy
}

export const getDecided = (roles: Roles) => {
  const solidPlayer = Object.values(Player).find(
    player => roles[player].length === 1 && roles[player].includes(BallType.Solid),
  )
  const stripePlayer = Object.values(Player).find(
    player => roles[player].length === 1 && roles[player].includes(BallType.Stripe),
  )
  const evenPlayer = Object.values(Player).find(
    player => roles[player].length === 1 && roles[player].includes(BallType.Even),
  )
  const oddPlayer = Object.values(Player).find(
    player => roles[player].length === 1 && roles[player].includes(BallType.Odd),
  )

  return {
    [BallType.Solid]: solidPlayer,
    [BallType.Stripe]: stripePlayer,
    [BallType.Even]: evenPlayer,
    [BallType.Odd]: oddPlayer,
  }
}

export const wouldWin = (
  player: Player,
  balls: Ball[],
  decided: Record<BallType, Player | undefined>,
): boolean => {
  let won = false
  Object.values(BallType).forEach(ballType => {
    if (decided[ballType] === player) {
      if (
        ballType === BallType.Solid &&
        balls.every(({ sunkBy, queued }, index) => index + 1 > 8 || sunkBy || queued)
      )
        won = true
      else if (
        ballType === BallType.Stripe &&
        balls.every(({ sunkBy, queued }, index) => index + 1 <= 8 || sunkBy || queued)
      )
        won = true
      else if (
        ballType === BallType.Even &&
        balls.every(({ sunkBy, queued }, index) => (index + 1) % 2 !== 0 || sunkBy || queued)
      )
        won = true
      else if (
        ballType === BallType.Odd &&
        balls.every(({ sunkBy, queued }, index) => (index + 1) % 2 === 0 || sunkBy || queued)
      )
        won = true
    }
  })

  return won
}

export const getWinners = (
  balls: Ball[],
  decided: Record<BallType, Player | undefined>,
): Player[] => {
  let winners: Player[] = []
  Object.values(BallType).forEach(ballType => {
    const decidedPlayer = decided[ballType]
    if (typeof decidedPlayer !== 'undefined') {
      if (
        ballType === BallType.Solid &&
        balls.every(({ sunkBy, queued }, index) => index + 1 > 8 || (sunkBy && !queued))
      )
        winners.push(decidedPlayer)
      else if (
        ballType === BallType.Stripe &&
        balls.every(({ sunkBy, queued }, index) => index + 1 <= 8 || (sunkBy && !queued))
      )
        winners.push(decidedPlayer)
      else if (
        ballType === BallType.Even &&
        balls.every(({ sunkBy, queued }, index) => (index + 1) % 2 !== 0 || (sunkBy && !queued))
      )
        winners.push(decidedPlayer)
      else if (
        ballType === BallType.Odd &&
        balls.every(({ sunkBy, queued }, index) => (index + 1) % 2 === 0 || (sunkBy && !queued))
      )
        winners.push(decidedPlayer)
    }
  })
  return winners
}
