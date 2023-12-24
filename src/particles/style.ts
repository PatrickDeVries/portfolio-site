import styled from 'styled-components'
import { TABLET } from '../theme/media-queries'

export const Wrapper = styled.div<{ $isFirstHit?: boolean }>`
  position: fixed;
  top: 2rem;
  right: 3.5rem;

  ${TABLET} {
    right: 6rem;
  }

  ${({ $isFirstHit }) => !$isFirstHit && 'transform: translateY(-100vh);'}

  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background-color: ${({ theme }) => theme.background}77;
  border: 1px ${({ theme }) => theme.secondary} solid;

  transition: transform 0.25s ease;
`

export const GearIndicator = styled.p`
  text-align: right;
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
`

export const Instructions = styled.p`
  text-align: right;
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
`
