import React from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './routes'

const RouteProvider: React.FC = () => useRoutes(routes)

export default RouteProvider
