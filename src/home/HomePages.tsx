import React, { Suspense, lazy } from 'react'

const HomeRouter = lazy(() => import('./HomeRouter'))

const HomePages: React.FC = () => (
  <Suspense fallback="Loading...">
    <HomeRouter />
  </Suspense>
)

export default HomePages
