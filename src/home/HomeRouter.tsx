import { RouteObject, useRoutes } from 'react-router-dom'
import HomePage from './pages'

const ROUTES: RouteObject[] = [{ path: '/', element: <HomePage /> }]

const HomeRouter: React.FC = () => useRoutes(ROUTES)

export default HomeRouter
