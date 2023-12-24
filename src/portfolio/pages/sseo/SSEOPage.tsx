import { Suspense, lazy } from 'react'

const SSEOPageContent = lazy(() => import('./SSEOPageContent'))

const SSEOPage: React.FC = () => (
  <Suspense fallback="Loading...">
    <SSEOPageContent />
  </Suspense>
)

export default SSEOPage
