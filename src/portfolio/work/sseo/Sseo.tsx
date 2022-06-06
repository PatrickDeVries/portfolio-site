import React, { useState } from 'react'
import { useTheme } from 'styled-components/macro'
import { useSnapshot } from 'valtio'
import Button from '../../../common/components/button'
import Input from '../../../common/components/input'
import Layout from '../../../common/components/layout'
import { formatBallType } from './formatters'
import Graph from './graph'
import sseo, { derived, INITIAL_STATE } from './store'
import {
  BallsWrapper,
  ConfirmQueue,
  Header,
  LeftSection,
  PlayerWrapper,
  PoolBall,
  RightSection,
  Wrapper,
} from './style'
import { Player } from './types'
import { ballsSunkToRole, cascadeRoles, wouldWin } from './utils'

const Sseo: React.FC = () => {
  const theme = useTheme()
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(Player.One)
  const [lost, setLost] = useState<boolean>(false)

  const stateSnap = useSnapshot(sseo)
  const { decided } = useSnapshot(derived)

  return (
    <Layout>
      <Wrapper>
        <LeftSection>
          <Header>
            <h1>Solids vs Stripes vs Evens vs Odds </h1>
            <Button
              onClick={() => {
                Object.assign(sseo.balls, INITIAL_STATE.balls)
                Object.assign(sseo.roles, INITIAL_STATE.roles)
                sseo.shots = []
                sseo.rankings = {}
                setSelectedPlayer(Player.One)
              }}
              color={theme.focus}
            >
              New game
            </Button>
          </Header>
          {Object.values(Player).map((playerKey, i) => (
            <PlayerWrapper key={playerKey}>
              <div>
                {`Player ${playerKey.toLowerCase()} - ${stateSnap.roles[playerKey]
                  .map(ballType => formatBallType(ballType))
                  .join(' | ')}`}
                <div>
                  <Input
                    placeholder={`Player name`}
                    type="text"
                    value={stateSnap.names[playerKey]}
                    onChange={e => {
                      sseo.names[playerKey] = e.target.value
                    }}
                  />
                  <Button
                    color={theme.primary}
                    variant="outline"
                    onClick={() => setSelectedPlayer(playerKey)}
                    disabled={stateSnap.rankings[playerKey] !== undefined}
                  >
                    Select
                  </Button>
                </div>
              </div>
              {stateSnap.shots
                .filter(({ player }) => player === playerKey)
                .map(({ balls }) =>
                  balls.map(ball => (
                    <PoolBall key={`ball-${ball}`} num={ball} sunk>
                      <div>{ball}</div>
                    </PoolBall>
                  )),
                )}
            </PlayerWrapper>
          ))}

          <div>Remaining - click a ball to queue</div>
          <BallsWrapper>
            {Object.entries(stateSnap.balls)
              .filter(([, status]) => status === 'table')
              .map(([ball]) => {
                const ballNum = +ball
                return (
                  <PoolBall
                    title="Click to add to queue"
                    key={`ball-${ball}`}
                    num={ballNum}
                    onClick={() => {
                      sseo.balls[ballNum] = 'queued'
                    }}
                  >
                    <div>{ball}</div>
                  </PoolBall>
                )
              })}
          </BallsWrapper>
          <ConfirmQueue>
            <div>Queue</div>
            <select
              title="Select Player"
              value={selectedPlayer}
              onChange={e => setSelectedPlayer(e.target.value as Player)}
            >
              {Object.values(Player).map((playerKey, i) => (
                <option
                  key={playerKey}
                  label={stateSnap.names[playerKey] || `Player ${i + 1}`}
                  value={playerKey}
                  disabled={stateSnap.rankings[playerKey] !== undefined}
                />
              ))}
            </select>
            <Button
              variant="outline"
              color={theme.focus}
              disabled={!Object.values(stateSnap.balls).some(status => status === 'queued')}
              onClick={() => {
                const sunkBalls = Object.entries(stateSnap.balls)
                  .filter(([, status]) => status === 'queued')
                  .map(([key]) => Number(key))
                sseo.shots.push({
                  player: selectedPlayer,
                  balls: sunkBalls,
                  roles: stateSnap.roles,
                  rankings: stateSnap.rankings,
                  lost,
                })

                sunkBalls.forEach(ball => {
                  sseo.balls[ball] = 'sunk'
                })

                sseo.roles = cascadeRoles({
                  ...stateSnap.roles,
                  [selectedPlayer]: ballsSunkToRole(sunkBalls, stateSnap.roles[selectedPlayer]),
                })

                let selectedWon = false
                if (wouldWin(selectedPlayer, sseo.balls, decided)) {
                  selectedWon = true
                  let ranks = [1, 2, 3, 4]
                  Object.values(sseo.rankings).forEach(
                    rank => (ranks = ranks.filter(r => r !== rank)),
                  )
                  if (lost) {
                    sseo.rankings[selectedPlayer] = ranks.at(-1)
                  } else {
                    sseo.rankings[selectedPlayer] = ranks.at(0)
                  }
                  setSelectedPlayer(
                    curr =>
                      Object.values(Player).find(
                        player =>
                          typeof sseo.rankings[player] === 'undefined' && player !== selectedPlayer,
                      ) ?? curr,
                  )
                }

                Object.values(Player).forEach(player => {
                  if (
                    typeof sseo.rankings[player] === 'undefined' &&
                    (!selectedWon || player !== selectedPlayer) &&
                    wouldWin(player, sseo.balls, decided)
                  ) {
                    let ranks = [1, 2, 3, 4]
                    Object.values(sseo.rankings).forEach(
                      rank => (ranks = ranks.filter(r => r !== rank)),
                    )
                    sseo.rankings[player] = ranks.at(0)
                  }
                })
                setLost(false)
              }}
            >
              Confirm
            </Button>
          </ConfirmQueue>
          {Object.entries(stateSnap.balls).filter(([, status]) => status === 'queued').length >
            0 && (
            <BallsWrapper>
              {Object.entries(stateSnap.balls)
                .filter(([, status]) => status === 'queued')
                .map(([ball]) => {
                  const ballNum = Number(ball)
                  return (
                    <PoolBall
                      title="Click to remove from queue"
                      key={`ball-${ball}`}
                      num={ballNum}
                      onClick={() => {
                        sseo.balls[ballNum] = 'table'
                      }}
                    >
                      <div>{ball}</div>
                    </PoolBall>
                  )
                })}
              {wouldWin(selectedPlayer, stateSnap.balls, decided) && (
                <Input
                  type="checkbox"
                  label="called wrong pocket / scratched"
                  checked={lost}
                  onChange={e => setLost(e.target.checked)}
                />
              )}
            </BallsWrapper>
          )}
          {stateSnap.shots.length > 0 && (
            <Button
              variant="outline"
              color={theme.danger}
              onClick={() => {
                const lastShot = stateSnap.shots.at(-1)
                if (!lastShot) return

                Object.entries(sseo.balls).forEach(([ball, status]) => {
                  if (status === 'queued') sseo.balls[Number(ball)] = 'table'
                })
                lastShot.balls.forEach(ball => (sseo.balls[ball] = 'queued'))

                Object.assign(sseo.roles, lastShot.roles)

                sseo.rankings = {}
                Object.assign(sseo.rankings, lastShot.rankings)

                setLost(lastShot.lost)
                setSelectedPlayer(lastShot.player)

                sseo.shots.pop()
              }}
            >
              Undo Last Shot
            </Button>
          )}
        </LeftSection>
        <RightSection>
          <Graph />
        </RightSection>
      </Wrapper>
    </Layout>
  )
}

export default Sseo
