import { Suspense, lazy } from 'react'

const PortfolioRouter = lazy(() => import('./PortfolioRouter'))

const PortfolioPages: React.FC = () => (
  <Suspense fallback="Loading...">
    <PortfolioRouter />
  </Suspense>
)

export default PortfolioPages
