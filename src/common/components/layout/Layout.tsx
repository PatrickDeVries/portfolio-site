import React, { useEffect, useRef } from 'react'
import { matchPath, matchRoutes, RouteObject, useLocation } from 'react-router-dom'
import BackgroundParticles from './backgroundParticles'
import Header from './header'
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
        <Body tint={!matchPath(location.pathname, '/particles')} ref={bodyRef}>
          {children}
        </Body>
      </Main>
    </>
  )
}

export default Layout
