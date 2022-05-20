import styled from 'styled-components/macro'

export const Main = styled.div`
  height: 100vh;
  width: 100%;

  background-repeat: no-repeat;
  ${({ theme }) =>
    `background-image: linear-gradient(168deg, ${theme.background}, ${theme.strongHighlight});`}

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`

export const Body = styled.div<{ tint?: boolean }>`
  height: 100%;
  width: 100%;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: auto;
  overflow-x: hidden;
  ${({ tint, theme }) => tint && `background-color: ${theme.background}77;`}
`
