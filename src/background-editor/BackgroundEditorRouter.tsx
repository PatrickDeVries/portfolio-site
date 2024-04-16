import { RouteObject, useRoutes } from 'react-router-dom'
import BackgroundEditorPage from './pages'

const ROUTES: RouteObject[] = [{ path: '/', element: <BackgroundEditorPage /> }]

const BackgroundEditorRouter: React.FC = () => useRoutes(ROUTES)

export default BackgroundEditorRouter
