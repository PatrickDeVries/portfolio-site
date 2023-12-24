import { RouteObject, useRoutes } from 'react-router-dom'
import PortfolioPage from './pages'
import SSEOPage from './pages/sseo'

const ROUTES: RouteObject[] = [
  { path: '/', element: <PortfolioPage /> },
  { path: 'sseo', element: <SSEOPage /> },
]

const PortfolioRouter: React.FC = () => useRoutes(ROUTES)

export default PortfolioRouter
