import { Suspense, lazy } from 'react'

const HomePageContent = lazy(() => import('./HomePageContent'))

const HomePage: React.FC = () => (
  <Suspense fallback="Loading...">
    <HomePageContent />
  </Suspense>
)

export default HomePage
