import BackgroundEditorPages from '@/background-editor'
import ContactPages from '@/contact'
import HomePages from '@/home'
import PortfolioPages from '@/portfolio'
import React from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'

const ROUTES: RouteObject[] = [
  {
    path: '/*',
    element: <HomePages />,
  },
  {
    path: '/background-editor/*',
    element: <BackgroundEditorPages />,
  },
  {
    path: '/contact/*',
    element: <ContactPages />,
  },
  {
    path: '/portfolio/*',
    element: <PortfolioPages />,
  },
]

const Router: React.FC = () => useRoutes(ROUTES)

export default Router
