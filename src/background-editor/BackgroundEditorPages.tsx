import React, { Suspense, lazy } from 'react'

const BackgroundEditorRouter = lazy(() => import('./BackgroundEditorRouter'))

const BackgroundEditorPages: React.FC = () => (
  <Suspense fallback="Loading...">
    <BackgroundEditorRouter />
  </Suspense>
)

export default BackgroundEditorPages
