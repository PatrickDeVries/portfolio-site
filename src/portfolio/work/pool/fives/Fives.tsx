import React, { useState } from 'react'
import { useTheme } from 'styled-components/macro'
import { useSnapshot } from 'valtio'
import Button from '../../../../common/components/button'
import Input from '../../../../common/components/input'
import Layout from '../../../../common/components/layout'
import Select from '../../../../common/components/select'
import { BallsWrapper, ConfirmQueue, PlayerCountSelection, PlayerWrapper, PoolBall } from '../style'
import { formatRole } from './formatters'
import fives, { reset, resetWithNewCount } from './store'
import { Header, LeftSection, RightSection, Wrapper } from './style'
import { isColor } from './types'
import { ballsSunkToRole, cascadeRoles, wouldWin } from './utils'

const Fives: React.FC = () => {
  const theme = useTheme()
  const [selectedPlayer, setSelectedPlayer] = useState<number>(1)
  const [lost, setLost] = useState<boolean>(false)

  const stateSnap = useSnapshot(fives)
  // const { decided } = useSnapshot(derived)

  return (
    <Layout>
      <Wrapper>
        <LeftSection>
          <Header>
            <h1>
              {stateSnap.playerCount === 3
                ? 'Fives'
                : stateSnap.playerCount <= 5
                ? 'Threes'
                : 'Colors'}
            </h1>

            <Button
              onClick={() => {
                reset()
                setSelectedPlayer(1)
              }}
              color={theme.focus}
            >
              New game
            </Button>
          </Header>
          <PlayerCountSelection>
            <div>
              Number of players - <em>changing will reset the game</em>
            </div>
            <Select
              title="Players"
              value={fives.playerCount}
              onChange={e => {
                resetWithNewCount(Number(e.target.value))
                setSelectedPlayer(1)
              }}
            >
              {[3, 4, 5, 6, 7, 8, 9].map(val => (
                <option key={val} value={val} label={val.toString()} />
              ))}
            </Select>
          </PlayerCountSelection>
          {15 % fives.playerCount !== 0 && (
            <BallsWrapper>
              {fives.freeBalls.map(num => (
                <PoolBall num={num} key={`free-${num}`} sunk>
                  <div>{num}</div>
                </PoolBall>
              ))}
              considered "free"
            </BallsWrapper>
          )}
          {Object.keys(stateSnap.roles)
            .map(Number)
            .map(playerKey => (
              <PlayerWrapper key={`player-${playerKey}`}>
                <div>
                  {`Player ${playerKey} - ${stateSnap.roles[playerKey]
                    .map(role => formatRole(role))
                    .join(' | ')}`}
                  <div>
                    <Input
                      placeholder={`Player name`}
                      type="text"
                      value={stateSnap.names[playerKey]}
                      onChange={e => {
                        fives.names[playerKey] = e.target.value
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
                {fives.rankings[playerKey] && `Placed ${fives.rankings[playerKey]}!`}
                {formatRole(fives.roles[playerKey][0]) === 'none' &&
                  ' - Lost by failing to get a role'}
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
                      fives.balls[ballNum] = 'queued'
                    }}
                  >
                    <div>{ball}</div>
                  </PoolBall>
                )
              })}
          </BallsWrapper>
          <ConfirmQueue>
            <div>Queue</div>
            <Select
              title="Select Player"
              value={selectedPlayer}
              onChange={e => setSelectedPlayer(Number(e.target.value))}
            >
              {Object.keys(stateSnap.roles).map((playerKey, i) => (
                <option
                  key={playerKey}
                  label={stateSnap.names[Number(playerKey)] || `Player ${i + 1}`}
                  value={Number(playerKey)}
                  disabled={stateSnap.rankings[Number(playerKey)] !== undefined}
                />
              ))}
            </Select>
            <Button
              variant="outline"
              color={theme.focus}
              disabled={!Object.values(stateSnap.balls).some(status => status === 'queued')}
              onClick={() => {
                const sunkBalls = Object.entries(stateSnap.balls)
                  .filter(([, status]) => status === 'queued')
                  .map(([key]) => Number(key))
                fives.shots.push({
                  player: selectedPlayer,
                  balls: sunkBalls,
                  roles: stateSnap.roles,
                  rankings: stateSnap.rankings,
                  lost,
                })

                sunkBalls.forEach(ball => {
                  fives.balls[ball] = 'sunk'
                })

                fives.roles = cascadeRoles({
                  ...stateSnap.roles,
                  [selectedPlayer]: ballsSunkToRole(sunkBalls, stateSnap.roles[selectedPlayer]),
                })

                let selectedWon = false
                if (wouldWin(selectedPlayer, fives.balls, fives.roles)) {
                  selectedWon = true
                  let ranks = Object.keys(fives.roles).map(Number)
                  Object.values(fives.rankings).forEach(
                    rank => (ranks = ranks.filter(r => r !== rank)),
                  )
                  if (lost) {
                    fives.rankings[selectedPlayer] = ranks.at(-1)
                  } else {
                    fives.rankings[selectedPlayer] = ranks.at(0)
                  }
                  setSelectedPlayer(
                    curr =>
                      Object.keys(fives.rankings)
                        .map(Number)
                        .find(
                          player =>
                            typeof fives.rankings[player] === 'undefined' &&
                            player !== selectedPlayer,
                        ) ?? curr,
                  )
                }

                Object.values(fives.rankings)
                  .map(Number)
                  .forEach(player => {
                    if (
                      typeof fives.rankings[player] === 'undefined' &&
                      (!selectedWon || player !== selectedPlayer) &&
                      wouldWin(player, fives.balls, fives.roles)
                    ) {
                      let ranks = Object.keys(fives.roles).map(Number)
                      Object.values(fives.rankings).forEach(
                        rank => (ranks = ranks.filter(r => r !== rank)),
                      )
                      fives.rankings[player] = ranks.at(0)
                    }
                  })

                Object.keys(fives.roles)
                  .map(Number)
                  .forEach(player => {
                    const newRole = fives.roles[player][0]
                    // loss by failing to secure a role
                    if (isColor(newRole) && newRole.solid === -1) {
                      let ranks = Object.keys(fives.roles).map(Number)
                      Object.values(fives.rankings).forEach(
                        rank => (ranks = ranks.filter(r => r !== rank)),
                      )
                      fives.rankings[player] = ranks.at(-1)
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
                        fives.balls[ballNum] = 'table'
                      }}
                    >
                      <div>{ball}</div>
                    </PoolBall>
                  )
                })}
              {wouldWin(selectedPlayer, stateSnap.balls, stateSnap.roles) && (
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

                Object.entries(fives.balls).forEach(([ball, status]) => {
                  if (status === 'queued') fives.balls[Number(ball)] = 'table'
                })
                lastShot.balls.forEach(ball => (fives.balls[ball] = 'queued'))

                Object.assign(fives.roles, lastShot.roles)

                fives.rankings = {}
                Object.assign(fives.rankings, lastShot.rankings)

                setLost(lastShot.lost)
                setSelectedPlayer(lastShot.player)

                fives.shots.pop()
              }}
            >
              Undo Last Shot
            </Button>
          )}
        </LeftSection>
        <RightSection>{/* <Graph /> */}</RightSection>
      </Wrapper>
    </Layout>
  )
}

export default Fives
