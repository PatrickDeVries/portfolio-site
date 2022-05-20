import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import { useProxy } from 'valtio/macro'
import store from './common/components/particleControlCard/store'
import Home from './home'
import './index.css'
import Particles from './particles'
import reportWebVitals from './reportWebVitals'
import { Global } from './theme/global'
import { dark, light } from './theme/themes'

const App: React.FC = () => {
  useProxy(store)

  return (
    <ThemeProvider theme={store.theme === 'light' ? light : dark}>
      <Global />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/particles" element={<Particles />} />
      </Routes>
    </ThemeProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
