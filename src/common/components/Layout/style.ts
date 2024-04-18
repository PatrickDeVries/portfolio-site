import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;

  height: 100vh;
  width: 100%;

  background-repeat: no-repeat;
  ${({ theme }) =>
    `background-image: linear-gradient(168deg, ${theme.background}, ${theme.strongHighlight});`}
`

export const Main = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  height: 100vh;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`

export const Body = styled.body<{ $tint?: boolean }>`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: hidden auto;
  ${({ $tint, theme }) => $tint && `background-color: ${theme.background}77;`}
`
