import React, { Suspense, lazy } from 'react'

const BackgroundEditorPageContent = lazy(() => import('./BackgroundEditorPageContent'))

const BackgroundEditorPage: React.FC = () => (
  <Suspense fallback="Loading...">
    <BackgroundEditorPageContent />
  </Suspense>
)

export default BackgroundEditorPage
