import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './common/components/layout'
import Contact from './contact'
import Home from './home'
import Particles from './particles'
import PortfolioRoutes from './portfolio/PortfolioRoutes'
import StyleProvider from './theme'
import './theme/global.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <StyleProvider>
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
      </StyleProvider>
    </HashRouter>
  </React.StrictMode>,
)
