import { FallbackMessage } from '@/common/providers/RouteProvider/style'
import React from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
import BackgroundEditorPage from './pages'

const ROUTES: RouteObject[] = [
  { path: '/', element: <BackgroundEditorPage /> },
  {
    path: '/*',
    element: <FallbackMessage>404 | not found</FallbackMessage>,
  },
]

const BackgroundEditorRouter: React.FC = () => useRoutes(ROUTES)

export default BackgroundEditorRouter
