import { RouteObject } from 'react-router-dom'
import Portfolio from './Portfolio'
import { SseoContainer } from './Portfolio/sseo'

const ROUTES: RouteObject[] = [
  { path: '/', element: <Portfolio /> },
  { path: 'sseo', element: <SseoContainer /> },
]

export default ROUTES
