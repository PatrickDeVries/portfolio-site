import React, { Suspense, lazy } from 'react'

const ContactRouter = lazy(() => import('./ContactRouter'))

const ContactPages: React.FC = () => (
  <Suspense fallback="Loading...">
    <ContactRouter />
  </Suspense>
)

export default ContactPages
