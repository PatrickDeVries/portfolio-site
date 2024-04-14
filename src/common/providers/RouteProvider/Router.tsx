import ContactPages from '@/contact'
import HomePages from '@/home'
import ParticlesPages from '@/particles'
import PortfolioPages from '@/portfolio'
import { RouteObject, useRoutes } from 'react-router-dom'
import { FallbackMessage } from './style'

const ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <HomePages />,
  },
  {
    path: '/particles/*',
    element: <ParticlesPages />,
  },
  {
    path: '/contact/*',
    element: <ContactPages />,
  },
  {
    path: '/portfolio/*',
    element: <PortfolioPages />,
  },
  {
    path: '/*',
    element: <FallbackMessage>404 | not found</FallbackMessage>,
  },
]

const Router: React.FC = () => useRoutes(ROUTES)

export default Router
