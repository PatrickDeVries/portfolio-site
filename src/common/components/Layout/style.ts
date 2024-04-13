import styled from 'styled-components'

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

export const Body = styled.body<{ $tint?: boolean }>`
  height: 100%;
  width: 100%;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: hidden auto;
  ${({ $tint, theme }) => $tint && `background-color: ${theme.background}77;`}
`
