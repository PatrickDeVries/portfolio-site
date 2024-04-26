import { FallbackMessage } from '@/common/providers/RouteProvider/style'
import React from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
import HomePage from './pages'

const ROUTES: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  {
    path: '/*',
    element: <FallbackMessage>404 | not found</FallbackMessage>,
  },
]

const HomeRouter: React.FC = () => useRoutes(ROUTES)

export default HomeRouter
