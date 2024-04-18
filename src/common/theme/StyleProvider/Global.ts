import { createGlobalStyle } from 'styled-components'

const Global = createGlobalStyle`
  html {
    height: 100vh;
    width: 100vw;
    overflow: hidden;

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
  }

  b {
    color: ${({ theme }) => theme.secondary};
    font-weight: 500;
  }
`

export default Global
