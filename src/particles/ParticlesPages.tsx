import { Suspense, lazy } from 'react'

const ParticlesRouter = lazy(() => import('./ParticlesRouter'))

const ParticlesPages: React.FC = () => (
  <Suspense fallback="Loading...">
    <ParticlesRouter />
  </Suspense>
)

export default ParticlesPages
