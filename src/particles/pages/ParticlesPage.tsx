import { Suspense, lazy } from 'react'

const ParticlesPageContent = lazy(() => import('./ParticlesPageContent'))

const ParticlesPage: React.FC = () => (
  <Suspense fallback="Loading...">
    <ParticlesPageContent />
  </Suspense>
)

export default ParticlesPage
