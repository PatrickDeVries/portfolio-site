import { RouteObject, useRoutes } from 'react-router-dom'
import ContactPage from './pages'

const ROUTES: RouteObject[] = [{ path: '/', element: <ContactPage /> }]

const ContactRouter: React.FC = () => useRoutes(ROUTES)

export default ContactRouter
