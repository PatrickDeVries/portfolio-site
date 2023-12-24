import { RouteObject, useRoutes } from 'react-router-dom'
import ParticlesPage from './pages'

const ROUTES: RouteObject[] = [{ path: '/', element: <ParticlesPage /> }]

const ParticlesRouter: React.FC = () => useRoutes(ROUTES)

export default ParticlesRouter
