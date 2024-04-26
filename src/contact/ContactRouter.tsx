import { FallbackMessage } from '@/common/providers/RouteProvider/style'
import React from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
import ContactPage from './pages'

const ROUTES: RouteObject[] = [
  { path: '/', element: <ContactPage /> },
  {
    path: '/*',
    element: <FallbackMessage>404 | not found</FallbackMessage>,
  },
]

const ContactRouter: React.FC = () => useRoutes(ROUTES)

export default ContactRouter
