import React, { Suspense, lazy } from 'react'

const ContactPageContent = lazy(() => import('./ContactPageContent'))

const ContactPage: React.FC = () => (
  <Suspense fallback="Loading...">
    <ContactPageContent />
  </Suspense>
)

export default ContactPage
