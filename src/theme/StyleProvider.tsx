import React from 'react'
import { ThemeProvider } from 'styled-components'
import { useSnapshot } from 'valtio'
import themeStore from './store'
import { Global } from './style'
import { dark, light } from './themes'
interface Props {
  children: React.ReactNode
}

const StyleProvider: React.FC<Props> = ({ children }) => {
  const { theme } = useSnapshot(themeStore)

  return (
    <ThemeProvider theme={theme === 'light' ? light : dark}>
      <Global />
      {children}
    </ThemeProvider>
  )
}

export default StyleProvider
