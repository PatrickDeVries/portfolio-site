import React, { useEffect, useRef } from 'react'
import { RouteObject, matchPath, matchRoutes, useLocation } from 'react-router-dom'
import BackgroundParticles from './BackgroundParticles'
import Header from './Header'
import { Body, Main } from './style'

const PARTICLE_WHITELIST: RouteObject[] = [
  { path: '/' },
  { path: '/portfolio' },
  { path: '/contact' },
  { path: '/particles' },
]
interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <>
      {matchRoutes(PARTICLE_WHITELIST, location.pathname) && (
        <BackgroundParticles top={bodyRef.current?.offsetTop ?? 0} />
      )}
      <Main>
        <Header />
        <Body $tint={!matchPath(location.pathname, '/particles')} ref={bodyRef}>
          {children}
        </Body>
      </Main>
    </>
  )
}

export const LayoutFallback: React.FC = () => {
  const location = useLocation()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <Main>
      <Header />
      <Body $tint={!matchPath(location.pathname, '/particles')} ref={bodyRef} />
    </Main>
  )
}

export default Layout
