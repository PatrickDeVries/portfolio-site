import { BallType } from '../types'
import { Role } from './types'

export const formatRole = (role: Role): string => {
  return role.min === role.max ? role.min.toString() : `${role.min}-${role.max}`
}

export const formatBallType = (ballType: BallType): string => {
  if (ballType === BallType.Odd) return 'Odds'
  if (ballType === BallType.Solid) return 'Solids'
  if (ballType === BallType.Even) return 'Evens'
  return 'Stripes'
}

export const formatPlayerName = (player: number, playerNames: Record<number, string>): string =>
  playerNames[player] ? playerNames[player] : `Player ${player}`

export const formatOrdinal = (i?: number): string => {
  if (!i) return ''
  let j = i % 10
  let k = i % 100

  if (j === 1 && k !== 11) return i + 'st'
  if (j === 2 && k !== 12) return i + 'nd'
  if (j === 3 && k !== 13) return i + 'rd'
  return i + 'th'
}
