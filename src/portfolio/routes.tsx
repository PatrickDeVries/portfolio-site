import { RouteObject } from 'react-router-dom'
import Portfolio from './work'
import { SseoContainer } from './work/sseo'

const routes: RouteObject[] = [
  { path: '/', element: <Portfolio /> },
  { path: 'sseo', element: <SseoContainer /> },
]

export default routes
