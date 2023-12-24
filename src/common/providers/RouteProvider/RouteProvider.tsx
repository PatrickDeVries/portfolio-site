import Layout from '@/common/components/Layout'
import React from 'react'
import Router from './Router'

const RouteProvider: React.FC = () => (
  <Layout>
    <Router />
  </Layout>
)

export default RouteProvider
