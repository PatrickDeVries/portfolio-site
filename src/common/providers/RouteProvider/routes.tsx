import Layout, { LayoutFallback } from '@/common/components/layout'
import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { FallbackMessage } from './style'

const Home = lazy(() => import('@/home'))
const Particles = lazy(() => import('@/particles'))
const Contact = lazy(() => import('@/contact'))
const PortfolioRoutes = lazy(() => import('@/portfolio'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <React.Suspense fallback={<LayoutFallback />}>
        <Home />
      </React.Suspense>
    ),
  },
  {
    path: '/particles',
    element: (
      <React.Suspense fallback={<LayoutFallback />}>
        <Particles />
      </React.Suspense>
    ),
  },
  {
    path: '/contact',
    element: (
      <React.Suspense fallback={<LayoutFallback />}>
        <Contact />
      </React.Suspense>
    ),
  },
  {
    path: '/portfolio/*',
    element: (
      <React.Suspense fallback={<LayoutFallback />}>
        <PortfolioRoutes />
      </React.Suspense>
    ),
  },
  {
    path: '/*',
    element: (
      <Layout>
        <FallbackMessage>404 | not found</FallbackMessage>
      </Layout>
    ),
  },
]

export default routes
