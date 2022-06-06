import React from 'react'
import { useSnapshot } from 'valtio'
import { BallType } from '../../types'
import { formatBallType, formatOrdinal, formatPlayerName } from '../formatters'
import sseo, { derived } from '../store'
import { BallTypeCombo } from '../types'
import { GraphBody, GraphLabels, GridCell, GridHeader, Label, Wrapper } from './style'

const getLocation = (
  player: number,
  decided: Record<BallType, number | undefined>,
  quarters: Record<BallTypeCombo, number[]>,
): BallType | BallTypeCombo | 'hidden' => {
  const single = Object.values(BallType).find(ballType => decided[ballType] === player)
  if (single) return single

  const combo = Object.values(BallTypeCombo).find(ballTypeCombo =>
    quarters[ballTypeCombo].includes(player),
  )
  if (combo) return combo

  return 'hidden'
}

const getIndex = (player: number, quarters: Record<BallTypeCombo, number[]>): -1 | 0 | 1 => {
  const quarter = Object.keys(quarters).find(quarter =>
    quarters[quarter as BallTypeCombo].includes(player),
  )
  if (!quarter || quarters[quarter as BallTypeCombo].length === 1) return -1
  return quarters[quarter as BallTypeCombo][0] === player ? 0 : 1
}

const Graph: React.FC = () => {
  const stateSnap = useSnapshot(sseo)
  const { decided, quarters } = useSnapshot(derived)

  return (
    <Wrapper>
      <GraphLabels>
        <div></div>
        <GridHeader ballType={BallType.Solid}>{formatBallType(BallType.Solid)}</GridHeader>
        <GridHeader ballType={BallType.Stripe}>{formatBallType(BallType.Stripe)}</GridHeader>
        <GridHeader ballType={BallType.Even}>{formatBallType(BallType.Even)}</GridHeader>
        <GridHeader ballType={BallType.Odd}>{formatBallType(BallType.Odd)}</GridHeader>
        <GraphBody>
          <GridCell>
            {Object.keys(stateSnap.roles)
              .map(Number)
              .map(player => (
                <Label
                  key={`${BallTypeCombo.SolidEven}-${player}`}
                  location={getLocation(player, decided, quarters)}
                  index={getIndex(player, quarters)}
                  rank={stateSnap.rankings[player]}
                >
                  <span>
                    {formatPlayerName(player, stateSnap.names)}
                    {stateSnap.rankings[player] && (
                      <span>
                        {' - '}
                        {formatOrdinal(stateSnap.rankings[player])}
                      </span>
                    )}
                  </span>
                </Label>
              ))}
          </GridCell>
          <GridCell></GridCell>
          <GridCell></GridCell>
          <GridCell></GridCell>
        </GraphBody>
      </GraphLabels>
    </Wrapper>
  )
}

export default Graph
