import { DARK, LIGHT } from '@/common/theme'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { useSnapshot } from 'valtio'
import store from '../store'
import Global from './Global'

interface Props {
  children: React.ReactNode
}

const StyleProvider: React.FC<Props> = ({ children }) => {
  const { theme } = useSnapshot(store)

  return (
    <ThemeProvider theme={theme === 'light' ? LIGHT : DARK}>
      <Global />
      {children}
    </ThemeProvider>
  )
}

export default StyleProvider
