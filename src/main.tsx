import RouteProvider from '@/common/providers/RouteProvider'
import StyleProvider from '@/common/theme'
import '@/common/theme/global.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <StyleProvider>
        <RouteProvider />
      </StyleProvider>
    </HashRouter>
  </React.StrictMode>,
)
