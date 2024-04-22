import React, { Suspense, lazy } from 'react'

const PortfolioPageContent = lazy(() => import('./PortfolioPageContent'))

const PortfolioPage: React.FC = () => (
  <Suspense fallback="Loading...">
    <PortfolioPageContent />
  </Suspense>
)

export default PortfolioPage
