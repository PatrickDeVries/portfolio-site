import styled, { css } from 'styled-components/macro'

const BALL_COLORS = [
  '#F6DD4A',
  '#0E348A',
  '#B2342B',
  '#381F74',
  '#E77943',
  '#2F6A50',
  '#611915',
  '#000000',
]

export const PlayerCountSelection = styled.div`
  width: fit-content;

  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
  gap: 0.5rem;

  em {
    color: ${({ theme }) => theme.danger};
  }
`

export const PlayerWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;

  font-size: 1.2rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-indent: 1rem;

    > div {
      display: flex;
      gap: 1rem;
      align-items: center;
      text-indent: 0;

      > label {
        width: 19rem;
      }
    }
  }
`

export const BallsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;

  font-size: 1.2rem;
`

export const PoolBall = styled.div<{ num: number; sunk?: boolean }>`
  position: relative;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background-color: ${({ num }) => BALL_COLORS[(num - 1) % 8]};
  box-sizing: border-box;

  ${({ sunk }) =>
    !sunk &&
    css`
      cursor: pointer;
    `}

  display: flex;
  place-content: center;
  align-items: center;
  overflow: hidden;

  user-select: none;

  ${({ num }) =>
    num > 8 &&
    css`
      ::before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 15%;

        width: 100%;
        height: 70%;

        border-top: 1px solid black;
        border-bottom: 1px solid black;
        box-shadow: 0 0 0 1rem white;
      }
    `}
  ::after {
    content: '';
    position: absolute;
    box-sizing: border-box;
    top: 0;

    width: 2em;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px solid black;
  }

  > div {
    width: 50%;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: white;
    color: black;
    font-size: 0.6em;
    border: 1px solid black;

    display: flex;
    place-content: center;
    align-items: center;
  }
`

export const ConfirmQueue = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  font-size: 1.2rem;
`
