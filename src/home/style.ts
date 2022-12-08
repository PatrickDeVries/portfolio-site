import styled from 'styled-components'

export const GreetingBlock = styled.div<{ controlsOpen?: boolean }>`
  flex: 1;
  padding: 1rem;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  filter: drop-shadow(0 0 4rem ${({ theme }) => theme.primary});
  font-size: 2rem;
`

export const IntroText = styled.span`
  text-align: center;
  color: ${({ theme }) => theme.text};
  font-size: 3rem;

  > b {
    color: ${({ theme }) => theme.secondary};
    font-weight: 500;
  }
`
