import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import RouteProvider from './common/providers/RouteProvider'
import StyleProvider from './theme'
import './theme/global.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <StyleProvider>
        <RouteProvider />
      </StyleProvider>
    </HashRouter>
  </React.StrictMode>,
)
