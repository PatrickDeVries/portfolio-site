import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import { useProxy } from 'valtio/macro'
import Layout from './common/components/layout'
import particleSettings from './common/components/particleControlCard/store'
import Contact from './contact'
import Home from './home'
import Particles from './particles'
import PortfolioRoutes from './portfolio/PortfolioRoutes'
import reportWebVitals from './reportWebVitals'
import { Global } from './theme/global'
import './theme/global.css'
import { dark, light } from './theme/themes'

const App: React.FC = () => {
  useProxy(particleSettings)
  return (
    <ThemeProvider theme={particleSettings.theme === 'light' ? light : dark}>
      <Global />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/particles" element={<Particles />} />
        <Route path="/portfolio/*" element={<PortfolioRoutes />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/*"
          element={
            <Layout>
              <p>404 | Page not found</p>
            </Layout>
          }
        />
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
