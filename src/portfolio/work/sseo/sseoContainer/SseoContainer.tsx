import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components/macro'
import Button from '../../../../common/components/button'
import Input from '../../../../common/components/input'
import { formatBallType } from '../formatters'
import SseoGraph from '../sseoGraph'
import { Ball, BallType, GameState, Player, Roles } from '../types'
import { ballsSunkToRole, cascadeRoles, getDecided, getWinners, wouldWin } from '../utils'
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

const INITIAL_STATE: GameState = {
  names: {
    [Player.One]: '',
    [Player.Two]: '',
    [Player.Three]: '',
    [Player.Four]: '',
  },
  balls: new Array(15).fill({ sunkBy: null, queued: false }),
  roles: {
    [Player.One]: Object.values(BallType),
    [Player.Two]: Object.values(BallType),
    [Player.Three]: Object.values(BallType),
    [Player.Four]: Object.values(BallType),
  },
  winners: [],
  losers: [],
}

const SseoContainer: React.FC = () => {
  const theme = useTheme()
  const [game, setGame] = useState<GameState>(INITIAL_STATE)
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(Player.One)
  const [lost, setLost] = useState<boolean>(false)
  const decided: Record<BallType, Player | undefined> = useMemo(
    () => getDecided(game.roles),
    [game.roles],
  )
  const winningShot = useMemo(
    () => wouldWin(selectedPlayer, game.balls, decided),
    [game.balls, decided, selectedPlayer],
  )
  // TODO: diffs instead of full state
  const [history, setHistory] = useState<
    { balls: Ball[]; roles?: Roles; winners?: Player[]; losers?: Player[] }[]
  >([])

  useEffect(() => {
    if (!winningShot) setLost(false)
  }, [winningShot])
  useEffect(
    () =>
      setGame(curr => ({
        ...curr,
        winners: [
          ...curr.winners,
          ...getWinners(game.balls, decided).filter(
            winner => !curr.winners.includes(winner) && !curr.losers.includes(winner),
          ),
        ],
      })),
    [decided, game.balls],
  )

  return (
    <Wrapper>
      <LeftSection>
        <Header>
          <h1>Solids vs Stripes vs Evens vs Odds </h1>
          <Button
            onClick={() => {
              setGame(curr => ({ ...INITIAL_STATE, names: curr.names }))
              setSelectedPlayer(Player.One)
              setLost(false)
            }}
            color={theme.focus}
          >
            New game
          </Button>
        </Header>
        {Object.values(Player).map((playerKey, i) => (
          <PlayerWrapper key={playerKey}>
            <div>
              {`Player ${playerKey.toLowerCase()} - ${game.roles[playerKey]
                .map(ballType => formatBallType(ballType))
                .join(' | ')}`}
              <div>
                <Input
                  placeholder={`Player name`}
                  type="text"
                  value={game.names[playerKey]}
                  onChange={e =>
                    setGame(curr => ({
                      ...curr,
                      names: { ...curr.names, [playerKey]: e.target.value },
                    }))
                  }
                />
                <Button
                  color={theme.primary}
                  variant="outline"
                  onClick={() => setSelectedPlayer(playerKey)}
                  disabled={game.winners.includes(playerKey) || game.losers.includes(playerKey)}
                >
                  Select
                </Button>
              </div>
            </div>
            {game.balls.map(
              ({ sunkBy, queued }, index) =>
                sunkBy === playerKey &&
                !queued && (
                  <PoolBall key={`ball-${index + 1}`} num={index + 1} sunk>
                    <div>{index + 1}</div>
                  </PoolBall>
                ),
            )}
          </PlayerWrapper>
        ))}

        <div>Remaining - click a ball to queue</div>
        <BallsWrapper>
          {game.balls.map(
            ({ sunkBy, queued }, index) =>
              !sunkBy &&
              !queued && (
                <PoolBall
                  title="Click to add to queue"
                  key={`ball-${index + 1}`}
                  num={index + 1}
                  onClick={() => {
                    const currCopy = [...game.balls]
                    currCopy[index] = { sunkBy: null, queued: true }
                    setGame(curr => ({ ...curr, balls: currCopy }))
                  }}
                >
                  <div>{index + 1}</div>
                </PoolBall>
              ),
          )}
        </BallsWrapper>
        <ConfirmQueue>
          <div>Queue</div>
          <select
            title="Select Player"
            value={selectedPlayer}
            onChange={e => setSelectedPlayer(e.target.value as Player)}
          >
            {Object.values(Player).map((player, i) => (
              <option
                key={player}
                label={game.names[player] || `Player ${i + 1}`}
                value={player}
                disabled={game.winners.includes(player) || game.losers.includes(player)}
              />
            ))}
          </select>
          <Button
            variant="outline"
            color={theme.focus}
            disabled={!game.balls.filter(({ queued }) => queued).length}
            onClick={() => {
              setHistory([...history, game])

              const newBalls = game.balls.map(({ sunkBy, queued }) => ({
                sunkBy: queued ? selectedPlayer : sunkBy,
                queued: false,
              }))
              const newRoles = cascadeRoles({
                ...game.roles,
                [selectedPlayer]: ballsSunkToRole(
                  game.balls
                    .map(({ queued }, i) => ({ queued: queued, val: i + 1 }))
                    .filter(({ queued }) => queued)
                    .map(({ val }) => val),
                  game.roles[selectedPlayer],
                ),
              })
              const newLosers = winningShot && lost ? [...game.losers, selectedPlayer] : game.losers
              const newWinners =
                winningShot && !lost ? [...game.winners, selectedPlayer] : game.winners

              setGame(curr => ({
                ...curr,
                roles: newRoles,
                balls: newBalls,
                winners: newWinners,
                losers: newLosers,
              }))

              if (winningShot) {
                setSelectedPlayer(
                  curr =>
                    Object.values(Player).find(
                      player =>
                        !newWinners.includes(player) &&
                        !newLosers.includes(player) &&
                        player !== curr,
                    ) ?? curr,
                )
              }
            }}
          >
            Confirm
          </Button>
        </ConfirmQueue>
        <BallsWrapper>
          {game.balls.map(
            ({ queued }, index) =>
              queued && (
                <PoolBall
                  title="Click to remove from queue"
                  key={`ball-${index + 1}`}
                  num={index + 1}
                  onClick={() => {
                    const currCopy = [...game.balls]
                    currCopy[index] = { sunkBy: null, queued: false }
                    setGame(curr => ({ ...curr, balls: currCopy }))
                  }}
                >
                  <div>{index + 1}</div>
                </PoolBall>
              ),
          )}
          {winningShot && game.balls.some(ball => ball.queued) && (
            <Input
              type="checkbox"
              label="called wrong pocket / scratched"
              checked={lost}
              onChange={e => setLost(e.target.checked)}
            />
          )}
        </BallsWrapper>
        {history.length > 0 && (
          <Button
            variant="outline"
            color={theme.danger}
            onClick={() => {
              setGame(curr => ({ ...curr, ...history.at(-1) }))
              setHistory(history.slice(0, -1))
            }}
          >
            Undo Last Shot
          </Button>
        )}
      </LeftSection>
      <RightSection>
        <SseoGraph game={game} decided={decided} />
      </RightSection>
    </Wrapper>
  )
}

export default SseoContainer
