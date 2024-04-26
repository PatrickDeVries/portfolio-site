import { FallbackMessage } from '@/common/providers/RouteProvider/style'
import React from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
import PortfolioPage from './pages'
import SSEOPage from './pages/sseo'

const ROUTES: RouteObject[] = [
  { path: '/', element: <PortfolioPage /> },
  { path: '/sseo', element: <SSEOPage /> },
  {
    path: '/sseo/*',
    element: <FallbackMessage>404 | not found</FallbackMessage>,
  },
  {
    path: '/*',
    element: <FallbackMessage>404 | not found</FallbackMessage>,
  },
]

const PortfolioRouter: React.FC = () => useRoutes(ROUTES)

export default PortfolioRouter
