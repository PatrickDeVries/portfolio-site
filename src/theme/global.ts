import { createGlobalStyle } from 'styled-components/macro'

export const Global = createGlobalStyle`
  html {
    height: 100vh;
    width: 100vw;

    color: ${({ theme }) => theme.text};
    background-image: ${({ theme }) =>
      `linear-gradient(168deg, ${theme.background}, ${theme.strongHighlight})`};
  }

  input {
    font-size: inherit;
    color: inherit;
  }

  *, *::before, *::after  {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  transition: background-color 100ms ease-out, color 100ms ease;
}
`
